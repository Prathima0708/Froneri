import View from 'src/components/View';
import {tw} from 'src/tw';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import {CUSTOMER_LANDING_SCREENS} from 'src/utils/Constant';
import Card from 'src/components/Card';
import TATopBarComponent from 'src/components/CustomerLanding/CLTradeAssets/TATopBarComponent';
import TAProfitabilityComponent from 'src/components/CustomerLanding/CLTradeAssets/TAProfitabilityComponent';
import TADetailsComponent from 'src/components/CustomerLanding/CLTradeAssets/TADetailsComponent';
import CLTradeAssetController from 'src/controller/CLTradeAssetController';
import {RootState, useAppSelector} from 'src/reducers/hooks';
import ApiUtil from 'src/services/ApiUtil';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';

const CLTradeAsset = () => {
  // Trade assets states..
  const [loading, setLoading] = useState(false);
  const [tradeAssetsData, setTradeAssetsData] = useState([]);
  const [taProfitabilityData, setTAProfitabilityData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );
  // ....

  useEffect(() => {
    handleTradeAssets();
  }, []);

  const handleTradeAssets = async () => {
    setLoading(true);
    // getMaterialInformation();
    /**
     * check customer is remote customer or not, if yes check the app status
     */
    const isRemoteCustomer = customerInfoData?.isCallApi
      ? customerInfoData?.isCallApi
      : false;
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (isRemoteCustomer && !isOnline.status) {
      console.log('isOnline.errMsg', isOnline.errMsg);
      setErrorMsg(isOnline.errMsg);
      setLoading(false);
      return;
    }
    // call offline / online api
    getCustomerTradeAssets();
    getTradeAssetsProfitability();
  };

  // get customer trade assets
  const getCustomerTradeAssets = async () => {
    CLTradeAssetController.getCustomerTradeAssets()
      .then(res => {
        console.log('getCustomerTradeAssets', res);
        setTradeAssetsData(res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLTradeAsset.tsx:28 ~ CLTradeAsset.getCustomerTradeAssets ~ error:',
          error,
        );
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  // get customer trade assets Profitability
  const getTradeAssetsProfitability = async () => {
    CLTradeAssetController.getTradeAssetsProfitability()
      .then(res => {
        console.log('getTradeAssetsProfitability', res);
        setTAProfitabilityData(res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLTradeAsset.tsx:28 ~ CLTradeAsset.getTradeAssetsProfitability ~ error:',
          error,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // get material information
  const getMaterialInformation = async () => {
    CLTradeAssetController.getMaterialInfoWebPageLink()
      .then(res => {
        console.log('getMaterialInfoWebPageLink', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLTradeAsset.tsx:28 ~ CLTradeAsset.getMaterialInfoWebPageLink ~ error:',
          error,
        );
      })
      .finally(() => {});
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader />
      <View flex row>
        <CLLeftMenuComponent activeTab={CUSTOMER_LANDING_SCREENS.TRADE_ASSET} />
        <Card flex-1 marginB-v2 marginR-v2>
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <View flex>
              <TATopBarComponent />
              {tradeAssetsData.length === 0 &&
              taProfitabilityData.length === 0 ? (
                <NoDataComponent
                  title={errorMsg != '' ? errorMsg : 'No Data'}
                />
              ) : (
                <View flex>
                  <TAProfitabilityComponent
                    taProfitabilityData={taProfitabilityData}
                  />
                  <TADetailsComponent tradeAssetsData={tradeAssetsData} />
                </View>
              )}
            </View>
          )}
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default CLTradeAsset;
