import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React, {useEffect, useState} from 'react';
import {images} from 'src/assets/Images';
import {FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import {CUSTOMER_LANDING_SCREENS} from 'src/utils/Constant';
import Card from 'src/components/Card';
import RenderOrderHistory from 'src/components/CustomerLanding/CLOrderHistory/RenderOrderHistory';
import SearchOrdersModalComponent from 'src/components/CustomerLanding/CLOrderHistory/SearchOrdersModalComponent';

import CLOrderHistoryController from 'src/controller/CLOrderHistoryController';
import {RootState, useAppSelector} from 'src/reducers/hooks';
import ApiUtil from 'src/services/ApiUtil';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import CLProductStatisticsPaginationComponent from 'src/components/CustomerLanding/CLProductStatistics/CLProductStatisticsPaginationComponent';
import ListLoader from 'src/components/SkeletonUi/CustomerLanding/ListLoader';
import {toast} from 'src/utils/Util';

const CLOrderHistory = () => {
  // Order History states...
  const [loading, setLoading] = useState(false);
  const [OrderHistoryData, setOrderHistoryData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(20);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isSearchOrderModalVisible, setIsSearchOrderModalVisible] =
    useState(false);

  const [isLeftActive, setIsLeftActive] = useState(true);
  const [isRightActive, setIsRightActive] = useState(true);

  const [searchOrderObj, setSearchOrderObj] = useState({
    orderNumber: '',
    tessInternalNumber: '',
    purchaseOrderNumber: '',
    orderType: [],
    deliveryDateFrom: '',
    deliveryDateTo: '',
    orderedFrom: '',
    orderedTo: '',
  });
  const [orderTypeDropDown, setOrderTypeDropDown] = useState([]);

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  // ....

  useEffect(() => {
    handleOrderTypeDropDown();
    handleOrderHistory(isFilterApplied, searchOrderObj);
  }, []);

  useEffect(() => {
    setLoading(true);
    handleOrderHistory(isFilterApplied, searchOrderObj);
  }, [pageNumber]);

  // get Order Type dropdown values
  const handleOrderTypeDropDown = () => {
    CLOrderHistoryController.getOrderTypeDropDown()
      .then((res: any) => {
        setOrderTypeDropDown(res);
        console.log('getOrderTypeDropDown', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLOrderHistory.tsx ~ CLOrderHistory.getOrderTypeDropDown ~ error:',
          error,
        );
      });
  };

  // get order History
  const handleOrderHistory = async (
    isFilterApplied: boolean,
    searchOrderObj: any,
  ) => {
    const isRemoteCustomer = customerInfoData?.isCallApi
      ? customerInfoData?.isCallApi
      : false;
    if (isRemoteCustomer && !isFilterApplied) {
      setLoading(false);
      setOrderHistoryData([]);
      return;
    }
    setLoading(true);
    CLOrderHistoryController.getCustomerOrderHistory(
      isFilterApplied,
      pageNumber,
      pageSize,
      searchOrderObj,
    )
      .then(data => {
        console.log(
          'contact history data :>> ',
          data.results.length,
          data.total,
        );

        const orderHistoryData = data.results;

        // Hiding the left icon and setting the end value to total when page number is 1, i.e. first page
        if (pageNumber === 1) {
          setIsLeftActive(false);
          if (orderHistoryData.length < pageSize) {
            setEnd(orderHistoryData.length);
          } else {
            setEnd(pageSize);
          }
        } else {
          setIsLeftActive(true);
        }

        // Hiding the right icon when data is less than page size i.e. last page
        if (orderHistoryData.length < pageSize) {
          setIsRightActive(false);
        } else {
          setIsRightActive(true);
        }

        // Setting the total value and contact history data
        setTotal(data.total);
        setOrderHistoryData(orderHistoryData);
      })
      .catch(error => {
        toast.error({
          message: 'Unable to fetch order history',
        });
        console.log(
          '🚀 ~ file: CLOrderHistory.tsx ~ CLOrderHistory.getCustomerOrderHistory ~ error:',
          error,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearchOrder = async () => {
    const isRemoteCustomer = customerInfoData?.isCallApi
      ? customerInfoData?.isCallApi
      : false;
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (isRemoteCustomer && !isOnline.status) {
      console.log('isOnline.errMsg', isOnline.errMsg);
      toast.info({
        message: isOnline.errMsg,
      });
      return;
    }
    setIsSearchOrderModalVisible(!isSearchOrderModalVisible);
  };

  const handleFilterSearchOrders = (searchOrderObj: any) => {
    setSearchOrderObj(searchOrderObj);
    setIsFilterApplied(true);
    setIsSearchOrderModalVisible(false);
    setLoading(true);
    handleOrderHistory(true, searchOrderObj);
  };

  const handleClearSearch = () => {
    setSearchOrderObj({
      orderNumber: '',
      tessInternalNumber: '',
      purchaseOrderNumber: '',
      orderType: [],
      deliveryDateFrom: '',
      deliveryDateTo: '',
      orderedFrom: '',
      orderedTo: '',
    });
    setIsFilterApplied(false);
    setLoading(true);
    handleOrderHistory(false, searchOrderObj);
  };

  // Handling the previous pagination
  const onLeftIconPress = () => {
    let endCondition = end - start;

    // Setting the end value to start if it is less than start
    if (endCondition < pageSize) {
      setEnd(start - 1);
    } else {
      setEnd(end - pageSize);
    }

    setStart(start - pageSize);
    setPageNumber(pageNumber - 1);

    // Disabling the left and right icons when data is loading for the pages
    setIsLeftActive(false);
    setIsRightActive(false);
  };

  // Handling the next pagination
  const onRightIconPress = () => {
    let endToSet = end + pageSize;

    // Setting the end value to total if it is greater than total
    if (endToSet > total) {
      setEnd(total);
    }
    // Setting the end value to endToSet if it is less than total
    else {
      setEnd(endToSet);
    }

    setStart(start + pageSize);
    setPageNumber(pageNumber + 1);

    // Disabling the left and right icons when data is loading for the pages
    setIsLeftActive(false);
    setIsRightActive(false);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader />
      <View flex row>
        <CLLeftMenuComponent
          activeTab={CUSTOMER_LANDING_SCREENS.ORDER_HISTORY}
        />

        <Card flex-1 marginB-v2 marginR-v2 padding-v4>
          <View row centerV right>
            {isFilterApplied && (
              <TouchableOpacity
                style={tw('flex-row items-center p-2 mr-10')}
                onPress={handleClearSearch}>
                <images.LeftBlueArrowIcon />
                <Text text13R marginL-v2 style={tw('text-light-darkBlue')}>
                  Show Recent 5 Orders
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSearchOrder}
              style={tw(
                'rounded-md flex-row items-center bg-light-darkBlue py-2 px-10',
              )}>
              <images.SearchWhiteIcon />
              <Text text13R style={tw('text-light-white ml-1')}>
                Search Orders
              </Text>
            </TouchableOpacity>
          </View>

          <View flex>
            {OrderHistoryData.length != 0 ? (
              <View>
                {isFilterApplied && !loading ? (
                  <CLProductStatisticsPaginationComponent
                    totalCount={total}
                    start={start}
                    end={end}
                    isLeftActive={isLeftActive}
                    isRightActive={isRightActive}
                    onLeftIconPress={onLeftIconPress}
                    onRightIconPress={onRightIconPress}
                  />
                ) : (
                  <Text text13R grey2 marginB-v3>
                    {loading ? '' : 'Showing Recent 5 Orders'}
                  </Text>
                )}
              </View>
            ) : null}
            {loading ? (
              <ListLoader />
            ) : OrderHistoryData.length != 0 ? (
              <>
                <View row centerV paddingH-v4 paddingV-v2>
                  <Text text13M textBlack flex marginR-v2>
                    Creation Date
                  </Text>
                  <Text text13M textBlack flex marginR-v2>
                    Origin
                  </Text>
                  <Text text13M textBlack flex marginR-v2>
                    Employee
                  </Text>
                  <Text text13M textBlack flex marginR-v3>
                    Delivery Date
                  </Text>
                  <Text text13M textBlack flex marginR-v1>
                    Order#
                  </Text>
                  <Text
                    text13M
                    textBlack
                    flex-2
                    marginR-v2
                    style={tw('text-center')}>
                    Order Status
                  </Text>
                  <View right flex>
                    <Text text13M textBlack>
                      Net Amount
                    </Text>
                  </View>
                </View>
                <FlatList
                  data={OrderHistoryData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return (
                      <RenderOrderHistory
                        item={item}
                        index={index}
                        isFilterApplied={isFilterApplied}
                      />
                    );
                  }}
                />
              </>
            ) : (
              <NoDataComponent />
            )}
          </View>
        </Card>
      </View>
      {isSearchOrderModalVisible ? (
        <SearchOrdersModalComponent
          isModalVisible={isSearchOrderModalVisible}
          orderTypeDropDown={orderTypeDropDown}
          onPressCancel={handleSearchOrder}
          onPressSearchOrders={handleFilterSearchOrders}
          searchObjInitial={searchOrderObj}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default CLOrderHistory;
