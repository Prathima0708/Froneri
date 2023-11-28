import View from 'src/components/View';
import React, { useState } from 'react';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import Dropdown from 'src/components/DropDown';
import DatePicker from 'src/components/DatePicker';
import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { TouchableOpacity } from 'react-native';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { SERVICE_WORKFLOW_STATUS_DROPDOWN } from 'src/utils/DropdownConst';
import {
  formatDateReverse,
} from 'src/utils/CommonUtil';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

interface BasicInfoAddressComponentProps {
  editMode: boolean;
  requestTypeData: any;
  assignToData: any;
  inputsData: any;
  errorMessages: any;
  handleInputChange: any;
  getAssignedToDropdownData: any;
  getRequestTypeDropdownData: any;
  claimsLayoutDropdownData: any;
  isClaimLayoutVisible: boolean;
  onClaimDetailsPress?: any;
}

const SWRequestBasicInfoComponent = (props: BasicInfoAddressComponentProps) => {
  const {
    editMode,
    requestTypeData,
    assignToData,
    inputsData,
    errorMessages,
    handleInputChange,
    getAssignedToDropdownData,
    getRequestTypeDropdownData,
    claimsLayoutDropdownData,
    isClaimLayoutVisible,
    onClaimDetailsPress,
  } = props;

  const [assignedToSearchText, setAssignedToSearchText] = useState("")
  const [requestTypeSearchText, setRequestTypeSearchText] = useState("")

  const onRequestTypeChange = handleInputChange('requestType');
  const onRequestedDateChange = handleInputChange('requestedDate');
  const onClaimsLayoutChange = handleInputChange('claimsLayout');
  const onDescriptionChange = handleInputChange('description');
  const onStatusChange = handleInputChange('status');
  const onAssignedToChange = handleInputChange('assignedTo');
  const onResolvedDateChange = handleInputChange('resolvedDate');
  const onResolutionChange = handleInputChange('resolution');

  const resolvedDateLabel = inputsData?.status === '3' ? 'Resolved Date*' : 'Resolved Date';
  const isResolvedDateEditable = inputsData?.status === '3';
  const resolutionLabel = inputsData?.status === '3' ? 'Resolution*' : 'Resolution';
  const assignedToLabel = inputsData?.status === '2' || inputsData?.status === '3' ? 'Assigned To*' : 'Assigned To';

  const fetchAssignedToDropdownData = (searchText: string) => {
    setAssignedToSearchText(searchText)
    getAssignedToDropdownData(searchText)
  }

  const fetchRequestTypeDropdownData = (searchText: string) => {
    setRequestTypeSearchText(searchText)
    getRequestTypeDropdownData(searchText)
  }

  return (
    <View marginT-v2>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Request Type*'}
            isEditable={editMode}
            data={requestTypeData}
            placeholder="Select Request Type"
            value={inputsData?.requestType}
            labelField={'description'}
            valueField={'idServiceRequestType'}
            onChange={onRequestTypeChange}
            errorMsg={errorMessages.requestType}
            search
            searchPlaceholder="Search items..."
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={fetchRequestTypeDropdownData}
                value={requestTypeSearchText}
              />
            )}
          />
        </View>

        <View flex marginR-v2 style={tw('border-light-lavendar ')}>
          <Text text13M textBlack style={tw('mb-1')}>
            Requested Date*
          </Text>
          <View style={tw(editMode ? 'bg-light-white' : 'bg-light-white1')}>
            <DatePicker
              isEditable={editMode}
              mode={DATETIME_PICKER_MODE.DATE}
              onChange={onRequestedDateChange}
              renderInput={() => {
                return (
                  <TouchableOpacity
                    style={tw(
                      'flex-row justify-between items-center rounded-md border-default border-light-lavendar',
                    )}>
                    <Text marginH-v2 text13R grey2={!editMode ? true : !inputsData?.requestedDate}>
                      {inputsData?.requestedDate ? formatDateReverse(inputsData?.requestedDate) : 'DD-MM-YYYY'}
                    </Text>
                    <images.CalendarIcon />
                  </TouchableOpacity>
                );
              }}
              errorMsg={errorMessages.requestedDate}
              value={inputsData?.requestedDate}
              minimumDate={new Date()}
            />
          </View>
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')} />
        <View flex style={tw('border-light-lavendar')} />
      </View>

      {isClaimLayoutVisible && <View marginT-v3 row>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <Dropdown
            title={'Claims Layout*'}
            isEditable={false}
            data={claimsLayoutDropdownData}
            placeholder={"Select Claims Layout"}
            value={inputsData?.claimsLayout}
            labelField={'description'}
            valueField={'claimsScreenLayout'}
            onChange={onClaimsLayoutChange}
            errorMsg={errorMessages.claimsLayout}
          />
        </View>
        <View flex marginT-30>
          <TouchableOpacity onPress={onClaimDetailsPress} disabled={!inputsData?.claimsLayout}>
            <Text grey1={!inputsData?.claimsLayout ? true : false} darkBlue={inputsData?.claimsLayout ? true : false}>Claim Details</Text>
          </TouchableOpacity>
        </View>
      </View>}

      <View marginT-v3>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            multiline
            title={'Description*'}
            contextMenuHidden={true}
            style={[tw('h-136px text-btn py-2 leading-5'), { textAlignVertical: 'top' }]}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={editMode}
            value={inputsData?.description}
            onChangeText={onDescriptionChange}
            errorMsg={errorMessages.description}
            placeholder={'Enter Description'}
            showCharCounter={editMode}
            maxLength={1000}
          />
        </View>
      </View>
      <View marginT-v5 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Status*'}
            isEditable={editMode}
            data={SERVICE_WORKFLOW_STATUS_DROPDOWN}
            value={inputsData?.status}
            labelField={'label'}
            valueField={'value'}
            onChange={onStatusChange}
            errorMsg={errorMessages.status}
            placeholder={'Select Status'}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={assignedToLabel}
            isEditable={editMode}
            data={assignToData}
            value={inputsData?.assignedTo}
            labelField={'name'}
            valueField={'employeeNumber'}
            onChange={onAssignedToChange}
            errorMsg={errorMessages.assignedTo}
            placeholder={'Select Assigned To'}
            search
            searchPlaceholder="Search items..."
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={fetchAssignedToDropdownData}
                value={assignedToSearchText}
              />
            )}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar ')}>
          <Text text13M textBlack style={tw('mb-1')}>
            {resolvedDateLabel}
          </Text>
          <View style={tw(isResolvedDateEditable ? 'bg-light-white' : 'bg-light-white1')}>
            <DatePicker
              maximumDate={new Date()}
              isEditable={isResolvedDateEditable}
              mode={DATETIME_PICKER_MODE.DATE}
              onChange={onResolvedDateChange}
              renderInput={() => {
                return (
                  <TouchableOpacity
                    style={tw(
                      'flex-row justify-between items-center rounded-md border-default border-light-lavendar',
                    )}>
                    <Text marginH-v2 text13R grey2={!editMode ? true : !inputsData?.resolvedDate}>
                      {inputsData?.resolvedDate ? formatDateReverse(inputsData?.resolvedDate) : 'DD-MM-YYYY'}
                    </Text>
                    <images.CalendarIcon />
                  </TouchableOpacity>
                );
              }}
              errorMsg={errorMessages.resolvedDate}
            />
          </View>
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}></View>
      </View>
      <View marginT-v3>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            multiline
            title={resolutionLabel}
            contextMenuHidden={true}
            style={[tw('h-136px text-btn py-2 leading-5'), { textAlignVertical: 'top' }]}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={editMode}
            value={inputsData?.resolution}
            onChangeText={onResolutionChange}
            errorMsg={errorMessages.resolution}
            placeholder={'Enter Resolution'}
            showCharCounter={editMode}
            maxLength={1000}
          />
        </View>
      </View>
    </View>
  );
};

export default SWRequestBasicInfoComponent;
