import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import View from 'src/components/View';
import Card from 'src/components/Card';
import Text from 'src/components/Text';
import MessageModal from 'src/components/Common/MessageModal';

import { tw } from 'src/tw';

import { ColourPalette } from 'src/styles/config/ColoursStyles';

import ServiceWorkFlowLandingHeader from 'src/components/Header/ServiceWorkFlowLandingHeader';
import SendViaEmailModal from 'src/components/ServiceWorkflow/SWFBasicInfo/SendViaMailModal';
import DeleteConfirmationModal from 'src/components/ServiceWorkflow/SWFBasicInfo/DeleteConfirmationModal';
import DeleteWarningModal from 'src/components/ServiceWorkflow/SWFBasicInfo/DeleteWarningModal';
import ChangeRequestTypeModal from 'src/components/ServiceWorkflow/SWFBasicInfo/ChangeRequestTypeModal';
import SWTraceGridComponent from 'src/components/ServiceWorkflow/SWFBasicInfo/SWTraceGridComponent';
import SWRequestBasicInfoComponent from 'src/components/ServiceWorkflow/SWFBasicInfo/SWRequestBasicInfoComponent';
import SWBasicInfoComponent from 'src/components/ServiceWorkflow/SWFBasicInfo/SWBasicInfoComponent';

import {
  pageNameDeliveryMistakesClaim,
  pageNameMaterialListing,
  pageNameProductClaims,
  pageNameProductDestroyedByTAClaims,
} from 'src/routes/Routes';

import { withAuthScreen } from 'src/hoc/withAuthScreen';

import { toast } from 'src/utils/Util';
import { addWeekdays, getUUID } from 'src/utils/CommonUtil';

import ServiceWorkflowController from 'src/controller/ServiceWorkflowController';
import CLServiceWorkflowController from 'src/controller/CLServiceWorkflowController';

import ACLService from 'src/services/ACLService';

import { RootState, useAppSelector } from 'src/reducers/hooks';
import { BUTTON_TYPE } from 'src/components/Button/ButtonType';
import { SERVICE_WORKFLOW_STATUS_DROPDOWN } from 'src/utils/DropdownConst';
import ProductClaimController from 'src/controller/ProductClaimController';

const RenderFormHeader = (props: {
  isVisible: boolean;
  disabled: boolean;
  editMode: boolean;
  onSendViaMailPress: any;
  onSavePress: any;
  onCancelPress: any;
}) => {
  const {
    isVisible,
    disabled,
    editMode,
    onSendViaMailPress,
    onCancelPress,
    onSavePress,
  } = props;
  return (
    <View row marginB-v2 center>
      <View centerH style={tw('flex-row')}>
        <Text text24BO textBlack style={tw('leading-10')}>
          Service Workflow
        </Text>
      </View>

      <View flex row style={tw('border-light-lavendar justify-end ')}>
        <TouchableOpacity
          style={tw(
            'w-110px py-2 px-5px rounded-md ml-6 border-default border-light-lavendar items-center justify-center',
          )}
          onPress={onSendViaMailPress}>
          <Text text13R textBlack>
            Send via Email
          </Text>
        </TouchableOpacity>
        {isVisible ? (
          <View row style={tw("self-end")}>
            {editMode ? (
              <TouchableOpacity
                style={tw('py-2 px-20px rounded-md ml-6')}
                disabled={disabled}
                onPress={onCancelPress}>
                <Text
                  text13R
                  style={tw(
                    `${disabled
                      ? BUTTON_TYPE.CANCEL_LIGHT_DISABLED_LABEL
                      : BUTTON_TYPE.CANCEL_LIGHT_ENABLED_LABEL
                    }`,
                  )}>
                  {'Cancel'}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={tw(
                `${disabled
                  ? BUTTON_TYPE.PRIMARY_DISABLED
                  : BUTTON_TYPE.PRIMARY_ENABLED
                } px-8 ml-6`,
              )}
              disabled={disabled}
              onPress={onSavePress}>
              <Text
                text13R
                style={tw(
                  `${disabled
                    ? BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                    : BUTTON_TYPE.PRIMARY_ENABLED_LABEL
                  }`,
                )}>
                {editMode ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

const SWFBasicInfo = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const employeeInfo = useAppSelector(
    (state: RootState) => state.userContext.employee,
  );

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  const [customerData, setCustomerData] = useState<any>({});
  const [inputsData, setInputsData] = useState<any>({
    plantDescription: '',
    customerClassification: '',
    createdBy: '',
    createdDatetime: '',
    tradeAssets: '',
    requestType: '',
    requestedDate: '',
    claimsLayout: '',
    description: '',
    status: '',
    assignedTo: '',
    resolvedDate: '',
    resolution: '',
  });

  const [errorMessages, setErrorMessages] = useState<any>({
    tradeAssets: '',
    requestType: '',
    requestedDate: '',
    claimsLayout: '',
    description: '',
    status: '',
    assignedTo: '',
    resolvedDate: '',
    resolution: '',
  });

  const [traceGridData, setTraceGridData] = useState<any>([]);
  const [requestTypeDropdownData, setRequestTypeDropdownData] = useState<any>(
    [],
  );
  const [assignedToDropdownData, setAssignedToDropdownData] = useState<any>([]);
  const [claimsLayoutDropdownData, setClaimsLayoutDropdownData] = useState([])

  const [loading, setLoading] = useState(false);
  const [isDiscardVisible, setIsDiscardVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viaMailModalVisible, setViaMailModalVisible] = useState(false);
  const [isUnsavedMailModalVisible, setIsUnsavedMailModalVisible] = useState(false)
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteWarningModal, setDeleteWarningModal] = useState(false);
  const [isRequestTypeModalVisible, setIsRequestTypeModalVisible] = useState(false)
  const [areActionsButtonDisabled, setAreActionsButtonDisabled] =
    useState(true);
  const [isClaimLayoutVisible, setIsClaimLayoutVisible] = useState(false);
  const [areActionsButtonVisible, setAreActionsButtonVisible] = useState(false);
  const [isAssignedToUpdated, setIsAssignedToUpdated] = useState(false)

  const [idServiceRequestCustomer, setIdServiceRequestCustomer] = useState("")
  const [tempRequestValue, setTempRequestValue] = useState("")

  useEffect(() => {
    console.log('customerInfoData :>> ', customerInfoData);
    const paramsData = route.params?.data || {};
    if (route.params?.fromCLP) {
      setCustomerData((prevData: any) => ({
        ...prevData,
        ...customerInfoData,
        ...paramsData,
      }));
    } else {
      setCustomerData(route.params?.data);
    }

    if (!route.params?.isEditable) {
      setEditMode(true);
      setAreActionsButtonVisible(true);
      const id = getUUID()
      setIdServiceRequestCustomer(id)
    } else {
      setIdServiceRequestCustomer(paramsData?.idServiceRequestCustomer)
      setAreActionsButtonDisabled(false);
    }

    getScreenData();
  }, []);

  // Fetching screen data
  const getScreenData = async () => {
    try {
      setLoading(true);
      await getRequestTypeDropdownData();
      await getAssignedToDropdownData();
      if (route.params?.isEditable) {
        await getInputsData();
        await getTraceGridData();
      } else {
        setTraceGridData([{}]);
        const plantNameData =
          await ServiceWorkflowController.getPlantDescriptionOfCustomer(
            customerInfoData?.pickingPlantNumber,
          );

        if (employeeInfo.length > 0) {
          setInputsData((prevState: any) => ({
            ...prevState,
            createdBy:
              employeeInfo[0]?.employeeNumber +
              ' ' +
              employeeInfo[0]?.lastName +
              ' ' +
              employeeInfo[0]?.firstName,
            customerClassification: customerInfoData?.abcClassification || '--',
            plantDescription:
              plantNameData.length > 0 ? plantNameData[0]?.name || '' : '',
            tradeAssets: customerInfoData?.tradeAssetsAmount ? String(customerInfoData?.tradeAssetsAmount) : '',
            status: SERVICE_WORKFLOW_STATUS_DROPDOWN[0].value
          }));
        }
      }
    } catch (error) {
      console.log('error while fetching screen data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetching inputs data of screen
  const getInputsData = async () => {
    try {
      const previousScreenData = route.params?.data || {};
      const fromCLP = route.params?.fromCLP;
      console.log('previousScreenData :>> ', previousScreenData);

      let pickingPlantNumber, customerClassification;
      if (route.params?.fromCLP) {
        pickingPlantNumber = customerInfoData?.pickingPlantNumber;
        customerClassification = customerInfoData?.abcClassification;
      } else {
        pickingPlantNumber = previousScreenData?.pickingPlantNumber;
        customerClassification = previousScreenData?.customerClassification;
      }

      const inputsData =
        await ServiceWorkflowController.getServiceWorkflowDataOfCustomer(
          previousScreenData?.idServiceRequestCustomer,
        );
      const plantNameData =
        await ServiceWorkflowController.getPlantDescriptionOfCustomer(
          pickingPlantNumber,
        );

      let tradeAssetsAmount;

      if (fromCLP) {
        tradeAssetsAmount = customerInfoData?.tradeAssetsAmount ? String(customerInfoData?.tradeAssetsAmount) : ''
      } else {
        tradeAssetsAmount = previousScreenData?.tradeAssetsAmount ? String(previousScreenData?.tradeAssetsAmount) : ''
      }

      let preparedData = {
        plantDescription: '',
        customerClassification: customerClassification || '',
        createdBy: '',
        createdDatetime: '',
        tradeAssets: tradeAssetsAmount,
        requestType: '',
        requestedDate: '' as any,
        claimsLayout: previousScreenData?.claimsScreenLayout || '',
        description: '',
        status: '',
        assignedTo: '',
        resolvedDate: '' as any,
        resolution: '',
      };

      if (inputsData?.length > 0) {
        const inputsDataObj = inputsData[0];
        preparedData = {
          ...preparedData,
          createdBy: inputsDataObj?.createdBy || '',
          createdDatetime: inputsDataObj?.creationDatetime || '',
          requestType: inputsDataObj?.idServiceRequestType || '',
          requestedDate: inputsDataObj?.requestedDate
            ? new Date(inputsDataObj?.requestedDate)
            : '',
          description: inputsDataObj?.description || '',
          status: inputsDataObj?.status || '',
          assignedTo: inputsDataObj?.resolvedEmployeeNumber || '',
          resolvedDate: inputsDataObj?.resolvedDate
            ? new Date(inputsDataObj?.resolvedDate)
            : '',
          resolution: inputsDataObj?.resolution || '',
        };
      }

      if (plantNameData?.length > 0) {
        preparedData = {
          ...preparedData,
          plantDescription: plantNameData[0]?.name || '',
        };
      }

      const additionalDropdownData = await fetchRequestTypeDropdownData(
        '',
        preparedData.requestType,
      );
      if (additionalDropdownData.length > 0) {
        setRequestTypeDropdownData((prevState: any) => {
          const isRequestTypePresent = prevState.find(
            (item: any) =>
              item.idServiceRequestType ===
              additionalDropdownData[0].idServiceRequestType,
          );
          if (isRequestTypePresent) {
            return prevState;
          }
          return [...prevState, ...additionalDropdownData];
        });
      }

      const assignedToDropdownData = await fetchAssignedToDropdownData(
        preparedData?.assignedTo,
      );
      if (assignedToDropdownData.length > 0) {
        setAssignedToDropdownData((prevState: any) => {
          const isAssignedToPresent = prevState.find(
            (item: any) =>
              item.employeeNumber === assignedToDropdownData[0].employeeNumber,
          );
          if (isAssignedToPresent) {
            return prevState;
          }
          return [...prevState, ...assignedToDropdownData];
        });
      }

      if (preparedData.claimsLayout !== '') {
        setIsClaimLayoutVisible(true);
        await fetchClaimsLayoutDropdownData(preparedData.requestType)
      } else {
        setIsClaimLayoutVisible(false);
        setClaimsLayoutDropdownData([])
      }

      if (preparedData.status === '3' || (previousScreenData?.statusType &&
        previousScreenData?.statusType.toLowerCase() === 'p')) {
        setAreActionsButtonVisible(false);
      } else {
        setAreActionsButtonVisible(true);
      }

      setInputsData((prevState: any) => ({
        ...prevState,
        ...preparedData,
      }));
    } catch (error) {
      console.log('error while fetching inputs data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });

      setInputsData({
        plantDescription: '',
        customerClassification: '',
        createdBy: '',
        createdDatetime: '',
        tradeAssets: '',
        requestType: '0',
        claimsLayout: '',
        requestedDate: '',
        description: '',
        status: '',
        assignedTo: '',
        resolvedDate: '',
        resolution: '',
      });
    }
  };

  // Fetching claims layout dropdown data
  const fetchClaimsLayoutDropdownData = async (idServiceRequestType: any) => {
    try {
      const claimsLayoutDropdownData = await ServiceWorkflowController.getClaimsLayoutDropdownData(idServiceRequestType);
      console.log('claimsLayoutDropdownData :>> ', claimsLayoutDropdownData);
      setClaimsLayoutDropdownData(claimsLayoutDropdownData)
      if (claimsLayoutDropdownData.length > 0) {
        setInputsData((prevState: any) => ({
          ...prevState,
          claimsLayout: claimsLayoutDropdownData[0]?.claimsScreenLayout || '',
        }))
      }
    } catch (error) {
      console.log('error while fetching claims layout dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setClaimsLayoutDropdownData([])
    }
  }

  const getRequestTypeDropdownData = async (
    searchText: string = '',
    idServiceRequestType: string = '',
  ) => {
    try {
      const requestTypeDropdownData = await fetchRequestTypeDropdownData(
        searchText,
        idServiceRequestType,
      );
      if (searchText) {
        setRequestTypeDropdownData(requestTypeDropdownData);
      } else {
        setRequestTypeDropdownData((prevState: any) => [
          ...prevState,
          ...requestTypeDropdownData,
        ]);
      }
    } catch (error) {
      console.log(
        'error while fetching request type dropdown data :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      });
      setRequestTypeDropdownData([]);
    }
  };

  const fetchRequestTypeDropdownData = async (
    searchText: string = '',
    idServiceRequestType: string = '',
  ) => {
    try {
      const requestTypeDropdownData =
        await ServiceWorkflowController.getServiceRequestTypeDropdownData(
          searchText,
          idServiceRequestType,
        );
      console.log('requestTypeDropdownData :>> ', requestTypeDropdownData);
      return requestTypeDropdownData;
    } catch (error) {
      console.log('error while fetching dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };

  const getAssignedToDropdownData = async (searchText: string = '') => {
    try {
      const assignedToDropdownData = await fetchAssignedToDropdownData(
        searchText,
      );
      if (searchText) {
        setAssignedToDropdownData(assignedToDropdownData);
      } else {
        setAssignedToDropdownData((prevState: any) => [
          ...prevState,
          ...assignedToDropdownData,
        ]);
      }
    } catch (error) {
      console.log('error while fetching assigned to dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setAssignedToDropdownData([]);
    }
  };

  const fetchAssignedToDropdownData = async (searchText: string = '') => {
    try {
      const assignedToDropdownData =
        await ServiceWorkflowController.getResponsiblePersonAndCreatorList(
          searchText,
        );
      console.log('assignedToDropdownData :>> ', assignedToDropdownData);
      return assignedToDropdownData;
    } catch (error) {
      console.log('error while fetching assigned to dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };

  const getTraceGridData = async () => {
    try {
      const traceGridData =
        await ServiceWorkflowController.getTraceGridDataOfCustomer(
          route.params?.data?.idServiceRequestCustomer,
        );
      console.log('traceGridData :>> ', traceGridData);
      setTraceGridData(traceGridData);
    } catch (error) {
      console.log('error while fetching trace grid data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setTraceGridData([]);
    }
  };

  const validateInputs = () => {
    console.log('inputsData :>> ', inputsData);
    let errorMessages = {
      tradeAssets: '',
      requestType: '',
      requestedDate: '',
      claimsLayout: '',
      description: '',
      status: '',
      assignedTo: '',
      resolvedDate: '',
      resolution: '',
    }

    let isValid = true;

    if (!inputsData.requestType) {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        requestType: 'Mandatory',
      }
    }

    if (!inputsData.requestedDate) {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        requestedDate: 'Mandatory',
      }
    } else if (inputsData.requestedDate < new Date().setHours(0, 0, 0, 0)) {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        requestedDate: 'Requested date cannot be in the past',
      }
    }

    if (inputsData.description.trim() === '') {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        description: 'Mandatory',
      }
    }

    if (!inputsData.status) {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        status: 'Mandatory',
      }
    }

    if (inputsData?.status !== '1' && !inputsData.assignedTo) {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        assignedTo: 'Mandatory',
      }
    } else if (inputsData?.status !== '1') {
      const filteredData = assignedToDropdownData.find(
        (item: any) => item.employeeNumber === inputsData.assignedTo,
      );

      if (!filteredData) {
        isValid = false;
        errorMessages = {
          ...errorMessages,
          assignedTo: 'Mandatory',
        }
      }
    }

    if (inputsData?.status === '3' && !inputsData.resolvedDate) {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        resolvedDate: 'Mandatory',
      }
    }

    if (inputsData?.status === '3' && inputsData.resolution.trim() === '') {
      isValid = false;
      errorMessages = {
        ...errorMessages,
        resolution: 'Mandatory',
      }
    }

    setErrorMessages(errorMessages);

    return isValid;
  };

  const saveData = async () => {
    try {
      const previousScreenData = route.params?.data || {};
      const fromCLP = route.params?.fromCLP;

      const preparedData = {
        ...inputsData,
        customerShipTo: fromCLP
          ? customerInfoData?.customerShipTo
          : previousScreenData?.customerShipTo,
        idServiceRequestCustomer: route.params?.isEditable
          ? previousScreenData?.idServiceRequestCustomer
          : idServiceRequestCustomer,
        callPlaceNumber: customerInfoData?.callPlaceNumber,
        isAssignedToUpdated,
        isCreated: !route.params?.isEditable,
      };

      console.log('preparedData :>> ', preparedData);

      const isDataSaved =
        await CLServiceWorkflowController.insertOrUpdateServiceRequestsCustomersData(
          preparedData,
        );

      if (isDataSaved) {
        await ACLService.saveAclGuardStatusToStorage(false);
        toast.success({
          message: 'Data saved successfully',
        });

        return;
      }

      toast.error({
        message: 'Something went wrong',
      });
    } catch (error) {
      console.log('error while saving the data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const handleDiscardCancel = () => {
    setIsDiscardVisible(false);
  };

  const handleDiscardChanges = async () => {
    setIsDiscardVisible(false);
    await ACLService.saveAclGuardStatusToStorage(false);
    await getScreenData();
    setEditMode(false);
    setIsAssignedToUpdated(false)
  };

  const handleSaveDetails = async () => {
    Keyboard.dismiss()
    closeUnsavedMailModal()
    if (editMode) {
      if (!validateInputs()) {
        toast.error({
          message: 'Please enter all the mandatory fields',
        });
        return;
      }
      await saveData();
      toast.success({
        message: 'Data saved successfully',
      });
      if (route.params?.isEditable) {
        setEditMode(!editMode);
        setIsAssignedToUpdated(false)
        await getTraceGridData();
      } else {
        navigation.goBack();
      }
    } else {
      setEditMode(!editMode);
      setAreActionsButtonDisabled(true);
    }
  };

  const handleSendViaMailModalVisible = () => {
    setViaMailModalVisible(false);
  };

  const handleDeleteConfirmationModal = async () => {
    setDeleteConfirmationModal(!deleteConfirmationModal);
  };

  const onDeletePress = () => {
    if (inputsData.status !== '1') {
      setDeleteWarningModal(true);
      return;
    }

    setDeleteConfirmationModal(true);
  }

  const handleDeleteWorkflow = async () => {
    try {
      setDeleteConfirmationModal(!deleteConfirmationModal);

      const isServiceWorkflowDeleted =
        await CLServiceWorkflowController.deleteServiceWorkflowData(
          customerData?.idServiceRequestCustomer,
        );
      if (isServiceWorkflowDeleted) {
        toast.success({
          message: 'Service workflow deleted successfully',
        });
        navigation.goBack();
        return;
      }

      toast.error({
        message: 'Something went wrong',
      });
    } catch (error) {
      console.log('error while deleting service workflow :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const handleDeleteWarningModal = () => {
    setDeleteWarningModal(!deleteWarningModal);
  };

  const onClaimDetailsPress = () => {
    console.log('claimsLayout :>> ', inputsData.claimsLayout);
    if (inputsData.claimsLayout) {

      const navigationConfig: any = {
        1: pageNameProductClaims,
        2: pageNameDeliveryMistakesClaim,
        3: pageNameProductDestroyedByTAClaims
      }

      let data = {
        ...customerData,
        idServiceRequestCustomer: route.params?.data?.idServiceRequestCustomer || idServiceRequestCustomer,
      }

      if (route.params?.fromCLP) {
        data = {
          ...data,
          ...customerInfoData
        }
      }

      navigation.navigate(navigationConfig[inputsData.claimsLayout] as never, {
        data,
      } as never);
    }
  };

  const onCancelPress = async () => {
    try {
      if (route.params?.isEditable) {
        setIsDiscardVisible(true);
      } else {
        await ACLService.saveAclGuardStatusToStorage(false);
        navigation.goBack();
      }
    } catch (error) {
      console.log('error while discarding the changes :>> ', error);
    }
  };

  const handleRequestTypeChange = (value: any) => {
    CLServiceWorkflowController.getNumberOfDaysOfRequestedDate(
      value.idServiceRequestType,
    )
      .then((numberOfDaysData: any) => {
        let requestedDate = new Date();
        if (numberOfDaysData.length > 0) {
          const numberOfDays = numberOfDaysData[0]?.numberOfDays || 0;
          const todaysDate = new Date();

          requestedDate = addWeekdays(todaysDate, numberOfDays);
        }

        setInputsData((prevState: any) => ({
          ...prevState,
          requestedDate: requestedDate,
        }));

        setErrorMessages((prevState: any) => ({
          ...prevState,
          requestedDate: '',
        }));
      })
      .catch((error: any) => {
        console.log('error while fetching number of days :>> ', error);
        toast.error({
          message: 'Something went wrong',
        });
      });

    CLServiceWorkflowController.getServiceRequestTypeDescription(
      value.idServiceRequestType,
    )
      .then((descriptionData: any) => {
        if (descriptionData.length > 0 && descriptionData[0]?.description) {
          setInputsData((prevState: any) => ({
            ...prevState,
            description: descriptionData[0]?.description || '',
          }));

          setErrorMessages((prevState: any) => ({
            ...prevState,
            description: '',
          }));
        }
      })
      .catch((error: any) => {
        console.log('error while fetching description :>> ', error);
        toast.error({
          message: 'Something went wrong',
        });
      });

    if (value.isClaimType === '1') {
      fetchClaimsLayoutDropdownData(value.idServiceRequestType)
      setIsClaimLayoutVisible(true);
    } else {
      setIsClaimLayoutVisible(false);
      setClaimsLayoutDropdownData([])
      setInputsData((prevState: any) => ({
        ...prevState,
        claimsLayout: '',
      }));
    }

    setInputsData((prevState: any) => ({
      ...prevState,
      requestType: value.idServiceRequestType,
    }));
  }

  const onRequestTypeChange = (value: any) => {
    if ((claimsLayoutDropdownData.length > 0 && value.isClaimType !== '1') || (claimsLayoutDropdownData.length === 0 && value.isClaimType === '1')) {
      setIsRequestTypeModalVisible(true)
      setInputsData((prevState: any) => ({
        ...prevState,
        requestType: prevState.requestType,
      }));
      setTempRequestValue(value)
      return
    }

    handleRequestTypeChange(value)
  }

  const handleInputChange = (fieldName: string) => (value: any) => {
    if (fieldName === 'requestType') {
      onRequestTypeChange(value)
    } else if (fieldName === 'status') {
      if (value.value !== '3') {
        setErrorMessages((prevState: any) => ({
          ...prevState,
          resolvedDate: '',
        }));
      }

      setInputsData((prevState: any) => ({
        ...prevState,
        [fieldName]: value.value,
      }));
    } else if (fieldName === 'assignedTo') {
      setInputsData((prevState: any) => ({
        ...prevState,
        [fieldName]: value.employeeNumber,
      }));

      if (!isAssignedToUpdated) {
        setIsAssignedToUpdated(true)
      }
    } else if (fieldName === 'claimsLayout') {
      setInputsData((prevState: any) => ({
        ...prevState,
        [fieldName]: value.claimsScreenLayout,
      }));
    } else {
      setInputsData((prevState: any) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }

    if (errorMessages[fieldName]) {
      setErrorMessages((prevState: any) => ({
        ...prevState,
        [fieldName]: '',
      }));
    }

    if (areActionsButtonDisabled) {
      setAreActionsButtonDisabled(false);
    }
  };

  const onViewListNavigate = () => {
    navigation.navigate(
      pageNameMaterialListing as never,
      {
        customerData: customerData,
        ...route.params,
      } as never,
    );
  };

  const onRequestTypeConfirmPress = async () => {
    try {
      setIsRequestTypeModalVisible(false)
      await ProductClaimController.deleteExistingData(idServiceRequestCustomer)
      handleRequestTypeChange(tempRequestValue)
    } catch (error) {
      console.log('error while deleting data :>> ', error);
    }
  }

  const handleRequestTypeModalClose = () => {
    setInputsData((prevState: any) => ({
      ...prevState,
      requestType: prevState.requestType,
    }));
    setIsRequestTypeModalVisible(false)
  }

  const onSendViaMailPress = async () => {
    try {
      if (!areActionsButtonDisabled && editMode) {
        setIsUnsavedMailModalVisible(true)
        return
      }

      let isValid = true;
      let errorMessages = {
        assignedTo: '',
      }
      if (inputsData?.status !== '1' && !inputsData.assignedTo) {
        isValid = false;
        errorMessages = {
          ...errorMessages,
          assignedTo: 'Mandatory',
        }
      } else if (inputsData?.status !== '1') {
        const filteredData = assignedToDropdownData.find(
          (item: any) => item.employeeNumber === inputsData.assignedTo,
        );

        if (!filteredData) {
          isValid = false;
          errorMessages = {
            ...errorMessages,
            assignedTo: 'Mandatory',
          }
        }
      }

      if (!isValid) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          ...errorMessages
        }));
        toast.error({
          message: 'Please enter all the mandatory fields',
        });
        return;
      }

      const isFlagUpdated = await ServiceWorkflowController.updateSendReportStatus(idServiceRequestCustomer)

      if (isFlagUpdated) {
        setViaMailModalVisible(true);
        return;
      }

      toast.error({
        message: 'Something went wrong',
      });

    } catch (error) {
      console.log('error while sending mail :>> ', error);
    }
  }

  const closeUnsavedMailModal = () => {
    setIsUnsavedMailModalVisible(false)
  }

  return (
    <SafeAreaView style={tw('flex-1')}>
      <View flex>
        <ServiceWorkFlowLandingHeader data={customerData} />
        <View row flex>
          <View flex style={tw('ml-4 mr-1')}>
            <Card flex-1 marginR-v2 marginB-v2 padding-v4>
              <RenderFormHeader
                disabled={areActionsButtonDisabled}
                editMode={editMode}
                onCancelPress={onCancelPress}
                onSendViaMailPress={onSendViaMailPress}
                onSavePress={handleSaveDetails}
                isVisible={areActionsButtonVisible}
              />
              {loading ? (
                <View flex center>
                  <ActivityIndicator
                    size={'large'}
                    color={ColourPalette.light.black}
                  />
                </View>
              ) : (
                <View flex>
                  <ScrollView
                    contentContainerStyle={tw('flex-grow-default')}
                    keyboardShouldPersistTaps="always">
                    <View flex-1>
                      <SWBasicInfoComponent
                        editMode={editMode}
                        inputsData={inputsData}
                        onNavigate={onViewListNavigate}
                      />
                      <SWRequestBasicInfoComponent
                        editMode={editMode}
                        requestTypeData={requestTypeDropdownData}
                        inputsData={inputsData}
                        errorMessages={errorMessages}
                        onClaimDetailsPress={onClaimDetailsPress}
                        assignToData={assignedToDropdownData}
                        handleInputChange={handleInputChange}
                        getAssignedToDropdownData={getAssignedToDropdownData}
                        getRequestTypeDropdownData={
                          getRequestTypeDropdownData
                        }
                        isClaimLayoutVisible={isClaimLayoutVisible}
                        claimsLayoutDropdownData={claimsLayoutDropdownData}
                      />
                      <SWTraceGridComponent
                        traceGridData={traceGridData}
                        editMode={editMode}
                        onDeletePress={onDeletePress}
                      />
                    </View>
                  </ScrollView>
                </View>
              )}
            </Card>
          </View>
        </View>
      </View>
      <ChangeRequestTypeModal
        visible={isRequestTypeModalVisible}
        title="Change the Request type?"
        subTitle="Claim data will be lost"
        onConfirmPress={onRequestTypeConfirmPress}
        onCancelPress={handleRequestTypeModalClose}
      />
      <DeleteConfirmationModal
        title={'Delete\nService Workflow?'}
        subTitle={`Are you sure you want to delete\nService Request${customerData?.name
          ? ' for ' + customerData?.name.slice(0, 22) + '...'
          : ''
          }?`}
        visible={deleteConfirmationModal}
        onDeletePress={() => {
          handleDeleteWorkflow();
        }}
        onCancelPress={handleDeleteConfirmationModal}
      />
      <DeleteWarningModal
        visible={deleteWarningModal}
        title={'Could not delete\nService Workflow'}
        subTitle={`${inputsData.status === '2' ? "In-Progress" : "Completed"} Service Workflow cannot be\ndeleted`}
        onSubmit={handleDeleteWarningModal}
      />
      <SendViaEmailModal
        visible={viaMailModalVisible}
        title={'Email will be sent after data sync to HOST'}
        buttonName={'Ok'}
        onSubmit={handleSendViaMailModalVisible}
      />
      <MessageModal
        isVisible={isUnsavedMailModalVisible}
        title="You have unsaved changes"
        subTitle={"You should save the changes before\nsending via email"}
        primaryButtonText="Yes, Save"
        secondaryButtonText="No, Stay on the page"
        handleOnPressSuccess={handleSaveDetails}
        handleOnPressCancel={closeUnsavedMailModal}
      />
      {isDiscardVisible ? (
        <MessageModal
          isVisible={isDiscardVisible}
          title="Discard the Changes?"
          subTitle="Your unsaved edits will be lost"
          primaryButtonText="Yes, Discard"
          secondaryButtonText="No, Keep the changes"
          handleOnPressSuccess={handleDiscardChanges}
          handleOnPressCancel={handleDiscardCancel}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default withAuthScreen(SWFBasicInfo);
