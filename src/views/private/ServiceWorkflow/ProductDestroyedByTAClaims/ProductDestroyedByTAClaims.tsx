import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {pageNameProductDestroyedByTAClaims} from 'src/routes/Routes';
import Text from 'src/components/Text';
import Card from 'src/components/Card';
import {TA_CLAIMS_TYPES} from 'src/utils/Constant';
import TAClaimsTopTabComponent from 'src/components/ServiceWorkflow/ProductDestroyedByTAClaims/TAClaimsTopTabComponent';
import ClaimsSettlementComponent from 'src/components/ServiceWorkflow/ProductDestroyedByTAClaims/ClaimsSettlementComponent';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import TAProductDetailController from 'src/controller/TAProductDetailController';
import ApiUtil from 'src/services/ApiUtil';
import {toast} from 'src/utils/Util';
import ProductDetailComponent from 'src/components/ServiceWorkflow/ProductDestroyedByTAClaims/ProductDetailComponent';
import PCModal from 'src/components/ServiceWorkflow/ProductClaims/PCModal';
import {withAuthScreen} from 'src/hoc/withAuthScreen';
import ACLService from 'src/services/ACLService';
import ServiceWorkFlowLandingHeader from 'src/components/Header/ServiceWorkFlowLandingHeader';

export interface IcedProductType {
  materialNumber: string;
  price: string;
  productGroup: 'Frozen Trade Goods';
  quantity: string;
  salesUnit: 'KGM';
}
interface headerProps {
  setClaimsModalVisible: () => void;
  handleCancelPressed: () => void;
  handleSave: () => void;
  isSaveAllowed: boolean;
}
const RenderHeader = (props: headerProps) => {
  return (
    <View row marginB-v2 center>
      <View centerH style={tw('flex-row')}>
        <Text text24BO textBlack style={tw('leading-10')}>
          Product Destroyed by TA Claims
        </Text>
      </View>

      <View flex row style={tw('border-light-lavendar justify-end ')}>
        <View flex row style={tw('border-light-lavendar justify-end ')}>
          <View row style={tw('py-2 px-20px rounded-md ml-6 ')}>
            <Text textBlack text13R>
              Claim, Customer and Sales Rep Data
            </Text>

            <TouchableOpacity onPress={props.setClaimsModalVisible}>
              <Text darkBlue text13R style={tw('px-20px  ')}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            touchSoundDisabled={!props.isSaveAllowed}
            onPress={props.handleCancelPressed}
            style={tw('py-2 px-20px rounded-md ml-6')}>
            <Text grey2 text13R>
              {'Cancel'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            touchSoundDisabled={!props.isSaveAllowed}
            onPress={props.handleSave}
            style={tw(
              `py-2 px-36px rounded-md ml-6 ${
                !props.isSaveAllowed ? 'bg-light-white1' : 'bg-light-darkBlue'
              }`,
            )}
            disabled={false}>
            <Text
              style={tw(
                `${
                  props.isSaveAllowed ? 'text-light-white' : 'text-light-grey1'
                }`,
              )}
              text13R
              grey2>
              {'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const ProductDestroyedByTAClaims = (props: any) => {
  const {data} = props.route.params;
  const [activeTab, setActiveTab] = useState(TA_CLAIMS_TYPES[0].title);
  const [isClaimsModalVisible, setClaimsModalVisible] = useState(false);
  const [isSaveAllowed, setIsSaveAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tradeAssetListData, setTradeAssetListData] = useState<any>([]);

  const [otherProductListData, setOtherProductListData] = useState<any>([]);
  const [otherProductListDataError, setOtherProductListDataError] =
    useState<any>([]);

  const [icedProductListData, setIcedProductListData] = useState<any>([]);
  const [icedProductListDropDown, setIcedProductListDropDown] = useState<any>(
    [],
  );
  const [icedProductListDataError, setIcedProductListDataError] = useState<any>(
    [],
  );
  const [allMaterialListData, setAllMaterialListData] = useState([]);
  const [salesTypeListData, setSalesTypeListData] = useState([]);
  const [approvedByistData, setApprovedByistData] = useState([]);
  const [responsibleRDCListData, setResponsibleRDCListData] = useState([]);
  const [claimSettlementData, setClaimSettlementData] = useState<any>({
    netAmount: 0,
    defectStatus: '',
    settlementDone: '',
    settlementDoneBy: '',
    requestDateTechnical: '',
    requestDateTA: '',
    refund: '',
    totalNetValue: '',
    rdc: '',
    approvedBy: '',
    notes: '',
  });
  const [claimEnteredBy, setClaimEnteredBy] = useState([]);
  const [customerDetail, setCustomerDetail] = useState([]);
  const [salesRepDetail, setSalesRepDetail] = useState([]);

  // console.log(props.route.params, 'USER DATA');
  const handleCancelPressed = () => {
    if (isSaveAllowed) {
      setIsSaveAllowed(false);
      getScreenData();
      ACLService.saveAclGuardStatusToStorage(false);
    }
  };

  const handleActiveTab = (data: string) => {
    setActiveTab(data);
  };
  const getOnlineTradeAssets = async () => {
    const {data} = props.route.params;
    const tradeAssetData = await TAProductDetailController.getOnlineTradeAssets(
      1,
      25,
      data?.customerShipTo,
      data?.salesOrganization,
      data?.distributionChannel,
    );

    // console.log(tradeAssetData, 'DATA RECEIVED');

    if (tradeAssetData && tradeAssetData?.data?.length > 0) {
      let ar = [...(tradeAssetData?.data ?? [])];
      (ar = ar.map(item => {
        return {
          ...item,
          selection: false,
        };
      })),
        setTradeAssetListData(ar);
    }
  };
  async function checkWorkFlow() {
    const {data} = props.route.params;
    const isWorkFlowExists =
      await TAProductDetailController.checkWorkflowExists(
        data?.idServiceRequestCustomer ?? '',
      );
    if (isWorkFlowExists) {
      getOfflineTradeAssets();
      getOfflineIcedProducts();
      getPDClaimSettlementData();
      getGridBlockedroducts();
    } else {
      // getOnlineBlockedTradeAssets();
      getOnlineTradeAssets();
      getOnlineIcedTradeAssets();
    }
  }
  const getOfflineTradeAssets = async () => {
    const {data} = props.route.params;
    const tradeAssetData =
      await TAProductDetailController.getServiceWorkflowOfflineTradeAssets(
        data?.customerShipTo,
        data?.salesOrganization,
        data?.distributionChannel,
        data?.idServiceRequestCustomer,
      );

    if (
      tradeAssetData &&
      tradeAssetData.results &&
      tradeAssetData.results.length > 0
    ) {
      console.log(tradeAssetData, 'Received in trade asset offline Api block');
      let ar = tradeAssetData.results.map((item: any) => ({
        selection: true,
        manufacturerSerialNumber: item?.materialNumber ?? '',
        materialDescription: item?.materialDescription ?? '',
        equipmentNumber: '',
        installedDate: '',
      }));

      setTradeAssetListData(ar);
    }
  };
  const handleTradeAssetItemClicked = (index: number) => {
    if (tradeAssetListData?.length > 0) {
      let ar = [...tradeAssetListData];
      ar[index] = {...ar[index], selection: !ar[index].selection};
      // setData(ar);
      console.log('ar', ar);
      setTradeAssetListData(ar);
      setIsSaveAllowed(true);
    }
  };
  const fetchAllMaterialListDropdownData = async () => {
    const {data} = props.route.params;

    try {
      const materialDropdownData =
        await TAProductDetailController.getMaterailNumberDropdownData(
          data.pickingPlantNumber,
          data.salesOrganization,
          data.distributionChannel,
          '',
        );

      setAllMaterialListData(materialDropdownData);
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchSalesUnitDropdownData = async () => {
    try {
      const salesUnitDropdownData =
        await TAProductDetailController.getSalesUnitTypeDropdownData();
      setSalesTypeListData(salesUnitDropdownData);
    } catch (error) {
      console.log('error while fetching salesUnit dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const getRDCNumber = async () => {
    try {
      const rdcDropdownData = await TAProductDetailController.getRDCNumber();

      let ar = rdcDropdownData.map((item: any) => ({
        description: item.description + '',
        rdc_number: item.rdc_number,
      }));
      // console.log(rdcDropdownData, 'rdcDropdownData');
      setResponsibleRDCListData(ar);
    } catch (error) {
      console.log('error while fetching rdc number dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };

  const getOfflineIcedProducts = async () => {
    const {data} = props.route.params;
    const icedProductData =
      await TAProductDetailController.getOfflineIcedProducts(
        data.customerShipTo,
        data.salesOrganization,
        data.distributionChannel,
        data.idServiceRequestCustomer,
      );
    if (icedProductData && icedProductData.length > 0) {
      let ar = icedProductData.map((item: any) => {
        return {
          materialNumber: item?.materialNumber ?? '',
          quantityDeliveredInLast52Weeks:
            item?.quantityDeliveredInLast52Weeks ?? '',
          quantity: item?.quantity ?? '',
          salesUnit: item?.salesUnit ?? '',
          price: item?.price ?? 0,
        };
      });
      setIcedProductListData(ar);
    }
  };

  const getPDClaimSettlementData = async () => {
    const {data} = props.route.params;
    const tradeAssetData =
      await TAProductDetailController.getPDClaimSettlementData(
        data.idServiceRequestCustomer,
      );
    if (tradeAssetData) {
      console.log(
        tradeAssetData,
        'Received getPDClaimSettlementData in offline Api block',
      );
      let data = {
        netAmount: tradeAssetData?.[0]?.net_value_of_product_destroyed,
        defectStatus: tradeAssetData?.[0]?.defect_status,
        settlementDone: tradeAssetData?.[0]?.settlement_status,
        settlementDoneBy: tradeAssetData?.[0]?.settlement_done_by,
        requestDateTechnical: tradeAssetData?.[0]
          ?.ta_service_technician_request_date
          ? tradeAssetData?.[0]?.ta_service_technician_request_date
            ? new Date(
                tradeAssetData[0]?.ta_service_technician_request_date ?? '',
              )
            : ''
          : 0,
        requestDateTA: tradeAssetData?.[0]?.ta_report_request_date
          ? tradeAssetData?.[0]?.ta_report_request_date
            ? new Date(tradeAssetData[0]?.ta_report_request_date ?? '')
            : ''
          : '',
        refund: tradeAssetData?.[0]?.refund_percentage ?? '',
        totalNetValue: tradeAssetData?.[0]?.net_value_of_product_destroyed,
        rdc: tradeAssetData?.[0]?.rdc_number,
        approvedBy: tradeAssetData?.[0]?.free_good_approver,
        notes: tradeAssetData?.[0]?.notes,
      };
      setClaimSettlementData(data);
    }
  };
  const getGridBlockedroducts = async () => {
    const {data} = props.route.params;
    const tradeAssetData =
      await TAProductDetailController.getGridBlockedroducts(
        data.idServiceRequestCustomer,
      );
    if (tradeAssetData) {
      console.log(
        tradeAssetData,
        'Received getGridBlockedroducts in offline Api block',
      );

      let dataObj = tradeAssetData.map((item: any) => ({
        materialNumber: item?.materialNumber,
        productGroup: item?.productGroup,
        quantity: item?.quantity,
        salesUnit: item?.salesUnit,
        price: item?.price,
      }));

      setOtherProductListData(dataObj);
    }
  };
  const getOnlineIcedTradeAssets = async () => {
    const {data} = props.route.params;
    const tradeIcedAssetData =
      await TAProductDetailController.getIcedTradeAssetsOnline(
        data?.customerShipTo,
        data?.salesOrganization,
        data?.distributionChannel,
        data?.idServiceRequestCustomer,
      );

    if (tradeIcedAssetData.data && tradeIcedAssetData.data.length > 0) {
      setIcedProductListData(tradeIcedAssetData?.data);
      let ar = tradeAssetListData.data.forEach(
        (element: any) => element.materialNumber,
      );

      setIcedProductListDropDown(ar);
    }
  };

  const getOnlineBlockedTradeAssets = async () => {
    const {data} = props.route.params;
    const dataList =
      await TAProductDetailController.getOnlineOrderlinesProducts(
        data?.customerShipTo,
      );

    console.log(dataList);
    setOtherProductListData(dataList?.data ?? []);
  };
  useEffect(() => {
    getScreenData();
  }, []);

  const getScreenData = async () => {
    try {
      setIsLoading(true);
      await checkWorkFlow();
      await fetchAllMaterialListDropdownData();
      await fetchSalesUnitDropdownData();
      await getRDCNumber();
      await getApprovedBy(' ');
      await getSalesRepDetail();
      await getClaimEnteredByData();
      await fetchCustomerDetail();
    } catch (er) {
      console.log('error in PD by TA', er);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (otherProductListData && otherProductListData.length) {
      let ar: any = [];
      otherProductListData.forEach(() => {
        ar = [
          ...ar,
          {
            materialNumber: '',
            quantity: '',
            salesUnit: '',
          },
        ];
      });
      setOtherProductListDataError(ar);
    }
  }, [otherProductListData]);
  useEffect(() => {
    if (icedProductListData && icedProductListData.length) {
      let ar: any = [];
      icedProductListData.forEach((element: any) => {
        ar = [
          ...ar,
          {
            materialNumber: '',
            last52Week: '',
            quantity: '',
            salesUnit: '',
          },
        ];
      });
      setIcedProductListDataError(ar);
    }
  }, [icedProductListData]);

  const calculateTotalValueDestroyed = () => {
    let total = 0;
    if (
      claimSettlementData.totalNetValue != '' &&
      !isNaN(claimSettlementData.totalNetValue)
    ) {
      total = claimSettlementData.totalNetValue;
    } else if (icedProductListData.length || otherProductListData.length) {
      icedProductListData.forEach((element: any) => {
        if (
          element.price &&
          element.price != '' &&
          !isNaN(Number(element.price))
        ) {
          total = total + element.price;
        }
      });

      otherProductListData.forEach((element: any) => {
        if (
          element.price &&
          element.price != '' &&
          !isNaN(Number(element.price))
        ) {
          total = total + element.price;
        }
      });
    }

    let refund =
      claimSettlementData.refund &&
      claimSettlementData.refund != '' &&
      !isNaN(Number(claimSettlementData.refund))
        ? Number(claimSettlementData.refund)
        : 0;

    let totalValue =
      claimSettlementData?.netAmount -
      (claimSettlementData?.netAmount * refund) / 100;

    setClaimSettlementData((prevState: any) => ({
      ...prevState,
      netAmount: total,
      totalNetValue: totalValue,
    }));
  };

  const handleSave = async () => {
    const {data} = props.route.params;
    console.log(data);
    if (isSaveAllowed) {
      const result = handleProductDetailErrorMessage();
      if (result) {
        const {data} = props.route.params;
        console.log(data);
        console.log(data.idServiceRequestCustomer);
        await TAProductDetailController.saveProductClaimData(
          data.idServiceRequestCustomer + '',
          data.customerShipTo + '',
          data.salesOrganization + '',
          data.distributionChannel + '',
          claimSettlementData,
          tradeAssetListData,
          icedProductListData,
          otherProductListData,
        );
        ACLService.saveAclGuardStatusToStorage(false);
        setIsSaveAllowed(false);
      }
    }
  };

  useEffect(() => {
    calculateTotalValueDestroyed();
  }, [activeTab]);

  const handleProductDetailErrorMessage = () => {
    if (tradeAssetListData && tradeAssetListData.length > 0) {
      let flag = false;
      tradeAssetListData.forEach((element: any) => {
        if (element.selection) {
          flag = true;
          return true;
        }
      });

      if (!flag) {
        toast.error({
          message: 'Select Trade Assets',
        });
        return flag;
      }
    }

    if (icedProductListData && icedProductListData.length) {
      let flag = false;
      let ar: any = [];
      icedProductListData.forEach((element: any, index: number) => {
        let obj = {
          materialNumber: '',
          last52Week: '',
          quantity: '',
          salesUnit: '',
        };
        if (element && element?.materialNumber == '') {
          flag = true;
          obj.materialNumber = 'mendatory';
        }
        if (element && element?.quantity == '') {
          flag = true;
          obj.quantity = 'mendatory';
        }
        if (isNaN(element?.quantity)) {
          flag = true;
          obj.quantity = 'invalid';
        }
        if (
          element &&
          !isNaN(element?.quantity) &&
          (element.quantity > 9999 || element.quantity < 0)
        ) {
          flag = true;
          obj.quantity = 'invalid';
        }
        if (element && element?.salesUnit == '') {
          flag = true;
          obj.salesUnit = 'mendatory';
        }

        ar = [...ar, obj];
      });
      setIcedProductListDataError(ar);
      setIcedProductListData((prevState: any) => [...prevState]);
      if (flag) {
        toast.error({
          message: 'Invalid Data',
        });
        return false;
      }
    }
    if (otherProductListData && otherProductListData.length) {
      let flag = false;
      let ar: any = [];
      otherProductListData.forEach((element: any, index: number) => {
        let obj = {
          materialNumber: '',
          quantity: '',
          salesUnit: '',
        };
        if (element && element?.materialNumber == '') {
          flag = true;
          obj.materialNumber = 'mendatory';
        }
        if (element && element?.quantity == '') {
          flag = true;
          obj.quantity = 'mendatory';
        }
        if (isNaN(element?.quantity)) {
          flag = true;
          obj.quantity = 'invalid';
        }
        if (
          element &&
          !isNaN(element?.quantity) &&
          (element.quantity > 9999 || element.quantity < 0)
        ) {
          flag = true;
          obj.quantity = 'invalid';
        }
        if (element && element?.salesUnit == '') {
          flag = true;
          obj.salesUnit = 'mendatory';
        }

        ar = [...ar, obj];
      });
      setOtherProductListDataError(ar);
      setOtherProductListData((prevState: any) => [...prevState]);
      if (flag) {
        toast.error({
          message: 'Invalid Data',
        });
        return false;
      }
    }

    return true;
  };

  const getClaimEnteredByData = async () => {
    const {data} = props.route.params;
    console.log(
      data?.idServiceRequestCustomer,
      'data?.idServiceRequestCustomer,',
    );
    try {
      const getApprovedByData =
        await TAProductDetailController.getClaimEnteredByData(
          data?.idServiceRequestCustomer,
        );

      setClaimEnteredBy(getApprovedByData);
    } catch (error) {
      console.log('error while fetching getClaimEnteredBy data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchCustomerDetail = async () => {
    const {data} = props.route.params;
    try {
      const customerDetailData =
        await TAProductDetailController.fetchCustomerDetail(
          data?.customerShipTo,
          data?.salesOrganization,
          data?.distributionChannel,
        );

      setCustomerDetail(customerDetailData);
    } catch (error) {
      console.log('error while fetching getClaimEnteredBy data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const getSalesRepDetail = async () => {
    const {data} = props.route.params;
    try {
      const customerDetailData =
        await TAProductDetailController.getSalesRepDetail(data?.customerShipTo);
      setSalesRepDetail(customerDetailData);
    } catch (error) {
      console.log('error while fetching getClaimEnteredBy data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };

  const getApprovedBy = async (searchText: string = ' ') => {
    if (searchText) {
      try {
        const getApprovedByData = await TAProductDetailController.getApprovedBy(
          searchText,
        );
        setApprovedByistData(getApprovedByData);
      } catch (error) {
        console.log(
          'error while fetching approvedBy dropdown data :>> ',
          error,
          searchText,
        );
        toast.error({
          message: 'Something went wrong',
        });
        return [];
      }
    }
  };

  const getNetValue = async (index: number, item: any) => {
    let ar = [...item];
    if (
      ar[index].materialNumber &&
      ar[index]?.quantity &&
      !isNaN(Number(ar[index]?.quantity))
    ) {
      const {data} = props.route.params;
      let valueData = await TAProductDetailController.getNetAmount(
        data.customerShipTo,
        data.salesOrganization,
        data.distributionChannel,
        ar[index].materialNumber,
        ar[index].quantity,
      );
      if (valueData && valueData.netamount) {
        ar[index] = {...ar[index], price: valueData.netamount};
        setIcedProductListData(ar);
      }
    }
  };
  const getOthersNetValue = async (index: number, item: any) => {
    let ar = [...item];
    if (
      ar[index].materialNumber &&
      ar[index]?.quantity &&
      !isNaN(Number(ar[index]?.quantity))
    ) {
      const {data} = props.route.params;
      let valueData = await TAProductDetailController.getNetAmount(
        data.customerShipTo,
        data.salesOrganization,
        data.distributionChannel,
        ar[index].materialNumber,
        ar[index].quantity,
      );
      if (valueData && valueData.netamount) {
        ar[index] = {...ar[index], price: valueData.netamount};
        setOtherProductListData(ar);
      }
    }
  };
  const handleIcedProductInputChange =
    (fieldName: string, index: number) => async (value: any) => {
      if (fieldName == 'quantity') {
        let ar = [...icedProductListData];
        ar[index] = {...ar[index], quantity: value};
        await setIcedProductListData(ar);
        getNetValue(index, ar);
      }
      if (fieldName == 'salesUnit') {
        let ar = [...icedProductListData];
        ar[index] = {...ar[index], salesUnit: value?.unitOfMeasure ?? ''};
        setIcedProductListData(ar);
      }
      if (fieldName == 'materialNumber') {
        let ar = [...icedProductListData];
        console.log(value);
        ar[index] = {
          ...ar[index],
          materialDescription: value?.description ?? '',
          materialNumber: value?.materialNumber ?? '',
        };
        setIcedProductListData(ar);
        getNetValue(index, ar);
      }
      if (fieldName == 'price') {
        console.log('INSIDE PRICE');
        let ar = [...icedProductListData];
        ar[index] = {...ar[index], price: value ?? ''};
        setIcedProductListData(ar);
      }
      if (fieldName == 'add') {
        setIcedProductListData((prevState: any) => [
          ...prevState,
          {
            materialDescription: '',
            materialNumber: 0,
            price: '',
            quantity: '',
            quantityDeliveredInLast52Weeks: 0,
            salesUnit: '',
          },
        ]);
      }
      if (fieldName == 'delete') {
        let Data = icedProductListData.filter(
          (item: any) => item != icedProductListData[index],
        );
        setIcedProductListData(Data);
      }
      setIsSaveAllowed(true);
    };

  const setProductGroup = async (index: number, ar: any) => {
    const {data} = props.route.params;
    if (ar[index]?.materialNumber != '') {
      let materialData: any =
        await TAProductDetailController.getMaterailNumberDropdownData(
          data.pickingPlantNumber,
          data.salesOrganization,
          data.distributionChannel,
          ar[index]?.materialNumber,
        );
      const productGroupData = await getMaterialProductGroup(
        materialData?.[0]?.material_hierarchy_from_sap_node_l2 ?? '',
        materialData?.[0]?.material_hierarchy_node_l2 ?? '',
      );
      if (productGroupData) {
        ar[index] = {...ar[index], productGroup: productGroupData};
        console.log(ar[index], 'PRODUCT GROUP DATA', productGroupData);
        setOtherProductListData([...ar]);
      }
    }
  };
  const getMaterialProductGroup = async (
    materialHierarchyFromSapNode: string,
    materialHierarchyFromNode: string,
  ) => {
    try {
      const materialDropdownData =
        await TAProductDetailController.getMaterialProductGroup(
          materialHierarchyFromSapNode,
          materialHierarchyFromNode,
        );

      return materialDropdownData?.[0]?.description_language_1 ?? '';
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const handleOtherProductInputChange =
    (fieldName: string, index: number) => async (value: any) => {
      if (fieldName == 'quantity') {
        let ar = [...otherProductListData];
        ar[index] = {...ar[index], quantity: value};
        await setOtherProductListData(ar);
        getOthersNetValue(index, ar);
      }
      if (fieldName == 'salesUnit') {
        let ar = [...otherProductListData];
        ar[index] = {...ar[index], salesUnit: value?.unitOfMeasure ?? ''};
        setOtherProductListData(ar);
      }
      if (fieldName == 'materialNumber') {
        let ar = [...otherProductListData];
        ar[index] = {
          ...ar[index],
          materialNumber: value?.materialNumber ?? '',
        };
        await setOtherProductListData(ar);
        setProductGroup(index, ar);
        // getOthersNetValue(index, ar);
      }
      if (fieldName == 'add') {
        setOtherProductListData((prevState: any) => [
          ...prevState,
          {
            materialNumber: 0,
            price: '',
            quantity: '',
            productGroup: '',
            salesUnit: '',
          },
        ]);
      }
      if (fieldName == 'delete') {
        let Data = otherProductListData.filter(
          (item: any) => item != otherProductListData[index],
        );
        setOtherProductListData(Data);
      }
      setIsSaveAllowed(true);
    };
  const handlSettlementInputChange = async (fieldName: string, value: any) => {
    if (fieldName == 'defectStatus') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        defectStatus: value?.value,
      }));
    }
    if (fieldName == 'settlementDone') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        settlementDone: value?.value,
      }));
    }
    if (fieldName == 'settlementDoneBy') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        settlementDoneBy: value?.value,
      }));
    }

    if (fieldName == 'requestDateTechnical') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        requestDateTechnical: value,
      }));
    }
    if (fieldName == 'requestDateTA') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        requestDateTA: value,
      }));
    }
    if (fieldName == 'refund') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        refund:
          value != ''
            ? value.length > 1 && value[0] == '0'
              ? value.slice(1)
              : value
            : '0',
      }));

      if (value && value != '' && !isNaN(Number(value))) {
        let totalValue =
          claimSettlementData?.netAmount -
          (claimSettlementData?.netAmount * Number(value)) / 100;

        setClaimSettlementData((prevState: any) => ({
          ...prevState,
          totalNetValue: totalValue,
        }));
      } else {
        setClaimSettlementData((prevState: any) => ({
          ...prevState,
          totalNetValue: claimSettlementData.netAmount,
        }));
      }
    }
    if (fieldName == 'totalNetValue') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        totalNetValue: value,
      }));
    }
    if (fieldName == 'rdc') {
      console.log(value, 'VAlue');
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        rdc: value?.description,
      }));
    }
    if (fieldName == 'approvedBy') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        approvedBy: value?.partnerNumber,
      }));
    }
    if (fieldName == 'notes') {
      setClaimSettlementData((prevState: any) => ({
        ...prevState,
        notes: value,
      }));
    }
    setIsSaveAllowed(true);
  };

  const handleModalBack = () => {
    setClaimsModalVisible(false);
  };
  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <ServiceWorkFlowLandingHeader data={data} />
      <View flex style={tw('ml-4 mr-1')}>
        <Card flex-1 marginR-v2 marginB-v2 padding-v4>
          <RenderHeader
            setClaimsModalVisible={() => setClaimsModalVisible(true)}
            handleCancelPressed={handleCancelPressed}
            handleSave={handleSave}
            isSaveAllowed={isSaveAllowed}
          />
          <TAClaimsTopTabComponent
            handleChangeTab={handleActiveTab}
            SelectedValue={activeTab}
          />
          {isLoading ? (
            <View flex center>
              <ActivityIndicator
                color={ColourPalette.light.darkBlue}
                size="large"
              />
            </View>
          ) : (
            // <></>
            <ScrollView nestedScrollEnabled style={tw('mt-6')}>
              {activeTab === TA_CLAIMS_TYPES[0].title ? (
                <ProductDetailComponent
                  icedProductListDropDown={icedProductListDropDown}
                  icedProductListDataError={icedProductListDataError}
                  otherProductListDataError={otherProductListDataError}
                  otherProductListData={otherProductListData}
                  allMaterialListData={allMaterialListData}
                  icedProductListData={icedProductListData}
                  handleTradeAssetItemClicked={handleTradeAssetItemClicked}
                  tradeAssetListData={tradeAssetListData}
                  salesTypeListData={salesTypeListData}
                  handleIcedProductInputChange={handleIcedProductInputChange}
                  handleOtherProductInputChange={handleOtherProductInputChange}
                  userData={data}
                  isEditable={true}
                />
              ) : (
                <ClaimsSettlementComponent
                  otherProductListData={otherProductListData}
                  icedProductListData={icedProductListData}
                  isEditable={true}
                  getApprovedBy={getApprovedBy}
                  approvedByistData={approvedByistData}
                  claimSettlementData={claimSettlementData}
                  handlSettlementInputChange={handlSettlementInputChange}
                  responsibleRDCListData={responsibleRDCListData}
                />
              )}
            </ScrollView>
          )}
        </Card>
      </View>
      <PCModal
        isClaimsModalVisible={isClaimsModalVisible}
        handleBack={handleModalBack}
        item={{
          claimEnteredBy,
          customerDetail,
          salesRepDetail,
        }}
        handleInputChange={() => {}}
        errorMessages={() => {}}
        isEditable={false}
      />
    </SafeAreaView>
  );
};

export default withAuthScreen(ProductDestroyedByTAClaims);

const styles = StyleSheet.create({});
