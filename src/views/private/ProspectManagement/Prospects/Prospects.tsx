import React, { useState, FC, useEffect } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import Card from 'src/components/Card';
import { images } from 'src/assets/Images';
import ProspectsHeader from 'src/components/Header/ProspectsHeader';
import InputText from 'src/components/InputText';
import { PROSPECTS_DROPDOWN } from 'src/utils/DropdownConst';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import PaginationHeader from 'src/components/CustomerSearch/PaginationHeader';
import { FlashList } from '@shopify/flash-list';
import RenderProspectComponent from 'src/components/Prospects/RenderProspectComponent';
import FilterModal from 'src/components/Prospects/AdvanceFilterModal/AdvanceFilterModal';
import ListingHeaderProspectComponent from 'src/components/Prospects/ListingHeaderProspectComponent';
import ProspectsController from 'src/controller/ProspectsController';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import FilterComponent from 'src/components/CustomerSearch/FilterComponent';
import Dropdown from 'src/components/DropDown';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'src/utils/Util';
import { i18nextFormatter } from 'src/locale';
import { PROSPECT_STATUS_TITLE } from 'src/utils/Constant';

const Prospects: FC = () => {
  const navigation = useNavigation();

  const limit = 20;
  // prospect listing states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [prospectDropdownValue, setProspectDropdownValue] = useState(
    PROSPECTS_DROPDOWN[0].value,
  );
  const [loading, setLoading] = useState(false);
  const [prospectsData, setProspectsData] = useState<any>([]);
  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useState(false);
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(limit);

  const [filterObj, setFilterObj] = useState({
    showCustomers: false,
    searchText: '',
    name: '',
    address: '',
    postalCode: '',
    city: '',
    prospectNumber: '',
    externalProspectNumber: '',
    outlet: [],
    priority: [],
    createdFrom: '',
    createdTill: '',
    createdBy: [],
    updatedBy: [],
  });

  // ...

  useEffect(() => {
    handleSearch(start, prospectDropdownValue, filterObj);
  }, [start, prospectDropdownValue]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleSearch(start, prospectDropdownValue, filterObj);
    });

    return unsubscribe;
  }, [start, filterObj, prospectDropdownValue]);

  // Get prospects list
  const handleSearch = (
    start: number,
    prospectDropdownValue: any,
    filterObj: any,
  ) => {
    setLoading(true);

    ProspectsController.getProspects(
      start,
      limit,
      prospectDropdownValue.value,
      filterObj,
    )
      .then(response => {
        setTotalCount(response.totalCount);
        let res = response.results;

        console.log(
          'Prospects data :>> ',
          response.totalCount,
          res.length,
          res,
        );

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
        setProspectsData(res);
      })
      .catch(error => {
        setProspectsData([]);
        console.log(
          'Something went wrong while fetching prospects data :>> ',
          error,
        );
        toast.error({
          message: 'msg.createprospect.something_went_wrong',
        });
      })
      .finally(() => setLoading(false));
  };

  const handleSearchTextChange = (text: string) => {
    setFilterObj({ ...filterObj, searchText: text });
  };

  const handleSearchText = () => {
    Keyboard.dismiss();
    setStart(0);
    setEnd(limit);
    handleSearch(0, prospectDropdownValue, filterObj);
  };

  const handleFilterModalVisible = () => {
    setFilterModalVisible(true);
  };

  const handleLeftIconPress = () => {
    setLoading(true);

    if (start === 0) {
      return;
    }

    setStart((prevStart: number) => prevStart - limit);
    setEnd((prevEnd: number) => prevEnd - limit);

    setLoading(false);
  };

  const handleRightIconPress = () => {
    setLoading(true);

    setStart((prevStart: number) => prevStart + limit);
    setEnd((prevEnd: number) => prevEnd + limit);

    setLoading(false);
  };

  const handleProspectDropdown = (item: any) => {
    setProspectDropdownValue(item);
  };

  const handleFilterModal = () => {
    setFilterModalVisible(false);
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
    handleSearch(0, prospectDropdownValue, filterObject);
  };

  const handleClipFilterDismiss = (filterObj: any) => {
    setFilterObj(filterObj);
    handleSearch(0, prospectDropdownValue, filterObj);
  };

  const handleResetFilter = () => {
    const filterObject = {
      showCustomers: false,
      searchText: '',
      name: '',
      address: '',
      postalCode: '',
      city: '',
      prospectNumber: '',
      externalProspectNumber: '',
      outlet: [],
      priority: [],
      createdFrom: '',
      createdTill: '',
      createdBy: [],
      updatedBy: [],
    };
    setFilterObj(filterObject);
    setProspectDropdownValue(PROSPECTS_DROPDOWN[0].value);
    setStart(0);
    setEnd(limit);
    handleSearch(0, PROSPECTS_DROPDOWN[0].value, filterObject);
  };

  const renderItem = (item: any) => {
    return (
      <View row centerV padding-v2>
        <Text
          style={tw(
            `${item.value === prospectDropdownValue
              ? 'text-light-darkBlue'
              : 'text-light-textBlack'
            } text-13px font-normal`,
          )}>
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <View flex>
        <ProspectsHeader />
        <Card flex-1 marginH-v2 marginB-v4 br40 padding-v4 row>
          <View flex-7>
            <View row>
              <View
                row
                centerV
                centerH
                style={tw(
                  'border-default rounded-md border-light-lavendar min-w-110px pl-2',
                )}>
                <InputText
                  placeholder="label.prospectlisting.search"
                  value={filterObj.searchText}
                  onChangeText={handleSearchTextChange}
                  onSubmitEditing={handleSearchText}
                  noBorders
                />
                <TouchableOpacity onPress={handleSearchText}>
                  <images.SearchIcon />
                </TouchableOpacity>
              </View>
              <View flex row centerV style={tw('justify-end')}>
                <TouchableOpacity
                  style={tw('px-3')}
                  onPress={handleResetFilter}>
                  <Text text13R darkBlue>
                    label.general.reset_filter
                  </Text>
                </TouchableOpacity>
                <View marginL-v4>
                  <TouchableOpacity
                    style={tw(
                      'p-2 border-default rounded-md border-light-lavendar',
                    )}
                    onPress={handleFilterModalVisible}>
                    <images.FilterIcon />
                  </TouchableOpacity>
                </View>
                {!filterObj.showCustomers && (
                  <Dropdown
                    extraStyle={'w-170px ml-5'}
                    labelField="label"
                    valueField="value"
                    renderItem={renderItem}
                    data={PROSPECTS_DROPDOWN}
                    value={prospectDropdownValue}
                    onChange={handleProspectDropdown}
                  />
                )}
              </View>
            </View>

            <FilterComponent
              filterObj={filterObj}
              handleClipFilterDismiss={handleClipFilterDismiss}
            />

            {!loading && prospectsData.length > 0 && (
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
              {loading ? (
                <ActivityIndicator
                  size={'large'}
                  color={ColourPalette.light.darkBlue}
                  style={tw('flex-1')}
                />
              ) : prospectsData.length === 0 ? (
                <NoDataComponent />
              ) : (
                <View
                  flex
                  style={tw(
                    `rounded-md bg-light-white border-default border-light-lavendar rounded-md`,
                  )}>
                  <ListingHeaderProspectComponent />
                  <FlashList
                    data={prospectsData}
                    keyExtractor={(_: any, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <RenderProspectComponent
                          item={item}
                          index={index}
                          lastItem={prospectsData.length - 1 === index}
                        />
                      );
                    }}
                    estimatedItemSize={59}
                  />
                </View>
              )}
            </View>
          </View>
        </Card>
        <FilterModal
          visible={filterModalVisible}
          onPressCancel={handleFilterModal}
          handleAdvanceSearch={handleAdvanceSearch}
          filterObjInitial={filterObj}
        />
      </View>
    </SafeAreaView>
  );
};

export default Prospects;
