import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { useEffect, useRef, useState } from 'react';
import base64 from 'react-native-base64'
import { tw } from 'src/tw';
import { SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import InputText from 'src/components/InputText';
import CADetailsComponent from 'src/components/ProspectLanding/PLConditionAgreements/CADetailsComponent';
import { images } from 'src/assets/Images';
import SignComponent from 'src/components/Common/SignComponent/SignComponent';
import SignPadModal from 'src/components/Common/SignComponent/SignPadModal';
import AgreementDetailsComponent from 'src/components/ProspectLanding/PLConditionAgreements/AgreementDetailsComponent';
import DeleteModal from 'src/components/Common/DeleteModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { pageNamePLCAPreview } from 'src/routes/Routes';
import { toast } from 'src/utils/Util';
import PLConditionAgreementController from 'src/controller/PLConditionAgreementController';
import ACLService from 'src/services/ACLService';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import { generateUniqueIdWithTimeWithoutPrefix, getOnlyDate } from 'src/utils/CommonUtil';
import { TextsService } from 'src/services/TextsService';
import MessageModal from 'src/components/Common/MessageModal';
import TextError from 'src/components/TextError';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { ICE_CONDITIONS_TEMPLATE } from 'src/utils/Templates';
import PLBasicInfoController from 'src/controller/PLBasicInfoController';
import { ParametersValuesService } from 'src/services/ParametersValuesService';
import ICEConditionsModal from 'src/components/ProspectLanding/PLConditionAgreements/ICEConditionsModal';
import CAHeaderComponent from 'src/components/ProspectLanding/PLConditionAgreements/CAHeaderComponent';

const PLCreateEditCA = () => {
  const route = useRoute<any>()

  const screenMode = route.params.screenMode;
  const navigation = useNavigation();
  const employeeInfo = useAppSelector(
    (state: RootState) => state.userContext.employee,
  );

  const prospectInfoData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const [isEditable, setIsEditable] = useState(
    screenMode === 'Create',
  );
  const [loading, setLoading] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isFinalizeModalVisible, setIsFinalizeModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCustomerSignPadVisible, setIsCustomerSignPadVisible] =
    useState(false);
  const [isEmployeeSignPadVisible, setIsEmployeeSignPadVisible] =
    useState(false);
  const [isFinalizeEnabled, setIsFinalizeEnabled] = useState(true)
  const [areSignaturesEditable, setAreSignaturesEditable] = useState(true)
  const [deleteIconVisible, setDeleteIconVisible] = useState(false)
  const [isSwissMarket, setIsSwissMarket] = useState(true)
  const [isConditionsModalVisible, setIsConditionsModalVisible] = useState(false)
  const [isAgreementDisabled, setIsAgreementDisabled] = useState(false)

  const [htmlContent, setHtmlContent] = useState("")
  const [initialHtml, setInitialHtml] = useState("")

  const [conditionAggrementInputData, setConditionAggrementInputData] =
    useState({
      conditionAgreementNumber: '',
      idContractType: "",
      description: "",
      creationDatetime: '',
      conditionsSignedDatetime: '',
      conditionsStatus: '',
      createdBy: '',
      updatedBy: '',
      updateDatetime: '',
      iceStartDate: '',
      iceEndDate: '',
      iceConditions: '',
      frozenfoodStartDate: '',
      frozenfoodEndDate: '',
      signatureCustomer: '',
      signatureEmployee: '',
      customerSigneeName: '',
      employeeSigneeName: '',
      justification: '',
      frozenfoodConditions: '',
      yambsStatus: '',
    });

  const [errorMessages, setErrorMessages] = useState({
    conditionAgreementNumber: '',
    idContractType: '',
    creationDatetime: '',
    conditionsSignedDatetime: '',
    conditionsStatus: '',
    createdBy: '',
    updatedBy: '',
    updateDatetime: '',
    iceStartDate: '',
    iceEndDate: '',
    iceConditions: '',
    frozenfoodStartDate: '',
    frozenfoodEndDate: '',
    signatureCustomer: '',
    signatureEmployee: '',
    customerSigneeName: '',
    employeeSigneeName: '',
    justification: '',
    frozenfoodConditions: '',
  });

  const richTextRef = useRef<any>();

  useEffect(() => {
    getScreenData();
  }, []);

  useEffect(() => {
    if (isSwissMarket) {
      prePopulateHtmlData()
    }
  }, [isSwissMarket])

  const prePopulateHtmlData = async () => {
    try {
      if (route.params?.isEditable) {
        await fetchCurrentAgreementHtmlData()
      } else {
        await setInitialHtmlData()
      }
    } catch (error) {
      console.log('error while setting html data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      })
    }
  }

  const fetchCurrentAgreementHtmlData = async () => {
    try {
      const previousScreenDataObj = route.params?.data;
      setHtmlContent(previousScreenDataObj?.iceConditionsHtml)
    } catch (error) {
      console.log('error while fetching current html data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      })
    }
  }

  const getScreenData = async () => {
    setLoading(true)
    const parametersValuesService = new ParametersValuesService()
    const templateFormValue = await parametersValuesService.getParameterValue('Agreement_Using_Template_Form')

    if (templateFormValue === '1') {
      setIsSwissMarket(true)
    } else {
      setIsSwissMarket(false)
    }

    if (route.params?.isEditable) {
      console.log('Previous screen Data :>> ', route.params?.data);
      await prePopulateScreenData()
      setIsFinalizeEnabled(true)
      setAreSignaturesEditable(false)
    } else {
      setInitialInputsData();
      setIsFinalizeEnabled(false)
      setAreSignaturesEditable(true)
      setDeleteIconVisible(false)

      setConditionAggrementInputData((prevData: any) => ({
        ...prevData,
        employeeSigneeName: employeeInfo[0].firstName + " " + employeeInfo[0].lastName
      }));
    }
    setLoading(false)
  };

  const prePopulateScreenData = async () => {
    try {
      const screenData = await PLConditionAgreementController.getConditionDataOfProspect(route.params?.data?.conditionAgreementNumber)
      console.log('screenData :>> ', screenData);

      if (screenData.length > 0) {
        const screenDataObj = screenData[0]
        const previousScreenDataObj = route.params?.data;

        console.log('previousScreenDataObj :>> ', previousScreenDataObj);

        const customerSignatureData = previousScreenDataObj?.signatureCustomer
        const customerSignatureArr = customerSignatureData?.split("-")

        const employeeSignatureData = previousScreenDataObj?.signatureEmployee
        const employeeSignatureArr = employeeSignatureData?.split("-")

        const customerSignature = customerSignatureArr?.length > 0 ? customerSignatureArr[0] : ""
        const customerSigneeName = customerSignatureArr?.length > 1 ? base64.decode(customerSignatureArr[1]) : ""

        const employeeSignature = employeeSignatureArr?.length > 0 ? employeeSignatureArr[0] : ""
        let employeeSigneeName = employeeSignatureArr?.length > 1 ? base64.decode(employeeSignatureArr[1]) : ""

        if (employeeSigneeName === '') {
          employeeInfo[0].firstName + " " + employeeInfo[0].lastName
        }

        const preparedData = {
          conditionAgreementNumber:
            previousScreenDataObj?.conditionAgreementNumber ?? '',
          idContractType: previousScreenDataObj?.idContractType ?? '',
          description: previousScreenDataObj?.description ?? '',
          creationDatetime: previousScreenDataObj?.creationDatetime ?? '',
          conditionsSignedDatetime:
            previousScreenDataObj?.conditionsSignedDatetime ?? '',
          createdBy: previousScreenDataObj?.createdby ?? '',
          updatedBy: previousScreenDataObj?.updatedby ?? '',
          updateDatetime: previousScreenDataObj?.updateDatetime ?? '',
          iceStartDate: screenDataObj?.iceStartDate ? new Date(screenDataObj?.iceStartDate) : '',
          iceEndDate: screenDataObj?.iceEndDate ? new Date(screenDataObj?.iceEndDate) : '',
          frozenfoodStartDate: screenDataObj?.frozenFoodStartDate ? new Date(screenDataObj?.frozenFoodStartDate) : '',
          frozenfoodEndDate: screenDataObj?.frozenFoodEndDate ? new Date(screenDataObj?.frozenFoodEndDate) : '',
          iceConditions: screenDataObj?.iceConditions ?? '',
          frozenfoodConditions: screenDataObj?.frozenFoodConditions ?? '',
          signatureCustomer: customerSignature,
          signatureEmployee: employeeSignature,
          customerSigneeName: customerSigneeName,
          employeeSigneeName: employeeSigneeName,
          justification: screenDataObj?.justification ?? '',
          yambsStatus: screenDataObj?.yambsStatus ?? '',
          status: previousScreenDataObj?.status ?? '',
        };

        console.log('preparedData :>> ', preparedData);

        setConditionAggrementInputData((prevData: any) => ({
          ...prevData,
          ...preparedData,
        }));

        if (screenDataObj?.conditionStatus === '1') {
          setIsEditable(false);
          setIsFinalized(true);
          setDeleteIconVisible(false)
        } else {
          setDeleteIconVisible(true)
        }
      }

    } catch (error) {
      console.log('error while fetching screen data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  }

  const handleCancel = async () => {
    await ACLService.saveAclGuardStatusToStorage(false)
    if (route.params?.isEditable) {
      await getScreenData()
      setIsEditable(false);
      setDeleteIconVisible(true)
    } else {
      navigation.goBack()
    }
  };

  const setInitialHtmlData = async () => {
    try {
      const customerInfoData = await PLBasicInfoController.getShipToPrepopulatedData()
      const customerPayerData = await PLConditionAgreementController.getCustomerPayersDetails();
      console.log('customerPayerData :>> ', customerPayerData);

      if (customerInfoData.length > 0) {
        const customerInfoObj = customerInfoData[0]
        const customerNumber = prospectInfoData?.customerShipTo
          ? prospectInfoData?.customerShipTo
          : prospectInfoData?.prospectNumber;
        const customerName = customerInfoObj?.name1 ? customerInfoObj?.name1 : '';

        const address = customerInfoObj?.address1 + ' ' + customerInfoObj?.address2 + ' ' + customerInfoObj?.address3 + ' ' + customerInfoObj?.coOrStreet3 + ' ' + customerInfoObj?.zipCode + ' ' + customerInfoObj?.city
        const hierarchy = customerInfoObj?.customerHierarchy
        const fsrName = employeeInfo[0].firstName + employeeInfo[0].lastName;
        let customerPayerNumber = ''

        if (customerPayerData.length > 0) {
          customerPayerNumber = customerPayerData[0].customerPayer;

          if (customerNumber !== customerPayerNumber) {
            customerPayerNumber = `<span style="background-color: yellow;">${customerPayerNumber + ' - ' + customerName}</span>`
          } else {
            customerPayerNumber = customerPayerNumber + ' - ' + customerName
          }
        } else {
          customerPayerNumber = ' - ' + customerName
        }

        const placeholders = ['&lt;#customer_name#&gt;', '&lt;#address#&gt;', '&lt;#hierarchy#&gt;', '&lt;#customer_payer_name#&gt;', '&lt;#FSR#&gt;']
        const placeholdersValue = [customerNumber + ' ' + customerName, address, hierarchy, customerPayerNumber, fsrName]

        let preparedTemplate = ICE_CONDITIONS_TEMPLATE

        placeholders.forEach((placeholder, index) => {
          preparedTemplate = preparedTemplate.replace(placeholder, placeholdersValue[index])
        })

        setHtmlContent(preparedTemplate)
        setInitialHtml(preparedTemplate)
      }
    } catch (error) {
      console.log('error while setting initial input data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      })
    }
  }

  const setInitialInputsData = async () => {
    let name = '';

    if (employeeInfo.length > 0) {
      name = employeeInfo[0].firstName + employeeInfo[0].lastName;
    }

    setConditionAggrementInputData((prevData: any) => ({
      ...prevData,
      status: 'Open',
      creationDatetime: getOnlyDate(new Date().toISOString()),
      createdBy: name,
      idContractType: route?.params?.type?.idContractType,
      description: route?.params?.type?.description,
    }));
  };

  const validateInputs = (validateAll = false) => {
    setErrorMessages({
      conditionAgreementNumber: '',
      idContractType: '',
      creationDatetime: '',
      conditionsSignedDatetime: '',
      conditionsStatus: '',
      createdBy: '',
      updatedBy: '',
      updateDatetime: '',
      iceStartDate: '',
      iceEndDate: '',
      iceConditions: '',
      frozenfoodStartDate: '',
      frozenfoodEndDate: '',
      frozenfoodConditions: '',
      signatureCustomer: '',
      signatureEmployee: '',
      customerSigneeName: '',
      employeeSigneeName: '',
      justification: '',
    });

    let isError = false;

    if (conditionAggrementInputData.iceStartDate === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        iceStartDate: 'Mandatory',
      }));
      isError = true;
    }

    if (conditionAggrementInputData.iceEndDate === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        iceEndDate: 'Mandatory',
      }));
      isError = true;
    }

    if (!isSwissMarket) {
      if (conditionAggrementInputData.iceConditions === '') {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          iceConditions: 'Mandatory',
        }));
        isError = true;
      }

      if (validateAll) {
        if (conditionAggrementInputData.signatureCustomer === '') {
          setErrorMessages((prevData: any) => ({
            ...prevData,
            signatureCustomer: 'Mandatory',
          }));
          isError = true;
        }

        if (conditionAggrementInputData.signatureEmployee === '') {
          setErrorMessages((prevData: any) => ({
            ...prevData,
            signatureEmployee: 'Mandatory',
          }));
          isError = true;
        }
      }
    }

    if (validateAll) {
      if (conditionAggrementInputData.justification === '') {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          justification: 'Mandatory',
        }));
        isError = true;
      }
    }

    return !isError;
  };

  const saveAgreement = async () => {
    try {

      let areInputsValid = validateInputs()
      if (isSwissMarket && (htmlContent === initialHtml)) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          iceConditions: 'Mandatory',
        }));
        areInputsValid = false
      }

      if (!areInputsValid) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return false;
      }

      const conditionAgreementNumber =
        conditionAggrementInputData?.conditionAgreementNumber
          ? conditionAggrementInputData?.conditionAgreementNumber
          : generateUniqueIdWithTimeWithoutPrefix();

      let customerSignature = conditionAggrementInputData.signatureCustomer
      let employeeSignature = conditionAggrementInputData.signatureEmployee

      if (conditionAggrementInputData.customerSigneeName.trim().length > 0) {
        const encodedCustomerSigneeName = base64.encode(conditionAggrementInputData.customerSigneeName)
        customerSignature = conditionAggrementInputData.signatureCustomer + "-" + encodedCustomerSigneeName
      }

      if (conditionAggrementInputData.employeeSigneeName.trim().length > 0) {
        const encodedEmployeeSigneeName = base64.encode(conditionAggrementInputData.employeeSigneeName)
        employeeSignature = conditionAggrementInputData.signatureEmployee + "-" + encodedEmployeeSigneeName
      }

      const formData = {
        ...conditionAggrementInputData,
        signatureCustomer: customerSignature,
        signatureEmployee: employeeSignature,
      }

      const isConditionalAgreementCreated =
        await PLConditionAgreementController.insertOrUpdateConditionalAgreement(
          conditionAgreementNumber,
          { ...formData, htmlContent },
        );
      console.log(
        'isConditionalAgreementCreated :>> ',
        isConditionalAgreementCreated,
      );

      if (!isConditionalAgreementCreated) {
        toast.error({
          message: 'Something went wrong',
        });
        return false;
      }

      await ACLService.saveAclGuardStatusToStorage(false);

      return conditionAgreementNumber;
    } catch (error) {
      console.log('error while saving agreement :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  }

  const handleSave = async () => {
    console.log('agreements input data :>> ', conditionAggrementInputData);
    try {
      const agreementNumber = await saveAgreement()

      if (!agreementNumber) {
        return;
      }

      toast.success({
        message: 'Changes saved successfully',
      });

      setIsEditable(false);
      setIsButtonActive(false);
      setAreSignaturesEditable(false)
      setDeleteIconVisible(true)
      setIsFinalizeEnabled(true)

      let name = '';

      if (employeeInfo.length > 0) {
        name = employeeInfo[0].firstName + employeeInfo[0].lastName;
      }

      if (!conditionAggrementInputData.conditionsSignedDatetime && conditionAggrementInputData.signatureCustomer && conditionAggrementInputData.signatureEmployee) {
        setConditionAggrementInputData((prevData: any) => ({
          ...prevData,
          conditionsSignedDatetime: getOnlyDate(new Date().toISOString()),
        }))
      }

      setConditionAggrementInputData((prevData: any) => ({
        ...prevData,
        updatedBy: conditionAggrementInputData.conditionAgreementNumber ? name : prevData.updatedBy,
        updateDatetime: conditionAggrementInputData.conditionAgreementNumber ? getOnlyDate(new Date().toISOString()) : prevData.updatedDate,
        conditionAgreementNumber: !route.params?.isEditable ? agreementNumber : prevData.conditionAgreementNumber
      }))
    } catch (error) {
      toast.error({
        message: 'Save failed',
      });
      console.log(
        'Error while creating the conditional agreements info :>> ',
        error,
      );
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
    setIsButtonActive(true);
    setDeleteIconVisible(false)

    if (conditionAggrementInputData.signatureEmployee && conditionAggrementInputData.signatureCustomer) {
      setAreSignaturesEditable(false)
    } else {
      setAreSignaturesEditable(true)
    }
  }

  const handlePreview = () => {
    if (isSwissMarket) {
      setIsAgreementDisabled(true)
      setIsConditionsModalVisible(true)
    } else {

      navigation.navigate(pageNamePLCAPreview as never, {
        data: conditionAggrementInputData,
        isSwissMarket,
      } as never);
    }
  };

  const handleCustomerSignPad = () => {
    setIsCustomerSignPadVisible(!isCustomerSignPadVisible);
  };

  const handleEmployeeSignPad = () => {
    setIsEmployeeSignPadVisible(!isEmployeeSignPadVisible);
  };

  const handleCustomerSaveSign = (name: string, sign: string) => {
    setConditionAggrementInputData((prevData: any) => ({
      ...prevData,
      customerSigneeName: name,
      signatureCustomer: sign,
    }));

    setErrorMessages((prevData: any) => ({
      ...prevData,
      signatureCustomer: '',
    }))

    if (!isButtonActive) {
      setIsButtonActive(true)
    }
  };

  const handleEmployeeSaveSign = (name: string, sign: string) => {
    setConditionAggrementInputData((prevData: any) => ({
      ...prevData,
      employeeSigneeName: name,
      signatureEmployee: sign,
    }));
    setErrorMessages((prevData: any) => ({
      ...prevData,
      signatureEmployee: '',
    }))

    if (!isButtonActive) {
      setIsButtonActive(true)
    }
  };

  const handleInputChange = (fieldName: string) => (value: any) => {
    setConditionAggrementInputData((prevData: any) => ({
      ...prevData,
      [fieldName]: value,
    }));

    setErrorMessages((prevData: any) => ({
      ...prevData,
      [fieldName]: '',
    }));

    if (!isButtonActive) {
      setIsButtonActive(true)
    }
  };

  const handleCADeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const handleFinalize = async () => {
    try {
      if (!validateInputs(true)) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return false;
      }

      if (isSwissMarket && (htmlContent === initialHtml)) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          iceConditions: 'Mandatory',
        }));

        return false;
      }

      const response =
        await PLConditionAgreementController.insertOrUpdateConditionalAgreement(
          conditionAggrementInputData.conditionAgreementNumber,
          {
            ...conditionAggrementInputData,
            htmlContent,
            isFinalizing: false,
          },
        );
      console.log('finalize response :>> ', response);

      if (response) {
        await ACLService.saveAclGuardStatusToStorage(false);
        setIsFinalizeModalVisible(true);
      } else {
        toast.error({
          message: 'Something went wrong',
        });
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log('Error while getting pre populated data :>> ', error);
    }
  };

  const handleFinalizeCancelPressed = () => {
    setIsFinalizeModalVisible(false);
  };

  const handleFinalizeYesPressed = async () => {
    try {
      setLoading(true);
      setIsFinalizeModalVisible(false);

      const preparedFinalizeData = {
        ...conditionAggrementInputData,
        htmlContent,
        isFinalizing: true,
      }

      const response =
        await PLConditionAgreementController.insertOrUpdateConditionalAgreement(conditionAggrementInputData.conditionAgreementNumber, preparedFinalizeData);

      console.log('finalize yes pressed response :>> ', response);

      if (!response) {
        toast.error({
          message: 'Something went wrong',
        });
        return
      }

      const isFinalized =
        await PLConditionAgreementController.finalizeConditionAgreementCreateRequest(
          conditionAggrementInputData,
        );
      if (isFinalized) {
        await ACLService.saveAclGuardStatusToStorage(false);
        toast.success({
          message: 'Agreement Finalized',
        });
        navigation.goBack();
      } else {
        toast.error({
          message: 'Something went wrong',
        });
      }

    } catch (error) {
      console.log('error while finalizing agreement :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCA = async () => {
    if (
      conditionAggrementInputData.yambsStatus === '1' ||
      conditionAggrementInputData.yambsStatus === '2'
    ) {
      const textsService = new TextsService();
      const msgConditionAgreementFinalized = await textsService.getTextsValue(
        'MSG_CONDITION_AGREEMENT_ALREADY_SENT_TO_YAMBS ',
      );
      console.log(
        'msgConditionAgreementFinalized -->',
        msgConditionAgreementFinalized,
      );
    } else {
      PLConditionAgreementController.deleteConditionAgreement(
        conditionAggrementInputData?.conditionAgreementNumber,
      )
        .then(() => {
          setIsDeleteModalVisible(false);
          toast.success({
            message: "Agreement deleted"
          })
          navigation.goBack();
        })
        .catch(error => {
          console.log('🚀 ~ file: CA ~ error:', error);
        });
    }
  };

  const handleIceConditions = async () => {
    setIsConditionsModalVisible(true)
  }

  const handleConditionsModalClose = () => {
    setIsConditionsModalVisible(false)
    setIsAgreementDisabled(false)
    setErrorMessages((prevData: any) => ({
      ...prevData,
      iceConditions: '',
    }))
  }

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <ProspectLandingHeader />
      <View flex bg-white br40 marginH-v2 marginB-v4 padding-v4 style={tw('overflow-hidden')}>
        {loading ? <View flex centerH centerV>
          <ActivityIndicator size={'large'} color={ColourPalette.light.black} />
        </View> :
          <View>
            <ScrollView
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ flexGrow: 1 }}
              stickyHeaderIndices={[0]}>
              <View bg-white>
                <CAHeaderComponent
                  handlePreview={handlePreview}
                  handleSave={handleSave}
                  isEditable={isEditable}
                  isFinalizeDisabled={!isFinalizeEnabled}
                  handleFinalize={handleFinalize}
                  isAgreementFinalized={isFinalized}
                  handleEdit={handleEdit}
                  isEditButtonVisible={!isEditable}
                  handleCancel={handleCancel}
                  isButtonActive={isButtonActive}
                />
              </View>
              <CADetailsComponent
                conditionAggrementInputData={conditionAggrementInputData}
                handleInputChange={handleInputChange}
              />
              <View marginT-v6 marginB-v4 style={tw('bg-light-lavendar h-px')} />
              <AgreementDetailsComponent
                areSignaturesEditable={areSignaturesEditable}
                conditionAggrementInputData={conditionAggrementInputData}
                handleInputChange={handleInputChange}
                errorMessages={errorMessages}
                isSwissMarket={isSwissMarket}
              />
              {!isSwissMarket && <View flex marginT-v6>
                <Text text18M textBlack marginB-v4>
                  Capture Signature
                </Text>
                <View row flex centerV>
                  <View flex marginR-v2>
                    <SignComponent
                      title="Customer Signature*"
                      handleSignPad={handleCustomerSignPad}
                      sign={conditionAggrementInputData.signatureCustomer}
                      signeeName={conditionAggrementInputData.customerSigneeName}
                      isEditable={areSignaturesEditable}
                    />
                    <TextError errorMsg={errorMessages?.signatureCustomer} />
                  </View>
                  <View flex>
                    <SignComponent
                      title="Employee Signature*"
                      handleSignPad={handleEmployeeSignPad}
                      sign={conditionAggrementInputData.signatureEmployee}
                      signeeName={conditionAggrementInputData.employeeSigneeName}
                      isEditable={areSignaturesEditable}
                    />
                    <TextError errorMsg={errorMessages?.signatureEmployee} />
                  </View>
                </View>
              </View>}
              {isSwissMarket && <View flex marginT-v6 style={tw('items-start')}>
                <TouchableOpacity onPress={handleIceConditions} disabled={!isEditable}>
                  <Text text12R style={tw(isEditable ? 'text-light-darkBlue' : 'text-light-grey1')}>
                    ICE Conditions*
                  </Text>
                </TouchableOpacity>
                {errorMessages?.iceConditions ? <TextError errorMsg={errorMessages?.iceConditions} /> : null}
              </View>}
              <View marginT-v6 marginB-v4 style={tw('bg-light-lavendar h-px')} />
              <View row marginB-v4>
                <View flex marginR-v2>
                  <InputText
                    title="Notes*"
                    style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
                    multiline
                    isEditable={isEditable}
                    value={conditionAggrementInputData.justification}
                    enableErrors
                    placeholder="Enter Notes"
                    validate={[(value: string) => value.length > 500]}
                    validationMessage={['Words limit reached']}
                    validateOnStart={true}
                    validateOnChange={true}
                    validationMessagePosition={'down'}
                    showCharCounter={isEditable}
                    maxLength={500}
                    errorMsg={errorMessages.justification}
                    onChangeText={handleInputChange('justification')}
                  />
                </View>
                <View flex />
              </View>
              {deleteIconVisible && (
                <TouchableOpacity style={tw('mt-1')} onPress={handleCADeleteModal}>
                  <images.DeleteIcon />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        }
      </View>
      <SignPadModal
        title="Customer Signature"
        isVisible={isCustomerSignPadVisible}
        handleCancel={handleCustomerSignPad}
        handleSaveSign={handleCustomerSaveSign}
      />
      <SignPadModal
        title="Employee Signature"
        isVisible={isEmployeeSignPadVisible}
        handleCancel={handleEmployeeSignPad}
        handleSaveSign={handleEmployeeSaveSign}
        accountHolderName={conditionAggrementInputData.employeeSigneeName}
      />
      <MessageModal
        isVisible={isFinalizeModalVisible}
        title={`Do you want to Finalize the\n${conditionAggrementInputData.conditionAgreementNumber}\nAgreement?`}
        subTitle=""
        primaryButtonText="Yes"
        secondaryButtonText="No"
        handleOnPressSuccess={handleFinalizeYesPressed}
        handleOnPressCancel={handleFinalizeCancelPressed}
      />
      <DeleteModal
        isDeleteModalVisible={isDeleteModalVisible}
        title={`Delete\nAgreement Number\n${conditionAggrementInputData.conditionAgreementNumber}`}
        subTitle={'Are you sure you want to delete\nthis Agreement?'}
        onPressDelete={handleDeleteCA}
        onPressCancel={handleCADeleteModal}
      />
      <ICEConditionsModal
        isVisible={isConditionsModalVisible}
        disabled={isAgreementDisabled}
        richTextRef={richTextRef}
        onChange={setHtmlContent}
        htmlContent={htmlContent}
        onCancelPress={handleConditionsModalClose}
      />
    </SafeAreaView>
  );
};

export default withAuthScreen(PLCreateEditCA);
