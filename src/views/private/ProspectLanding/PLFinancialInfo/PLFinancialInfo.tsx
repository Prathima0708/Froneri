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
import TaxAndTurnoverComponent from 'src/components/ProspectLanding/PLFinancialInfo/TaxAndTurnoverComponent';
import DeliveryAndInvoiceComponent from 'src/components/ProspectLanding/PLFinancialInfo/DeliveryAndInvoiceComponent';
import PaymentInformationComponent from 'src/components/ProspectLanding/PLFinancialInfo/PaymentInformationComponent';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import { toast } from 'src/utils/Util';
import PLFinancialInfoController from 'src/controller/PLFinancialInfoController';
import { validateEmail } from 'src/utils/CommonUtil';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import MessageModal from 'src/components/Common/MessageModal';
import ACLService from 'src/services/ACLService';
import Text from 'src/components/Text';

const PLFinancialInfo = () => {
  const [loading, setLoading] = useState(false);

  const prospectData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const isEditable =
    prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'p';

  const dropdownFields = ['paymentTerms', 'paymentMethods'];

  const dropdownValueFields = [
    'invoiceRhythm',
    'rekap',
    'pdfInvoicing',
    'deliveryNoteType',
  ];

  const numericFields = [
    'expectedTurnOverOne',
    'expectedTurnOverTwo',
    'expectedTurnOverThree',
  ];

  const [deliveryTypeDropdownData, setDeliveryTypeDropdownData] = useState([]);
  const [invoiceRhythmDropdownData, setInvoiceRhythmDropdownData] = useState(
    [],
  );
  const [rekapDropdownData, setRekapDropdownData] = useState([]);
  const [pdfInvoicingDropdownData, setPdfInvoicingDropdownData] = useState([]);
  const [paymentTermsDropdownData, setPaymentTermsDropdownData] = useState([]);
  const [paymentMethodsDropdownData, setPaymentMethodsDropdownData] = useState(
    [],
  );

  const [financialInfoInputData, setFinancialInfoInputData] = useState({
    taxPayerAccNumber: '',
    salesTaxIdNumber: '',
    expectedTurnOverOne: '',
    expectedTurnOverTwo: '',
    expectedTurnOverThree: '',
    totalPotentialTurnOver: '',
    deliveryNoteType: '',
    invoiceRhythm: '',
    rekap: '',
    pdfInvoicing: '',
    emailPdfInvoicing: '',
    paymentTerms: '',
    paymentMethods: '',
    taMinimumTurnoverExplained: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    taxPayerAccNumber: '',
    salesTaxIdNumber: '',
    expectedTurnOverOne: '',
    expectedTurnOverTwo: '',
    expectedTurnOverThree: '',
    deliveryNoteType: '',
    invoiceRhythm: '',
    rekap: '',
    pdfInvoicing: '',
    emailPdfInvoicing: '',
    paymentTerms: '',
    paymentMethods: '',
  });

  const [mandatoryData, setMandatoryData] = useState({
    taxPayerAccNumber: 0,
    salesTaxIdNumber: 0,
    taMinimumTurnoverExplained: 0,
    expectedTurnOverOne: 0,
    expectedTurnOverTwo: 0,
    expectedTurnOverThree: 0,
    deliveryNoteType: 0,
    invoiceRhythm: 0,
    rekap: 0,
    pdfInvoicing: 0,
    emailPdfInvoicing: 0,
    paymentTerms: 0,
    paymentMethods: 0,
  });
  const [isDiscardVisible, setIsDiscardVisible] = useState(false);

  useEffect(() => {
    getScreenData();
  }, []);

  const getScreenData = async () => {
    // setLoading(true);
    await getDeliveryTypeDropdownData();
    await getInvoiceRhythmDropdownData();
    await getRekapDropdownData();
    await getPdfInvoicingDropdownData();
    await getPaymentTermsDropdownData();
    await getPaymentMethodsDropdownData();

    await prePopulateScreenData();
    await getMandatoryFieldsConfig();

    setLoading(false);
  };

  const handleTaMinimumTurnoverExplained = () => {
    setFinancialInfoInputData(prevState => ({
      ...prevState,
      taMinimumTurnoverExplained:
        !financialInfoInputData.taMinimumTurnoverExplained,
    }));
  };

  const getDeliveryTypeDropdownData = async () => {
    try {
      const deliveryTypeData =
        await PLFinancialInfoController.getDeliveryAndInvoicing();
      console.log('deliveryTypeData :>> ', deliveryTypeData);
      setDeliveryTypeDropdownData(deliveryTypeData);
    } catch (error) {
      setDeliveryTypeDropdownData([]);
      console.log('Error while delivery Type Data dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getInvoiceRhythmDropdownData = async () => {
    try {
      const invoiceRhythm = await PLFinancialInfoController.getInvoiceRhythm();
      console.log('invoiceRhythm :>> ', invoiceRhythm);
      setInvoiceRhythmDropdownData(invoiceRhythm);
    } catch (error) {
      setInvoiceRhythmDropdownData([]);
      console.log('Error while invoice rhythm dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getRekapDropdownData = async () => {
    try {
      const rekap = await PLFinancialInfoController.getRekap();
      console.log('rekap :>> ', rekap);
      setRekapDropdownData(rekap);
    } catch (error) {
      setRekapDropdownData([]);
      console.log('Error while rekap dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getPdfInvoicingDropdownData = async () => {
    try {
      const pdfInvoicing = await PLFinancialInfoController.getPdfInvoicing();
      console.log('pdfInvoicing :>> ', pdfInvoicing);
      setPdfInvoicingDropdownData(pdfInvoicing);
    } catch (error) {
      setPdfInvoicingDropdownData([]);
      console.log('Error while pdf invoicing dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getPaymentTermsDropdownData = async () => {
    try {
      const paymentTerms =
        await PLFinancialInfoController.getFinancialInfoCustomerPaymentTermDescription();
      console.log('paymentTerms ', paymentTerms);
      setPaymentTermsDropdownData(paymentTerms);
    } catch (error) {
      setPaymentTermsDropdownData([]);
      console.log('Error while payment terms dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getPaymentMethodsDropdownData = async () => {
    try {
      const paymentMethods =
        await PLFinancialInfoController.getCustomerPaymentMethodsDescription();
      console.log('paymentMethods', paymentMethods);
      setPaymentMethodsDropdownData(paymentMethods);
    } catch (error) {
      setPaymentMethodsDropdownData([]);
      console.log('Error while payment terms dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const prePopulateScreenData = async () => {
    try {
      const screenData =
        await PLFinancialInfoController.getProspectOrCustomerFinancialInfo();

      console.log('screenData', screenData);

      if (screenData.length > 0) {
        const screenDataObj = screenData[0];
        const prepareData = {
          taxPayerAccNumber: screenDataObj?.taxPayerAccountNumber || '',
          salesTaxIdNumber: screenDataObj?.salesTaxIdentificationNumber || '',
          expectedTurnOverOne: screenDataObj?.expectedTurnover1
            ? screenDataObj?.expectedTurnover1.toString()
            : '',
          expectedTurnOverTwo: screenDataObj?.expectedTurnover2
            ? screenDataObj?.expectedTurnover2.toString()
            : '',
          expectedTurnOverThree: screenDataObj?.expectedTurnover3
            ? screenDataObj?.expectedTurnover3.toString()
            : '',
          totalPotentialTurnOver: screenDataObj?.totalPotential
            ? screenDataObj?.totalPotential.toString()
            : '',
          deliveryNoteType: screenDataObj?.deliveryNoteType || '',
          invoiceRhythm: screenDataObj?.invoiceRhythm || '',
          rekap: screenDataObj?.rekap || '',
          pdfInvoicing: screenDataObj?.pdfInvoicing || '',
          emailPdfInvoicing: screenDataObj?.emailForPdfInvoicing || '',
          paymentTerms: screenDataObj?.paymentTerms || '',
          paymentMethods: screenDataObj?.paymentMethod || '',
          taMinimumTurnoverExplained:
            screenDataObj?.taMinimumTurnoverExplained === '1' ? true : false,
        };

        setFinancialInfoInputData(prepareData);
      }
    } catch (error) {
      console.log('Error while pre populate Screen data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getMandatoryFieldsConfig = async () => {
    try {
      const mandatoryFieldsConfig =
        await PLFinancialInfoController.getMandatoryFieldsConfig();
      console.log('mandatoryFieldsConfig :>> ', mandatoryFieldsConfig);
      setMandatoryData(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const handleInputChange = (fieldName: string) => (value: any) => {
    if (numericFields.includes(fieldName)) {
      value = value.replace(/[^0-9]/g, '');
    }

    if (dropdownFields.includes(fieldName)) {
      setFinancialInfoInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.itemValue,
      }));
    } else if (dropdownValueFields.includes(fieldName)) {
      setFinancialInfoInputData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.discoveryListValuesId,
      }));
    } else {
      setFinancialInfoInputData((prevData: any) => ({
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
      taxPayerAccNumber: '',
      salesTaxIdNumber: '',
      expectedTurnOverOne: '',
      expectedTurnOverTwo: '',
      expectedTurnOverThree: '',
      deliveryNoteType: '',
      invoiceRhythm: '',
      rekap: '',
      pdfInvoicing: '',
      emailPdfInvoicing: '',
      paymentTerms: '',
      paymentMethods: '',
    });

    let isError = false;

    if (
      mandatoryData.taxPayerAccNumber &&
      financialInfoInputData.taxPayerAccNumber.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        taxPayerAccNumber: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.salesTaxIdNumber &&
      financialInfoInputData.salesTaxIdNumber.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        salesTaxIdNumber: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.expectedTurnOverOne &&
      financialInfoInputData.expectedTurnOverOne.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        expectedTurnOverOne: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.expectedTurnOverTwo &&
      financialInfoInputData.expectedTurnOverTwo.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        expectedTurnOverTwo: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.expectedTurnOverThree &&
      financialInfoInputData.expectedTurnOverThree.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        expectedTurnOverThree: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.emailPdfInvoicing &&
      financialInfoInputData.emailPdfInvoicing.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        emailPdfInvoicing: 'Required',
      }));
      isError = true;
    }

    if (
      financialInfoInputData.emailPdfInvoicing.trim() !== '' &&
      !validateEmail(financialInfoInputData.emailPdfInvoicing.trim())
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        emailPdfInvoicing: 'Invalid',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryNoteType &&
      financialInfoInputData.deliveryNoteType === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        deliveryNoteType: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.invoiceRhythm &&
      financialInfoInputData.invoiceRhythm === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        invoiceRhythm: 'Required',
      }));
      isError = true;
    }

    if (mandatoryData.rekap && financialInfoInputData.rekap === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        rekap: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.pdfInvoicing &&
      financialInfoInputData.pdfInvoicing === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        pdfInvoicing: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.paymentTerms &&
      financialInfoInputData.paymentTerms === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        paymentTerms: 'Required',
      }));
      isError = true;
    }

    if (
      mandatoryData.paymentMethods &&
      financialInfoInputData.paymentMethods === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        paymentMethods: 'Required',
      }));
      isError = true;
    }

    return !isError;
  };

  const handleSaveFinancialInfo = async () => {
    try {
      if (!validateInputs()) {
        return;
      }
      const isFinancialInfoCreated =
        await PLFinancialInfoController.insertOrUpdateFinancialInfo(
          financialInfoInputData,
        );
      console.log('isFinancialInfoCreated :>> ', isFinancialInfoCreated);
      toast.success({
        message: 'Changes saved successfully',
      });
      await ACLService.saveAclGuardStatusToStorage(false);
    } catch (error) {
      toast.error({
        message: 'Save failed',
      });
      console.log('Error while creating the financial info :>> ', error);
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
    <SafeAreaView style={tw('flex-1')}>
      <View flex>
        <ProspectLandingHeader
          fromPLP={true}
        />
        <View row flex>
          <PLLeftMenuComponent
            activeTab={PROSPECT_LANDING_SCREENS.FINANCIAL_INFO}
          />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <View flex marginR-v2 marginB-v2>
              <Card flex-1>
                <View
                  paddingH-v4
                  centerH
                  style={tw('flex-row justify-between mt-6')}>
                  <Text text18M textBlack>
                    Tax and Turnover
                  </Text>
                  {isEditable && (
                    <View row centerV>
                      <TouchableOpacity
                        style={tw('mr-6')}
                        onPress={handleCancel}>
                        <Text grey2 text13R>
                          {'Cancel'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw(
                          'bg-light-darkBlue rounded-md py-2 px-8 flex-row items-center ml-6',
                        )}
                        onPress={handleSaveFinancialInfo}>
                        <Text white text13R>
                          {'Save'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}>
                  <TaxAndTurnoverComponent
                    inputData={financialInfoInputData}
                    handleInputChange={handleInputChange}
                    handleSaveFinancialInfo={handleSaveFinancialInfo}
                    handleCancel={handleCancel}
                    handleTaMinimumTurnoverExplained={
                      handleTaMinimumTurnoverExplained
                    }
                    errorMessages={errorMessages}
                    isEditable={isEditable}
                    mandatoryData={mandatoryData}
                  />
                  <DeliveryAndInvoiceComponent
                    deliveryTypeDropdownData={deliveryTypeDropdownData}
                    invoiceRhythmDropdownData={invoiceRhythmDropdownData}
                    rekapDropdownData={rekapDropdownData}
                    pdfInvoicingDropdownData={pdfInvoicingDropdownData}
                    inputData={financialInfoInputData}
                    handleInputChange={handleInputChange}
                    errorMessages={errorMessages}
                    isEditable={isEditable}
                    mandatoryData={mandatoryData}
                  />
                  <PaymentInformationComponent
                    paymentTermsDropdownData={paymentTermsDropdownData}
                    paymentMethodsDropdownData={paymentMethodsDropdownData}
                    inputData={financialInfoInputData}
                    handleInputChange={handleInputChange}
                    errorMessages={errorMessages}
                    isEditable={isEditable}
                    mandatoryData={mandatoryData}
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

export default withAuthScreen(PLFinancialInfo, true);
