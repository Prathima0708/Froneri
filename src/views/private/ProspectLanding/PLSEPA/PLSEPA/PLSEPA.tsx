import base64 from 'react-native-base64'
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { PROSPECT_LANDING_SCREENS } from 'src/utils/Constant';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import Card from 'src/components/Card';
import InputText from 'src/components/InputText';
import { BUTTON_TYPE } from 'src/components/Button/ButtonType';
import SignPadModal from 'src/components/Common/SignComponent/SignPadModal';
import SignComponent from 'src/components/Common/SignComponent/SignComponent';
import CustomerDetailsComponent from 'src/components/ProspectLanding/PLSEPA/CustomerDetailsComponent';
import { pageNamePLSEPAPreview } from 'src/routes/Routes';
import PLSepaController from 'src/controller/PLSepaController';
import { toast } from 'src/utils/Util';
import { getDateTimeIn12HourFormat, validateIBAN } from 'src/utils/CommonUtil';
import { SEPA_AGREEMENT_TYPE_DROPDOWN } from 'src/utils/DropdownConst';
import MessageModal from 'src/components/Common/MessageModal';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import ACLService from 'src/services/ACLService';

const PLSEPA = () => {
  const navigation = useNavigation();
  // SEPA States....
  const [sepaData, setSepaData] = useState<any>({
    generateAgreementNo: '', // needed  while insert
    agreementNumber: '',
    agreementType: SEPA_AGREEMENT_TYPE_DROPDOWN[0].value,
    mandateReferenceNumber: '',
    originalFormatSignedDate: '',
    signedDate: '',
    status: '',
    name1: '',
    name2: '',
    name3: '',
    customerNo: '',
    houseNumber: '',
    street: '',
    city: '',
    postalCode: '',
    nameOfAccountHolder: '',
    ibanNumber: '',
    signeeName: '',
    customerSignature: '',
    sepaStatus: '0',
  });
  const [mandatoryData, setMandatoryData] = useState<any>({
    nameOfAccountHolder: '',
    ibanNumber: '',
    customerSignature: '',
  });
  const [errorMessages, setErrorMessages] = useState<any>({
    nameOfAccountHolder: '',
    ibanNumber: '',
    customerSignature: '',
  });

  const [isEditable, setIsEditable] = useState(true);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isFinalizedEnabled, setIsFinalizedEnabled] = useState(true);
  const [isSignPadVisible, setIsSignPadVisible] = useState(false);
  const [isOverwriteModalVisible, setIsOverwriteModalVisible] = useState(false);
  const [isFinalizeModalVisible, setIsFinalizeModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false); // Cancel modal state
  const [loading, setLoading] = useState(false);
  // SEPA ....
  // Type - 1 - SEPA, 2 - BANK DETAILS

  useEffect(() => {
    getSepaInfo('1');
  }, []);

  const getSepaInfo = async (agreementType: string) => {
    // Check Sepa exist or not
    try {
      setLoading(true);
      const isSepaExistAlready = await PLSepaController.isSepaAgreementExists();
      console.log('isSepaExistAlready', isSepaExistAlready);
      if (isSepaExistAlready.length > 0) {
        await getPrepopulatedSepaInfo();
      } else {
        await getPLPSepAgreementNotAvailableInfo(agreementType);
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  // Prepopulate the prospect / customer data
  const getPrepopulatedSepaInfo = async () => {
    try {
      const response = await PLSepaController.getPrepopulatedSepaInfo();
      console.log('pre populatedData :>> ', response);
      if (response.length > 0) {
        const item = response[0];

        const customerSignatureData = item?.customerSignature
        const customerSignatureArr = customerSignatureData?.split("-")

        const customerSignature = customerSignatureArr?.length > 0 ? customerSignatureArr[0] : ""
        const customerSigneeName = customerSignatureArr?.length > 1 ? base64.decode(customerSignatureArr[1]) : ""

        const prepareData = {
          agreementType: item.agreementType
            ? item.agreementType == '1'
              ? SEPA_AGREEMENT_TYPE_DROPDOWN[0].value
              : SEPA_AGREEMENT_TYPE_DROPDOWN[1].value
            : '',
          mandateReferenceNumber: item.mandateReferenceNumber
            ? item.mandateReferenceNumber
            : '',
          agreementNumber: item.agreementNumber ? item.agreementNumber : '',
          nameOfAccountHolder: item.nameOfAccountHolder
            ? item.nameOfAccountHolder
            : '',
          name1: item.name1 ? item.name1 : '',
          name2: item.name2 ? item.name2 : '',
          name3: item.name3 ? item.name3 : '',
          customerNo: item.customerNo ? item.customerNo : '',
          street: item.street ? item.street : '',
          postalCode: item.postalCode ? item.postalCode : '',
          city: item.city ? item.city : '',
          houseNumber: item.houseNumber ? item.houseNumber : '',
          status: item.status ? item.status : '',
          customerSignature: customerSignature,
          signeeName: customerSigneeName,
          ibanNumber: item.ibanNumber ? item.ibanNumber : '',
          originalFormatSignedDate: item.signedDate ? item.signedDate : '',
          signedDate: item.signedDate
            ? getDateTimeIn12HourFormat(item.signedDate)
            : '',
          sepaStatus: item.sepaStatus ? item.sepaStatus : '',
        };

        setSepaData((prevData: any) => ({ ...prevData, ...prepareData }));

        if (prepareData.sepaStatus === '2') {
          setIsEditable(false);
        }
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log('Error while getting pre populated data :>> ', error);
    }
  };

  const getPLPSepAgreementNotAvailableInfo = async (agreementType: string) => {
    try {
      const response =
        await PLSepaController.getPLPSepAgreementNotAvailableInfo();
      console.log('sepa agreement not available info :>> ', response);

      if (response.length > 0) {
        const item = response[0];
        const prepareData = {
          agreementType:
            agreementType === '1'
              ? SEPA_AGREEMENT_TYPE_DROPDOWN[0].value
              : SEPA_AGREEMENT_TYPE_DROPDOWN[1].value,
          name1: item.name1 ? item.name1 : '',
          name2: item.name2 ? item.name2 : '',
          name3: item.name3 ? item.name3 : '',
          customerNo: item.customerNo ? item.customerNo : '',
          street: item.street ? item.street : '',
          postalCode: item.postalCode ? item.postalCode : '',
          city: item.city ? item.city : '',
          houseNumber: item.houseNumber ? item.houseNumber : '',
          status: item.status ? item.status : 'Open',
          generateAgreementNo: item.generateAgreementNo
            ? item.generateAgreementNo
            : '',
          sepaStatus: item.sepaStatus ? item.sepaStatus : '0',
          nameOfAccountHolder: '',
          ibanNumber: '',
          signeeName: '',
          customerSignature: '',
          agreementNumber: '',
          mandateReferenceNumber: '',
          originalFormatSignedDate: '',
          signedDate: '',
        };
        setSepaData((prevData: any) => ({ ...prevData, ...prepareData }));
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log(
        'Error while getting sepa agreement not available info data :>> ',
        error,
      );
    }
  };

  const getMandantoryFields = async () => {
    try {
      const mandatoryFieldsConfig =
        await PLSepaController.getMandatoryFieldsConfig();
      console.log('mandatoryFieldsConfig :>> ', mandatoryFieldsConfig);
      setMandatoryData(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const handleNameOfAccountHolder = (text: string) => {
    setSepaData((prevData: any) => ({
      ...prevData,
      nameOfAccountHolder: text,
    }));
    setErrorMessages({ ...errorMessages, nameOfAccountHolder: '' });

    if (!isButtonActive) {
      setIsButtonActive(true);
    }
  };

  const handleIBANNumber = (text: string) => {
    setSepaData((prevData: any) => ({
      ...prevData,
      ibanNumber: text.toUpperCase().replace(/[^a-zA-Z0-9]/g, ''),
    }));
    setErrorMessages({ ...errorMessages, ibanNumber: '' });

    if (!isButtonActive) {
      setIsButtonActive(true);
    }
  };

  const handleAgreement = async (item: any) => {
    if (sepaData?.sepaStatus === '2' || sepaData?.sepaStatus === '1') {
      setIsOverwriteModalVisible(true);
      return;
    }
    setSepaData((prevData: any) => ({
      ...prevData,
      agreementType: item.value,
      nameOfAccountHolder: '',
      ibanNumber: '',
      signeeName: '',
      customerSignature: '',
      sepaStatus: '0',
      status: 'Open',
    }));
    setIsEditable(true);
  };

  const handleCancel = () => {
    setIsCancelModalVisible((prevData: any) => !prevData);
  };

  const handleSave = async () => {
    try {
      setErrorMessages({
        nameOfAccountHolder: '',
        ibanNumber: '',
        customerSignature: '',
      });

      if (
        sepaData.ibanNumber.length > 0 &&
        !validateIBAN(sepaData.ibanNumber)
      ) {
        toast.error({ message: 'Invalid IBAN Number' });
        return;
      }

      let customerSignature = sepaData.customerSignature

      if (sepaData.signeeName.trim().length > 0) {
        const encodedCustomerSigneeName = base64.encode(sepaData.signeeName)
        customerSignature = sepaData.customerSignature + "-" + encodedCustomerSigneeName
      }

      const formData = {
        ...sepaData,
        customerSignature,
      }

      const response = await PLSepaController.createOrUpdateProspectSepaInfo({
        ...formData,
        isFinalizing: false,
      });
      console.log('save response :>> ', response);

      if (!sepaData.signedDate && sepaData.customerSignature) {
        setSepaData((prevData: any) => ({
          ...prevData,
          signedDate: getDateTimeIn12HourFormat(new Date().toISOString()),
        }))
      }

      if (response) {
        await getPrepopulatedSepaInfo();
        await ACLService.saveAclGuardStatusToStorage(false);
        setIsButtonActive(false);
        toast.success({
          message: 'Changes saved successfully',
        });
      } else {
        toast.error({
          message: 'Changes not saved',
        });
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log('Error while saving the data :>> ', error);
    }
  };

  const handlePreview = () => {
    navigation.navigate(pageNamePLSEPAPreview as never, { sepaData } as never);
  };

  const handleFinalize = async () => {
    try {
      if (!sepaData?.customerSignature) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          customerSignature: 'Mandatory',
        }));
      }
      if (!sepaData?.nameOfAccountHolder) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          nameOfAccountHolder: 'Mandatory',
        }));
      }
      if (!sepaData?.ibanNumber) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          ibanNumber: 'Mandatory',
        }));
      }
      if (
        !sepaData?.customerSignature ||
        !sepaData?.nameOfAccountHolder ||
        !sepaData?.ibanNumber
      ) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return;
      }

      if (
        sepaData.ibanNumber.length > 0 &&
        !validateIBAN(sepaData.ibanNumber)
      ) {
        toast.error({ message: 'Invalid IBAN Number' });
        return;
      }
      setIsFinalizeModalVisible(true);
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log('Error while getting pre populated data :>> ', error);
    }
  };

  const handleFinalizeYesPressed = async () => {
    try {
      setLoading(true);

      setIsFinalizeModalVisible(false);

      let customerSignature = sepaData.customerSignature

      if (sepaData.signeeName.trim().length > 0) {
        const encodedCustomerSigneeName = base64.encode(sepaData.signeeName)
        customerSignature = sepaData.customerSignature + "-" + encodedCustomerSigneeName
      }

      const formData = {
        ...sepaData,
        customerSignature,
      }

      const response = await PLSepaController.createOrUpdateProspectSepaInfo({
        ...formData,
        isFinalizing: true,
      });
      console.log('finalize yes pressed response :>> ', response);

      if (response) {
        const isFinalized =
          await PLSepaController.finalizeSepaAgreementCreateRequest(sepaData);
        if (isFinalized) {
          await ACLService.saveAclGuardStatusToStorage(false);
          toast.success({
            message: 'Agreement Finalized',
          });
          await getPrepopulatedSepaInfo();
          setIsEditable(false);
        } else {
          toast.error({
            message: 'Something went wrong',
          });
        }
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

  const handleFinalizeCancelPressed = () => {
    setIsFinalizeModalVisible(false);
  };

  const handleOverwriteYesPressed = async () => {
    try {
      setIsOverwriteModalVisible(false);
      const isDeleted = await PLSepaController.deleteSepaAgreement();
      console.log('isDeleted', isDeleted);
      if (isDeleted) {
        const isUpdatedSepaData =
          await PLSepaController.updateSepaOverwriteInfo();
        if (isUpdatedSepaData) {
          // deleted existing and created new one
          let previousSepaDetails = sepaData;
          const agreementType =
            previousSepaDetails.agreementType ==
              SEPA_AGREEMENT_TYPE_DROPDOWN[0].value
              ? '2'
              : '1';
          await getSepaInfo(agreementType);
          await ACLService.saveAclGuardStatusToStorage(false);
          setIsEditable(true);
        } else {
          toast.error({
            message: 'Something went wrong',
          });
        }
      } else {
        toast.error({
          message: 'Something went wrong',
        });
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const handleOverwriteCancelPressed = async () => {
    await ACLService.saveAclGuardStatusToStorage(false);
    setIsOverwriteModalVisible(false);
  };
  const handleSignPad = () => {
    if (!sepaData?.ibanNumber) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        ibanNumber: 'Mandatory',
      }));
      return;
    }
    if (sepaData.ibanNumber.length > 0 && !validateIBAN(sepaData.ibanNumber)) {
      toast.error({ message: 'Invalid IBAN Number' });
      return;
    }
    setIsSignPadVisible(!isSignPadVisible);
    setErrorMessages({ ...errorMessages, customerSignature: '' });
  };

  const handleSaveSign = (name: string, sign: string) => {
    console.log('sign', sign);
    setSepaData((prevData: any) => ({
      ...prevData,
      signeeName: name,
      customerSignature: sign,
    }));

    if (!isButtonActive) {
      setIsButtonActive(true);
    }
  };

  // Discarding the data and resetting the form
  const handleDiscard = async () => {
    try {
      setIsCancelModalVisible(false);
      setLoading(true);

      let previousSepaDetails = sepaData;
      const agreementType =
        previousSepaDetails.agreementType ==
          SEPA_AGREEMENT_TYPE_DROPDOWN[0].value
          ? '1'
          : '2';
      await getSepaInfo(agreementType);
      await ACLService.saveAclGuardStatusToStorage(false);
      setIsButtonActive(false);
    } catch (error) {
      console.log('error while discarding data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <ProspectLandingHeader
        agreementType={sepaData.agreementType}
        handleSepaAgreementType={handleAgreement}
        fromPLP={true}
      />
      <View flex row>
        <PLLeftMenuComponent activeTab={PROSPECT_LANDING_SCREENS.SEPA} />
        {loading ? (
          <CustomerLandingLoader />
        ) : (
          <Card flex-1 marginR-v2 marginB-v2 padding-v4>
            <View row centerV spread marginB-v4 style={tw('w-full')}>
              <Text
                text18M
                style={tw("leading-9")}
              >
                {`Agreement Type - ${sepaData.agreementType}`}
              </Text>
              <View right row centerV>
                {sepaData.sepaStatus !== '2' && (
                  <View row centerV>
                    <TouchableOpacity
                      onPress={handleCancel}
                      disabled={!isButtonActive}
                      style={tw('p-2 rounded-md')}>
                      <Text
                        text13R
                        style={tw(
                          `${isButtonActive
                            ? 'text-light-textBlack'
                            : 'text-light-grey2'
                          }`,
                        )}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSave}
                      disabled={!isButtonActive}
                      style={tw(
                        `${isButtonActive
                          ? BUTTON_TYPE.PRIMARY_BORDER_ENABLED
                          : BUTTON_TYPE.PRIMARY_DISABLED
                        } px-36px mx-6`,
                      )}>
                      <Text
                        text13R
                        style={tw(
                          `${isButtonActive
                            ? BUTTON_TYPE.PRIMARY_BORDER_ENABLED_LABEL
                            : BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                          }`,
                        )}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  onPress={handlePreview}
                  style={tw(
                    `${BUTTON_TYPE.LIGHT_BORDER_ENABLED} px-36px`,
                  )}>
                  <Text
                    text13R
                    style={tw(
                      `${BUTTON_TYPE.LIGHT_BORDER_ENABLED_LABEL}`,
                    )}>
                    Preview
                  </Text>
                </TouchableOpacity>
                {sepaData.sepaStatus !== '2' && (
                  <TouchableOpacity
                    onPress={handleFinalize}
                    disabled={!isFinalizedEnabled}
                    style={tw(
                      `${isFinalizedEnabled
                        ? BUTTON_TYPE.PRIMARY_ENABLED
                        : BUTTON_TYPE.PRIMARY_DISABLED
                      } px-36px ml-6`,
                    )}>
                    <Text
                      text13R
                      style={tw(
                        `${isFinalizedEnabled
                          ? BUTTON_TYPE.PRIMARY_ENABLED_LABEL
                          : BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                        }`,
                      )}>
                      Finalize
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
              <CustomerDetailsComponent sepaData={sepaData} />

              <View marginV-v6 style={tw('bg-light-lavendar h-px')} />
              <View>
                <Text text18M textBlack>
                  Account Information
                </Text>
                <View row marginT-v4>
                  <View flex marginR-v2>
                    <InputText
                      title="Name of Account Holder*"
                      placeholder="Enter Name of Account Holder"
                      isEditable={isEditable}
                      value={sepaData.nameOfAccountHolder}
                      onChangeText={handleNameOfAccountHolder}
                      maxLength={100}
                      errorMsg={errorMessages.nameOfAccountHolder}
                    />
                  </View>
                  <View flex marginR-v2>
                    <InputText
                      title="IBAN Number*"
                      placeholder="Enter IBAN Number"
                      isEditable={isEditable}
                      value={sepaData.ibanNumber}
                      onChangeText={handleIBANNumber}
                      maxLength={100}
                      errorMsg={errorMessages.ibanNumber}
                    />
                  </View>
                  <View flex-2 marginR-v2 />
                </View>
                <View row marginT-v5>
                  <View flex-2>
                    <SignComponent
                      title="Customer Signature*"
                      handleSignPad={handleSignPad}
                      sign={sepaData.customerSignature}
                      signeeName={sepaData.signeeName}
                      isEditable={isEditable}
                      errorMsg={errorMessages.customerSignature}
                    />
                  </View>
                  <View flex-2 marginR-v2 />
                </View>
              </View>
            </ScrollView>
            <SignPadModal
              title="Customer Signature"
              isVisible={isSignPadVisible}
              handleCancel={handleSignPad}
              handleSaveSign={handleSaveSign}
              accountHolderName={sepaData.nameOfAccountHolder}
            />
          </Card>
        )}
      </View>
      <MessageModal
        isVisible={isFinalizeModalVisible}
        title={'Do you want to Finalize the\n  Agreement?'}
        subTitle=""
        primaryButtonText="Yes"
        secondaryButtonText="No"
        handleOnPressSuccess={handleFinalizeYesPressed}
        handleOnPressCancel={handleFinalizeCancelPressed}
      />
      <MessageModal
        isVisible={isOverwriteModalVisible}
        title="Overwrite SEPA Agreement"
        subTitle=""
        primaryButtonText="Yes"
        secondaryButtonText="No"
        handleOnPressSuccess={handleOverwriteYesPressed}
        handleOnPressCancel={handleOverwriteCancelPressed}
      />
      <MessageModal
        isVisible={isCancelModalVisible}
        title="Discard the Changes?"
        subTitle="Your unsaved edits will be lost"
        primaryButtonText="Yes, Discard"
        secondaryButtonText="No, Keep the changes"
        handleOnPressSuccess={handleDiscard}
        handleOnPressCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

export default withAuthScreen(PLSEPA, true);
