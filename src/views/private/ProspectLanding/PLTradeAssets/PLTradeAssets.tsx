import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import View from 'src/components/View';
import Card from 'src/components/Card';

import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import TATabComponent from 'src/components/ProspectLanding/PLTradeAssets/TATabComponent';
import TATitleHeaderComponent from 'src/components/ProspectLanding/PLTradeAssets/TATitleHeaderComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import NoDataComponent from 'src/components/Common/NoDataComponent';

import { tw } from 'src/tw';

import { PROSPECT_LANDING_SCREENS, TA_TAB_TYPES } from 'src/utils/Constant';
import { toast } from 'src/utils/Util';

import { pageNamePLTradeAssets } from 'src/routes/Routes';

import PLTradeAssetController from 'src/controller/PLTradeAssetController';
import { withAuthScreen } from 'src/hoc/withAuthScreen';

const PLTradeAssets = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [taSelectedValue, setTaSelectedValue] = useState(TA_TAB_TYPES.ALL);

  const [taListingData, setTaListingData] = useState([])
  const [taRequestData, setTaRequestData] = useState([])
  const [taChargeOffData, setTaChargeOffData] = useState([])

  useEffect(() => {
    getScreenData()
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScreenData()
    })

    return unsubscribe
  }, []);

  const getScreenData = async () => {
    try {
      setLoading(true)
      await getTAListingData()
    } catch (error) {
      console.log('error while fetching screen data :>> ', error);
    } finally {
      setLoading(false)
    }
  }

  const getTAListingData = async () => {
    try {
      const taListingData = await PLTradeAssetController.getTAListing()
      console.log('TA listing data :>> ', taListingData.length, taListingData);

      if (taListingData.length > 0) {
        const taRequestData = taListingData.filter((data: any) => data.taProcess === '1')
        const taChargeOffData = taListingData.filter((data: any) => data.taProcess === '2')

        setTaListingData(taListingData)
        setTaRequestData(taRequestData)
        setTaChargeOffData(taChargeOffData)
      } else {
        setTaListingData([])
        setTaRequestData([])
        setTaChargeOffData([])
      }
    } catch (error) {
      console.log('error while fetching TA listing data :>> ', error);

      toast.error({
        message: "Something went wrong"
      })
      setTaListingData([])
      setTaRequestData([])
      setTaChargeOffData([])
    }
  }

  const handlePDSelectedValue = (data: string) => {
    setTaSelectedValue(data);
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <View flex>
        <ProspectLandingHeader screen={pageNamePLTradeAssets}
          fromPLP={true}
        />
        <View row flex>
          <PLLeftMenuComponent
            activeTab={PROSPECT_LANDING_SCREENS.TRADE_ASSET}
          />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <Card flex-1 marginH-v2 marginB-v2 padding-v4>
              {taListingData.length > 0 ? <View flex>
                <View>
                  <TATabComponent
                    handleChangeTab={handlePDSelectedValue}
                    taSelectedValue={taSelectedValue}
                  />
                </View>
                <View flex>
                  {taSelectedValue === TA_TAB_TYPES.ALL && (
                    <TATitleHeaderComponent taListingData={taListingData} tabTitle={TA_TAB_TYPES.ALL} />
                  )}
                  {taSelectedValue === TA_TAB_TYPES.TA_REQUEST && <TATitleHeaderComponent taListingData={taRequestData} tabTitle={TA_TAB_TYPES.TA_REQUEST} />}
                  {taSelectedValue === TA_TAB_TYPES.TA_CHARGE_OFF && (
                    <TATitleHeaderComponent taListingData={taChargeOffData} tabTitle={TA_TAB_TYPES.TA_CHARGE_OFF} />
                  )}
                </View>
              </View> : <View flex>
                <NoDataComponent title={'No Agreements Created'} subTitle='Please Create Agreement' />
              </View>}
            </Card>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withAuthScreen(PLTradeAssets, true);
