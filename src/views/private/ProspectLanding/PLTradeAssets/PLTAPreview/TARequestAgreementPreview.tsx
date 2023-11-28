import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import PLTradeAssetController from 'src/controller/PLTradeAssetController';

import View from 'src/components/View';
import Card from 'src/components/Card';
import Text from 'src/components/Text';

import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';

import { toast } from 'src/utils/Util';

import { tw } from 'src/tw';

import { images } from 'src/assets/Images';
import TermsAndConditionsModal from 'src/components/ProspectLanding/PLTradeAssets/TermsAndConditionsModal';
import { RootState, useAppSelector } from 'src/reducers/hooks';

const TARequestAgreementPreview: FC = () => {
  const route = useRoute<any>()

  const [taWishPreviewData, setTaWishPreviewData] = useState<any>([])
  const [taTakeoverPreviewData, setTaTakeoverPreviewData] = useState([])
  const [isTermsAndConditionsModalVisible, setIsTermsAndConditionsModalVisible] = useState(false)
  const [termsAndConditionsFilePath, setTermsAndConditionsFilePath] = useState("")
  const [justification, setJustification] = useState("")

  const prospectInfoData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const [screenData, setScreenData] = useState({
    houseNumber: "",
    postalCode: "",
    addressStreet2: "",
    city: "",
    street1: "",
    name3: "",
    name2: "",
    deliveryFee: "",
    name1: "",
    customerNumber: "",
    agreementNumber: ""
  })

  useEffect(() => {
    getScreenData()
  }, [])


  const getScreenData = async () => {
    try {
      if (route.params?.isProspect) {
        await getProspectInfo()
      } else {
        await getCustomerInfo()
      }
      await getTaWishData()
      await getTaTakeoverData()
      await getTermsAndConditionsFilePath()
    } catch (error) {
      console.log("error while fetching screen data", error)
      toast.error({
        message: "Something went wrong"
      })
    }
  }

  const formatAndSetPreviewData = (previewData: any) => {
    if (previewData.length > 0) {
      const previewDataObj = previewData[0]
      setScreenData((prevData: any) => ({
        ...prevData,
        ...previewDataObj,
        agreementNumber: route.params?.data?.agreementNumber,
      }))
      return
    }

    setScreenData({
      houseNumber: "",
      postalCode: "",
      addressStreet2: "",
      city: "",
      street1: "",
      name3: "",
      name2: "",
      deliveryFee: "",
      name1: "",
      customerNumber: "",
      agreementNumber: ""
    })
  }

  const getTermsAndConditionsFilePath = async () => {
    try {
      console.log('abcClassification :>> ', prospectInfoData?.abcClassification);
      console.log('discoveryId :>> ', prospectInfoData?.discoveryId);
      console.log('customerShipTo :>> ', prospectInfoData?.customerShipTo);
      console.log('salesOrganization :>> ', prospectInfoData?.salesOrganization);
      console.log('distributionChannel :>> ', prospectInfoData?.distributionChannel);
      const fileData = await PLTradeAssetController.getTermsAndConditionsTemplateName(prospectInfoData, route.params?.isProspect)
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

  const getProspectInfo = async () => {
    try {
      console.log('Preview screen -> previous screen data :>> ', route.params?.data);
      const prospectPreviewData = await PLTradeAssetController.getTaRequestProspectAgreementPreview()
      console.log('prospectPreviewData :>> ', prospectPreviewData);

      formatAndSetPreviewData(prospectPreviewData)
    } catch (error) {
      console.log("error while fetching prospect info data :>>", error)
      toast.error({
        message: "Something went wrong"
      })
      setScreenData({
        houseNumber: "",
        postalCode: "",
        addressStreet2: "",
        city: "",
        street1: "",
        name3: "",
        name2: "",
        deliveryFee: "",
        name1: "",
        customerNumber: "",
        agreementNumber: ""
      })
    }
  }

  const getCustomerInfo = async () => {
    try {
      const customerPreviewData = await PLTradeAssetController.getTaRequestCustomerPreviewData()
      console.log('customerPreviewData :>> ', customerPreviewData);
      formatAndSetPreviewData(customerPreviewData)
    } catch (error) {
      console.log('error while fetching customer preview data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  }

  const getTaWishData = async () => {
    try {
      const taWishPreviewData = await PLTradeAssetController.getTradeAssetWishPreviewData(route.params?.data?.agreementNumber)
      console.log('taWishPreviewData :>> ', taWishPreviewData);

      if (taWishPreviewData.length > 0) {
        setTaWishPreviewData(taWishPreviewData)
        setJustification(taWishPreviewData[0]?.justification)
        return
      }

      setTaWishPreviewData([])
    } catch (error) {
      console.log('error while fetching preview ta wish data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setTaWishPreviewData([])
    }
  }

  const getTaTakeoverData = async () => {
    try {
      const taTakeoverPreviewData = await PLTradeAssetController.getTradeAssetTakeOverPreviewData(route.params?.data?.agreementNumber)
      console.log('taTakeoverPreviewData :>> ', taTakeoverPreviewData);

      if (taTakeoverPreviewData.length > 0) {
        setTaTakeoverPreviewData(taTakeoverPreviewData)
        setJustification(taTakeoverPreviewData[0]?.justification)
        return
      }

      setTaTakeoverPreviewData([])
    } catch (error) {
      console.log('error while fetching preview ta takeover data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setTaTakeoverPreviewData([])
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
            Preview: Trade Assets Request Agreement
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
                  <Text textBlack text13R>
                    {`${screenData.street1 ? screenData.street1.trim() : ""}, ${screenData.houseNumber}, ${screenData.postalCode}`}
                  </Text>
                </View>
              </View>
              <Text textBlack text13R marginT-v05>
                {screenData.city}
              </Text>
            </View>
            {taWishPreviewData.length > 0 && <View flex marginT-v9>
              <Text text18M>{'TA Wish'}</Text>
              <View
                flex
                marginT-v2
                paddingT-v2
                style={tw(
                  'rounded-12px bg-light-white border-default border-light-lavendar',
                )}>
                <View marginH-v2 marginV-v1>
                  <View flex row paddingV-v1 style={tw('bg-light-white')}>
                    <View flex-3 style={tw('items-start ml-2')}>
                      <Text text13M textBlack>
                        {'TA Description'}
                      </Text>
                    </View>
                    <View flex style={tw('items-start mr-2')}>
                      <Text text13M textBlack>
                        {'Material Number'}
                      </Text>
                    </View>
                    <View flex style={tw('items-start')}>
                      <Text text13M textBlack>
                        {'Design'}
                      </Text>
                    </View>
                    <View flex style={tw('items-center')}>
                      <Text text13M textBlack>
                        {'Quantity'}
                      </Text>
                    </View>
                    <View flex-2 style={tw('items-end')}>
                      <Text text13M textBlack>
                        {'Expected Turnover'}
                      </Text>
                    </View>
                    <View flex style={tw('items-end pr-8')}>
                      <Text text13M textBlack>
                        {'Price'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  flex
                  marginH-v2
                  marginB-v2
                  style={tw('bg-light-white')}>
                  <FlashList
                    data={taWishPreviewData}
                    keyExtractor={(_: any, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      const description = item?.taDescription ? item?.taDescription : '--'
                      const materialNumber = item?.materialNumber ? item?.materialNumber : '--'

                      return (
                        <View
                          flex
                          row
                          paddingV-v1
                          style={tw(index % 2 ? 'bg-light-white' : 'bg-light-offWhite')}>
                          <View flex-3 style={tw('items-start ml-2')}>
                            <Text text13R>
                              {description}
                            </Text>
                          </View>
                          <View flex style={tw('items-start mr-2')}>
                            <Text text13R>{materialNumber}</Text>
                          </View>
                          <View flex style={tw('items-start')}>
                            <Text text13R>{item?.design}</Text>
                          </View>
                          <View flex style={tw('items-center')}>
                            <Text text13R>{item?.quantity}</Text>
                          </View>
                          <View flex-2 style={tw('items-end')}>
                            <Text text13R>{item?.expectedTurnover}</Text>
                          </View>
                          <View flex style={tw('items-end pr-8')}>
                            <Text text13R>{item?.price}</Text>
                          </View>
                        </View>
                      )
                    }}
                    estimatedItemSize={65}
                  />
                </View>
              </View>
            </View>}
            {taTakeoverPreviewData.length > 0 && <View flex marginT-v9>
              <Text text18M>{'TA Takeover'}</Text>
              <View
                flex
                marginT-v4

                paddingT-v2
                style={tw(
                  'rounded-12px bg-light-white border-default border-light-lavendar',
                )}>
                <View marginB-v1>
                  <View flex row paddingV-v1 style={tw('bg-light-white')}>
                    <View flex-2 style={tw('items-start ml-6')}>
                      <Text text13M textBlack>
                        {'Prev. Cus. Ship To Number'}
                      </Text>
                    </View>
                    <View flex-3 style={tw('items-start mr-2')}>
                      <Text text13M textBlack>
                        {'Material Description'}
                      </Text>
                    </View>
                    <View flex style={tw('items-end')}>
                      <Text text13M textBlack>
                        {'Serial Number'}
                      </Text>
                    </View>
                    <View flex-2 style={tw('items-end')}>
                      <Text text13M textBlack>
                        {'Expected Turnover'}
                      </Text>
                    </View>
                    <View flex style={tw('items-end pr-8')}>
                      <Text text13M textBlack>
                        {'Price'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  flex
                  marginH-v2
                  marginB-v2
                  style={tw('bg-light-white')}>
                  <FlashList
                    data={taTakeoverPreviewData}
                    keyExtractor={(_: any, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      const description = item?.materialDescription ? item?.materialDescription : '--'
                      const expectedTurnover = item?.expectedTurnover ? item?.expectedTurnover : '--'
                      const previousCustomerShipTo = item?.previousCustomerShipTo ? item?.previousCustomerShipTo : '--'

                      return (
                        <View flex row paddingV-v1 style={tw(index % 2 ? 'bg-light-white' : 'bg-light-offWhite')}>
                          <View flex-2 style={tw('items-start ml-4')}>
                            <Text text13R>{previousCustomerShipTo}</Text>
                          </View>
                          <View flex-3 style={tw('items-start mr-2')}>
                            <Text text13R>
                              {description}
                            </Text>
                          </View>
                          <View flex style={tw('items-end')}>
                            <Text text13R>{item?.serialNumber}</Text>
                          </View>
                          <View flex-2 style={tw('items-end')}>
                            <Text text13R>{expectedTurnover}</Text>
                          </View>
                          <View flex style={tw('items-end pr-8')}>
                            <Text text13R>{item?.price}</Text>
                          </View>
                        </View>
                      )
                    }}
                    estimatedItemSize={100}
                  />
                </View>
              </View>
            </View>}
            <View row flex marginT-v9>
              <Text flex text13BO>
                {'Notes:'}
              </Text>
              <Text flex-13 text13R>
                {justification}
              </Text>
            </View>
            <View flex marginT-v5 style={tw('items-start')}>
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

export default TARequestAgreementPreview;
