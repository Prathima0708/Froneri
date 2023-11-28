import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text/Text';
import { BUTTON_TYPE } from 'src/components/Button/ButtonType';

import { tw } from 'src/tw';

import ServiceWorkFlowLandingHeader from 'src/components/Header/ServiceWorkFlowLandingHeader';
import DMCTopTabComponent from 'src/components/ServiceWorkflow/DeliveryMistakesClaim/DMCTopTabComponent';
import DMCClaimedProducts from 'src/components/ServiceWorkflow/DeliveryMistakesClaim/ProductsDetails/DMCClaimedProducts';
import DMCProductsDelivered from 'src/components/ServiceWorkflow/DeliveryMistakesClaim/ProductsDetails/DMCProductsDelivered';
import DMCInsteadDeliveredProduct from 'src/components/ServiceWorkflow/DeliveryMistakesClaim/ProductsDetails/DMCInsteadDeliveredProduct';
import DMCClaimsSettlements from 'src/components/ServiceWorkflow/DeliveryMistakesClaim/ClaimSettlements/DMCClaimsSettlements';
import MessageModal from 'src/components/Common/MessageModal';
import PCModal from 'src/components/ServiceWorkflow/ProductClaims/PCModal';

import { toast } from 'src/utils/Util';

import { DELIVERY_MISTAKES_CLAIM } from 'src/utils/Constant';
import { CLAIMS_MATERIAL_TYPES } from 'src/utils/DbConst';

import DeliveryMistakeClaimsController from 'src/controller/DeliveryMistakeClaimsController';
import ProductClaimController from 'src/controller/ProductClaimController';

import ApiUtil from 'src/services/ApiUtil';
import ACLService from 'src/services/ACLService';

import { TradeAssetsCustomersService } from 'src/services/TradeAssetsCustomersService';
import { ServiceRequestsCustomersService } from 'src/services/ServiceRequestsCustomersService';

import { withAuthScreen } from 'src/hoc/withAuthScreen';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

const DeliveryMistakesClaim = () => {
  const route = useRoute<any>();
  const [routeData, setRouteData] = useState<any>({});
  const [isClaimsModalVisible, setClaimsModalVisible] = useState(false);
  const [isDiscardVisible, setIsDiscardVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [screenLoading, setScreenLoading] = useState(false)
  const [productDetailObj, setProductDetailObj] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState({
    completeDelivery: false,
    orderNumber: '',
  });
  const [productsShouldHaveBeenDeliveredData, setProductsShouldHaveBeenDeliveredData] = useState([])
  const [insteadProductListData, setInsteadProductListData] = useState([]);
  const [freeGoodsListData, setFreeGoodsListData] = useState<any>([]);
  const [approvedByDropDownData, setApprovedByDropDownData] = useState(null);
  const [claimReasonDropDownData, setClaimReasonDropDownData] = useState(null);
  const [salesUnitDropDownData, setSalesUnitDropDownData] = useState([]);
  const [claimEnteredBy, setClaimEnteredBy] = useState([]);
  const [customerDetail, setCustomerDetail] = useState([]);
  const [salesRepDetail, setSalesRepDetail] = useState([]);
  const [selectedDropdownOptions, setSelectedDropdownOptions] = useState({
    settlementTypeVal: '',
    settlementDoneByVal: '',
    approvedByVal: '',
    reasonForClaim: '',
  });

  const [notes, setNotes] = useState('')

  const [requestTypeData, setRequestTypeData] = useState([
    { description: 'Select Reason', item: { data: 'Select Reason' } },
  ]);

  const [customerType, setCustomerType] = useState(
    DELIVERY_MISTAKES_CLAIM.PRODUCT_DETAILS,
  );

  useEffect(() => {
    getScreenData()
  }, []);

  // useEffect(() => {
  //   if (selectedOrder) {
  //     if (
  //       selectedOrder?.orderNumber &&
  //       selectedOrder?.completeDelivery === '1'
  //     ) {
  //       // claimsOrderListLines(selectedOrder?.orderNumber);
  //     }
  //   }
  // }, [selectedOrder]);

  const getScreenData = async () => {
    try {
      setScreenLoading(true)
      const data = route.params?.data;
      if (data) {
        setRouteData(data);
        console.log('route data :>> ', data);
        // claimOrderList('0020351332', 'DE09', '02');
        await claimOrderList();
        await salesUnitTypeDropdownData();
        await approvedBy();
        await deliveryClaimReason('4');
        await deliveryMistakeClaimsDataPopulation(data?.idServiceRequestCustomer ?? '');
        await gridUndeliveredProducts(data?.idServiceRequestCustomer);
        await gridInsteadDeliveredProducts(data?.idServiceRequestCustomer);
        await gridFreeGoodsProducts(data?.idServiceRequestCustomer);

        await getClaimEnteredByData();
        await fetchCustomerDetail();
        await getSalesRepDetail();

        // await gridUndeliveredProducts('008BB365AF8C4690A399BBA16433A21A');
        // await gridInsteadDeliveredProducts('01459692E6204671AC4C666BBACEE03A');
        // gridFreeGoodsProducts('033FF701985749CC9095BBE8E0AF66D0');
        // deliveryMistakeClaimsDataPopulation('033FF701985749CC9095BBE8E0AF66D0');
        // claimsOrderListLines('SOD20276750');
      }
    } catch (error) {
      console.log('Get screen data error :>> ', error);
    } finally {
      setScreenLoading(false)
    }
  }

  const changeCalendarFilter = (data: string) => {
    setCustomerType(data);
  };

  const validateProductDetails = () => {
    return true
  }

  const validateClaimsSettlement = () => {
    let isValid = true;
    const newData = freeGoodsListData

    const updatedData: any = newData.map((item: any) => {
      if (item?.materialNumber || item?.quantity || item?.salesUnit) {

        if (!item?.materialNumber) {
          isValid = false;
          item.materialDropdownError = 'Required'
        }

        if (!Number(item?.quantity)) {
          isValid = false;
          item.quantityError = 'Required'
        }

        if (!item?.salesUnit) {
          isValid = false;
          item.salesUnitError = 'Required'
        }

        return item;
      }
    })

    setFreeGoodsListData([...updatedData])

    return isValid;
  }

  const validateInputs = () => {
    let isValid = true;
    if (customerType === DELIVERY_MISTAKES_CLAIM.PRODUCT_DETAILS) {
      isValid = validateProductDetails();
    } else {
      isValid = validateClaimsSettlement();
    }

    return isValid;
  }

  const handleModalBack = () => {
    setClaimsModalVisible(false);
  };

  const renderModal = () => {
    setClaimsModalVisible(true);
  };

  const handleCancel = () => {
    setIsDiscardVisible(true);
  }

  const handleDiscardCancel = () => {
    setIsDiscardVisible(false);
  };

  const handleDiscardChanges = async () => {
    try {
      setIsDiscardVisible(false);
      await ACLService.saveAclGuardStatusToStorage(false);
    } catch (error) {
      console.log('error while discarding the changes :>> ', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!validateInputs()) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return;
      }

      await saveClaimWorkflowHeaderData();
      await saveWorkflowClaimsData();
      await saveClaimsSettlementData();

      await ACLService.saveAclGuardStatusToStorage(false);
    } catch (error) {
      console.log('error while saving the data :>> ', error);
    }
  };

  const saveClaimWorkflowHeaderData = async () => {
    try {
      let data = routeData;
      const deleteOperation =
        await DeliveryMistakeClaimsController.deleteWorkflowHeaderData(
          data?.idServiceRequestCustomer,
        );
      if (deleteOperation) {
        try {
          console.log('selectedOrder :>> ', selectedOrder);
          const insertionOperation =
            await DeliveryMistakeClaimsController.insertCustomersClaimsWorkFlowHeader(
              data?.idServiceRequestCustomer,
              data?.customerShipTo,
              data?.salesOrganization,
              data?.distributionChannel,
              selectedOrder?.orderNumber,
              selectedOrder?.completeDelivery ? '1' : '0',
            );
          if (insertionOperation) {
            toast.success({ message: 'Data saved successfully' });
            return
          }

          toast.error({ message: 'Something went wrong' });
        } catch (e) {
          console.log('save workflow header error..', e);
          toast.error({ message: 'Something went wrong' });
        }
      }
    } catch (e) {
      console.log('delete workflow header error..', e);
    }
  };

  const saveWorkflowClaimsData = async () => {
    try {
      const data = routeData;
      const deleteOperation =
        await DeliveryMistakeClaimsController.deleteWorkflowClaimsData(
          data?.idServiceRequestCustomer,
        );
      if (deleteOperation) {
        try {

          /**
           * Insert data of should delivered products
           **/

          productsShouldHaveBeenDeliveredData?.map(async (item: any, index: number) => {
            const preparedShouldDeliveredData = {
              idServiceRequestCustomer: data?.idServiceRequestCustomer,
              idCustomersClaimsWorkflowClaimsData: index,
              materialNumber: item?.materialNumber.toString().padStart(18, '0'),
              quantityOfClaimedProducts: item?.quantity,
              quantityOfClaimedProductsSalesUnits: item?.salesUnit,
              reasonForClaim: selectedDropdownOptions?.reasonForClaim,
              claimSettlementProductType:
                CLAIMS_MATERIAL_TYPES.UNDELIVERED_PRODUCTS,
              netAmount: item?.price,
            }

            console.log('preparedShouldDeliveredData :>> ', preparedShouldDeliveredData);

            await DeliveryMistakeClaimsController.insertCustomersClaimsWorkFlowClaimsData(
              preparedShouldDeliveredData,
            );
          });

          /**
           * Insert data of instead delivered products
           **/

          insteadProductListData?.map(async (item: any, index: number) => {
            const preparedInsteadDeliveredData = {
              idServiceRequestCustomer: data?.idServiceRequestCustomer,
              idCustomersClaimsWorkflowClaimsData: index,
              materialNumber: item?.materialNumber.toString().padStart(18, '0'),
              quantityOfClaimedProducts: item?.quantity,
              quantityOfClaimedProductsSalesUnits: item?.salesUnit,
              reasonForClaim: selectedDropdownOptions?.reasonForClaim,
              claimSettlementProductType:
                CLAIMS_MATERIAL_TYPES.INSTEAD_DELIVERED_PRODUCTS,
              netAmount: item?.price,
            }

            console.log('preparedInsteadDeliveredData :>> ', preparedInsteadDeliveredData);

            await DeliveryMistakeClaimsController.insertCustomersClaimsWorkFlowClaimsData(
              preparedInsteadDeliveredData,
            );
          });
        } catch (e) {
          console.log('save workflow claim error..', e);
        }
      }
    } catch (e) {
      console.log('delete workflow claim error..', e);
    }
  };

  const saveClaimsSettlementData = async () => {
    try {
      let data = routeData
      const deleteOperation =
        await DeliveryMistakeClaimsController.deleteWorkflowSettlementData(
          data?.idServiceRequestCustomer,
        );
      if (deleteOperation) {
        try {
          /**
           * Insert data of free goods products
           **/
          console.log('selectedDropdownOptions :>> ', selectedDropdownOptions);
          freeGoodsListData.map(async (item: any, index: number) => {
            const preparedData = {
              idServiceRequestCustomer: data?.idServiceRequestCustomer,
              idCustomersClaimsWorkflowSettlementData: index,
              freeGoodNumber: item?.materialNumber.toString().padStart(18, '0'),
              freeGoodQuantity: item?.quantity,
              freeGoodQuantitySalesUnits: item?.salesUnit,
              reasonForClaim: selectedDropdownOptions?.reasonForClaim,
              settlementType: selectedDropdownOptions?.settlementTypeVal,
              settlementDoneBy: selectedDropdownOptions?.settlementDoneByVal,
              freeGoodValue: item?.price,
              freeGoodApprover: selectedDropdownOptions?.approvedByVal,
              notes,
            }

            const isCreated = await DeliveryMistakeClaimsController.insertCustomersClaimsWorkFlowSettlementData(
              preparedData,
            );

            if (!isCreated) {
              toast.error({
                message: 'Something went wrong'
              })
            }
          });
        } catch (e) {
          console.log('save workflow settlement error..', e);
        }
      }
    } catch (e) {
      console.log('delete workflow settlement error..', e);
    }
  };

  const getClaimEnteredByData = async () => {
    const { data } = route.params;
    try {
      const claimEnteredByData =
        await ProductClaimController.getClaimEnteredByData(
          data?.idServiceRequestCustomer,
        );

      setClaimEnteredBy(claimEnteredByData);
    } catch (error) {
      console.log('error while fetching claimEnteredByData :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setClaimEnteredBy([])
    }
  };

  const fetchCustomerDetail = async () => {
    const { data } = route.params;
    try {
      const customerDetailData =
        await ProductClaimController.fetchCustomerDetail(
          data?.customerShipTo,
          data?.salesOrganization,
          data?.distributionChannel,
        );
      console.log('customerDetailData', customerDetailData);
      setCustomerDetail(customerDetailData);
    } catch (error) {
      console.log('error while fetching customerDetailData :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setCustomerDetail([])
    }
  };

  const getSalesRepDetail = async () => {
    const { data } = route.params;
    try {
      const salesRepDetailData = await ProductClaimController.getSalesRepDetail(
        data?.customerShipTo,
      );
      setSalesRepDetail(salesRepDetailData);
    } catch (error) {
      console.log('error while fetching salesRepDetailData :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setSalesRepDetail([])
    }
  };

  const claimOrderList = async () => {
    try {
      const data = route.params?.data;
      const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
      console.log('isOnline :>> ', isOnline);

      let orderListData = [];

      if (!isOnline.status) {
        orderListData = await DeliveryMistakeClaimsController.getClaimsOrderLists(
          data?.customerShipTo,
          data?.salesOrganization,
          data?.distributionChannel
        );
      } else {
        const serviceRequestsCustomersService = new ServiceRequestsCustomersService()
        const onlineData = await serviceRequestsCustomersService.getOnlineTradeAssets(
          data?.customerShipTo,
          data?.salesOrganization,
          data?.distributionChannel
        );

        console.log('online claim order data :>> ', onlineData);

        if (onlineData && onlineData?.data) {
          orderListData = onlineData.data
        }
      }

      console.log('orderListData :>> ', orderListData);

      if (orderListData && orderListData.length > 0) {
        setProductDetailObj({ ...orderListData[0] });
      }
    } catch (error) {
      console.log('error while fetching service workflow listing :>> ', error);
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const salesUnitTypeDropdownData = async () => {
    try {
      const salesUnitTypeData =
        await DeliveryMistakeClaimsController.getSalesUnitTypeDropdownData();

      console.log('sales unit dropdown data :>> ', salesUnitTypeData);
      if (salesUnitTypeData && salesUnitTypeData.length > 0) {
        setSalesUnitDropDownData(salesUnitTypeData);
      }
    } catch (error) {
      console.log(
        'error while fetching sales unit dropdown data :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const claimsOrderListLines = async (orderNumber: any) => {
    try {
      const listLinesData =
        await DeliveryMistakeClaimsController.getClaimsOrderListLines(
          orderNumber,
        );
      console.log('listingData222 :>> ', listLinesData);
      if (listLinesData && listLinesData.length > 0) {
        setProductsShouldHaveBeenDeliveredData(listLinesData);
      }
    } catch (error) {
      console.log(
        'error while fetching service workflow listing222 :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const approvedBy = async (searchText: string = ' ') => {
    try {
      const approvedByData =
        await DeliveryMistakeClaimsController.getApprovedBy(searchText);
      console.log('approvedByData :>> ', approvedByData);
      if (approvedByData && approvedByData.length > 0) {
        setApprovedByDropDownData(approvedByData);
      }
    } catch (error) {
      console.log(
        'error while fetching service workflow listing444 :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const deliveryClaimReason = async (claimsConfigCode: string) => {
    try {
      const data = await DeliveryMistakeClaimsController.getDeliveryClaimReason(
        claimsConfigCode,
      );
      console.log('deliveryClaimReason :>> ', data);
      if (data && data.length > 0) {
        setClaimReasonDropDownData(data);
      }
    } catch (error) {
      console.log(
        'error while fetching service workflow listing555 :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const deliveryMistakeClaimsDataPopulation = async (
    serviceRequestCustomerId: string,
  ) => {
    try {
      const data =
        await DeliveryMistakeClaimsController.getDeliveryMistakeClaimsDataPopulation(
          serviceRequestCustomerId,
        );
      console.log('inputs data :>> ', data);
      if (data && data.length > 0) {
        const singleData = data[0];

        setSelectedDropdownOptions((prevData: any) => ({
          ...prevData,
          settlementTypeVal: singleData?.settlementType,
          settlementDoneByVal: singleData?.settlementDoneBy,
          approvedByVal: singleData?.freeGoodApprover,
          reasonForClaim: singleData?.reasonForClaim,
        }))

        setNotes(singleData?.notes)

        setSelectedOrder((prevData: any) => ({
          ...prevData,
          orderNumber: singleData?.orderNumber,
          completeDelivery: singleData?.completeDelivery === '1',
        }))
      }
    } catch (error) {
      console.log(
        'error while fetching service workflow inputs Data :>> ',
        error,
      );

      setSelectedDropdownOptions({
        settlementTypeVal: '',
        settlementDoneByVal: '',
        approvedByVal: '',
        reasonForClaim: '',
      })

      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const prepareDataWithMaterialDropdown = async (data: any) => {
    try {
      const materialDropdownData = await getMaterialData();

      let preparedData: any = data.map((item: any) => {
        item.materialDropdown = materialDropdownData
        return item
      })

      for (const singleData of preparedData) {
        let containsData = false

        singleData.materialDropdown.forEach((item: any) => {
          if (item.materialNumber === singleData.materialNumber) {
            containsData = true
          }
        })

        if (!containsData) {
          try {
            const response = await getMaterialData(singleData.materialNumber)

            singleData.materialDropdown = [
              ...singleData.materialDropdown,
              ...response
            ]
          } catch (error) {
            console.log('error while fetching material data :>> ', error);
            toast.error({
              message: "Something went wrong"
            })
          }
        } else {
          singleData.materialDropdown = [
            ...singleData.materialDropdown,
          ]
        }

        if (!singleData?.productGroup) {
          const foundData = singleData.materialDropdown.find((item: any) => item.materialNumber === singleData.materialNumber)
          const materialProductGroup = await getMaterialProductGroup(foundData.material_hierarchy_from_sap_node_l2, foundData.material_hierarchy_node_l2)

          singleData.productGroup = materialProductGroup
        }

      }

      return preparedData
    } catch (error) {
      console.log('error while preparing data with material dropdown :>> ', error);
      toast.error({
        message: 'Something went wrong',
      })
      return []
    }
  }

  const gridUndeliveredProducts = async (idServiceRequestCustomer: any) => {
    try {
      let undeliveredProductsData = []
      const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
      if (!isOnline.status) {
        undeliveredProductsData =
          await DeliveryMistakeClaimsController.getGridUndeliveredProducts(
            idServiceRequestCustomer,
          );
      } else {
        const tradeAssetsCustomersService = new TradeAssetsCustomersService()
        const onlineData = await tradeAssetsCustomersService.getOnlineOrderlinesroducts('')
        if (onlineData && onlineData.data) {
          undeliveredProductsData = onlineData.data
        }
      }

      console.log('undeliveredProductsData :>> ', undeliveredProductsData);

      if (undeliveredProductsData.length > 0) {
        const preparedUndeliveredProductsData: any = await prepareDataWithMaterialDropdown(undeliveredProductsData)

        console.log('preparedUndeliveredProductsData :>> ', preparedUndeliveredProductsData);

        setProductsShouldHaveBeenDeliveredData(preparedUndeliveredProductsData);
      } else {
        setProductsShouldHaveBeenDeliveredData([])
      }
    } catch (error) {
      console.log(
        'error while fetching service workflow listing777 :>> ',
        error,
      );
      setProductsShouldHaveBeenDeliveredData([])
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const gridInsteadDeliveredProducts = async (
    idServiceRequestCustomer: any,
  ) => {
    try {
      const gridInsteadDeliveredProductsData =
        await DeliveryMistakeClaimsController.getGridInsteadDeliveredProducts(
          idServiceRequestCustomer,
        );

      if (gridInsteadDeliveredProductsData.length > 0) {
        const preparedGridInsteadDeliveredProductsData = await prepareDataWithMaterialDropdown(gridInsteadDeliveredProductsData)
        console.log('preparedGridInsteadDeliveredProductsData :>> ', preparedGridInsteadDeliveredProductsData);

        setInsteadProductListData(preparedGridInsteadDeliveredProductsData);
      } else {
        setInsteadProductListData([])
      }
    } catch (error) {
      console.log(
        'error while fetching grid instead delivered products data :>> ',
        error,
      );
      setInsteadProductListData([])
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const gridFreeGoodsProducts = async (idServiceRequestCustomer: any) => {
    try {
      const freeGoodsData = await DeliveryMistakeClaimsController.getGridFreeProducts(
        idServiceRequestCustomer,
      );
      console.log('Free goods list data :>> ', freeGoodsData);
      if (freeGoodsData && freeGoodsData.length > 0) {
        let preparedFreeGoodsData: any = await prepareDataWithMaterialDropdown(freeGoodsData)
        console.log('preparedFreeGoodsData :>> ', preparedFreeGoodsData);

        setFreeGoodsListData(preparedFreeGoodsData);
      }
    } catch (error) {
      console.log(
        'error while fetching service workflow listing888 :>> ',
        error,
      );
    }
  };

  const changeDisableState = () => {
    if (disabled) {
      setDisabled(false)
    }
  }

  const getMaterialData = async (searchText: string = '') => {
    try {
      const routeData = route.params?.data;
      const pickingPlantNumber = routeData?.pickingPlantNumber;
      const salesOrganization = routeData?.salesOrganization;
      const distributionChannel = routeData?.distributionChannel;

      const data =
        await DeliveryMistakeClaimsController.getMaterailNumberDropdownData(
          pickingPlantNumber,
          salesOrganization,
          distributionChannel,
          searchText,
        );

      console.log('Material Dropdown Data :>> ', data);

      return data;
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      return []
    }
  };

  const changeProductDetails = (obj: any) => {
    setProductDetailObj({ ...obj });

    changeDisableState()
  };

  const changeSelectedOrderNumber = (obj: any) => {
    setSelectedOrder(obj);

    changeDisableState()
  };

  const onChangeCompleteDelivery = () => {
    setSelectedOrder((prevData) => ({
      ...prevData,
      completeDelivery: !prevData?.completeDelivery,
    }))

    changeDisableState()
  };

  const getNetValue = async (materialNumber: string, quantity: string) => {
    try {
      const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
      if (!isOnline.status) {
        toast.info({
          message: isOnline.errMsg,
        });
        return 0;
      }

      const valueData = await ProductClaimController.getNetAmount(
        routeData.customerShipTo,
        routeData.salesOrganization,
        routeData.distributionChannel,
        materialNumber,
        quantity,
      );
      console.log('valueData :>> ', valueData);

      if (valueData) {
        return valueData?.netamount;
      }

      return 0;

    } catch (error) {
      console.log('error while fetching net value :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  }

  const getMaterialProductGroup = async (
    materialHierarchyFromSapNode: string,
    materialHierarchyFromNode: string,
  ) => {
    try {
      const materialDropdownData =
        await ProductClaimController.getMaterialProductGroup(
          materialHierarchyFromSapNode,
          materialHierarchyFromNode,
        );

      console.log(materialDropdownData, 'PRODUCT GROUP DATA');
      return materialDropdownData?.[0]?.description_language_1 ?? '';
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };

  return (
    <View flex style={tw('bg-light-lightGrey ')}>
      <ServiceWorkFlowLandingHeader data={routeData} />
      <View
        marginB-v2
        flex
        width={1250}
        style={tw('bg-dark-black self-center rounded-15px mb-24px pb-5 ')}>
        <View row marginB-v2 style={tw('m-24px')}>
          <View style={tw('flex-row justify-between')}>
            <Text text26BL textBlack>
              Delivery Mistakes Claim
            </Text>
          </View>

          <View flex row style={tw('border-light-lavendar justify-end ')}>
            <View row style={tw('py-2 px-20px rounded-md ml-6 ')}>
              <Text textBlack text13R>
                Claim, Customer and Sales Rep Data
              </Text>
              <TouchableOpacity onPress={renderModal}>
                <Text darkBlue text13R style={tw('px-20px  ')}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={tw('py-2 px-20px rounded-md ml-6')}
              disabled={disabled}
              onPress={handleCancel}
            >
              <Text grey2 text13R>
                {'Cancel'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw(
                `${disabled
                  ? BUTTON_TYPE.PRIMARY_DISABLED
                  : BUTTON_TYPE.PRIMARY_ENABLED
                } px-8 ml-6`,
              )}
              disabled={disabled}
              onPress={handleSave}>
              <Text
                text13R
                style={tw(
                  `${disabled
                    ? BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                    : BUTTON_TYPE.PRIMARY_ENABLED_LABEL
                  }`,
                )}>
                {'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {screenLoading ?
          <View flex center>
            <ActivityIndicator
              color={ColourPalette.light.black}
              size="large"
            />
          </View>
          : <ScrollView>
            <View style={tw('ml-24px')}>
              <DMCTopTabComponent
                handleChangeCalendarFilter={(data: string) => {
                  changeCalendarFilter(data);
                }}
                calendarFilterValue={customerType}
              />
            </View>
            {customerType === DELIVERY_MISTAKES_CLAIM.PRODUCT_DETAILS ? (
              <View>
                <DMCClaimedProducts
                  item={productDetailObj}
                  selectedOrder={selectedOrder}
                  onCompleteDeliveryTap={onChangeCompleteDelivery}
                  onChangeItem={changeProductDetails}
                  onChangeOrderNumber={changeSelectedOrderNumber}
                />
                <View style={tw('mt-47px')}>
                  <DMCProductsDelivered
                    productsShouldHaveBeenDeliveredData={productsShouldHaveBeenDeliveredData}
                    setProductsShouldHaveBeenDeliveredData={setProductsShouldHaveBeenDeliveredData}
                    salesUnitData={salesUnitDropDownData}
                    getMaterialData={getMaterialData}
                    getMaterialProductGroup={getMaterialProductGroup}
                    getNetValue={getNetValue}
                    changeDisableState={changeDisableState}
                  />
                </View>
                <View style={tw('mt-24px')}>
                  <DMCInsteadDeliveredProduct
                    insteadProductListData={insteadProductListData}
                    setInsteadProductListData={setInsteadProductListData}
                    salesUnitData={salesUnitDropDownData}
                    getMaterialData={getMaterialData}
                    getMaterialProductGroup={getMaterialProductGroup}
                    getNetValue={getNetValue}
                  />
                </View>
                <View style={tw('mx-24px mt-24px')}>
                  <InputText
                    title="Notes"
                    style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
                    multiline
                    value={notes}
                    showCharCounter
                    maxLength={500}
                    onChangeText={setNotes}
                  />
                </View>
              </View>
            ) : (
              <View>
                <DMCClaimsSettlements
                  requestTypeData={requestTypeData}
                  freeGoodsData={freeGoodsListData}
                  getNetValue={getNetValue}
                  setFreeGoodsListData={setFreeGoodsListData}
                  getMaterialData={getMaterialData}
                  selectedDropdownOptions={selectedDropdownOptions}
                  selectedOrder={selectedOrder}
                  salesUnitData={salesUnitDropDownData}
                  approvedByDropDownData={approvedByDropDownData}
                  reasonForClaimDropDownData={claimReasonDropDownData}
                  errorMessages={''}
                  onChangeTour={() => { }}
                  onChangeOrderCreated={() => { }}
                  onChangeReasonForClaim={(val: any) => {
                    setSelectedDropdownOptions({
                      ...selectedDropdownOptions,
                      reasonForClaim: val.claimCode,
                    });
                  }}
                  onChangeApprovedBy={(val: any) => {
                    setSelectedDropdownOptions({
                      ...selectedDropdownOptions,
                      approvedByVal: val.partnerNumber,
                    });
                  }}
                  onChangeSettlementDone={(val: any) => {
                    setSelectedDropdownOptions({
                      ...selectedDropdownOptions,
                      settlementDoneByVal: val.value,
                    });
                  }}
                  onChangeSettlementType={(val: any) => {
                    setSelectedDropdownOptions({
                      ...selectedDropdownOptions,
                      settlementTypeVal: val.value,
                    });
                  }}
                />
              </View>
            )}
          </ScrollView>}
      </View>
      <MessageModal
        isVisible={isDiscardVisible}
        title="Discard the Changes?"
        subTitle="Your unsaved edits will be lost"
        primaryButtonText="Yes, Discard"
        secondaryButtonText="No, Keep the changes"
        handleOnPressSuccess={handleDiscardChanges}
        handleOnPressCancel={handleDiscardCancel}
      />
      <PCModal
        isClaimsModalVisible={isClaimsModalVisible}
        handleBack={handleModalBack}
        item={{
          claimEnteredBy,
          customerDetail,
          salesRepDetail,
        }}
        handleInputChange={() => { }}
        errorMessages={{}}
        isEditable={false}
      />
    </View>
  );
};

export default withAuthScreen(DeliveryMistakesClaim);
