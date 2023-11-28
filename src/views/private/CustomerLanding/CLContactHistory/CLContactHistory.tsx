import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import { CUSTOMER_LANDING_SCREENS } from 'src/utils/Constant';
import Card from 'src/components/Card';
import CLContactHistoryPaginationComponent from 'src/components/CustomerLanding/CLContactHistory/CLContactHistoryPaginationComponent';
import CLContactHistoryCustomerComponent from 'src/components/CustomerLanding/CLContactHistory/CLContactHistoryCustomerComponent';
import CLContactHistoryController from 'src/controller/CLContactHistoryController';
import { CONTACT_HISTORY_DROPDOWN_VALUES } from 'src/utils/DropdownConst';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import Loader from 'src/components/Loader';
import ApiUtil from 'src/services/ApiUtil';
import { toast } from 'src/utils/Util';

const CLContactHistory = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0);
  const [start, setStart] = useState(1)
  const [end, setEnd] = useState(20)

  const [contactHistoryValue, setContactHistoryValue] = useState(CONTACT_HISTORY_DROPDOWN_VALUES.ALL_CONTACTS);
  const [message, setMessage] = useState("")

  const [showFullLoader, setShowFullLoader] = useState(false)
  const [showListLoader, setShowListLoader] = useState(false)
  const [isLeftActive, setIsLeftActive] = useState(true)
  const [isRightActive, setIsRightActive] = useState(true)

  const [contactHistoryData, setContactHistoryData] = useState([])

  // Showing the list loader and fetching data after checking the internet connection
  useEffect(() => {
    setShowListLoader(true)
    checkConnectionAndGetData()
  }, [pageNumber])

  // Showing the full loader and fetching data after checking the internet connection
  // useEffect(() => {
  //   setShowFullLoader(true)
  //   checkConnectionAndGetData()
  // }, [contactHistoryValue, isFlightModeEnabled, isDeviceOnline])

  useEffect(() => {
    // Setting the default values when the dropdown value is changed
    setShowFullLoader(true)
    setStart(1)
    setEnd(20)
    setPageNumber(1)
    checkConnectionAndGetData()
  }, [contactHistoryValue])

  // Setting the dropdown filters
  const handleContactHistoryDropdown = (item: any) => {
    setContactHistoryValue(item.value);
  };

  // Checking the flight mode and internet connection and fetching data
  const checkConnectionAndGetData = async () => {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

    if (!isOnline.status) {
      setShowFullLoader(false)
      setShowListLoader(false)
      setContactHistoryData([])
      setMessage(isOnline.errMsg)
      return;
    }

    setMessage("")
    getContactHistoryData()
  }

  // Fetching the contact history data and managing the icons visibility
  const getContactHistoryData = () => {
    CLContactHistoryController.getContactHistoryData(
      pageNumber,
      pageSize,
      contactHistoryValue === CONTACT_HISTORY_DROPDOWN_VALUES.ORDERS,
      contactHistoryValue === CONTACT_HISTORY_DROPDOWN_VALUES.VISITS,
    ).then((data) => {
      if (data.data.length === 0) {
        setContactHistoryData([])
        return
      }

      let contactHistoryData = data.data;

      // Hiding the left icon and setting the end value to total when page number is 1, i.e. first page
      if (pageNumber === 1) {
        setIsLeftActive(false)
        if (contactHistoryData.length < pageSize) {
          setEnd(contactHistoryData.length)
        }
      } else {
        setIsLeftActive(true)
      }

      // Hiding the right icon when data is less than page size i.e. last page
      if (contactHistoryData.length < pageSize) {
        setIsRightActive(false)
      } else {
        setIsRightActive(true)
      }

      // Setting the total value and contact history data
      setTotal(data.total)
      setContactHistoryData(contactHistoryData)

    }).catch((error) => {
      toast.error({
        message: 'Something went wrong',
      })
      console.log('error while fetching customer history data :>> ', error);
    }).finally(() => {
      setShowFullLoader(false)
      setShowListLoader(false)
    })
  }

  // Handling the previous pagination
  const onLeftIconPress = () => {
    let endCondition = end - start

    // Setting the end value to start if it is less than start
    if (endCondition < pageSize) {
      setEnd(start - 1)
    } else {
      setEnd(end - pageSize)
    }

    setStart(start - pageSize)
    setPageNumber(pageNumber - 1)

    // Disabling the left and right icons when data is loading for the pages
    setIsLeftActive(false)
    setIsRightActive(false)
  }

  // Handling the next pagination
  const onRightIconPress = () => {
    let endToSet = end + pageSize

    // Setting the end value to total if it is greater than total
    if (endToSet > total) {
      setEnd(total)
    }
    // Setting the end value to endToSet if it is less than total
    else {
      setEnd(endToSet)
    }

    setStart(start + pageSize)
    setPageNumber(pageNumber + 1)

    // Disabling the left and right icons when data is loading for the pages
    setIsLeftActive(false)
    setIsRightActive(false)
  }

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader />
      <View flex row>
        <CLLeftMenuComponent
          activeTab={CUSTOMER_LANDING_SCREENS.CONTACT_HISTORY}
        />
        <Card marginR-v2 marginB-v2 flex-1>
          {showFullLoader ?
            <CustomerLandingLoader />
            :
            <>
              {message === "" && <CLContactHistoryPaginationComponent
                totalCount={total}
                contactHistoryDropdownValue={contactHistoryValue}
                handleContactHistoryDropdown={handleContactHistoryDropdown}
                start={start}
                end={end}
                isLeftActive={isLeftActive}
                isRightActive={isRightActive}
                onLeftIconPress={onLeftIconPress}
                onRightIconPress={onRightIconPress}
                noDataFound={contactHistoryData.length === 0}
              />}
              {showListLoader ?
                <Loader size={"large"} color={ColourPalette.light.darkBlue} />
                : contactHistoryData.length > 0 ? <CLContactHistoryCustomerComponent data={contactHistoryData} /> :
                  <NoDataComponent title={message !== "" ? message : "No Data Found"} />
              }
            </>
          }
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default CLContactHistory;
