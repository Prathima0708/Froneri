import React, {FC, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import View from 'src/components/View';
import {tw} from 'src/tw';
import Card from 'src/components/Card';
import ProductDetailsComponent from 'src/components/ServiceWorkflow/ProductClaims/ProductDetailsComponent';
import PCModal from 'src/components/ServiceWorkflow/ProductClaims/PCModal';
import {toast} from 'src/utils/Util';
import ProductClaimController from 'src/controller/ProductClaimController';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import ServiceWorkFlowLandingHeader from 'src/components/Header/ServiceWorkFlowLandingHeader';
import MessageModal from 'src/components/Common/MessageModal';
import {useNavigation} from '@react-navigation/native';

const ProductClaims: FC = (props: any) => {
  const navigation = useNavigation();
  const [isClaimsModalVisible, setClaimsModalVisible] = useState(false);
  const [productClaimInfo, setProductClaimInfo] = useState<any>({
    minorDamage: '',
    freeGoodNumber: '',
    freeGoodQuantity: '',
    freeGoodSalesUnit: '',
    freeGoodValue: '',
    freeGoods: [{}],
    approvedBy: '',
    alreadyDestroyed: '',
    pickupNecessary: '',
    notifiedProductDestructionDate: '',
    pickUpDate: '',
    claimNumber: '',
    priority: '',
    dateOfAnswer: '',
    replyLetter: '',
  });
  const [productDetailInfo, setProductDetailInfo] = useState<any>({
    materialNumber: '',
    productGroup: '',
    batchCode: '',
    bestBeforDate: '',
    bestBeforTime: '',
    quantity: '',
    salesUnit: '',
    claimType: '',
    productCondition: '',
    claimDescription: '',
    email: '',
    claimProductsAvl: '',
    feedbackRequested: '',
  });
  const [productDetailError, setProductDetailError] = useState<any>({
    materialNumber: '',
    productGroup: '',
    batchCode: '',
    bestBeforDate: '',
    bestBeforTime: '',
    quantity: '',
    salesUnit: '',
    claimType: '',
    productCondition: '',
    claimDescription: '',
    email: '',
    claimProductsAvl: '',
    feedbackRequested: '',
  });
  const [productClaimInfoErrorMessage, setProductClaimInfoErrorMessage] =
    useState({
      minorDamage: '',
      freeGoodNumber: '',
      freeGoodQuantity: '',
      freeGoodSalesUnit: '',
      freeGoodValue: '',
      approvedBy: '',
      alreadyDestroyed: '',
      pickupNecessary: '',
      notifiedProductDestructionDate: '',
      pickUpDate: '',
      claimNumber: '',
      priority: '',
      dateOfAnswer: '',
      replyLetter: '',
    });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isSaveAllowed, setIsSaveAllowed] = useState(false);
  const [handleDiscardVisible, setHandleDiscardVisible] = useState(false);
  const [materialListData, setMaterialListData] = useState([]);
  const [claimMaterialListData, setClaimMaterialListData] = useState([]);
  const [salesUnitListData, setSalesUnitListData] = useState([]);
  const [claimTypeListData, setClaimTypeListData] = useState([]);
  const [priorityListData, setPriorityListData] = useState([]);
  const [productConditionListData, setProductConditionListData] = useState([]);
  const [approvedByListData, setApprovedByListData] = useState([]);
  const [claimEnteredBy, setClaimEnteredBy] = useState([]);
  const [customerDetail, setCustomerDetail] = useState([]);
  const [salesRepDetail, setSalesRepDetail] = useState([]);

  // unused for population of data
  const getProductClaimCustomerData = async () => {
    const {data} = props.route.params;
    console.log(
      'data?.idServiceRequestCustomer :>> ',
      data?.idServiceRequestCustomer,
    );
    try {
      const productClaimCustomerData =
        await ProductClaimController.getProductClaimCustomerData(
          data?.idServiceRequestCustomer ?? '',
        );
      const emailData = await ProductClaimController.getTextsValue();
      console.log(emailData, 'emailData');
      if (productClaimCustomerData && productClaimCustomerData.length > 0) {
        await getApprovedBy(
          productClaimCustomerData?.[0].free_good_approver ?? ' ',
        );

        setProductGroup();
        let productDetailData = {
          materialNumber: productClaimCustomerData?.[0].material_number ?? '',
          productGroup: '',
          batchCode:
            productClaimCustomerData?.[0].batch_code_or_delivery_date ?? '',
          bestBeforDate:
            new Date(productClaimCustomerData[0].best_before_date) ?? '',
          bestBeforTime:
            productClaimCustomerData[0].best_before_date_time ?? '',
          quantity:
            productClaimCustomerData[0].quantity_of_claimed_products ?? '',
          salesUnit:
            productClaimCustomerData[0]
              .quantity_of_claimed_products_sales_units ?? '',
          claimType: productClaimCustomerData[0].reason_for_claim ?? '',
          productCondition:
            productClaimCustomerData[0].condition_of_product ?? '',
          claimDescription:
            productClaimCustomerData[0].description_claim_reason ?? '',
          email: emailData,
          claimProductsAvl:
            productClaimCustomerData[0].claimed_products_available ?? '',
          feedbackRequested:
            productClaimCustomerData[0].feedback_requested_from_customer ?? '',
        };

        setProductDetailInfo((prevState: any) => ({
          ...prevState,
          ...productDetailData,
        }));
        let ProductClaimData = {
          minorDamage: productClaimCustomerData[0].minor_damage ?? '',
          freeGoodNumber: productClaimCustomerData[0].free_good_number ?? '',
          freeGoodQuantity:
            productClaimCustomerData[0].free_good_quantity ?? '',
          freeGoodSalesUnit:
            productClaimCustomerData[0].free_good_quantity_sales_units ?? '',
          freeGoodValue: productClaimCustomerData[0].free_good_value ?? '',
          freeGoods: [{}] ?? '',
          approvedBy: productClaimCustomerData[0].free_good_approver ?? '',
          alreadyDestroyed:
            productClaimCustomerData[0].products_destroyed ?? '',
          pickupNecessary:
            productClaimCustomerData[0].product_pickup_necessary ?? '',
          notifiedProductDestructionDate: productClaimCustomerData[0]
            .customer_destruction_info_date
            ? new Date(
                productClaimCustomerData[0].customer_destruction_info_date ??
                  '',
              )
            : '',
          pickUpDate: productClaimCustomerData[0].product_pickup_date
            ? new Date(productClaimCustomerData[0].product_pickup_date)
            : '',
          claimNumber: productClaimCustomerData[0].claim_id ?? '',
          priority: productClaimCustomerData[0].priority ?? '',
          dateOfAnswer: productClaimCustomerData[0].quality_team_answer_date
            ? new Date(
                productClaimCustomerData[0].quality_team_answer_date ?? '',
              )
            : '',
          replyLetter:
            productClaimCustomerData[0].reply_letter_to_customer ?? '',
        };
        setProductClaimInfo((prevState: any) => ({
          ...prevState,
          ...ProductClaimData,
        }));
        setProductClaimInfo(ProductClaimData);
        fetchMaterialListDropdownData(productDetailData?.materialNumber ?? '');
        fetchClaimMaterialListDropdownData(
          ProductClaimData?.freeGoodNumber ?? '',
        );
      } else {
        await getApprovedBy(' ');
        setProductClaimInfo({
          minorDamage: '',
          freeGoodNumber: '',
          freeGoodQuantity: '',
          freeGoodSalesUnit: '',
          freeGoodValue: '',
          freeGoods: [{}],
          approvedBy: '',
          alreadyDestroyed: '',
          pickupNecessary: '',
          notifiedProductDestructionDate: '',
          pickUpDate: '',
          claimNumber: '',
          priority: '',
          dateOfAnswer: '',
          replyLetter: '',
        });
        setProductDetailInfo({
          materialNumber: '',
          productGroup: '',
          batchCode: '',
          bestBeforDate: '',
          bestBeforTime: '',
          quantity: '',
          salesUnit: '',
          claimType: '',
          productCondition: '',
          claimDescription: '',
          email: emailData,
          claimProductsAvl: '',
          feedbackRequested: '',
        });
        fetchMaterialListDropdownData('');
        fetchClaimMaterialListDropdownData('');
      }
    } catch (error) {
      console.log(
        'error while fetching productClaimCustomerData dropdown data :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchSalesUnitDropdownData = async () => {
    try {
      const salesUnitDropdownData =
        await ProductClaimController.getSalesUnitTypeDropdownData();
      setSalesUnitListData(salesUnitDropdownData);
    } catch (error) {
      console.log('error while fetching salesUnit dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchClaimTypeDropdownData = async () => {
    try {
      const claimTypeData =
        await ProductClaimController.getClaimsTypeDropdownData();
      setClaimTypeListData(claimTypeData);
    } catch (error) {
      console.log('error while fetching salesUnit dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchProductConditionDropdownData = async () => {
    try {
      const productConditionData =
        await ProductClaimController.getProductConditionDropdownData();
      setProductConditionListData(productConditionData);
    } catch (error) {
      console.log(
        'error while fetching ProductCondition dropdown data :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchMaterialListDropdownData = async (searchText: string) => {
    const {data} = props.route.params;
    console.log(data);
    try {
      const materialDropdownData =
        await ProductClaimController.getMaterailNumberDropdownData(
          data?.pickingPlantNumber,
          data?.salesOrganization,
          data?.distributionChannel,
          searchText,
        );

      setMaterialListData(materialDropdownData);
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchClaimMaterialListDropdownData = async (searchText: string) => {
    const {data} = props.route.params;
    console.log(data);
    try {
      const materialDropdownData =
        await ProductClaimController.getMaterailNumberDropdownData(
          data?.pickingPlantNumber,
          data?.salesOrganization,
          data?.distributionChannel,
          searchText,
        );

      setClaimMaterialListData(materialDropdownData);
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
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

      return materialDropdownData?.[0]?.description_language_1 ?? '';
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const getApprovedBy = async (searchText: string = ' ') => {
    if (searchText) {
      try {
        const getApprovedByData = await ProductClaimController.getApprovedBy(
          searchText,
        );
        setApprovedByListData(getApprovedByData);
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
  const getPriorityDropdownData = async () => {
    try {
      const getApprovedByData =
        await ProductClaimController.getPriorityDropdownData();

      setPriorityListData(getApprovedByData);
    } catch (error) {
      console.log(
        'error while fetching getPriorityDropdownData dropdown data :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const getClaimEnteredByData = async () => {
    const {data} = props.route.params;
    console.log(
      data?.idServiceRequestCustomer,
      'data?.idServiceRequestCustomer,',
    );
    try {
      const getApprovedByData =
        await ProductClaimController.getClaimEnteredByData(
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
        await ProductClaimController.fetchCustomerDetail(
          data?.customerShipTo,
          data?.salesOrganization,
          data?.distributionChannel,
        );
      console.log('RESESES', customerDetailData);
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
      const customerDetailData = await ProductClaimController.getSalesRepDetail(
        data?.customerShipTo,
      );
      setSalesRepDetail(customerDetailData);
    } catch (error) {
      console.log('error while fetching getClaimEnteredBy data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };

  const getScreenData = async () => {
    try {
      setIsLoading(true);
      await fetchSalesUnitDropdownData();
      await getProductClaimCustomerData();
      await fetchClaimTypeDropdownData();
      await fetchProductConditionDropdownData();
      await getPriorityDropdownData();
      await getClaimEnteredByData();
      await fetchCustomerDetail();
      await getSalesRepDetail();
    } catch (er) {
      console.log(er, 'Error in get Screen Data');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getScreenData();
  }, []);
  const handleCancel = async () => {
    if (isSaveAllowed) {
      if (!handleDiscardVisible) {
        setHandleDiscardVisible(true);
      } else {
        setIsSaveAllowed(false);
        await getProductClaimCustomerData();
        setProductClaimInfoErrorMessage({
          minorDamage: '',
          freeGoodNumber: '',
          freeGoodQuantity: '',
          freeGoodSalesUnit: '',
          freeGoodValue: '',
          approvedBy: '',
          alreadyDestroyed: '',
          pickupNecessary: '',
          notifiedProductDestructionDate: '',
          pickUpDate: '',
          claimNumber: '',
          priority: '',
          dateOfAnswer: '',
          replyLetter: '',
        });
        setProductDetailError({
          materialNumber: '',
          productGroup: '',
          batchCode: '',
          bestBeforDate: '',
          bestBeforTime: '',
          quantity: '',
          salesUnit: '',
          claimType: '',
          productCondition: '',
          claimDescription: '',
          email: '',
          claimProductsAvl: '',
          feedbackRequested: '',
        });
        setHandleDiscardVisible(false);
        navigation.goBack();
      }
    }
  };
  const handleSaveCustomerInfo = async () => {
    console.log(productDetailInfo.productCondition);
    const {data} = props.route.params;
    console.log('prev screen data :>> ', data);
    if (!validateProductDetail()) {
      toast.error({
        message: 'Please enter all the mandatory fields in all the tabs.',
      });
      return;
    }

    const isProductSaved = await ProductClaimController.saveProductClaimData(
      data.idServiceRequestCustomer,
      productDetailInfo,
      productClaimInfo,
      data.customerShipTo,
      data.salesOrganization,
      data.distributionChannel,
    );

    console.log(isProductSaved, 'Finally saved');

    if (isProductSaved) {
      toast.success({
        message: 'Data Saved Successfully',
      });
      navigation.goBack();
      return;
    }

    toast.error({
      message: 'Something went wrong',
    });
  };

  const setDetailError = (key: string, value: string) => {
    setProductDetailError((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const validateProductDetail = () => {
    let errorDetected = false;
    if (productDetailInfo.materialNumber == '') {
      setDetailError('materialNumber', 'Mandatory');
      errorDetected = true;
    }
    if (productDetailInfo.batchCode == '') {
      setDetailError('batchCode', 'Mandatory');
      errorDetected = true;
    }
    if (
      productDetailInfo.batchCode &&
      productDetailInfo?.batchCode?.length > 100
    ) {
      setDetailError('batchCode', 'Invalid');
      errorDetected = true;
    }
    if (productDetailInfo.bestBeforDate == '') {
      setDetailError('bestBeforDate', 'Mandatory');
      errorDetected = true;
    }
    if (productDetailInfo.bestBeforTime == '') {
      setDetailError('bestBeforTime', 'Mandatory');
      errorDetected = true;
    }
    if (
      productDetailInfo.bestBeforTime &&
      productDetailInfo?.bestBeforTime?.length > 100
    ) {
      setDetailError('bestBeforTime', 'Invalid');
      errorDetected = true;
    }
    if (productDetailInfo.quantity == '') {
      setDetailError('quantity', 'Mandatory');
      errorDetected = true;
    }
    if (productDetailInfo.quantity > 9999) {
      setDetailError('quantity', 'Invalid');
      errorDetected = true;
    }
    if (isNaN(Number(productDetailInfo.quantity))) {
      setDetailError('quantity', 'Invalid');
      errorDetected = true;
    }
    if (Number(productDetailInfo.quantity) < 0) {
      setDetailError('quantity', 'Invalid');
      errorDetected = true;
    }
    if (productDetailInfo.salesUnit == '') {
      setDetailError('salesUnit', 'Mandatory');
      errorDetected = true;
    }

    if (productDetailInfo.claimType == '') {
      setDetailError('claimType', 'Mandatory');
      errorDetected = true;
    }
    if (productDetailInfo.productCondition == '') {
      setDetailError('productCondition', 'Mandatory');
      errorDetected = true;
    }
    if (productDetailInfo.claimDescription == '') {
      setDetailError('claimDescription', 'Mandatory');
      errorDetected = true;
    }
    if (
      productDetailInfo.claimDescription &&
      productDetailInfo.claimDescription.length > 1000
    ) {
      setDetailError('claimDescription', 'Invalid');
      errorDetected = true;
    }
    if (productDetailInfo.claimProductsAvl == '') {
      setDetailError('claimProductsAvl', 'Mandatory');
      errorDetected = true;
    }
    if (productDetailInfo.feedbackRequested == '') {
      setDetailError('feedbackRequested', 'Mandatory');
      errorDetected = true;
    }

    // Claim Settlement Error
    if (
      productClaimInfo.freeGoodNumber !== '' ||
      productClaimInfo.freeGoodQuantity !== '' ||
      productClaimInfo.freeGoodSalesUnit !== ''
    ) {
      if (productClaimInfo.freeGoodNumber == '') {
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodNumber: 'Mandatory',
        }));
        errorDetected = true;
      }
      if (productClaimInfo.freeGoodQuantity == '') {
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodQuantity: 'Mandatory',
        }));
        errorDetected = true;
      }
      if (productClaimInfo.freeGoodQuantity > 9999) {
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodQuantity: 'Invalid',
        }));

        errorDetected = true;
      }
      if (Number.isNaN(Number(productClaimInfo.freeGoodQuantity))) {
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodQuantity: 'Invalid',
        }));

        errorDetected = true;
      }
      if (productClaimInfo.freeGoodSalesUnit == '') {
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodSalesUnit: 'Mandatory',
        }));
        errorDetected = true;
      }
      // if (productClaimInfo.approvedBy == '') {
      //   setProductClaimInfoErrorMessage((prevState: any) => ({
      //     ...prevState,
      //     approvedBy: 'Mandatory',
      //   }));
      //   errorDetected = true;
      // }
    }
    if (
      productClaimInfo.freeGoodQuantity !== '' &&
      productClaimInfo.approvedBy == ''
    ) {
      setProductClaimInfoErrorMessage((prevState: any) => ({
        ...prevState,
        approvedBy: 'Mandatory',
      }));
      errorDetected = true;
    }

    if (errorDetected) {
      return false;
    }
    return true;
  };

  const handleModalBack = () => {
    setClaimsModalVisible(false);
  };

  const renderModal = () => {
    setClaimsModalVisible(true);
  };

  const getNetValue = async () => {
    if (
      productClaimInfo.freeGoodNumber &&
      productClaimInfo?.freeGoodQuantity &&
      isNaN(Number(productClaimInfo?.freeGoodQuantit))
    ) {
      let valueData = await ProductClaimController.getNetAmount(
        data.customerShipTo,
        data.salesOrganization,
        data.distributionChannel,
        productClaimInfo.freeGoodNumber,
        productClaimInfo.freeGoodQuantity,
      );
      console.log(valueData, 'Value received');
      setProductClaimInfo((prevState: any) => ({
        ...prevState,
        freeGoodValue: valueData?.netamount ?? '',
      }));
    }
  };

  useEffect(() => {
    getNetValue();
  }, [productClaimInfo.freeGoodNumber, productClaimInfo.freeGoodQuantity]);

  const setProductGroup = async () => {
    if (productDetailInfo.materialNumber != '') {
      let materialData: any = await materialListData.filter(
        (item: any) =>
          item?.materialNumber === productDetailInfo.materialNumber,
      );
      const productGroupData = await getMaterialProductGroup(
        materialData?.[0]?.material_hierarchy_from_sap_node_l2 ?? '',
        materialData?.[0]?.material_hierarchy_node_l2 ?? '',
      );
      setProductDetailInfo((prevState: any) => ({
        ...prevState,
        productGroup: productGroupData,
      }));
    }
  };
  useEffect(() => {
    setProductGroup();
  }, [materialListData]);
  const handleClaimsInputChange = (fieldName: string) => async (value: any) => {
    setIsSaveAllowed(true);
    let ar = {};

    setIsEditable(true);
    switch (fieldName) {
      case 'minorDamage':
        ar = {...productClaimInfo, minorDamage: value?.value};

        setProductClaimInfo(ar);
        break;
      case 'approvedBy':
        console.log(value, 'bestBeforDate');
        ar = {...productClaimInfo, approvedBy: value?.partnerNumber};
        setProductClaimInfo(ar);
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          approvedBy: '',
        }));
        break;
      case 'alreadyDestroyed':
        ar = {...productClaimInfo, alreadyDestroyed: value?.value};
        setProductClaimInfo(ar);
        break;
      case 'pickupNecessary':
        ar = {...productClaimInfo, pickupNecessary: value?.value};
        setProductClaimInfo(ar);
        break;
      case 'notifiedProductDestructionDate':
        ar = {
          ...productClaimInfo,
          notifiedProductDestructionDate: value,
        };
        setProductClaimInfo(ar);
        break;
      case 'pickUpDate':
        ar = {...productClaimInfo, pickUpDate: value};
        setProductClaimInfo(ar);
        break;
      case 'claimNumber':
        ar = {...productClaimInfo, claimNumber: value};
        setProductClaimInfo(ar);
        break;
      case 'priority':
        console.log(value, 'PriorityVALUE');
        ar = {...productClaimInfo, priority: value?.claim_code};
        setProductClaimInfo(ar);
        break;
      case 'dateOfAnswer':
        ar = {...productClaimInfo, dateOfAnswer: value};
        setProductClaimInfo(ar);
        break;
      case 'replyLetter':
        ar = {...productClaimInfo, replyLetter: value ?? ''};
        setProductClaimInfo(ar);
        break;
      case 'freeGoodSalesUnit':
        setProductClaimInfo((prevState: any) => ({
          ...prevState,
          freeGoodSalesUnit: value.unitOfMeasure,
        }));
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodSalesUnit: '',
        }));
        break;
      case 'freeGoodNumber':
        await setProductClaimInfo((prevState: any) => ({
          ...prevState,
          freeGoodNumber: value.materialNumber,
        }));
        getNetValue();
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodNumber: '',
        }));
        break;
      case 'freeGoodQuantity':
        setProductClaimInfo((prevState: any) => ({
          ...prevState,
          freeGoodQuantity: value,
        }));

        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodQuantity: '',
        }));
        break;
      case 'freeGoodDelete':
        ar = {
          ...productClaimInfo,
          freeGoodNumber: '',
          freeGoodQuantity: '',
          freeGoodSalesUnit: '',
          freeGoodValue: '',
          freeGoods: [],
        };
        setProductClaimInfo(ar);
        setProductClaimInfoErrorMessage((prevState: any) => ({
          ...prevState,
          freeGoodNumber: '',
          freeGoodQuantity: '',
          freeGoodSalesUnit: '',
          freeGoodValue: '',
        }));
        break;
      default:
        break;
    }
  };
  const handleDetailInputChange = (fieldName: string) => async (value: any) => {
    setIsSaveAllowed(true);
    let ar = {};
    var err = {};
    switch (fieldName) {
      case 'materialNumber':
        const productGroupData = await getMaterialProductGroup(
          value?.material_hierarchy_from_sap_node_l2 ?? '',
          value?.material_hierarchy_node_l2 ?? '',
        );
        ar = {
          ...productDetailInfo,
          materialNumber: value?.materialNumber ?? '',
          productGroup: productGroupData,
        };
        setProductDetailInfo(ar);
        err = {...productDetailError, materialNumber: ''};
        setProductDetailError(err);
        break;
      case 'productGroup':
        ar = {...productDetailInfo, productGroup: value};
        setProductDetailInfo(ar);
        err = {...productDetailError, productGroup: ''};
        setProductDetailError(err);
        break;
      case 'batchCode':
        ar = {...productDetailInfo, batchCode: value};
        setProductDetailInfo(ar);
        err = {...productDetailError, batchCode: ''};
        setProductDetailError(err);
        break;
      case 'bestBeforDate':
        console.log(value, 'bestBeforDate');
        ar = {...productDetailInfo, bestBeforDate: value};
        setProductDetailInfo(ar);
        err = {...productDetailError, bestBeforDate: ''};
        setProductDetailError(err);
        break;
      case 'bestBeforTime':
        ar = {...productDetailInfo, bestBeforTime: value};
        setProductDetailInfo(ar);
        err = {...productDetailError, bestBeforTime: ''};
        setProductDetailError(err);
        break;
      case 'quantity':
        ar = {...productDetailInfo, quantity: value};
        setProductDetailInfo(ar);
        err = {...productDetailError, quantity: ''};
        setProductDetailError(err);
        break;
      case 'salesUnit':
        ar = {...productDetailInfo, salesUnit: value?.unitOfMeasure ?? ''};
        setProductDetailInfo(ar);
        err = {...productDetailError, salesUnit: ''};
        setProductDetailError(err);
        break;
      case 'claimType':
        ar = {...productDetailInfo, claimType: value?.claim_code ?? ''};
        setProductDetailInfo(ar);
        err = {...productDetailError, claimType: ''};
        setProductDetailError(err);
        break;
      case 'productCondition':
        ar = {...productDetailInfo, productCondition: value.claim_code};
        setProductDetailInfo(ar);
        err = {...productDetailError, productCondition: ''};
        setProductDetailError(err);
        break;
      case 'claimDescription':
        ar = {...productDetailInfo, claimDescription: value};
        setProductDetailInfo(ar);
        err = {...productDetailError, claimDescription: ''};
        setProductDetailError(err);
        break;
      case 'email':
        ar = {...productDetailInfo, email: value};
        setProductDetailInfo(ar);
        err = {...productDetailError, email: ''};
        setProductDetailError(err);
        break;
      case 'claimProductsAvl':
        ar = {...productDetailInfo, claimProductsAvl: value?.value ?? ''};
        setProductDetailInfo(ar);
        err = {...productDetailError, claimProductsAvl: ''};
        setProductDetailError(err);
        break;
      case 'feedbackRequested':
        ar = {...productDetailInfo, feedbackRequested: value?.value ?? ''};
        setProductDetailInfo(ar);
        err = {...productDetailError, feedbackRequested: ''};
        setProductDetailError(err);
        break;
      default:
        break;
    }
  };

  const {data} = props.route.params;
  return (
    <SafeAreaView style={tw('flex-1 border-light-lavendar')}>
      <View flex>
        <ServiceWorkFlowLandingHeader data={data} />
        <View row flex>
          <View flex margin-v2>
            <Card flex-1 marginB-v2>
              {isLoading ? (
                <CustomerLandingLoader />
              ) : (
                <ProductDetailsComponent
                  fetchMaterialListDropdownData={fetchMaterialListDropdownData}
                  fetchClaimMaterialListDropdownData={
                    fetchClaimMaterialListDropdownData
                  }
                  productDetailError={productDetailError}
                  productClaimInfo={productClaimInfo}
                  productDetailInfo={productDetailInfo}
                  approvedByListData={approvedByListData}
                  handleDetailInputChange={handleDetailInputChange}
                  handleClaimsInputChange={handleClaimsInputChange}
                  userData={data}
                  isSaveAllowed={isSaveAllowed}
                  productConditionListData={productConditionListData}
                  claimTypeListData={claimTypeListData}
                  salesUnitListData={salesUnitListData}
                  materialListData={materialListData}
                  claimMaterialListData={claimMaterialListData}
                  handleSaveCustomerInfo={handleSaveCustomerInfo}
                  handleCancel={handleCancel}
                  isEditable={isEditable}
                  handleModal={renderModal}
                  productClaimInfoErrorMessage={productClaimInfoErrorMessage}
                  priorityListData={priorityListData}
                  getApprovedByDropdownData={getApprovedBy}
                />
              )}
            </Card>
          </View>
        </View>
        <PCModal
          isClaimsModalVisible={isClaimsModalVisible}
          handleBack={handleModalBack}
          item={{
            claimEnteredBy,
            customerDetail,
            salesRepDetail,
          }}
          handleInputChange={handleClaimsInputChange}
          errorMessages={productClaimInfoErrorMessage}
          isEditable={false}
        />
      </View>
      {handleDiscardVisible ? (
        <MessageModal
          isVisible={handleDiscardVisible}
          title="Discard the Changes?"
          subTitle="Your unsaved edits will be lost"
          primaryButtonText="Yes, Discard"
          secondaryButtonText="No, Keep the changes"
          handleOnPressSuccess={handleCancel}
          handleOnPressCancel={() => {
            setHandleDiscardVisible(false);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ProductClaims;
