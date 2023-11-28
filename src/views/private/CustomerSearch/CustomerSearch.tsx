import React, { useEffect, useState } from 'react';
import View from 'src/components/View';
import { tw } from 'src/tw';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import CustomerSearchHeader from 'src/components/Header/CustomerSearchHeader';
import Card from 'src/components/Card';
import VisitsLoader from 'src/components/SkeletonUi/Visits/VisitsLoader';
import { CUSTOMER_TYPES } from 'src/utils/Constant';
import { images } from 'src/assets/Images';
import InputText from 'src/components/InputText';
import RenderCustomerComponent from 'src/components/CustomerSearch/RenderCustomerComponent';
import Modal from 'src/components/Modal';
import FilterModal from 'src/components/CustomerSearch/AdvanceFilterModal/AdvanceFilterModal';
import Text from 'src/components/Text';
import PaginationHeader from 'src/components/CustomerSearch/PaginationHeader';
import CustomerSearchTopTabComponent from 'src/components/CustomerSearch/CustomerSearchTopTabComponent';
import DateSelectionComponent from 'src/components/CustomerSearch/DateComponent/DateSelectionComponent';
import CustomerSearchController from 'src/controller/CustomerSearchController';
import NoDataComponent from 'src/components/CustomerSearch/NoDataComponent';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import FilterComponent from 'src/components/CustomerSearch/FilterComponent';
import CustomerVacationsService from 'src/services/CustomerVacationsService';
import { pageNameVisits } from 'src/routes/Routes';
import { toast } from 'src/utils/Util';

const CustomerSearch = ({ route }) => {
  const screen = route.params?.screen;

  const limit = 20;

  const [customerType, setCustomerType] = useState(CUSTOMER_TYPES.ALL);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [customersData, setCustomersData] = useState<any>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any>([]);
  const [allSelectedCustomersList, setAllSelectedCustomersList] = useState<any>(
    [],
  );
  const [isAllRegion, setIsAllRegion] = useState(false);
  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useState(false);
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);
  const [totalCount, setTotalCount] = useState([]);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(limit);
  const [expandedItemIndex, setExpandedItemIndex] = useState(-1);

  const [filterObj, setFilterObj] = useState({
    multiSearchText: '',
    name: '',
    address: '',
    postalCode: '',
    city: '',
    inActiveCustomerOnly: false,
    outlet: [],
    abcClassification: [],
    productGroup: [],
    distributor: [],
    customerHierarchy: [],
    productMaterial: '',
    scooping: false,
    priority: [],
    visitedFrom: '',
    visitedTo: '',
    isNoLastVisitDate: false,
  });

  useEffect(() => {
    setStart(0);
    handleSearch(isAllRegion, start, filterObj);
  }, [customerType]);

  useEffect(() => {
    handleSearch(isAllRegion, start, filterObj);
  }, [start]);

  const handleSearch = (
    isAllRegion: boolean,
    start: number,
    filterObj: any,
  ) => {
    setListLoading(true);
    setExpandedItemIndex(-1);
    let startValue = start;
    if (isAllRegion) {
      if (start === 0) {
        startValue = 1;
      } else {
        startValue = start / limit + 1;
      }
    }

    CustomerSearchController.searchCustomers(
      isAllRegion,
      startValue,
      limit,
      customerType,
      filterObj,
    )
      .then(response => {
        console.log('count', response.totalCount);
        setTotalCount(response.totalCount);
        let res = response.results;

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
        setCustomersData(res);

        console.log('success');
      })
      .catch(err => {
        console.log('the err is', err);
      })
      .finally(() => setListLoading(false));
  };

  const getSelectedCustomerItem = (item: any) => {
    const foundCustomer = selectedCustomers.find(
      (customer: any) => customer.customerShipTo === item.customerShipTo,
    );

    if (foundCustomer) {
      const newSelectedCustomers = selectedCustomers.filter(
        (customer: any) => customer.customerShipTo !== item.customerShipTo,
      );
      setSelectedCustomers(newSelectedCustomers);
      return;
    }

    const newSelectedCustomers = [...selectedCustomers, item];

    setSelectedCustomers(newSelectedCustomers);
  };

  // Setting the calendar filter when pressing on top tab
  const changeCalendarFilter = (data: string) => {
    setCustomerType(data);
  };

  const handleFilterModal = () => {
    setFilterModalVisible(false);
  };

  const handleFilterModalVisible = () => {
    setFilterModalVisible(true);
  };

  const handleResetFilter = () => {
    setIsAllRegion(false);
    setStart(0);
    let filterObj = {
      multiSearchText: '',
      name: '',
      address: '',
      postalCode: '',
      city: '',
      inActiveCustomerOnly: false,
      outlet: [],
      abcClassification: [],
      productGroup: [],
      distributor: [],
      customerHierarchy: [],
      productMaterial: '',
      scooping: false,
      priority: [],
      visitedFrom: '',
      visitedTo: '',
      isNoLastVisitDate: false,
    };
    setFilterObj(filterObj);
    setCustomerType(CUSTOMER_TYPES.ALL);
    handleSearch(false, 0, filterObj);
  };

  const unselectCustomers = () => {
    setSelectedCustomers([]);
  };

  const onDatePress = async (date: string) => {
    try {
      const allRemote = selectedCustomers.every(
        (customer: any) => customer.remote === '0',
      );

      if (allRemote) {
        // Allow customer to create visits
      } else {
        // Block is customer is remote
        unselectCustomers();
        toast.error({
          message: 'message.customersearch.remote_customers_visit_error',
        })
        return;
      }
      const selectedCustomersShipto = selectedCustomers.map(
        (selectedCustomer: any) => selectedCustomer.customerShipTo,
      );

      const unavailabeCustomers =
        await CustomerVacationsService.checkUnavailableCustomers(
          selectedCustomersShipto,
          date,
        );

      if (unavailabeCustomers.length > 0) {
        const message = selectedCustomers.length === 1
          ? 'message.customersearch.customer_vacation_error'
          : 'message.customersearch.some_customers_vacation_error'

        toast.error({
          message,
        })

        return;
      }

      const selectedDateCustomersIndex = allSelectedCustomersList.findIndex(
        (customer: any) => customer.date === date,
      );

      if (selectedCustomers.length === 0) {
        return;
      }

      if (selectedDateCustomersIndex !== -1) {
        if (
          allSelectedCustomersList[selectedDateCustomersIndex].data.length >= 10
        ) {
          toast.info({
            message: 'message.customersearch.select_customer_per_day_limit_error',
          })
          return;
        }

        const selectedDateCustomers =
          allSelectedCustomersList[selectedDateCustomersIndex];

        const customerShipToOfSelectedDateCustomers =
          selectedDateCustomers.data.map(
            (customer: any) => customer.customerShipTo,
          );

        let selectedCustomersData = selectedCustomers.filter(
          (customer: any) =>
            !customerShipToOfSelectedDateCustomers.includes(
              customer.customerShipTo,
            ),
        );
        selectedCustomersData = [
          ...selectedCustomersData,
          ...selectedDateCustomers.data,
        ];

        if (selectedCustomersData.length > 10) {
          toast.info({
            message: 'message.customersearch.select_customer_per_day_limit_error',
          })
          return;
        }
        const newData = [...allSelectedCustomersList];

        newData[selectedDateCustomersIndex] = {
          date,
          data: selectedCustomersData,
          time: selectedDateCustomers.time,
        };

        setAllSelectedCustomersList(newData);

        unselectCustomers();
        return;
      }

      if (selectedCustomers.length > 10) {
        toast.info({
          message: 'message.customersearch.select_customer_per_day_limit_error',
        })
        return;
      }

      if (allSelectedCustomersList.length > 10) {
        toast.info({
          message: 'message.customersearch.create_visit_limit_error'
        })
        return;
      }

      const newSelectedCustomersData = {
        date,
        data: selectedCustomers,
      };

      const newSelectedCustomersList = [
        ...allSelectedCustomersList,
        newSelectedCustomersData,
      ];

      setAllSelectedCustomersList(newSelectedCustomersList);

      unselectCustomers();
    } catch (error) {
      console.log(
        '🚀 ~ file: CustomerSearch.tsx:180 ~ onDatePress ~ error:',
        error,
      );
    }
  };

  const setScreenLoading = (data: boolean) => {
    setLoading(data);
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
    console.log('newStartValue :>> ', start + limit);

    setStart((prevStart: number) => prevStart + limit);
    setEnd((prevEnd: number) => prevEnd + limit);

    setListLoading(false);
  };

  const handleMultiSearchTextChange = (text: string) => {
    setFilterObj({ ...filterObj, multiSearchText: text });
  };

  const handleMultiSearchText = () => {
    Keyboard.dismiss();
    setStart(0);
    setEnd(limit);
    handleSearch(isAllRegion, 0, filterObj);
  };

  const handleAdvanceSearch = (filterSelected: any, isRegion: boolean) => {
    setIsAllRegion(isRegion);
    setFilterObj({ ...filterObj, ...filterSelected });
    setFilterModalVisible(false);
    setStart(0);
    setEnd(limit);
    handleSearch(isRegion, 0, { ...filterObj, ...filterSelected });
  };

  const handleClipFilterDismiss = (filterObj: any) => {
    setFilterObj(filterObj);
    handleSearch(isAllRegion, 0, filterObj);
  };

  const handleClearFilter = () => {
    setIsAllRegion(false);
    let filterObj = {
      multiSearchText: '',
      name: '',
      address: '',
      postalCode: '',
      city: '',
      inActiveCustomerOnly: false,
      outlet: [],
      abcClassification: [],
      productGroup: [],
      distributor: [],
      customerHierarchy: [],
      productMaterial: '',
      scooping: false,
      priority: [],
      visitedFrom: '',
      visitedTo: '',
      isNoLastVisitDate: false,
    };
    setFilterObj(filterObj);
    setCustomerType(CUSTOMER_TYPES.ALL);
    handleSearch(false, 0, filterObj);
  };

  const handleExpandable = (index: number) => {
    if (index === expandedItemIndex) {
      setExpandedItemIndex(-1); // Close the expanded item
    } else {
      setExpandedItemIndex(index); // Expand the item
    }
  };

  return loading ? (
    <VisitsLoader />
  ) : (
    <SafeAreaView style={tw('bg-light-lightGrey flex-1')}>
      <CustomerSearchHeader
        setScreenLoading={setScreenLoading}
        allSelectedCustomersList={allSelectedCustomersList}
        setAllSelectedCustomersList={setAllSelectedCustomersList}
        fromScreen={screen}
        onBackPress={handleClearFilter}
      />
      <Card flex-1 marginH-v2 marginB-v4 br40 padding-v4 row>
        <View flex-7 style={tw(`${screen === pageNameVisits ? 'mr-6' : ''}`)}>
          <View
            marginB-v4
            row
            spread
            centerV
            paddingL-v2
            style={tw(
              'border-default rounded-md border-light-lavendar min-w-282px max-w-xs',
            )}>
            <InputText
              placeholder="placeholder.customersearch.search_customers_prospects"
              value={filterObj.multiSearchText}
              onChangeText={handleMultiSearchTextChange}
              noBorders={true}
              onSubmitEditing={handleMultiSearchText}
            />
            <TouchableOpacity onPress={handleMultiSearchText}>
              <images.SearchIcon />
            </TouchableOpacity>
          </View>
          <View row spread centerH>
            <CustomerSearchTopTabComponent
              handleChangeCalendarFilter={(data: string) => {
                changeCalendarFilter(data);
              }}
              calendarFilterValue={customerType}
            />
            <View row centerV>
              {listLoading ? null : (
                <TouchableOpacity
                  style={tw('mr-8')}
                  onPress={handleResetFilter}>
                  <Text text13R darkBlue>
                    label.general.reset_filter
                  </Text>
                </TouchableOpacity>
              )}

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

          {!listLoading && customersData.length > 0 && (
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
          {selectedCustomers.length > 0 && (
            <View row marginV-v2>
              <Text text13M textBlack>
                label.customersearch.customers_selected
              </Text>
              <Text text13M textBlack marginR-v5>
                {` (${selectedCustomers.length}) `}
              </Text>
              <TouchableOpacity onPress={unselectCustomers}>
                <Text darkBlue text13R>
                  {'Clear Selection'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View marginT-v2 flex>
            {listLoading ? (
              <ActivityIndicator
                size={'large'}
                color={ColourPalette.light.darkBlue}
                style={tw('flex-1')}
              />
            ) : customersData.length === 0 ? (
              <NoDataComponent />
            ) : (
              <FlashList
                data={customersData}
                keyExtractor={(_: any, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <RenderCustomerComponent
                      item={item}
                      index={index}
                      fromScreen={screen}
                      getSelectedCustomerItem={getSelectedCustomerItem}
                      selected={selectedCustomers.some(
                        (selectedItem: any) =>
                          selectedItem.customerShipTo === item.customerShipTo,
                      )}
                      expandedItemIndex={expandedItemIndex}
                      onPressExpand={handleExpandable}
                    />
                  );
                }}
                estimatedItemSize={59}
                // ListEmptyComponent={() => <NoDataComponent />}
                extraData={[selectedCustomers, expandedItemIndex]}
              />
            )}
          </View>
        </View>
        {screen == pageNameVisits && (
          <View flex br20 style={tw('bg-light-lightBlue1')}>
            <DateSelectionComponent
              {...{
                onDatePress,
                allSelectedCustomersList,
                setAllSelectedCustomersList,
              }}
            />
          </View>
        )}
      </Card>

      <Modal
        visible={filterModalVisible}
        transparent={true}
        enableModalBlur={false}
        overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
        <FilterModal
          onPressCancel={handleFilterModal}
          handleAdvanceSearch={handleAdvanceSearch}
          isAllRegionInitial={isAllRegion}
          filterObjInitial={filterObj}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default CustomerSearch;
