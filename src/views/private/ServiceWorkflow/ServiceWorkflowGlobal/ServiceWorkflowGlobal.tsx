import React, { useEffect, useState, useContext, FC } from 'react';
import { ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import Card from 'src/components/Card';
import ServiceWorkflowHeader from 'src/components/Header/ServiceWorkflowHeader';
import PaginationHeader from 'src/components/CustomerSearch/PaginationHeader';
import FilterComponent from 'src/components/CustomerSearch/FilterComponent';
import SWListingComponent from 'src/components/ServiceWorkflow/ServiceWorkflowGlobal/SWListingComponent';
import SWFilterModal from 'src/components/ServiceWorkflow/ServiceWorkflowGlobal/SWFilterModal';
import SWListingHeaderComponent from 'src/components/ServiceWorkflow/ServiceWorkflowGlobal/SWListingHeaderComponent';
import SWTopTabComponent from 'src/components/ServiceWorkflow/ServiceWorkflowGlobal/SWTopTabComponent';
import NoDataComponent from 'src/components/Common/NoDataComponent';

import { tw } from 'src/tw';

import { ColourPalette } from 'src/styles/config/ColoursStyles';

import { SERVICE_WORKFLOW } from 'src/utils/Constant';
import { toast } from 'src/utils/Util';

import { AppContext } from 'src/provider/AppProvider';

import { images } from 'src/assets/Images';

import ServiceWorkflowController from 'src/controller/ServiceWorkflowController';

const ServiceWorkflowGlobal: FC = () => {
  const navigation = useNavigation();
  const { theme } = useContext(AppContext);

  const limit = 20;

  const [serviceWorkflowListingData, setServiceWorkflowListingData] =
    useState<any>([]);

  const [statusType, setStatusType] = useState(SERVICE_WORKFLOW.TODO);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useState(false);
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(limit);
  const [showResetFilterOption, setShowResetFilterOption] = useState(false);

  const [filterObj, setFilterObj] = useState<any>({
    name: '',
    requestType: [],
    assignedTo: [],
    createdFrom: '',
    createdTill: '',
    requestedFrom: '',
    requestedTill: '',
  });

  useEffect(() => {
    handleSearch(start, statusType, filterObj);
  }, [start, statusType]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleSearch(start, statusType, filterObj);
    });

    return unsubscribe;
  }, [start, statusType, filterObj]);

  useEffect(() => {
    handleResetFilterVisibility();
  }, [filterObj]);

  const handleResetFilterVisibility = () => {
    let showResetFilter = false;
    for (const key in filterObj) {
      const element = filterObj[key];
      if (element.toString().length > 0) {
        showResetFilter = true;
        break;
      }
    }
    setShowResetFilterOption(showResetFilter);
  };

  // handle search code
  const handleSearch = async (
    start: number,
    statusType: string,
    filterObj: any = {},
  ) => {
    try {
      setListLoading(true);
      const listingData =
        await ServiceWorkflowController.getServiceWorkflowListing(
          start,
          limit,
          statusType,
          filterObj,
        );
      console.log(
        'listingData :>> ',
        listingData.totalCount,
        listingData.results,
      );
      const res = listingData.results;

      if (start === 0) {
        setIsLeftButtonDisabled(true);
      } else {
        setIsLeftButtonDisabled(false);
      }

      if (res.length < limit) {
        setEnd(start + res.length);
        setIsRightButtonDisabled(true);
      } else {
        setEnd(start + limit);
        setIsRightButtonDisabled(false);
      }

      setServiceWorkflowListingData(listingData.results);
      setTotalCount(listingData.totalCount);
    } catch (error) {
      console.log('error while fetching service workflow listing :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setServiceWorkflowListingData([]);
      setTotalCount(0);
      setIsLeftButtonDisabled(true);
      setIsRightButtonDisabled(true);
      setEnd(0);
    } finally {
      setListLoading(false);
    }
  };

  // Setting the calendar filter when pressing on top tab
  const changeCalendarFilter = (data: string) => {
    setStatusType(data);
  };

  const handleFilterModalVisible = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const handleAdvanceSearch = (filterSelected: any) => {
    const filterObject = {
      ...filterObj,
      ...filterSelected,
    };

    setFilterObj(filterObject);
    setFilterModalVisible(false);
    setStart(0);
    setEnd(limit);
    handleSearch(0, statusType, filterObject);
  };

  const resetFilterPress = () => {
    const filterObject = {
      name: '',
      requestType: [],
      assignedTo: [],
      createdFrom: '',
      createdTill: '',
      requestedFrom: '',
      requestedTill: '',
    };

    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      ...filterObject,
    }));
    setStatusType(SERVICE_WORKFLOW.TODO);
    setStart(0);
    setEnd(limit);
    handleSearch(0, statusType, filterObject);
  };

  const handleLeftIconPress = () => {
    setListLoading(true);

    if (start === 0) {
      return;
    }

    setStart((prevStart: number) => prevStart - limit);
    setEnd((prevEnd: number) => prevEnd - limit);

    setListLoading(false);
  };

  const handleRightIconPress = () => {
    setListLoading(true);

    setStart((prevStart: number) => prevStart + limit);
    setEnd((prevEnd: number) => prevEnd + limit);

    setListLoading(false);
  };

  const handleClipFilterDismiss = (filterObj: any) => {
    setFilterObj(filterObj);
    handleSearch(0, statusType, filterObj);
  };

  const renderContent = () => {
    if (listLoading) {
      return (
        <ActivityIndicator
          size={'large'}
          color={ColourPalette.light.black}
          style={tw('flex-1')}
        />
      );
    } else if (serviceWorkflowListingData.length > 0) {
      return (
        <View
          flex
          style={tw(
            'bg-light-white border-default border-light-lavendar rounded-md',
          )}>
          <SWListingHeaderComponent />
          <FlashList
            data={serviceWorkflowListingData}
            keyExtractor={(_: any, index) => index?.toString()}
            renderItem={({ item, index }) => {
              return (
                <SWListingComponent
                  item={item}
                  index={index}
                  lastItem={serviceWorkflowListingData.length - 1 === index}
                />
              );
            }}
            estimatedItemSize={59}
          />
        </View>
      );
    } else {
      return <NoDataComponent />;
    }
  };

  return (
    <View flex style={tw('bg-light-lightGrey')}>
      <ServiceWorkflowHeader />
      <SafeAreaView style={tw('flex-1 pr-6 pl-6  pb-6  ')}>
        <View
          center
          width={'100%'}
          style={tw(`flex-1 bg-${theme}-white rounded-12px `)}>
          <Card
            flex-1
            marginH-v2
            marginB-v3
            padding-v02
            cardStyle={tw('mt-10px flex-row')}>
            <View flex-7>
              <View row spread centerH>
                <SWTopTabComponent
                  handleChangeCalendarFilter={(data: string) => {
                    changeCalendarFilter(data);
                  }}
                  calendarFilterValue={statusType}
                />
                <View row centerV>
                  {showResetFilterOption ? (
                    <TouchableOpacity
                      style={tw('p-2 ')}
                      onPress={resetFilterPress}>
                      <Text darkBlue text13R style={tw('mr-30px')}>
                        Reset Filter
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={tw(
                      'p-2 border-default rounded-md border-light-lavendar',
                    )}
                    onPress={handleFilterModalVisible}>
                    <images.FilterIcon />
                  </TouchableOpacity>
                </View>
              </View>

              <FilterComponent
                filterObj={filterObj}
                handleClipFilterDismiss={handleClipFilterDismiss}
              />

              {!listLoading && serviceWorkflowListingData.length > 0 && (
                <PaginationHeader
                  currentPage={`${start + 1}`}
                  totalPages={`${end}`}
                  totalCustomers={`${totalCount}`}
                  isLeftButtonDisabled={isLeftButtonDisabled}
                  isRightButtonDisabled={isRightButtonDisabled}
                  handleLeftIconPress={handleLeftIconPress}
                  handleRightIconPress={handleRightIconPress}
                />
              )}
              <View marginT-v2 flex>
                {renderContent()}
              </View>
            </View>
          </Card>
          <SWFilterModal
            visible={filterModalVisible}
            onPressCancel={handleFilterModalVisible}
            handleAdvanceSearch={handleAdvanceSearch}
            filterObjInitial={filterObj}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ServiceWorkflowGlobal;
