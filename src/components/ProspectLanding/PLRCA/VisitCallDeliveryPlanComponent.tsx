import React from 'react';

import { tw } from 'src/tw';

import View from 'src/components/View';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';
import InputText from 'src/components/InputText';

import DropdownSearchComponent from 'src/components/DropdownSearchComponent';
import CallDeliveryDayComponent from 'src/components/ProspectLanding/PLRCA/CallDeliveryDayComponent';

interface VisitCallDeliveryPlanComponentProps {
  inputFields: any;
  errorMessages: any;
  seasonDropdownData: any;
  callFrequencyDropdownData: any;
  distributionCenterDropdownData: any;
  transitCallPlaceDropdownData: any;
  weekDropdownData: any;
  handleInputChange: any;
  getTransitCallPlaceDropdownData: any;
  onCallFrequencyFocus: any;
  callDayDisabled: boolean;
  isEditable: boolean;
  mandatoryData: any;
  callAndDeliveryWeekDropdownData: any;
}

const VisitCallDeliveryPlanComponent = (props: VisitCallDeliveryPlanComponentProps) => {
  const {
    inputFields,
    errorMessages,
    seasonDropdownData,
    callFrequencyDropdownData,
    distributionCenterDropdownData,
    transitCallPlaceDropdownData,
    weekDropdownData,
    handleInputChange,
    getTransitCallPlaceDropdownData,
    onCallFrequencyFocus,
    callDayDisabled,
    isEditable,
    mandatoryData,
    callAndDeliveryWeekDropdownData,
  } = props;

  const handleSeason = handleInputChange('season');

  const handleCallFrequency = handleInputChange('callFrequency')

  const handleCallWeek = handleInputChange('callWeek')

  const handleDeliveryWeek = handleInputChange('deliveryWeek')

  const handleDistributionCenter = handleInputChange('distributionCenter')

  const handleTransitCallPlace = handleInputChange('transitCallPlace')

  const handleNotes = handleInputChange('notes')

  const handleMondayCall = handleInputChange('mondayCall')

  const handleTuesdayCall = handleInputChange('tuesdayCall')

  const handleWednesdayCall = handleInputChange('wednesdayCall')

  const handleThursdayCall = handleInputChange('thursdayCall')

  const handleFridayCall = handleInputChange('fridayCall')

  const handleSaturdayCall = handleInputChange('saturdayCall')

  const handleSundayCall = handleInputChange('sundayCall')

  const handleMondayDropdown = handleInputChange('mondayDropdown')

  const handleTuesdayDropdown = handleInputChange('tuesdayDropdown')

  const handleWednesdayDropdown = handleInputChange('wednesdayDropdown')

  const handleThursdayDropdown = handleInputChange('thursdayDropdown')

  const handleFridayDropdown = handleInputChange('fridayDropdown')

  const handleSaturdayDropdown = handleInputChange('saturdayDropdown')

  const handleSundayDropdown = handleInputChange('sundayDropdown')

  const seasonTitle = mandatoryData?.season ? 'Season *' : 'Season'
  const frequencyTitle = mandatoryData?.callFrequency ? 'Call Frequency *' : 'Call Frequency'
  const callWeekTitle = mandatoryData?.callWeek ? 'Call Week *' : 'Call Week'
  const deliveryWeekTitle = mandatoryData?.deliveryWeek ? 'Delivery Week *' : 'Delivery Week'
  const distributionCenterTitle = mandatoryData?.distributionCenter ? 'Distribution Center *' : 'Distribution Center'
  const transitCallPlaceTitle = mandatoryData?.transitCallPlace ? 'Transit Call Place *' : 'Transit Call Place'
  const notesTitle = mandatoryData?.notes ? 'Notes *' : 'Notes'

  return (
    <View>
      <View row>
        <View flex marginR-v2>
          <Dropdown
            isEditable={isEditable}
            title={seasonTitle}
            labelField="description"
            valueField="season"
            placeholder="Select Season"
            data={seasonDropdownData}
            value={inputFields.season}
            onChange={handleSeason}
            errorMsg={errorMessages.season}
          />
        </View>
        <View flex marginR-v2>
          <Dropdown
            isEditable={isEditable}
            title={frequencyTitle}
            labelField="label"
            valueField="value"
            placeholder="Select Call Frequency"
            data={callFrequencyDropdownData}
            value={inputFields.callFrequency}
            onChange={handleCallFrequency}
            onFocus={onCallFrequencyFocus}
            errorMsg={errorMessages.callFrequency}
          />
        </View>
        <View flex marginR-v2>
          <Dropdown
            isEditable={isEditable}
            title={callWeekTitle}
            labelField="label"
            valueField="value"
            placeholder="Select Call Week"
            data={callAndDeliveryWeekDropdownData}
            value={inputFields.callWeek}
            onChange={handleCallWeek}
            errorMsg={errorMessages.callWeek}
          />
        </View>
        <View flex>
          <Dropdown
            isEditable={isEditable}
            title={deliveryWeekTitle}
            labelField="label"
            valueField="value"
            placeholder="Select Delivery Week"
            data={callAndDeliveryWeekDropdownData}
            value={inputFields.deliveryWeek}
            onChange={handleDeliveryWeek}
            errorMsg={errorMessages.deliveryWeek}
          />
        </View>
      </View>
      <View row marginT-v5>
        <View flex marginR-v2>
          <Dropdown
            isEditable={isEditable}
            title={distributionCenterTitle}
            labelField="description"
            valueField="rdcNumber"
            placeholder="Select Distribution Center"
            data={distributionCenterDropdownData}
            value={inputFields.distributionCenter}
            onChange={handleDistributionCenter}
            errorMsg={errorMessages.distributionCenter}
          />
        </View>
        <View flex marginR-v2>
          <Dropdown
            isEditable={isEditable}
            title={transitCallPlaceTitle}
            labelField="callPlaceName"
            valueField="callPlaceNumber"
            placeholder="Select Transit Call Place"
            data={transitCallPlaceDropdownData}
            value={inputFields.transitCallPlace}
            onChange={handleTransitCallPlace}
            search
            searchPlaceholder="Search items..."
            renderInputSearch={() => (
              <DropdownSearchComponent handleSearchDropdown={getTransitCallPlaceDropdownData} />
            )}
            errorMsg={errorMessages.transitCallPlace}
          />
        </View>
        <View flex-2 marginR-v2></View>
      </View>
      <View row marginT-v7>
        {weekDropdownData.length > 0 && <View flex marginR-v2>
          <View row centerV spread>
            <Text text13M textBlack flex marginR-v2>
              Call Day
            </Text>
            <Text text13M textBlack flex>
              Delivery Day
            </Text>
          </View>
          <CallDeliveryDayComponent
            weekLabel={weekDropdownData[0].label}
            isSelect={inputFields.mondayCall}
            handleCallDay={handleMondayCall}
            weekDropdownData={weekDropdownData}
            dropdownValue={inputFields.mondayDropdown}
            handleDropdown={handleMondayDropdown}
            disabled={callDayDisabled}
            deliveryErrorMsg={errorMessages.mondayDropdown}
          />
          <CallDeliveryDayComponent
            weekLabel={weekDropdownData[1].label}
            isSelect={inputFields.tuesdayCall}
            handleCallDay={handleTuesdayCall}
            weekDropdownData={weekDropdownData}
            dropdownValue={inputFields.tuesdayDropdown}
            handleDropdown={handleTuesdayDropdown}
            disabled={callDayDisabled}
            deliveryErrorMsg={errorMessages.tuesdayDropdown}
          />
          <CallDeliveryDayComponent
            weekLabel={weekDropdownData[2].label}
            isSelect={inputFields.wednesdayCall}
            handleCallDay={handleWednesdayCall}
            weekDropdownData={weekDropdownData}
            dropdownValue={inputFields.wednesdayDropdown}
            handleDropdown={handleWednesdayDropdown}
            disabled={callDayDisabled}
            deliveryErrorMsg={errorMessages.wednesdayDropdown}
          />
          <CallDeliveryDayComponent
            weekLabel={weekDropdownData[3].label}
            isSelect={inputFields.thursdayCall}
            handleCallDay={handleThursdayCall}
            weekDropdownData={weekDropdownData}
            dropdownValue={inputFields.thursdayDropdown}
            handleDropdown={handleThursdayDropdown}
            disabled={callDayDisabled}
            deliveryErrorMsg={errorMessages.thursdayDropdown}
          />
          <CallDeliveryDayComponent
            weekLabel={weekDropdownData[4].label}
            isSelect={inputFields.fridayCall}
            handleCallDay={handleFridayCall}
            weekDropdownData={weekDropdownData}
            dropdownValue={inputFields.fridayDropdown}
            handleDropdown={handleFridayDropdown}
            disabled={callDayDisabled}
            deliveryErrorMsg={errorMessages.fridayDropdown}
          />
          <CallDeliveryDayComponent
            weekLabel={weekDropdownData[5].label}
            isSelect={inputFields.saturdayCall}
            handleCallDay={handleSaturdayCall}
            weekDropdownData={weekDropdownData}
            dropdownValue={inputFields.saturdayDropdown}
            handleDropdown={handleSaturdayDropdown}
            disabled={callDayDisabled}
            deliveryErrorMsg={errorMessages.saturdayDropdown}
          />
          <CallDeliveryDayComponent
            weekLabel={weekDropdownData[6].label}
            isSelect={inputFields.sundayCall}
            handleCallDay={handleSundayCall}
            weekDropdownData={weekDropdownData}
            dropdownValue={inputFields.sundayDropdown}
            handleDropdown={handleSundayDropdown}
            disabled={callDayDisabled}
            deliveryErrorMsg={errorMessages.sundayDropdown}
          />
        </View>}
        <View flex>
          <InputText
            style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
            title="Notes"
            placeholder={notesTitle}
            multiline
            value={inputFields.notes}
            showCharCounter
            maxLength={500}
            onChangeText={handleNotes}
            isEditable={isEditable}
            errorMsg={errorMessages.notes}
          />
        </View>
      </View>
    </View>
  );
};

export default VisitCallDeliveryPlanComponent;
