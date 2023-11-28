import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PROSPECT_LANDING_SCREENS } from 'src/utils/Constant';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import Card from 'src/components/Card';
import BusinessDetailsComponent from 'src/components/ProspectLanding/PLCustomerAttibutes/BusinessDetailsComponent';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import CustomerSearchController from 'src/controller/CustomerSearchController';
import PLCustomerInfoController from 'src/controller/PLCustomerInfoController';
import { toast } from 'src/utils/Util';
import PLCustomerBusinessReasonsController from 'src/controller/PLCustomerBusinessReasonsController';
import ProspectsController from 'src/controller/ProspectsController';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import MessageModal from 'src/components/Common/MessageModal';
import ACLService from 'src/services/ACLService';
import Text from 'src/components/Text';

const PLCustomerAttibutes = () => {
  // Customer Attribute Info states
  const [loading, setLoading] = useState(false);
  const [abcClassificationDropdownData, setAbcClassificationDropdownData] =
    useState([]);
  const [startBusinessReasonDropdownData, setStartBusinessReasonDropdownData] =
    useState([]);
  const [distributerDropdownData, setDistributerDropdownData] = useState([]);
  const [nameDropdownData, setNameDropdownData] = useState([]);
  const [customerAttributeInputData, setCustomerAttributeInputData] = useState({
    abcClassification: '',
    priority: '',
    scooping: false,
    startBusinessDate: '',
    startBusinessReason: '',
    keyAccountGLNCode: '',
    indirectCustomer: false,
    wholeSalerCustomerNumber: '',
    distributer: '',
    firstName: '',
    lastName: '',
    name: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    abcClassification: '',
    priority: '',
    scooping: '',
    startBusinessDate: '',
    startBusinessReason: '',
    keyAccountGLNCode: '',
    indirectCustomer: '',
    wholeSalerCustomerNumber: '',
    distributer: '',
    firstName: '',
    lastName: '',
    name: '',
  });
  const [mandatoryData, setMandatoryData] = useState({
    abcClassification: 0,
    priority: 0,
    scooping: 0,
    startBusinessDate: 0,
    startBusinessReason: 0,
    keyAccountGLNCode: 0,
    indirectCustomer: 0,
    wholeSalerCustomerNumber: 0,
    distributer: 0,
    firstName: 0,
    lastName: 0,
    name: 0,
  });
  const [isEnableWholeSaler, setIsEnableWholeSaler] = useState(false);
  const [isEnableDistributor, setIsEnableDistributor] = useState(false);
  const [isDiscardVisible, setIsDiscardVisible] = useState(false);
  // ....

  const prospectInfo = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );
  const statusType = prospectInfo.statusType ? prospectInfo.statusType : 'c';
  const isEditable = statusType.toLowerCase() === 'p';

  useEffect(() => {
    getScreenData();
  }, []);

  const getScreenData = async () => {
    setLoading(true);
    try {
      await getAbcClassificationDropdownData();
      await getBusinessReasonDropdown();
      await getDistributorDropdown();
      await getCanvasserDropdown();
      await prePopulateScreenData();
      await getMandantoryFields();
    } catch (error) {
      console.log('error while fetching screen data :>> ', error);
    } finally {
      setLoading(false);
    }
  };

  const getMandantoryFields = async () => {
    try {
      const mandatoryFieldsConfig =
        await PLCustomerInfoController.getMandatoryFieldsConfig();
      console.log('mandatoryFieldsConfig :>> ', mandatoryFieldsConfig);
      setMandatoryData(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const prePopulateScreenData = async () => {
    try {
      const screenData =
        await PLCustomerInfoController.getProspectOrCustomerAttributeInfo();

      console.log('screenData ___>>>>>', screenData);

      if (screenData.length > 0) {
        const screenDataObj = screenData[0];
        const prepareData = {
          abcClassification: screenDataObj?.abcClassification || '',
          priority: screenDataObj?.priority || '',
          scooping: screenDataObj?.scooping === '1',
          startBusinessDate: screenDataObj?.startCustomerBusinessDatetime
            ? new Date(screenDataObj?.startCustomerBusinessDatetime)
            : '',
          startBusinessReason:
            screenDataObj?.idCustomerBusinessReasonStart || '',
          keyAccountGLNCode: screenDataObj?.keyAccountGlnCode
            ? screenDataObj?.keyAccountGlnCode
            : '',
          indirectCustomer: screenDataObj?.indirectCustomer === '1',
          wholeSalerCustomerNumber: screenDataObj?.wholesalerCustomerNumber
            ? screenDataObj?.wholesalerCustomerNumber
            : '',
          distributer: screenDataObj?.idDistributors || '',
          firstName: screenDataObj?.ownerDeputyFirstName || '',
          lastName: screenDataObj?.ownerDeputyLastName || '',
          name: screenDataObj?.canvasserEmployeeNumber || '',
        };
        if (statusType.toLowerCase() === 'p') {
          if (prepareData.indirectCustomer) {
            setIsEnableWholeSaler(true);
            setIsEnableDistributor(true);
          } else {
            setIsEnableWholeSaler(false);
            setIsEnableDistributor(false);
          }
        } else {
          setIsEnableDistributor(true);
        }

        setCustomerAttributeInputData(prepareData);
      }
    } catch (error) {
      console.log('Error while pre populate Screen data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const handleScooping = () => {
    setCustomerAttributeInputData(prevState => ({
      ...prevState,
      scooping: !customerAttributeInputData.scooping,
    }));
  };

  const handleIndirectCustomer = () => {
    if (customerAttributeInputData.indirectCustomer && isEditable) {
      setIsEnableWholeSaler(false);
      setIsEnableDistributor(false);
      setCustomerAttributeInputData(prevState => ({
        ...prevState,
        wholeSalerCustomerNumber: '',
        distributer: '',
      }));
    } else {
      setIsEnableWholeSaler(true);
      setIsEnableDistributor(true);
      setMandatoryData(prevState => ({
        ...prevState,
        wholeSalerCustomerNumber: 1,
        distributer: 1,
      }));
    }
    setErrorMessages((prevData: any) => ({
      ...prevData,
      wholeSalerCustomerNumber: '',
      distributer: '',
    }));
    setCustomerAttributeInputData(prevState => ({
      ...prevState,
      indirectCustomer: !customerAttributeInputData.indirectCustomer,
    }));
  };

  const getAbcClassificationDropdownData = async () => {
    //Fetching dropdown value for ABC classifications
    CustomerSearchController.getCustomersAbcClassification()
      .then(res => {
        setAbcClassificationDropdownData([...(res as never)]);
      })
      .catch(err => {
        setLoading(false);
        console.log('abc classification err is', err);
      });
  };

  const getBusinessReasonDropdown = async () => {
    //Fetching dropdown value for business reasons
    PLCustomerBusinessReasonsController.getCustomersBusinessReasons()
      .then(res => {
        setStartBusinessReasonDropdownData([...(res as never)]);
      })
      .catch(err => {
        setLoading(false);
        console.log('business reasons err is', err);
      });
  };

  const getDistributorDropdown = async () => {
    //Fetching dropdown value for Distributor
    CustomerSearchController.getCustomerAttributeDistributors()
      .then(res => {
        console.log('distributerDropdownData :>> ', res);
        setDistributerDropdownData([...(res as never)]);
      })
      .catch(err => {
        setLoading(false);
        console.log('distributor err is', err);
      });
  };

  const getCanvasserDropdown = async () => {
    //Fetching dropdown value for Canvasser
    ProspectsController.getCanvasserSalesRep()
      .then(res => {
        setNameDropdownData([...(res as never)]);
      })
      .catch(err => {
        setLoading(false);
        console.log('Canvasser err is', err);
      });
  };

  const handleInputChange = (fieldName: string) => (value: any) => {
    console.log('fieldNmae amd value', fieldName, value);
    if (fieldName === 'abcClassification') {
      setCustomerAttributeInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.abcClassification,
      }));
    } else if (fieldName === 'priority') {
      setCustomerAttributeInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.value,
      }));
    } else if (fieldName === 'startBusinessReason') {
      setCustomerAttributeInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.idCustomerBusinessReason,
      }));
    } else if (fieldName === 'distributer') {
      setCustomerAttributeInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.idDistributors,
      }));
    } else if (fieldName === 'name') {
      setCustomerAttributeInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.partnerNumber,
      }));
    } else {
      setCustomerAttributeInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }

    setErrorMessages((prevData: any) => ({
      ...prevData,
      [fieldName]: '',
    }));
  };

  const validateInputs = () => {
    setErrorMessages({
      abcClassification: '',
      priority: '',
      scooping: '',
      startBusinessDate: '',
      startBusinessReason: '',
      keyAccountGLNCode: '',
      indirectCustomer: '',
      wholeSalerCustomerNumber: '',
      distributer: '',
      firstName: '',
      lastName: '',
      name: '',
    });
    console.log('mandatory data', mandatoryData, customerAttributeInputData);

    let isError = false;

    if (
      mandatoryData.startBusinessDate &&
      customerAttributeInputData.startBusinessDate === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        startBusinessDate: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.keyAccountGLNCode &&
      customerAttributeInputData.keyAccountGLNCode.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        keyAccountGLNCode: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.firstName &&
      customerAttributeInputData.firstName.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        firstName: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.lastName &&
      customerAttributeInputData.lastName.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        lastName: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.abcClassification &&
      customerAttributeInputData.abcClassification.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        abcClassification: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.priority && customerAttributeInputData.priority === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        priority: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.startBusinessReason &&
      customerAttributeInputData.startBusinessReason === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        startBusinessReason: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.name && customerAttributeInputData.name.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        name: 'Mandatory',
      }));
      isError = true;
    }
    if (
      mandatoryData.wholeSalerCustomerNumber &&
      customerAttributeInputData.wholeSalerCustomerNumber.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        wholeSalerCustomerNumber: 'Mandatory',
      }));
    }

    if (
      mandatoryData.distributer &&
      customerAttributeInputData.distributer === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        distributer: 'Mandatory',
      }));

      isError = true;
    }

    return !isError;
  };

  const handleSaveCustomerInfo = async () => {
    try {
      if (statusType.toLowerCase() === 'p') {
        if (!validateInputs()) {
          return;
        }
        if (customerAttributeInputData.indirectCustomer) {
          if (customerAttributeInputData.wholeSalerCustomerNumber === '') {
            setErrorMessages((prevData: any) => ({
              ...prevData,
              wholeSalerCustomerNumber: 'Mandatory',
            }));
            toast.error({
              message: 'Please enter the wholesaler customer number',
            });
            return;
          }
          if (customerAttributeInputData.distributer === '') {
            setErrorMessages((prevData: any) => ({
              ...prevData,
              distributer: 'Mandatory',
            }));
            toast.error({
              message: 'Please select the distributor',
            });
            return;
          }
        }
      }
      const isCustomerAttributeInfoCreated =
        await PLCustomerInfoController.insertOrUpdateCustomerAttributeInfo(
          customerAttributeInputData,
        );

      if (isCustomerAttributeInfoCreated) {
        toast.success({
          message: 'Changes saved successfully',
        });
        await ACLService.saveAclGuardStatusToStorage(false);
      } else {
        toast.error({
          message: 'Save failed',
        });
      }
    } catch (error) {
      toast.error({
        message: 'Save failed',
      });
      console.log(
        'Error while creating the customer attribute info :>> ',
        error,
      );
    }
  };

  // Discard changes ....
  const handleCancel = async () => {
    const isFormDirty = await ACLService.isFormDirty();
    if (isFormDirty) {
      setIsDiscardVisible(true);
    } else {
      toast.info({
        message: 'No changes to discard',
      });
    }
  };

  const handleDiscardCancel = () => {
    setIsDiscardVisible(false);
  };
  const handleDiscardChanges = async () => {
    prePopulateScreenData();
    await ACLService.saveAclGuardStatusToStorage(false);
    setIsDiscardVisible(false);
  };
  // ..

  return (
    <SafeAreaView style={tw('flex-1 border-light-lavendar')}>
      <View flex>
        <ProspectLandingHeader
          fromPLP={true}
        />
        <View row flex>
          <PLLeftMenuComponent
            activeTab={PROSPECT_LANDING_SCREENS.CUSTOMER_ATTRIBUTE}
          />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <View flex marginR-v2>
              <Card flex-1 marginB-v2>
                <View
                  centerH
                  style={tw('flex-row justify-between')}
                  paddingH-v4
                  paddingT-v2>
                  <Text text18M textBlack>
                    Business Details
                  </Text>

                  <View center marginR-v2 row>
                    {isEditable ? (
                      <TouchableOpacity
                        style={tw(' m-6')}
                        onPress={handleCancel}>
                        <Text grey2 text13R>
                          {'Cancel'}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={tw(
                        'bg-light-darkBlue rounded-md py-2 px-8 flex-row items-center ml-6',
                      )}
                      onPress={handleSaveCustomerInfo}>
                      <Text white text13R>
                        {'  '}
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}>
                  <BusinessDetailsComponent
                    abcClassificationDropdownData={
                      abcClassificationDropdownData
                    }
                    startBusinessReasonDropdownData={
                      startBusinessReasonDropdownData
                    }
                    distributerDropdownData={distributerDropdownData}
                    inputData={customerAttributeInputData}
                    handleInputChange={handleInputChange}
                    handleSaveCustomerInfo={handleSaveCustomerInfo}
                    handleScooping={handleScooping}
                    handleIndirectCustomer={handleIndirectCustomer}
                    errorMessages={errorMessages}
                    mandatoryData={mandatoryData}
                    nameDropdownData={nameDropdownData}
                    isEnableWholeSaler={isEnableWholeSaler}
                    isEnableDistributor={isEnableDistributor}
                    isEditable={isEditable}
                    handleCancel={handleCancel}
                  />
                </ScrollView>
              </Card>
            </View>
          )}
        </View>
      </View>
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

export default withAuthScreen(PLCustomerAttibutes, true);
