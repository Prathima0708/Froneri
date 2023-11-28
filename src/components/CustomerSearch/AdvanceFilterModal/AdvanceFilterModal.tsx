import React, { useEffect, useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import ApplyFilterComponent from 'src/components/CustomerSearch/AdvanceFilterModal/ApplyFilterComponent';
import AdvanceFilterSwitchComponent from 'src/components/CustomerSearch/AdvanceFilterModal/AdvanceFilterSwitchComponent';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { PRIORITY_DROPDOWN } from 'src/utils/DropdownConst';
import DateTimePicker from 'src/components/DateTimePicker';
import { formatDateReverse } from 'src/utils/CommonUtil';
import CheckBox from 'src/components/CheckBox';
import Dropdown from 'src/components/DropDown';
import MultiSelect from 'src/components/MultiSelect';
import AbcClassificationPlaceholder from 'src/components/CustomerSearch/AdvanceFilterModal/AbcClassificationPlaceholder';
import DistributorPlaceholder from 'src/components/CustomerSearch/AdvanceFilterModal/DistributorPlaceholder';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import OfflineModal from '../OfflineModal';
import CustomerSearchController from 'src/controller/CustomerSearchController';
import TextError from 'src/components/TextError';
import { i18nextFormatter } from 'src/locale';

interface AdvanceFilterModalProps {
  onPressCancel: any;
  handleAdvanceSearch: any;
  isAllRegionInitial: boolean;
  filterObjInitial: any;
}

const AdvanceFilterModal = (props: AdvanceFilterModalProps) => {
  const {
    filterObjInitial,
    onPressCancel,
    handleAdvanceSearch,
    isAllRegionInitial,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [showFlightModeBtn, setShowFlightModeBtn] = useState(false);
  const [showNetInfoText, setShowNetInfoText] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [isLocalAllRegion, setLocalAllRegion] = useState(isAllRegionInitial);
  const [filterObj, setFilterObj] = useState(filterObjInitial);
  const [abcClassification, setAbcClassification] = useState([]);
  const [distributor, setDistributor] = useState([]); // multi select

  const [outletDropdown, setOutletDropdown] = useState<never[]>([]);
  const [abcClassificationDropdown, setAbcClassificationDropdown] = useState<
    never[]
  >([]);
  const [productGroupDropdown, setProductGroupDropdown] = useState<never[]>([]);
  const [distributorsDropdown, setDistributorsDropdown] = useState<never[]>([]);
  const [customersHierarchyDropdown, setCustomersHierarchyDropdown] = useState<
    never[]
  >([]);
  const [errorMsg, setErrorMsg] = useState('');

  const isFlightModeEnabled = useAppSelector(
    (state: RootState) => state.userContext.isFlightModeEnabled,
  );
  const isDeviceOnline = useAppSelector(
    (state: RootState) => state.userContext.isDeviceOnline,
  );

  useEffect(() => {
    setupDropdowns();
  }, []);

  const setupDropdowns = async () => {
    setIsLoading(true);
    await fetchOutletDropdown('');
    await fetchAbcClassificationDropdown();
    await fetchProductGroupDropdown();
    await fetchDistributorDropdown();
    await fetchCustomerHierarchyDropdown('');

    setIsLoading(false);
  };

  const containsObject = (res: any, value: any) => {
    for (const element of res) {
      if (element.industryCode == value || element.customerHierL6 == value) {
        return true;
      }
    }
    return false;
  };

  const fetchOutletDropdown = async (value: string) => {
    //Fetching dropdown value for outlet
    CustomerSearchController.getOutletClassification(value)
      .then(res => {
        if (filterObj.outlet.length > 0) {
          const isPresent = containsObject(
            res,
            filterObj.outlet[0].industryCode,
          );
          if (isPresent) {
            setOutletDropdown([...(res as never)]);
          } else {
            setOutletDropdown([
              ...(res as never),
              ...(filterObj.outlet as never),
            ]);
          }
        } else {
          setOutletDropdown([...(res as never)]);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('outlet err is', err);
      });
  };

  const fetchAbcClassificationDropdown = async () => {
    //Fetching dropdown value for ABC classifications
    CustomerSearchController.getCustomersAbcClassification()
      .then(res => {
        setAbcClassificationDropdown([...(res as never)]);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('abc classification err is', err);
      });
  };

  const fetchProductGroupDropdown = async () => {
    //Fetching dropdown value for Product group
    CustomerSearchController.getProductGroup()
      .then(res => {
        setProductGroupDropdown([...(res as never)]);
      })
      .catch(err => {
        console.log('product group err is', err);
        setIsLoading(false);
      });
  };

  const fetchDistributorDropdown = async () => {
    //Fetching dropdown value for Distributor
    CustomerSearchController.getDistributors()
      .then(res => {
        setDistributorsDropdown([...(res as never)]);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('distributor err is', err);
      });
  };

  const fetchCustomerHierarchyDropdown = async (value: string) => {
    //Fetching dropdown value for Customer Hierarchy
    CustomerSearchController.getCustomerHierarchiesShipTo(value)
      .then(res => {
        if (filterObj.customerHierarchy.length > 0) {
          const isPresent = containsObject(
            res,
            filterObj.customerHierarchy[0].customerHierL6,
          );
          if (isPresent) {
            setCustomersHierarchyDropdown([...(res as never)]);
          } else {
            setCustomersHierarchyDropdown([
              ...(res as never),
              ...(filterObj.customerHierarchy as never),
            ]);
          }
        } else {
          setCustomersHierarchyDropdown([...(res as never)]);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Customer Hierarchy err is', err);
      });
  };

  // Checking the internet connection and flight mode then enabling the all region
  const handleAllRegion = async () => {
    if (isLocalAllRegion) {
      setLocalAllRegion(!isLocalAllRegion);
      return;
    }

    try {
      console.log('isDeviceOnline :>> ', isDeviceOnline);
      console.log('isFlightModeEnabled :>> ', isFlightModeEnabled);

      if (!isDeviceOnline && isFlightModeEnabled) {
        setShowOfflineModal(true);
        setShowFlightModeBtn(true);
        setShowNetInfoText(true);
      } else if (!isDeviceOnline && !isFlightModeEnabled) {
        setShowOfflineModal(true);
        setShowNetInfoText(true);
      } else if (isDeviceOnline && isFlightModeEnabled) {
        setShowOfflineModal(true);
        setShowFlightModeBtn(true);
      } else {
        setShowFlightModeBtn(false);
        setShowNetInfoText(false);
        setLocalAllRegion(!isLocalAllRegion);
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: AdvanceFilterModal.tsx:219 ~ handleAllRegion ~ error:',
        error,
      );
    }
  };

  const handleInActiveCustomer = () => {
    setFilterObj({
      ...filterObj,
      inActiveCustomerOnly: !filterObj.inActiveCustomerOnly,
    });
  };

  const handleScooping = () => {
    setFilterObj({
      ...filterObj,
      scooping: !filterObj.scooping,
    });
  };

  const handleName = (value: string) => {
    setFilterObj({ ...filterObj, name: value });
  };

  const handleAddress = (value: string) => {
    setFilterObj({ ...filterObj, address: value });
  };

  const handlePostalCode = (value: string) => {
    setFilterObj({ ...filterObj, postalCode: value });
  };

  const handleCity = (value: string) => {
    setFilterObj({ ...filterObj, city: value });
  };

  const handleOutlet = (item: any) => {
    setFilterObj({
      ...filterObj,
      outlet: [item],
    });
  };

  const handleAbcClassification = (item: any) => {
    setAbcClassification(item);
    const abcClassificationArray = [];
    if (abcClassificationDropdown.length > 1) {
      for (const element of item) {
        const selectedValue = abcClassificationDropdown.find(
          data => data.abcClassification == element,
        );
        if (selectedValue) {
          abcClassificationArray.push(selectedValue);
        }
      }
    } else {
      abcClassificationArray.push(item);
    }
    setFilterObj({
      ...filterObj,
      abcClassification: abcClassificationArray,
    });
  };

  const handlePriority = (item: any) => {
    setFilterObj({
      ...filterObj,
      priority: [item],
    });
  };

  const handleDistributor = (item: any) => {
    console.log('distributorArray', item);
    setDistributor(item);

    const distributorArray = [];
    if (distributorsDropdown.length > 1) {
      for (const element of item) {
        const selectedValue = distributorsDropdown.find(
          (data: any) => data.idDistributors == element,
        );
        if (selectedValue) {
          distributorArray.push(selectedValue);
        }
      }
    } else {
      distributorArray.push(item);
    }
    setFilterObj({
      ...filterObj,
      distributor: distributorArray,
    });
  };

  const handleProductGroup = (item: any) => {
    setFilterObj({ ...filterObj, productGroup: [item] });
  };

  const handleProductMaterial = (value: any) => {
    setFilterObj({ ...filterObj, productMaterial: value });
  };

  const handleCustomerHierarchy = (item: any) => {
    setFilterObj({ ...filterObj, customerHierarchy: [item] });
  };

  const handleVisitedFrom = (date: any) => {
    setErrorMsg('');
    setFilterObj({ ...filterObj, visitedFrom: date });
  };

  const handleVisitedTo = (date: any) => {
    setErrorMsg('');
    setFilterObj({ ...filterObj, visitedTo: date });
  };

  const handleNoLastVisit = () => {
    setFilterObj({
      ...filterObj,
      isNoLastVisitDate: !filterObj.isNoLastVisitDate,
    });
  };

  const handleApplyFilter = () => {
    console.log('the filterObj is', filterObj.visitedFrom, filterObj.visitedTo);
    if (
      (filterObj.visitedFrom != '' && filterObj.visitedTo == '') ||
      (filterObj.visitedFrom == '' && filterObj.visitedTo != '')
    ) {
      setErrorMsg('Please select both the dates');
      return;
    }

    handleAdvanceSearch(filterObj, isLocalAllRegion);
  };

  const handleCLearFilter = (item: any) => {
    setDistributor([]);
    setAbcClassification([]);
    setLocalAllRegion(false);
    setFilterObj({
      multiSearchText: '',
      name: '',
      address: '',
      postalCode: '',
      city: '',
      inActiveCustomerOnly: false,
      outlet: [],
      abcClassification: [],
      priority: [],
      productGroup: [],
      distributor: [],
      customerHierarchy: [],
      productMaterial: '',
      scooping: false,
      visitedFrom: '',
      visitedTo: '',
      isNoLastVisitDate: false,
    });
  };

  const onPressCancelOfflineModal = () => {
    setShowOfflineModal(false);
  };

  return (
    <View bg-white style={[tw('flex-1 w-1/2'), { marginLeft: '50%' }]}>
      {isLoading ? (
        <View flex center>
          <ActivityIndicator
            color={ColourPalette.light.darkBlue}
            size="large"
          />
        </View>
      ) : (
        <View flex>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw('p-6')}>
            <View row centerV spread>
              <Text text26BO style={tw('self-center')}>
                label.general.filter
              </Text>
              <TouchableOpacity onPress={onPressCancel}>
                <images.CancelNoBorderIcon />
              </TouchableOpacity>
            </View>
            <AdvanceFilterSwitchComponent
              title="label.customersearch.all_regions"
              isEnabled={isLocalAllRegion}
              handleToggleSwitch={handleAllRegion}
            />
            <AdvanceFilterSwitchComponent
              title="label.customersearch.inactive_customers"
              isEnabled={filterObj.inActiveCustomerOnly}
              handleToggleSwitch={handleInActiveCustomer}
            />
            <AdvanceFilterSwitchComponent
              title="label.customersearch.scooping"
              isEnabled={filterObj.scooping}
              handleToggleSwitch={handleScooping}
            />
            <View marginT-v4>
              <InputText
                title="label.general.name"
                placeholder="placeholder.general.name"
                value={filterObj.name}
                onChangeText={handleName}
              />
            </View>
            <View marginT-v5>
              <InputText
                title="label.general.address"
                placeholder="placeholder.general.address"
                value={filterObj.address}
                onChangeText={handleAddress}
              />
            </View>
            <View marginT-v5 row centerV>
              <View flex marginR-v2>
                <InputText
                  title="label.general.postal_code"
                  placeholder="placeholder.general.code"
                  value={filterObj.postalCode}
                  onChangeText={handlePostalCode}
                />
              </View>
              <View flex>
                <InputText
                  title="label.general.city"
                  placeholder="placeholder.general.city"
                  value={filterObj.city}
                  onChangeText={handleCity}
                />
              </View>
            </View>
            <View marginT-v5 row centerV>
              <View flex marginR-v2>
                <Dropdown
                  title="label.general.outlet"
                  labelField="descriptionLanguage"
                  valueField="industryCode"
                  placeholder="placeholder.customersearch.select_outlet"
                  data={outletDropdown}
                  value={
                    filterObj.outlet.length > 0
                      ? filterObj.outlet[0].industryCode
                      : ''
                  }
                  search
                  keyboardAvoiding={true}
                  renderInputSearch={() => (
                    <DropdownSearchComponent
                      handleSearchDropdown={fetchOutletDropdown}
                    />
                  )}
                  onChange={handleOutlet}
                  searchQuery={fetchOutletDropdown}
                />
              </View>
              <View flex>
                <InputText
                  title="label.customersearch.product_materials"
                  placeholder="placeholder.customersearch.enter_product_materials"
                  value={filterObj.productMaterial}
                  onChangeText={handleProductMaterial}
                />
              </View>
            </View>
            <View marginT-v5 row centerV>
              <View flex marginR-v2>
                <Text text13M textBlack>
                  label.general.abc_classification
                </Text>
                <MultiSelect
                  visibleSelectedItem={false}
                  labelField="descriptionLanguage"
                  valueField="abcClassification"
                  placeholder={
                    filterObj.abcClassification.length == 0 ? (
                      i18nextFormatter('placeholder.customersearch.select_abc_classification')
                    ) : (
                      <AbcClassificationPlaceholder
                        data={filterObj.abcClassification}
                      />
                    )
                  }
                  data={abcClassificationDropdown}
                  value={abcClassification}
                  onChange={handleAbcClassification}
                />
              </View>
              <View flex>
                <Dropdown
                  title="label.general.priority"
                  labelField="label"
                  valueField="value"
                  placeholder="placeholder.customersearch.select_priority"
                  data={PRIORITY_DROPDOWN}
                  value={
                    filterObj.priority.length > 0
                      ? filterObj.priority[0].value
                      : ''
                  }
                  onChange={handlePriority}
                />
              </View>
            </View>
            <View marginT-v5 row centerV>
              <View flex marginR-v2>
                <Dropdown
                  title="label.customersearch.product_group"
                  labelField="descriptionLanguage"
                  valueField="idTurnoverGroup"
                  placeholder="placeholder.customersearch.select_product_group"
                  visibleSelectedItem={false}
                  data={productGroupDropdown}
                  value={
                    filterObj.productGroup.length > 0
                      ? filterObj.productGroup[0].idTurnoverGroup
                      : ''
                  }
                  onChange={handleProductGroup}
                />
              </View>
              <View flex>
                <Dropdown
                  title="label.customersearch.distributor"
                  labelField="description"
                  valueField="idDistributors"
                  visibleSelectedItem={false}
                  placeholder={
                    filterObj.distributor.length == 0 ? (
                      i18nextFormatter('placeholder.customersearch.select_distributor')
                    ) : (
                      <DistributorPlaceholder data={filterObj.distributor} />
                    )
                  }
                  data={distributorsDropdown}
                  value={distributor}
                  onChange={handleDistributor}
                />
              </View>
            </View>
            <View marginT-v5 row centerV>
              <View flex>
                <Dropdown
                  title="label.general.customer_hierarchy"
                  labelField="details"
                  valueField="customerHierL6"
                  search
                  renderInputSearch={() => (
                    <DropdownSearchComponent
                      handleSearchDropdown={fetchCustomerHierarchyDropdown}
                    />
                  )}
                  searchQuery={fetchCustomerHierarchyDropdown}
                  placeholder="placeholder.general.customer_hierarchy"
                  data={customersHierarchyDropdown}
                  value={
                    filterObj.customerHierarchy.length > 0
                      ? filterObj.customerHierarchy[0].customerHierL6
                      : ''
                  }
                  onChange={handleCustomerHierarchy}
                />
              </View>
            </View>
            <View marginT-v5 row centerV>
              <View flex marginR-v2>
                <Text text13M textBlack>
                  label.general.visited_from
                </Text>
                <DateTimePicker
                  mode={DATETIME_PICKER_MODE.DATE}
                  onChange={handleVisitedFrom}
                  maximumDate={
                    filterObj.visitedTo !== ''
                      ? filterObj.visitedTo
                      : new Date()
                  }
                  renderInput={() => {
                    return (
                      <View>
                        <TouchableOpacity
                          style={tw(
                            'flex-row items-center rounded-md border-default border-light-lavendar pl-2 justify-between  mt-1',
                          )}>
                          <Text text13R style={tw('text-light-grey2')}>
                            {filterObj.visitedFrom == ''
                              ? i18nextFormatter('placeholder.customersearch.select_date')
                              : formatDateReverse(filterObj.visitedFrom)}
                          </Text>
                          <images.CalendarIcon />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
              <View flex>
                <Text text13M textBlack>
                  label.general.visited_to
                </Text>
                <DateTimePicker
                  mode={DATETIME_PICKER_MODE.DATE}
                  onChange={handleVisitedTo}
                  minimumDate={
                    filterObj.visitedFrom !== ''
                      ? filterObj.visitedFrom
                      : new Date(1950, 0, 1)
                  }
                  maximumDate={new Date()}
                  renderInput={() => {
                    return (
                      <View>
                        <TouchableOpacity
                          style={tw(
                            'flex-row items-center rounded-md border-default border-light-lavendar pl-2 justify-between  mt-1',
                          )}>
                          <Text text13R style={tw('text-light-grey2')}>
                            {filterObj.visitedTo == ''
                              ? i18nextFormatter('placeholder.customersearch.select_date')
                              : formatDateReverse(filterObj.visitedTo)}
                          </Text>
                          <images.CalendarIcon />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            {errorMsg ? <TextError errorMsg={errorMsg} /> : null}
            <View marginT-v5 row centerV>
              <CheckBox
                label={i18nextFormatter("label.customersearch.no_last_visit")}
                labelStyle={tw('text-light-grey2')}
                value={filterObj.isNoLastVisitDate}
                onValueChange={handleNoLastVisit}
                color={
                  filterObj.isNoLastVisitDate
                    ? ColourPalette.light.darkBlue
                    : ColourPalette.light.grey4
                }
              />
            </View>
          </ScrollView>
          <ApplyFilterComponent
            onPressClearFilter={handleCLearFilter}
            onPressApplyFilter={handleApplyFilter}
          />
          <OfflineModal
            visible={showOfflineModal}
            onPressOk={onPressCancelOfflineModal}
            showFlightModeBtn={showFlightModeBtn}
            showNetInfoText={showNetInfoText}
          />
        </View>
      )}
    </View>
  );
};

export default AdvanceFilterModal;
