import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import View from 'src/components/View';
import { tw } from 'src/tw';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import PLConditionAgreementController from 'src/controller/PLConditionAgreementController';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import { getOnlyDate } from 'src/utils/CommonUtil';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import TermsAndConditionsModal from 'src/components/ProspectLanding/PLTradeAssets/TermsAndConditionsModal';
import { toast } from 'src/utils/Util';

const PLCAPreview: FC = () => {
  const route = useRoute<any>();
  const [loading, setLoading] = useState(false);
  const [isTermsAndConditionsModalVisible, setIsTermsAndConditionsModalVisible] = useState(false)
  const [termsAndConditionsFilePath, setTermsAndConditionsFilePath] = useState("")

  const [conditionAgreementDetails, setConditionAgreementDetails] = useState({
    conditionAgreementNumber: '',
    customernumber: '',
    name1: '',
    name2: '',
    name3: '',
    street1: '',
    housenumber: '',
    postalcode: '',
    city: '',
    iceStartDate: '',
    iceEndDate: '',
    frozenfoodStartDate: '',
    frozenfoodEndDate: '',
    iceConditions: '',
    frozenfoodConditions: '',
    justification: '',
    expectedTurnover1: '',
    expectedTurnover2: '',
    expectedTurnover3: '',
  });

  useEffect(() => {
    getScreenData();
  }, []);

  const getScreenData = async () => {
    try {
      setLoading(true);
      await getConditionAgreementDetails();
      await getExpectedTurnOverDetails();
      await getTermsAndConditionsFilePath()

      setUpdateInitialInputsData();
    } catch (error) {
      console.log('error while fetching screen data :>> ', error);
    } finally {
      setLoading(false);
    }
  };

  const setUpdateInitialInputsData = () => {
    const previousScreenDataObj = route.params?.data;

    const preparedData = {
      conditionAgreementNumber:
        previousScreenDataObj?.conditionAgreementNumber ?? '',
      idContractType: previousScreenDataObj?.idContractType ?? '',
      creationDatetime: previousScreenDataObj?.creationDatetime ?? '',
      conditionsSignedDatetime:
        previousScreenDataObj?.conditionsSignedDatetime ?? '',
      createdBy: previousScreenDataObj?.createdBy ?? '',
      updatedBy: previousScreenDataObj?.updatedBy ?? '',
      updateDatetime: previousScreenDataObj?.updateDatetime ?? '',
      iceStartDate: previousScreenDataObj?.iceStartDate ? getOnlyDate(previousScreenDataObj?.iceStartDate) : '',
      iceEndDate: previousScreenDataObj?.iceEndDate ? getOnlyDate(previousScreenDataObj?.iceEndDate) : '',
      frozenfoodStartDate:
        previousScreenDataObj?.frozenfoodStartDate ? getOnlyDate(previousScreenDataObj?.frozenfoodStartDate) : '',
      frozenfoodEndDate:
        previousScreenDataObj?.frozenfoodEndDate ? getOnlyDate(previousScreenDataObj?.frozenfoodEndDate) : '',
      iceConditions: previousScreenDataObj?.iceConditions ?? '',
      frozenfoodConditions: previousScreenDataObj?.frozenfoodConditions ?? '',
      signatureCustomer: previousScreenDataObj?.signatureCustomer ?? '',
      signatureEmployee: previousScreenDataObj?.signatureEmployee ?? '',
      customerSigneeName: previousScreenDataObj?.customerSigneeName ?? '',
      employeeSigneeName: previousScreenDataObj?.employeeSigneeName ?? '',
      justification: previousScreenDataObj?.justification ?? '',
    };

    console.log('preparedData :>> ', preparedData);

    setConditionAgreementDetails((prevData: any) => ({
      ...prevData,
      ...preparedData,
    }));
  };

  const getTermsAndConditionsFilePath = async () => {
    try {
      const previousScreenDataObj = route.params?.data;
      const fileData = await PLConditionAgreementController.getTermsAndConditionsTemplateName(previousScreenDataObj?.idContractType)
      if (fileData.length > 0) {
        const filePath = fileData[0]?.templateName.replace(".xlsx", ".pdf")
        setTermsAndConditionsFilePath(filePath)
      } else {
        setTermsAndConditionsFilePath("")
      }

    } catch (error) {
      console.log('error while fetching file path :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  };

  const formatAndSetPreviewData = (previewData: any) => {
    if (previewData.length > 0) {
      const previewDataObj = previewData[0];
      setConditionAgreementDetails((prevData: any) => ({
        ...prevData,
        ...previewDataObj,
      }));
      return;
    }

    setConditionAgreementDetails({
      conditionAgreementNumber: '',
      customernumber: '',
      name1: '',
      name2: '',
      name3: '',
      street1: '',
      housenumber: '',
      postalcode: '',
      city: '',
      iceStartDate: '',
      iceEndDate: '',
      frozenfoodStartDate: '',
      frozenfoodEndDate: '',
      iceConditions: '',
      frozenfoodConditions: '',
      justification: '',
      expectedTurnover1: '',
      expectedTurnover2: '',
      expectedTurnover3: '',
    });
  };

  const getConditionAgreementDetails = async () => {
    //Fetching dropdown value for ca details
    try {
      const res = await PLConditionAgreementController.getConditionAgreementDetails()
      console.log('condition agreement res :>> ', res);
      formatAndSetPreviewData(res);
    } catch (err) {
      console.log('ca details err is', err);
    }
  };

  const getExpectedTurnOverDetails = async () => {
    try {
      const res = await PLConditionAgreementController.getConditionAgreementPreview()
      if (res.length > 0) {
        const screenData = res[0];
        const prepareObj = {
          expectedTurnover1: screenData?.expectedTurnover1.toString(),
          expectedTurnover2: screenData?.expectedTurnover2.toString(),
          expectedTurnover3: screenData?.expectedTurnover3.toString(),
        };
        setConditionAgreementDetails((prevData: any) => ({
          ...prevData,
          ...prepareObj,
        }));
      }
    } catch (err) {
      console.log('financial details err is', err);
    }
  };

  const handleTermsAndConditionsModal = () => {
    setIsTermsAndConditionsModalVisible(true)
  }

  const handleTermsAndConditionsModalClose = () => {
    setIsTermsAndConditionsModalVisible(false)
  }

  console.log('conditionAgreementDetails :>> ', conditionAgreementDetails);

  return (
    <SafeAreaView style={tw('bg-light-lightGrey flex-1')}>
      <View flex>
        <ProspectLandingHeader />
        <View style={tw('bg-light-lightBlue3 h-6 justify-center items-center')}>
          <Text text13R>{'Preview: Conditions Agreement'}</Text>
        </View>
        <View
          flex-1
          marginH-v4
          marginB-v4
          padding-v4
          marginT-v3
          style={tw('bg-light-white border-default border-light-lavendar')}>
          {loading ?
            <View flex center>
              <ActivityIndicator size={'large'} color={ColourPalette.light.black} />
            </View>
            : <ScrollView>
              <View flex>
                <View flex-2 paddingT-v1 style={tw('border-light-darkBlue -my-8')}>
                  <images.FroneriIcon width={100} height={100} />
                </View>
                <View marginT-v3 style={tw('bg-light-greyCloud h-px')} />
                <View marginT-v3 row>
                  <Text textBlack text13M>
                    {'Customer Number:'}
                  </Text>
                  <Text textBlack text13R marginT-v05 marginL-v02>
                    {conditionAgreementDetails.customernumber}
                  </Text>
                </View>
                <View marginT-v3 row>
                  <Text textBlack text13M>
                    {'Agreement Number:'}
                  </Text>
                  <Text textBlack text13R marginT-v05 marginL-v02>
                    {conditionAgreementDetails.conditionAgreementNumber}
                  </Text>
                </View>
                <View marginT-v3 style={tw('w-40')}>
                  <View marginT-v01>
                    <Text textBlack text13M>
                      {conditionAgreementDetails.name1}
                    </Text>
                  </View>
                  {conditionAgreementDetails.name2 && (
                    <View marginT-v01>
                      <Text textBlack text13M>
                        {conditionAgreementDetails.name2}
                      </Text>
                    </View>
                  )}
                  {conditionAgreementDetails.name3 && conditionAgreementDetails.name3.trim() && <View marginT-v01>
                    <Text textBlack text13M>
                      {conditionAgreementDetails.name3}
                    </Text>
                  </View>}
                </View>
                <View marginT-v3 row>
                  <Text textBlack text13M>
                    {'Address:'}
                  </Text>
                  <Text textBlack text13R marginT-v05 marginL-v02>
                    {`${conditionAgreementDetails.street1} ${conditionAgreementDetails.housenumber} ${conditionAgreementDetails.postalcode} ${conditionAgreementDetails.city}`}
                  </Text>
                </View>
                <View marginT-v8>
                  <Text textBlack text18BO>
                    {'ICE Conditions'}
                  </Text>
                  <View row flex marginT-v3>
                    <Text textBlack text13M>
                      {'Start Date:'}
                    </Text>
                    <Text textBlack text13R marginL-v02>
                      {conditionAgreementDetails.iceStartDate}
                    </Text>
                  </View>
                  <View row flex marginT-v1>
                    <Text textBlack text13M>
                      {'End Date:'}
                    </Text>
                    <Text textBlack text13R marginL-v02>
                      {conditionAgreementDetails.iceEndDate}
                    </Text>
                  </View>
                  <View row flex marginT-v3>
                    <Text textBlack text13M>
                      {'Expected Turnover 1:'}
                    </Text>
                    <Text textBlack text13R marginL-v02>
                      {conditionAgreementDetails.expectedTurnover1}
                    </Text>
                  </View>
                  <View flex marginT-v3 row>
                    <Text text13BO>{`${'Conditions: '}`}</Text>
                    <Text text13R>{conditionAgreementDetails.iceConditions}</Text>
                  </View>
                </View>
                <View marginT-v8>
                  <View>
                    <Text textBlack text18BO>
                      {'Frozen Conditions'}
                    </Text>
                    <View row flex marginT-v3>
                      <Text textBlack text13M>
                        {'Start Date:'}
                      </Text>
                      <Text textBlack text13R marginL-v02>
                        {conditionAgreementDetails.frozenfoodStartDate}
                      </Text>
                    </View>
                    <View row flex marginT-v1>
                      <Text textBlack text13M>
                        {'End Date:'}
                      </Text>
                      <Text textBlack text13R marginL-v02>
                        {conditionAgreementDetails.frozenfoodEndDate}
                      </Text>
                    </View>
                    <View row flex marginT-v3>
                      <Text textBlack text13M>
                        {'Expected Turnover 2:'}
                      </Text>
                      <Text textBlack text13R marginL-v02>
                        {conditionAgreementDetails.expectedTurnover2}
                      </Text>
                    </View>
                    <View row flex marginT-v1>
                      <Text textBlack text13M>
                        {'Expected Turnover 3:'}
                      </Text>
                      <Text textBlack text13R marginL-v02>
                        {conditionAgreementDetails.expectedTurnover3}
                      </Text>
                    </View>

                    <View flex marginT-v3 row>
                      <Text text13BO>{`${'Conditions: '}`}</Text>
                      <Text text13R>
                        {conditionAgreementDetails.frozenfoodConditions}
                      </Text>
                    </View>
                  </View>
                  <View flex marginT-v7 row>
                    <Text text13BO>{'Notes: '}</Text>
                    <Text text13R>{conditionAgreementDetails.justification}</Text>
                  </View>
                  <View flex marginT-v5 style={tw('items-start')}>
                    <TouchableOpacity onPress={handleTermsAndConditionsModal}>
                      <Text flex-13 text12R style={tw('text-light-darkBlue')}>
                        {'Terms & Conditions'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>}
        </View>
      </View>
      <TermsAndConditionsModal
        isVisible={isTermsAndConditionsModalVisible}
        onCancelPress={handleTermsAndConditionsModalClose}
        filePath={termsAndConditionsFilePath}
      />
    </SafeAreaView>
  );
};

export default PLCAPreview;
