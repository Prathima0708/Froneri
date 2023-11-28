import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';
import InputText from 'src/components/InputText';
import DateTimePicker from 'src/components/DateTimePicker';
import Modal from 'src/components/Modal';
import TextError from 'src/components/TextError';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';
import ApplyFilterComponent from 'src/components/CustomerSearch/AdvanceFilterModal/ApplyFilterComponent';

import {images} from 'src/assets/Images';

import {ColourPalette} from 'src/styles/config/ColoursStyles';

import {tw} from 'src/tw';

import {DATETIME_PICKER_MODE} from 'src/utils/Constant';
import {formatDateReverse} from 'src/utils/CommonUtil';
import {toast} from 'src/utils/Util';

import ServiceWorkflowController from 'src/controller/ServiceWorkflowController';

interface AdvanceFilterModalProps {
  visible: boolean;
  onPressCancel: any;
  handleAdvanceSearch: any;
  filterObjInitial: any;
  fromCLP?: boolean;
}

const dropDownComponent = ({
  title,
  value,
  onValueChange,
  minimumDate,
  maximumDate,
}: {
  title: string;
  value: string;
  onValueChange: any;
  minimumDate?: any;
  maximumDate?: any;
}) => {
  let dateValue = new Date();

  if (value !== 'DD-MM-YYYY') {
    const [day, month, year] = value.split('-').map(Number);
    dateValue = new Date(year, month - 1, day);
  }

  return (
    <View flex>
      <Text text13M textBlack>
        {title}
      </Text>
      <DateTimePicker
        mode={DATETIME_PICKER_MODE.DATE}
        onChange={onValueChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        renderInput={() => {
          return (
            <View>
              <TouchableOpacity
                style={tw(
                  'flex-row items-center rounded-md border-default border-light-lavendar pl-2 justify-between  mt-1',
                )}>
                <Text text13R style={tw('text-light-grey2')}>
                  {value}
                </Text>
                <images.CalendarIcon />
              </TouchableOpacity>
            </View>
          );
        }}
        value={dateValue}
      />
    </View>
  );
};

const DelegationFilterModal = (props: AdvanceFilterModalProps) => {
  const {
    visible,
    filterObjInitial,
    onPressCancel,
    handleAdvanceSearch,
    fromCLP = false,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [filterObj, setFilterObj] = useState<any>({
    name: '',
    requestType: [],
    assignedTo: [],
    createdFrom: '',
    createdTill: '',
    requestedFrom: '',
    requestedTill: '',
  });

  const [requestTypeDropdownData, setRequestTypeDropdownData] = useState([]);
  const [assignedToDropdownData, setAssignedToDropdownData] = useState([]);

  const [createdDateErrorMsg, setCreatedDateErrorMsg] = useState('');
  const [requestedDateErrorMsg, setRequestedDateErrorMsg] = useState('');
  const [assignedToSearchText, setAssignedToSearchText] = useState('');
  const [requestTypeSearchText, setRequestTypeSearchText] = useState('');

  useEffect(() => {
    if (visible) {
      setFilterObj((prevFilterObj: any) => ({
        ...prevFilterObj,
        ...filterObjInitial,
      }));
    }
  }, [visible]);

  useEffect(() => {
    setupDropdowns();
  }, []);

  const setupDropdowns = async () => {
    setIsLoading(true);
    await fetchRequestTypeDropdownData();
    await fetchAssignedToDropdownData();
    setIsLoading(false);
  };

  const fetchRequestTypeDropdownData = async (searchText: string = '') => {
    try {
      setRequestTypeSearchText(searchText);
      const requestTypeDropdownData =
        await ServiceWorkflowController.getServiceRequestTypeDropdownData(
          searchText,
        );
      setRequestTypeDropdownData(requestTypeDropdownData);
      console.log('requestTypeDropdownData :>> ', requestTypeDropdownData);
    } catch (error) {
      console.log(
        'error while fetching request type dropdown data :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      });
      setRequestTypeDropdownData([]);
    }
  };

  const fetchAssignedToDropdownData = async (searchText: string = '') => {
    try {
      setAssignedToSearchText(searchText);
      const assignedToDropdownData =
        await ServiceWorkflowController.getResponsiblePersonAndCreatorList(
          searchText,
        );
      setAssignedToDropdownData(assignedToDropdownData);
      console.log('assignedToDropdownData :>> ', assignedToDropdownData);
    } catch (error) {
      console.log(
        'error while fetching request type dropdown data :>> ',
        error,
      );
      toast.error({
        message: 'Something went wrong',
      });
      setAssignedToDropdownData([]);
    }
  };

  const handleName = (value: string) => {
    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      name: value,
    }));
  };

  const handleRequestType = (item: any) => {
    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      requestType: [item],
    }));
  };

  const handleAssignedTo = (item: any) => {
    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      assignedTo: [item],
    }));
  };

  const handleCreatedFrom = (date: any) => {
    setCreatedDateErrorMsg('');
    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      createdFrom: date,
    }));
  };

  const handleCreatedTill = (date: any) => {
    setCreatedDateErrorMsg('');
    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      createdTill: date,
    }));
  };

  const handleRequestedFrom = (date: any) => {
    setRequestedDateErrorMsg('');
    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      requestedFrom: date,
    }));
  };

  const handleRequestedTill = (date: any) => {
    setRequestedDateErrorMsg('');
    setFilterObj((prevFilterObj: any) => ({
      ...prevFilterObj,
      requestedTill: date,
    }));
  };

  const validateInputs = () => {
    let isValid = true;

    if (
      (filterObj.createdFrom !== '' && filterObj.createdTill === '') ||
      (filterObj.createdFrom === '' && filterObj.createdTill !== '')
    ) {
      setCreatedDateErrorMsg('Please select both the dates');
      isValid = false;
    }

    if (
      (filterObj.requestedFrom !== '' && filterObj.requestedTill === '') ||
      (filterObj.requestedFrom === '' && filterObj.requestedTill !== '')
    ) {
      setRequestedDateErrorMsg('Please select both the dates');
      isValid = false;
    }

    return isValid;
  };

  const handleApplyFilter = () => {
    if (!validateInputs()) {
      return;
    }

    handleAdvanceSearch(filterObj);
  };

  const handleCLearFilter = async () => {
    await fetchRequestTypeDropdownData();
    await fetchAssignedToDropdownData();
    setCreatedDateErrorMsg('');
    setRequestedDateErrorMsg('');
    setAssignedToSearchText('');
    setRequestTypeSearchText('');
    setFilterObj({
      name: '',
      requestType: [],
      assignedTo: [],
      createdFrom: '',
      createdTill: '',
      requestedFrom: '',
      requestedTill: '',
    });
  };

  return (
    <Modal visible={visible}>
      <View bg-white style={[tw('flex-1 w-1/2'), {marginLeft: '50%'}]}>
        {isLoading ? (
          <View flex center>
            <ActivityIndicator color={ColourPalette.light.black} size="large" />
          </View>
        ) : (
          <View flex>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={tw('p-6')}>
              <View row centerV spread>
                <Text text26BO style={tw('self-center')}>
                  Filter
                </Text>
                <TouchableOpacity onPress={onPressCancel}>
                  <images.CancelNoBorderIcon />
                </TouchableOpacity>
              </View>
              <View flex marginT-v5>
                <Text text13M textBlack style={tw('mb-4px')}>
                  Primary Employee Name
                </Text>

                <Dropdown
                  labelField="description"
                  valueField="idServiceRequestType"
                  placeholder="Select Primary Employee Name"
                  search
                  searchPlaceholder="Search items..."
                  renderInputSearch={() => (
                    <DropdownSearchComponent
                      handleSearchDropdown={fetchRequestTypeDropdownData}
                      value={requestTypeSearchText}
                    />
                  )}
                  searchQuery={fetchRequestTypeDropdownData}
                  data={requestTypeDropdownData}
                  value={
                    filterObj.requestType?.length > 0
                      ? filterObj.requestType[0].idServiceRequestType
                      : ''
                  }
                  keyboardAvoiding={true}
                  onChange={handleRequestType}
                />
              </View>
              <View flex marginT-v5>
                <Text text13M textBlack style={tw('mb-4px')}>
                  Secondary Employee Name
                </Text>

                <Dropdown
                  labelField="description"
                  valueField="idServiceRequestType"
                  placeholder="Select Secondary Employee Name"
                  search
                  searchPlaceholder="Search items..."
                  renderInputSearch={() => (
                    <DropdownSearchComponent
                      handleSearchDropdown={fetchRequestTypeDropdownData}
                      value={requestTypeSearchText}
                    />
                  )}
                  searchQuery={fetchRequestTypeDropdownData}
                  data={requestTypeDropdownData}
                  value={
                    filterObj.requestType?.length > 0
                      ? filterObj.requestType[0].idServiceRequestType
                      : ''
                  }
                  keyboardAvoiding={true}
                  onChange={handleRequestType}
                />
              </View>

              {/** Created From and to **/}
              <View marginT-v5 row centerV>
                <View flex marginR-v2>
                  {dropDownComponent({
                    title: 'Valid From',
                    value: filterObj.createdFrom
                      ? formatDateReverse(filterObj.createdFrom)
                      : 'DD-MM-YYYY',
                    onValueChange: handleCreatedFrom,
                    maximumDate:
                      filterObj.createdTill !== ''
                        ? filterObj.createdTill
                        : new Date(),
                  })}
                  {createdDateErrorMsg ? (
                    <TextError errorMsg={createdDateErrorMsg} />
                  ) : null}
                </View>

                <View flex>
                  {dropDownComponent({
                    title: 'Valid To',
                    value: filterObj.createdTill
                      ? formatDateReverse(filterObj.createdTill)
                      : 'DD-MM-YYYY',
                    onValueChange: handleCreatedTill,
                    minimumDate:
                      filterObj.createdFrom !== ''
                        ? filterObj.createdFrom
                        : new Date(1950, 0, 1),
                    maximumDate: new Date(),
                  })}
                </View>
              </View>

              {/** Requested From and to **/}
              <View marginT-v5 row centerV>
                <View flex marginR-v2>
                  {dropDownComponent({
                    title: 'Created From',
                    value: filterObj.requestedFrom
                      ? formatDateReverse(filterObj.requestedFrom)
                      : 'DD-MM-YYYY',
                    onValueChange: handleRequestedFrom,
                    maximumDate:
                      filterObj.requestedTill !== ''
                        ? filterObj.requestedTill
                        : new Date(2400, 0, 1),
                  })}
                  {requestedDateErrorMsg ? (
                    <TextError errorMsg={requestedDateErrorMsg} />
                  ) : null}
                </View>
                <View flex>
                  {dropDownComponent({
                    title: 'Created To',
                    value: filterObj.requestedTill
                      ? formatDateReverse(filterObj.requestedTill)
                      : 'DD-MM-YYYY',
                    onValueChange: handleRequestedTill,
                    minimumDate:
                      filterObj.requestedFrom !== ''
                        ? filterObj.requestedFrom
                        : new Date(1950, 0, 1),
                    // maximumDate: new Date(),
                  })}
                </View>
              </View>
              {/** Requested From and to **/}
              <View marginT-v5 row centerV>
                <View flex marginR-v2>
                  {dropDownComponent({
                    title: 'Updated From',
                    value: filterObj.requestedFrom
                      ? formatDateReverse(filterObj.requestedFrom)
                      : 'DD-MM-YYYY',
                    onValueChange: handleRequestedFrom,
                    maximumDate:
                      filterObj.requestedTill !== ''
                        ? filterObj.requestedTill
                        : new Date(2400, 0, 1),
                  })}
                  {requestedDateErrorMsg ? (
                    <TextError errorMsg={requestedDateErrorMsg} />
                  ) : null}
                </View>
                <View flex>
                  {dropDownComponent({
                    title: 'Updated To',
                    value: filterObj.requestedTill
                      ? formatDateReverse(filterObj.requestedTill)
                      : 'DD-MM-YYYY',
                    onValueChange: handleRequestedTill,
                    minimumDate:
                      filterObj.requestedFrom !== ''
                        ? filterObj.requestedFrom
                        : new Date(1950, 0, 1),
                    // maximumDate: new Date(),
                  })}
                </View>
              </View>
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

export default DelegationFilterModal;
