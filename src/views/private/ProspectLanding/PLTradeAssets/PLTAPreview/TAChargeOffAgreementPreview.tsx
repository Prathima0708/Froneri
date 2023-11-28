import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

import View from 'src/components/View';
import Card from 'src/components/Card';
import Text from 'src/components/Text';

import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';

import { tw } from 'src/tw';

import { removeLeadingZeroes } from 'src/utils/CommonUtil';
import { toast } from 'src/utils/Util';

import { images } from 'src/assets/Images';

import PLTradeAssetController from 'src/controller/PLTradeAssetController';
import { FlashList } from '@shopify/flash-list';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import TermsAndConditionsModal from 'src/components/ProspectLanding/PLTradeAssets/TermsAndConditionsModal';

const TAChargeOffAgreementPreview: FC = () => {
  const route = useRoute<any>()

  const [screenData, setScreenData] = useState({
    houseNumber: "",
    postalCode: "",
    city: "",
    street1: "",
    name3: "",
    name2: "",
    name1: "",
    customerNumber: "",
    agreementNumber: "",
    justification: ""
  })

  const [taChargeOffData, setTaChargeOffData] = useState([])
  const [isTermsAndConditionsModalVisible, setIsTermsAndConditionsModalVisible] = useState(false)
  const [termsAndConditionsFilePath, setTermsAndConditionsFilePath] = useState("")
  const [justification, setJustification] = useState("")

  const prospectInfoData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  useEffect(() => {
    getScreenData()
  }, [])

  const getScreenData = async () => {
    try {
      await getPreviewData()
      await getTermsAndConditionsFilePath()
    } catch (error) {
      console.log("error while fetching screen data", error)
      toast.error({
        message: "Something went wrong"
      })
    }
  }

  const getTermsAndConditionsFilePath = async () => {
    try {
      const abcClassification = prospectInfoData?.abcClassification ? prospectInfoData?.abcClassification : ""
      const fileData = await PLTradeAssetController.getTermsAndConditionsTemplateName(abcClassification, route.params?.isProspect)
      console.log('fileData :>> ', fileData);

      if (fileData.length > 0) {
        const filePath = fileData[0]?.templateName + ".pdf"
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
  }

  const getPreviewData = async () => {
    try {
      console.log('agreementNumber :>> ', route.params?.data?.agreementNumber);
      const tradeAssetPreviewData = await PLTradeAssetController.getTaChargeOffPreviewData(route.params?.data?.agreementNumber)
      console.log('tradeAssetChargeOffData in preview :>> ', tradeAssetPreviewData);

      if (tradeAssetPreviewData.prospectInfo.length > 0) {
        setScreenData((prevState) => ({
          ...prevState,
          ...tradeAssetPreviewData.prospectInfo[0]
        }))
      } else {
        setScreenData({
          houseNumber: "",
          postalCode: "",
          city: "",
          street1: "",
          name3: "",
          name2: "",
          name1: "",
          customerNumber: "",
          agreementNumber: "",
          justification: ""
        })
      }

      if (tradeAssetPreviewData.taChargeOffData.length > 0) {
        setTaChargeOffData(tradeAssetPreviewData.taChargeOffData)
      } else {
        setTaChargeOffData([])
      }

    } catch (error) {
      console.log('error while fetching prospect info :>> ', error);

      toast.error({
        message: "Something went wrong"
      })
      setScreenData({
        houseNumber: "",
        postalCode: "",
        city: "",
        street1: "",
        name3: "",
        name2: "",
        name1: "",
        customerNumber: "",
        agreementNumber: "",
        justification: ""
      })
      setTaChargeOffData([])
    }
  }

  const handleTermsAndConditionsModal = () => {
    setIsTermsAndConditionsModalVisible(true)
  }

  const handleTermsAndConditionsModalClose = () => {
    setIsTermsAndConditionsModalVisible(false)
  }

  return (
    <SafeAreaView style={tw('bg-light-lightGrey flex-1')}>
      <View flex>
        <ProspectLandingHeader />
        <View
          center
          row
          paddingV-v02
          style={[tw('relative bg-light-lightBlue3'), { bottom: 10 }]}>
          <Text text12R textBlack>
            Preview: Trade Assets Charge - Off Agreement
          </Text>
        </View>
        <Card flex-1 marginH-v2 marginB-v4 padding-v4>
          <ScrollView>
            <View flex-2 paddingT-v1 style={tw('border-light-darkBlue -my-8')}>
              <images.FroneriIcon width={100} height={100} />
            </View>
            <View marginT-v3 style={tw('bg-light-greyCloud h-px')} />
            <View flex>
              <View marginT-v3>
                <View row>
                  <Text textBlack text13M>
                    {'Customer Number: '}
                  </Text>
                  <Text textBlack text13R>
                    {screenData.customerNumber}
                  </Text>
                </View>
              </View>
              <View marginT-v3>
                <View row>
                  <Text textBlack text13M>
                    {'Agreement Number: '}
                  </Text>
                  <Text textBlack text13R>
                    {screenData.agreementNumber}
                  </Text>
                </View>
              </View>
              <View marginT-v3>
                {screenData.name1 && <Text textBlack text13M>
                  {screenData.name1}
                </Text>}
                {screenData.name2 && <Text textBlack text13M>
                  {screenData.name2}
                </Text>}
                {screenData.name3 && <Text textBlack text13M>
                  {screenData.name3}
                </Text>}
              </View>
              <View marginT-v3>
                <View row>
                  <Text textBlack text13M>
                    {'Address: '}
                  </Text>
                  <View row>
                    {screenData.street1 && screenData.street1.trim().length > 0 && <Text textBlack text13R>
                      {screenData.street1},
                    </Text>}
                    {screenData.houseNumber && screenData.houseNumber.trim().length > 0 && <Text textBlack text13R>
                      {screenData.houseNumber},
                    </Text>}
                    {screenData.postalCode && screenData.postalCode.trim().length > 0 && <Text textBlack text13R>
                      {screenData.postalCode}
                    </Text>}
                  </View>
                </View>
              </View>
              <Text textBlack text13R marginT-v05>
                {screenData.city}
              </Text>
            </View>
            <View
              flex
              marginB-v6>
              <Text text18M marginT-v9>
                {'TA Charge - Off'}
              </Text>
              <View
                flex
                marginT-v2
                paddingT-v2
                paddingB-v3
                style={tw(
                  'rounded-12px bg-light-white border-default border-light-lavendar',
                )}>
                <View marginH-v1 marginV-v1>
                  <View flex row paddingV-v1 style={tw('bg-light-white')}>
                    <View flex-4 style={tw('items-start ml-6')}>
                      <Text text13M textBlack>
                        {'Material Description'}
                      </Text>
                    </View>
                    <View flex style={tw('items-start mr-2')}>
                      <Text text13M textBlack>
                        {'Material Number'}
                      </Text>
                    </View>
                    <View flex-2 style={tw('items-center')}>
                      <Text text13M textBlack>
                        {'Serial Number'}
                      </Text>
                    </View>
                    <View flex style={tw('items-end')}>
                      <Text text13M textBlack>
                        {'Residual value'}
                      </Text>
                    </View>
                    <View flex-2 style={tw('items-end pr-8')}>
                      <Text text13M textBlack>
                        {'Construction Date'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  flex
                  marginH-v2
                  style={tw('bg-light-white')}>
                  <FlashList
                    data={taChargeOffData}
                    keyExtractor={(_: any, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      const description = item?.description ? item?.description : '--'
                      const materialNumber = item?.formattedMaterialNumber ? removeLeadingZeroes(item.formattedMaterialNumber.trim()) : '--';
                      const serialNumber = item?.serialNumber ? item?.serialNumber : '--'
                      const residualValue = item?.residualValue ? item?.residualValue : '--'
                      const constructionDate = item?.constructionDate ? item?.constructionDate : '--'

                      return (
                        <View>
                          <View flex row paddingV-v1 style={tw(index % 2 ? 'bg-light-white' : 'bg-light-offWhite')}>
                            <View flex-4 style={tw('items-start ml-6')}>
                              <Text text13R>{description}</Text>
                            </View>
                            <View flex style={tw('items-start mr-2')}>
                              <Text text13R textBlack>
                                {materialNumber}
                              </Text>
                            </View>
                            <View flex-2 style={tw('items-center')}>
                              <Text text13R textBlack>
                                {serialNumber}
                              </Text>
                            </View>
                            <View flex style={tw('items-end')}>
                              <Text text13R textBlack>
                                {residualValue}
                              </Text>
                            </View>
                            <View flex-2 style={tw('items-end pr-8')}>
                              <Text text13R textBlack>
                                {constructionDate}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )
                    }}
                    estimatedItemSize={65}
                  />
                </View>
              </View>
            </View>
            <View row flex marginT-v3>
              <Text flex text13BO>
                {'Notes:'}
              </Text>
              <Text flex-13 text13R>
                {screenData.justification}
              </Text>
            </View>
            <View flex marginT-v5>
              <TouchableOpacity onPress={handleTermsAndConditionsModal}>
                <Text flex-13 text12R style={tw('text-light-darkBlue')}>
                  {'Terms & Conditions'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>
      </View>
      <TermsAndConditionsModal
        isVisible={isTermsAndConditionsModalVisible}
        onCancelPress={handleTermsAndConditionsModalClose}
        filePath={termsAndConditionsFilePath}
      />
    </SafeAreaView>
  );
};

export default TAChargeOffAgreementPreview;
