import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import {
  CUSTOMER_LANDING_SCREENS,
  MONTH_DATA,
  TURNOVER_TYPES,
} from 'src/utils/Constant';
import Card from 'src/components/Card';
import { images } from 'src/assets/Images';
import TurnoverTopTabComponent from 'src/components/CustomerLanding/CLTurnover/TurnoverTopTabComponent';
import TurnoverDetailsComponent from 'src/components/CustomerLanding/CLTurnover/TurnoverDetailsComponent';
import MonthlyTurnoverComponent from 'src/components/CustomerLanding/CLTurnover/MonthlyTurnoverComponent';
import Last10DeliveriesComponent from 'src/components/CustomerLanding/CLTurnover/Last10DeliveriesComponent';
import { useNavigation } from '@react-navigation/native';
import { pageNameCLProductStatistics } from 'src/routes/Routes';
import CLTurnoverController from 'src/controller/CLTurnoverController';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import ApiUtil from 'src/services/ApiUtil';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import { toast } from 'src/utils/Util';

const CLTurnover = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(TURNOVER_TYPES[0].title);
  const [message, setMessage] = useState<string>('');
  const [turnoverDropdown, setTurnoverDropdown] = useState([]);
  const [headerData, setHeaderData] = useState<any>([]);
  const [turnoverDetails, setTurnoverDetails] = useState([]);
  const [turnoverSummaryData, setTurnoverSummaryData] = useState<any>([]);
  const [monthlyTurnoverData, setMonthlyTurnoverData] = useState<any>([]);
  const [last10DeliveriesDataHeader, setLast10DeliveriesDataHeader] =
    useState<any>([]);
  const [last10DeliveriesData, setLast10DeliveriesData] = useState<any>([]);

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  useEffect(() => {
    checkConnectionAndGetData();
  }, []);

  const checkConnectionAndGetData = async () => {
    setLoading(true);
    if (customerInfoData.isCallApi) {
      const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

      if (!isOnline.status) {
        setLoading(false);
        setMessage(isOnline.errMsg);
        return;
      }

      setMessage('');
      getTurnoverData();
    } else {
      getTurnoverData();
    }
  };

  const getTurnoverData = async () => {
    try {
      setLoading(true);
      await getTurnoverDropdown();
      await getTurnoverSummaryData();
      await getTurnoverDetailsData();
      await getMonthlyTurnoverData();
      await getLast10Deliveries();
    } catch (error) {
      console.log('error while fetching turnover data :>> ', error);
    } finally {
      setLoading(false);
    }
  };

  const getTurnoverDropdown = async () => {
    try {
      const res = await CLTurnoverController.getTurnoverGroupDropdown()
      console.log('Turnover group dropdown data :>> ', res);
      if (res.length === 0) {
        return;
      }

      let headersData = [
        ...res,
        {
          idTurnoverGroup: res.length,
          descriptionLanguage: 'Cumulative',
        },
      ];

      headersData = headersData.slice(1, headersData.length);

      setTurnoverDropdown(res);
      setHeaderData(headersData);

    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      })
      console.log('getTurnoverGroupDropdown error----->', error);
    }
  };

  const getTurnoverSummaryData = async () => {
    try {
      const turnoverData = await CLTurnoverController.getTurnoverSummary()
      console.log('Turnover summary data :>> ', turnoverData);
      setTurnoverSummaryData(turnoverData);
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      })
      console.log('Turnover summary data :>>', error);
    }

  };

  const getTurnoverDetailsData = async () => {
    try {
      const turnoverDetailsData = await CLTurnoverController.getAllTurnoverDetails()
      console.log(
        'Turnover details data :>>',
        turnoverDetailsData,
      );
      if (turnoverDetailsData.length > 0) {
        setTurnoverDetails(turnoverDetailsData);
      }

    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      })
      console.log('error while fetching turnover details data :>>', error);
    }
  };

  const getMonthlyTurnoverData = async () => {
    try {
      const monthlyTurnoverData = await CLTurnoverController.getMonthlyTurnover()
      console.log(
        'Monthly turnover data :>>',
        monthlyTurnoverData.length,
        monthlyTurnoverData,
      );

      if (monthlyTurnoverData.length > 0) {
        setMonthlyTurnoverData(monthlyTurnoverData);
      } else {
        const newMonthData = JSON.parse(JSON.stringify(MONTH_DATA));
        newMonthData.push({
          id: MONTH_DATA.length + 1,
          title: 'Total',
        });
        setMonthlyTurnoverData(newMonthData);
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      })
      console.log('error while fetching monthly turnover data :>>', error);
    }
  };

  const getLast10Deliveries = async () => {
    try {
      const last10Deliveries = await CLTurnoverController.getLast10Deliveries()
      console.log(
        'last10Deliveries Header data :>>',
        last10Deliveries[0].length,
      );

      if (last10Deliveries[0].length > 0) {
        setLast10DeliveriesDataHeader(last10Deliveries[0]);
      }
      if (last10Deliveries[1].length > 0) {
        setLast10DeliveriesData(last10Deliveries[1]);
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      })
      console.log('error while fetching last10Deliveries data :>>', error);
    }
  };

  const handleTurnoverSelectedValue = (data: string) => {
    setActiveTab(data);
  };

  const handleProductStatistics = async () => {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

    if (!isOnline.status) {
      toast.info({
        message: isOnline.errMsg,
      })
      return;
    }
    navigation.navigate(pageNameCLProductStatistics as never);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader message={message} />
      <View flex row>
        <CLLeftMenuComponent activeTab={CUSTOMER_LANDING_SCREENS.TURNOVER} />
        {loading ? (
          <CustomerLandingLoader />
        ) : (
          <Card flex-1 marginB-v2 marginR-v2 padding-v4>
            <View row centerV spread>
              <TurnoverTopTabComponent
                handleChangeTab={handleTurnoverSelectedValue}
                turnoverSelectedValue={activeTab}
              />
              <TouchableOpacity
                onPress={handleProductStatistics}
                style={tw(
                  'rounded-md flex-row items-center bg-light-darkBlue py-2 px-10',
                )}>
                <images.StatisticsIcon />
                <Text text13R style={tw('text-light-white ml-1')} marginL-v1>
                  Product Statistics
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab === TURNOVER_TYPES[0].title ? (
              turnoverDetails.length > 0 || turnoverSummaryData.length > 0 ? (
                <TurnoverDetailsComponent
                  dropDownData={turnoverDropdown}
                  turnoverData={turnoverDetails}
                  turnoverSummaryData={turnoverSummaryData}
                />
              ) : (
                <NoDataComponent
                  title={
                    message === '' ? 'No data for turnover details' : message
                  }
                />
              )
            ) : activeTab === TURNOVER_TYPES[1].title ? (
              headerData.length > 1 ? (
                <MonthlyTurnoverComponent
                  headerData={headerData}
                  monthlyTurnoverData={
                    monthlyTurnoverData.length === 0 ? [] : monthlyTurnoverData
                  }
                />
              ) : (
                <NoDataComponent
                  title={
                    message === '' ? 'No data for monthly turnover' : message
                  }
                />
              )
            ) : last10DeliveriesData.length > 0 ? (
              <Last10DeliveriesComponent
                dropDownData={turnoverDropdown}
                last10DeliveriesDataHeader={last10DeliveriesDataHeader}
                last10DeliveriesData={last10DeliveriesData}
              />
            ) : (
              <NoDataComponent
                title={
                  message === '' ? 'No data for last 10 deliveries' : message
                }
              />
            )}
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CLTurnover;
