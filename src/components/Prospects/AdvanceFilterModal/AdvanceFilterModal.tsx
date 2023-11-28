import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';
import InputText from 'src/components/InputText';
import DateTimePicker from 'src/components/DateTimePicker';
import Modal from 'src/components/Modal';

import ApplyFilterComponent from 'src/components/CustomerSearch/AdvanceFilterModal/ApplyFilterComponent';
import AdvanceFilterSwitchComponent from 'src/components/CustomerSearch/AdvanceFilterModal/AdvanceFilterSwitchComponent';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

import { images } from 'src/assets/Images';

import { ColourPalette } from 'src/styles/config/ColoursStyles';

import { tw } from 'src/tw';

import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { PRIORITY_DROPDOWN } from 'src/utils/DropdownConst';
import { formatDateReverse } from 'src/utils/CommonUtil';
import CustomerSearchController from 'src/controller/CustomerSearchController';
import TextError from 'src/components/TextError';
import ProspectsController from 'src/controller/ProspectsController';

interface AdvanceFilterModalProps {
  visible: boolean;
  onPressCancel: any;
  handleAdvanceSearch: any;
  filterObjInitial: any;
}

const AdvanceFilterModal = (props: AdvanceFilterModalProps) => {
  const { visible, filterObjInitial, onPressCancel, handleAdvanceSearch } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [filterObj, setFilterObj] = useState(filterObjInitial);

  const [outletDropdown, setOutletDropdown] = useState([]);
  const [createdByDropdownData, setCreatedByDropdownData] = useState([]);
  const [updatedByDropdownData, setUpdatedByDropdownData] = useState([]);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setFilterObj(filterObjInitial);
    }
  }, [visible]);

  useEffect(() => {
    setupDropdowns();
  }, []);

  const setupDropdowns = async () => {
    setIsLoading(true);
    await fetchOutletDropdown('');
    await fetchCreatedByDropdownData();
    await fetchUpdatedByDropdownData();
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
        console.log('Error while fetching outlet', err);
      });
  };

  const fetchCreatedByDropdownData = async (searchText?: string) => {
    ProspectsController.getCreatedByAndUpdatedByEmployees(searchText)
      .then((data: any) => {
        setCreatedByDropdownData(data);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('Error while fetching employees data', error);
      });
  };

  const fetchUpdatedByDropdownData = async (searchText?: string) => {
    ProspectsController.getCreatedByAndUpdatedByEmployees(searchText)
      .then((data: any) => {
        setUpdatedByDropdownData(data);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('Error while fetching employees data', error);
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

  const handleProspectNumber = (value: string) => {
    setFilterObj({ ...filterObj, prospectNumber: value });
  };

  const handleExternalProspectNumber = (value: string) => {
    setFilterObj({ ...filterObj, externalProspectNumber: value });
  };

  const handleOutlet = (item: any) => {
    setFilterObj({
      ...filterObj,
      outlet: [item],
    });
  };

  const handleCreatedBy = (item: any) => {
    setFilterObj({
      ...filterObj,
      createdBy: [item],
    });
  };

  const handleUpdatedBy = (item: any) => {
    setFilterObj({
      ...filterObj,
      updatedBy: [item],
    });
  };

  const handlePriority = (item: any) => {
    setFilterObj({
      ...filterObj,
      priority: [item],
    });
  };

  const handleCreatedFrom = (date: any) => {
    setErrorMsg('');
    setFilterObj({ ...filterObj, createdFrom: date });
  };

  const handleCreatedTill = (date: any) => {
    setErrorMsg('');
    setFilterObj({ ...filterObj, createdTill: date });
  };

  const handleShowCustomers = () => {
    setFilterObj({ ...filterObj, showCustomers: !filterObj.showCustomers });
  };

  const handleApplyFilter = () => {
    if (
      (filterObj.createdFrom != '' && filterObj.createdTill == '') ||
      (filterObj.createdFrom == '' && filterObj.createdTill != '')
    ) {
      setErrorMsg('Please select both the dates');
      return;
    }
    handleAdvanceSearch(filterObj);
  };

  const handleCLearFilter = () => {
    setErrorMsg('');
    setFilterObj({
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
  };

  return (
    <Modal visible={visible}>
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
                title="label.general.show_customers"
                isEnabled={filterObj.showCustomers}
                handleToggleSwitch={handleShowCustomers}
              />
              <View marginT-v4>
                <InputText
                  title={'label.general.name'}
                  placeholder="placeholder.general.name"
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={filterObj.name}
                  onChangeText={handleName}
                />
              </View>
              <View marginT-v5>
                <InputText
                  title={'label.general.address'}
                  placeholder="placeholder.general.address"
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={filterObj.address}
                  onChangeText={handleAddress}
                />
              </View>
              <View marginT-v5 row centerV>
                <View flex marginR-v2>
                  <InputText
                    title={'label.general.postal_code'}
                    placeholder="placeholder.general.code"
                    keyboardType="numeric"
                    inputPlaceHolderTextColor={ColourPalette.light.grey2}
                    value={filterObj.postalCode}
                    onChangeText={handlePostalCode}
                  />
                </View>
                <View flex>
                  <InputText
                    title={'label.general.city'}
                    placeholder="placeholder.general.city"
                    inputPlaceHolderTextColor={ColourPalette.light.grey2}
                    value={filterObj.city}
                    onChangeText={handleCity}
                  />
                </View>
              </View>
              <View marginT-v5>
                <InputText
                  title={'label.general.prospect_number'}
                  placeholder="label.general.prospect_number"
                  keyboardType="numeric"
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={filterObj.prospectNumber}
                  onChangeText={handleProspectNumber}
                />
              </View>
              <View marginT-v5>
                <InputText
                  title={'label.general.external_prospect_number'}
                  placeholder="label.general.external_prospect_number"
                  keyboardType="numeric"
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={filterObj.externalProspectNumber}
                  onChangeText={handleExternalProspectNumber}
                />
              </View>
              <View marginT-v5 row centerV>
                <View flex marginR-v2>
                  <Text text13M textBlack>
                    label.general.outlet
                  </Text>
                  <Dropdown
                    labelField="descriptionLanguage"
                    valueField="industryCode"
                    placeholder="placeholder.general.select_outlet"
                    data={outletDropdown}
                    value={
                      filterObj.outlet.length > 0
                        ? filterObj.outlet[0].industryCode
                        : ''
                    }
                    search
                    searchPlaceholder="Search items..."
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
                  <Text text13M textBlack>
                    label.prospectlisting.priority
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    placeholder="placeholder.prospectlisting.select_priority"
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
                  <Text text13M textBlack>
                    label.general.created_by
                  </Text>
                  <Dropdown
                    labelField="name"
                    valueField="employeeNumber"
                    placeholder="placeholder.prospectlisting.select_employee"
                    data={createdByDropdownData}
                    value={
                      filterObj.createdBy.length > 0
                        ? filterObj.createdBy[0].employeeNumber
                        : ''
                    }
                    search
                    searchPlaceholder="Search employees..."
                    keyboardAvoiding={true}
                    renderInputSearch={() => (
                      <DropdownSearchComponent
                        handleSearchDropdown={fetchCreatedByDropdownData}
                      />
                    )}
                    onChange={handleCreatedBy}
                    searchQuery={fetchCreatedByDropdownData}
                  />
                </View>
                <View flex>
                  <Text text13M textBlack>
                    label.general.updated_by
                  </Text>
                  <Dropdown
                    labelField="name"
                    valueField="employeeNumber"
                    placeholder="placeholder.prospectlisting.select_employee"
                    data={updatedByDropdownData}
                    value={
                      filterObj.updatedBy.length > 0
                        ? filterObj.updatedBy[0].employeeNumber
                        : ''
                    }
                    search
                    searchPlaceholder="Search employees..."
                    keyboardAvoiding={true}
                    renderInputSearch={() => (
                      <DropdownSearchComponent
                        handleSearchDropdown={fetchUpdatedByDropdownData}
                      />
                    )}
                    onChange={handleUpdatedBy}
                    searchQuery={fetchUpdatedByDropdownData}
                  />
                </View>
              </View>
              <View marginT-v5 row centerV>
                <View flex marginR-v2>
                  <Text text13M textBlack>
                    label.general.created_from
                  </Text>
                  <DateTimePicker
                    mode={DATETIME_PICKER_MODE.DATE}
                    onChange={handleCreatedFrom}
                    maximumDate={
                      filterObj.createdTill !== ''
                        ? filterObj.createdTill
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
                              {filterObj.createdFrom
                                ? formatDateReverse(filterObj.createdFrom)
                                : 'DD-MM-YYYY'}
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
                    Created Till
                  </Text>
                  <DateTimePicker
                    mode={DATETIME_PICKER_MODE.DATE}
                    onChange={handleCreatedTill}
                    minimumDate={
                      filterObj.createdFrom !== ''
                        ? filterObj.createdFrom
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
                              {filterObj.createdTill == ''
                                ? 'DD-MM-YYYY'
                                : formatDateReverse(filterObj.createdTill)}
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
            </ScrollView>
            <ApplyFilterComponent
              onPressClearFilter={handleCLearFilter}
              onPressApplyFilter={handleApplyFilter}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default AdvanceFilterModal;
