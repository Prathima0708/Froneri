import View from 'src/components/View';
import React, { useState } from 'react';
import InputText from 'src/components/InputText';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import { tw } from 'src/tw';
import Dropdown from 'src/components/DropDown';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

interface ProspectInfoComponentProps {
  isEditable: boolean;
  handleDelete: any;
  countryDropdownData: any;
  salesAreaDropdownData: any;
  customerHierarchyDropdownData: any;
  employeeDropdownData: any;
  outletClassificationDropdownData: any;
  getCustomerHierarchyDropdownData: any;
  getOutletClassificationDropdownData: any;
  getEmployeeDropdownData: any;
  isProspectDeletable: boolean;
  handleInputChange: any;
  onCustomerHierarchyFocus: any;
  errorMessages: any;
  screenType?: string;
  inputsData?: any;
  mandatoryData: any;
}

const ProspectInfoComponent = (props: ProspectInfoComponentProps) => {
  const {
    isEditable,
    mandatoryData,
    handleDelete,
    screenType,
    inputsData,
    countryDropdownData,
    salesAreaDropdownData,
    customerHierarchyDropdownData,
    outletClassificationDropdownData,
    employeeDropdownData,
    getCustomerHierarchyDropdownData,
    getOutletClassificationDropdownData,
    getEmployeeDropdownData,
    isProspectDeletable,
    handleInputChange,
    errorMessages,
    onCustomerHierarchyFocus,
  } = props;

  const [outletSearchText, setOutletSearchText] = useState('');
  const [customerHierarchySearchText, setCustomerHierarchySearchText] = useState("")

  const nameTitle =
    mandatoryData.name == 1 ? 'label.general.name*' : 'label.general.name';

  const addressTitle =
    mandatoryData.address == 1
      ? 'label.general.address*'
      : 'label.general.address';

  const phoneNumberTitle =
    mandatoryData.phoneNumber == 1
      ? 'label.general.phone_no*'
      : 'label.general.phone_no';

  const streetNumberTitle =
    mandatoryData.streetNo == 1
      ? 'label.general.street_number*'
      : 'label.general.street_number';

  const zipCodeTitle =
    mandatoryData.zipCode == 1
      ? 'label.general.zipcode*'
      : 'label.general.zipcode';

  const cityTitle =
    mandatoryData.city == 1 ? 'label.general.city*' : 'label.general.city';

  const countryTitle =
    mandatoryData.country == 1
      ? 'label.general.country*'
      : 'label.general.country';

  const customerHierarchyTitle =
    mandatoryData.customerHierarchy == 1
      ? 'label.general.customer_hierarchy*'
      : 'label.general.customer_hierarchy';
  const iceCreamBulkTitle =
    mandatoryData.iceCreamBulk == 1
      ? 'label.createprospect.ice_cream_bulk*'
      : 'label.createprospect.ice_cream_bulk';
  const iceCreamImpluseTitle =
    mandatoryData.iceCreamImpluse == 1
      ? 'label.createprospect.ice_cream_impluse*'
      : 'label.createprospect.ice_cream_impluse';
  const frozenFoodTitle =
    mandatoryData.frozenFood == 1
      ? 'label.createprospect.frozen_food*'
      : 'label.createprospect.frozen_food';

  const outletClassificationTitle =
    mandatoryData.outlet == 1
      ? 'label.general.outlet_classification*'
      : 'label.general.outlet_classification';

  const handleName = handleInputChange('name');

  const handleAddress = handleInputChange('address');

  const handlePhoneNumber = handleInputChange('phoneNumber');

  const handleEmail = handleInputChange('email');

  const handleStreetNumber = handleInputChange('streetNumber');

  const handleZipCode = handleInputChange('zipCode');

  const handleCity = handleInputChange('city');

  const handleCountry = handleInputChange('country');

  const handleSalesArea = handleInputChange('salesArea');

  const handleCustomerHierarchy = handleInputChange('customerHierarchy');

  const handleOutletClassification = handleInputChange('outletClassification');

  const handleEmployeeName = handleInputChange('employeeName');

  const handleIceCreamBulk = handleInputChange('iceCreamBulk');

  const handleIceCreamImpulse = handleInputChange('iceCreamImpulse');

  const handleFrozenFood = handleInputChange('frozenFood');

  const handleOutletSearch = (text: string) => {
    setOutletSearchText(text);
    getOutletClassificationDropdownData(text);
  };

  const handleCustomerHierarchySearch = (text: string) => {
    setCustomerHierarchySearchText(text);
    getCustomerHierarchyDropdownData(text);
  }

  return (
    <View flex>
      <View>
        <View row>
          <View flex marginR-v2>
            <InputText
              title={nameTitle}
              placeholder="placeholder.general.name"
              value={inputsData.name}
              isEditable={isEditable}
              onChangeText={handleName}
              errorMsg={errorMessages.name}
              maxLength={100}
            />
          </View>
          <View flex marginR-v2>
            <InputText
              title={phoneNumberTitle}
              placeholder="placeholder.general.phone_number"
              value={inputsData.phoneNumber}
              isEditable={isEditable}
              onChangeText={handlePhoneNumber}
              errorMsg={errorMessages.phoneNumber}
              keyboardType={'numeric'}
              maxLength={20}
            />
          </View>
          <View flex marginR-v2>
            <InputText
              title={'label.general.email_address'}
              placeholder="placeholder.general.email_address"
              value={inputsData.email}
              isEditable={isEditable}
              onChangeText={handleEmail}
              errorMsg={errorMessages.email}
              maxLength={50}
            />
          </View>
          <View flex marginR-v1>
            <InputText
              title={addressTitle}
              placeholder="placeholder.general.address"
              value={inputsData.address}
              isEditable={isEditable}
              onChangeText={handleAddress}
              errorMsg={errorMessages.address}
              maxLength={100}
            />
          </View>
        </View>
        <View marginT-v5 row>
          <View flex marginR-v2>
            <InputText
              title={streetNumberTitle}
              placeholder="placeholder.general.street_number"
              value={inputsData.streetNumber}
              isEditable={isEditable}
              onChangeText={handleStreetNumber}
              errorMsg={errorMessages.streetNumber}
              keyboardType={'numeric'}
              maxLength={20}
            />
          </View>
          <View flex marginR-v2>
            <InputText
              title={zipCodeTitle}
              placeholder="placeholder.general.zipcode"
              value={inputsData.zipCode}
              isEditable={isEditable}
              onChangeText={handleZipCode}
              errorMsg={errorMessages.zipCode}
              maxLength={10}
              keyboardType={'numeric'}
            />
          </View>
          <View flex marginR-v2>
            <InputText
              title={cityTitle}
              placeholder="placeholder.general.city"
              value={inputsData.city}
              isEditable={isEditable}
              onChangeText={handleCity}
              errorMsg={errorMessages.city}
              maxLength={50}
            />
          </View>
          <View flex marginR-v1>
            <Dropdown
              title={countryTitle}
              isEditable={isEditable}
              data={countryDropdownData}
              placeholder="placeholder.general.country"
              value={inputsData.country}
              labelField={'description'}
              valueField={'discoveryListValuesId'}
              onChange={handleCountry}
              errorMsg={errorMessages.country}
            />
          </View>
        </View>
        <View marginV-v6 style={tw('bg-light-lavendar h-px')} />
      </View>
      <View>
        <View row>
          <View flex marginR-v2>
            <InputText
              title={'label.general.prospect_number'}
              value={inputsData.prospectNumber}
              isEditable={false}
            />
          </View>
          <View flex marginR-v2>
            <Dropdown
              title="label.general.sales_area"
              isEditable={isEditable}
              data={salesAreaDropdownData}
              placeholder="placeholder.general.sales_area"
              value={inputsData.salesArea}
              labelField={'salesArea'}
              valueField={'salesAreaValue'}
              onChange={handleSalesArea}
              errorMsg={errorMessages.salesArea}
            />
          </View>

          <View flex marginR-v2>
            <Dropdown
              title={customerHierarchyTitle}
              isEditable={isEditable}
              data={customerHierarchyDropdownData}
              placeholder="placeholder.general.customer_hierarchy"
              search
              searchPlaceholder="Search items..."
              renderInputSearch={() => {
                if (customerHierarchyDropdownData.length > 0 || customerHierarchySearchText.length > 0) {
                  return (
                    <DropdownSearchComponent
                      handleSearchDropdown={handleCustomerHierarchySearch}
                      value={customerHierarchySearchText}
                    />
                  );
                }
                return (
                  <Text text13M grey3 center>
                    No data
                  </Text>
                );
              }}
              value={inputsData.customerHierarchy}
              labelField={'l6HierarchyLabel'}
              valueField={'l6HierarchyValue'}
              onChange={handleCustomerHierarchy}
              errorMsg={errorMessages.customerHierarchy}
              onFocus={onCustomerHierarchyFocus}
            />
          </View>
          <View flex marginR-v1>
            <Dropdown
              title={outletClassificationTitle}
              isEditable={isEditable}
              data={outletClassificationDropdownData}
              placeholder="placeholder.general.outlet_classification"
              search
              searchPlaceholder="Search items..."
              renderInputSearch={() => (
                <DropdownSearchComponent
                  handleSearchDropdown={handleOutletSearch}
                  value={outletSearchText}
                />
              )}
              value={inputsData.outletClassification}
              labelField={'descriptionLanguage'}
              valueField={'industryCode'}
              onChange={handleOutletClassification}
              errorMsg={errorMessages.outletClassification}
            />
          </View>
        </View>
        <View marginT-v5 row centerV>
          <View flex marginR-v2>
            <Dropdown
              title="label.createprospect.fsr_employee_name"
              isEditable={isEditable}
              data={employeeDropdownData}
              placeholder="placeholder.createprospect.fsr_employee_name"
              search
              searchPlaceholder="Search items..."
              renderInputSearch={() => (
                <DropdownSearchComponent
                  handleSearchDropdown={getEmployeeDropdownData}
                />
              )}
              value={inputsData.employeeName}
              labelField={'employeeDetails'}
              valueField={'employeeNumber'}
              onChange={handleEmployeeName}
              errorMsg={errorMessages.employeeName}
            />
          </View>
          <View flex-3 marginR-v5></View>
        </View>
        <View marginV-v6 style={tw('bg-light-lavendar h-px')} />
      </View>
      <View>
        <Text text18M textBlack>
          {'label.createprospect.potential'}
        </Text>
        <View marginT-v3 row>
          <View flex marginR-v2>
            <InputText
              title={iceCreamBulkTitle}
              placeholder="0"
              value={inputsData.iceCreamBulk}
              isEditable={isEditable}
              onChangeText={handleIceCreamBulk}
              errorMsg={errorMessages.iceCreamBulk}
              keyboardType={'numeric'}
              maxLength={4}
              style={tw('text-right')}
            />
          </View>
          <View flex marginR-v2>
            <InputText
              title={iceCreamImpluseTitle}
              placeholder="0"
              value={inputsData.iceCreamImpulse}
              isEditable={isEditable}
              onChangeText={handleIceCreamImpulse}
              errorMsg={errorMessages.iceCreamImpulse}
              keyboardType={'numeric'}
              maxLength={4}
              style={tw('text-right')}
            />
          </View>
          <View flex marginR-v2>
            <InputText
              title={frozenFoodTitle}
              placeholder="0"
              value={inputsData.frozenFood}
              isEditable={isEditable}
              onChangeText={handleFrozenFood}
              errorMsg={errorMessages.frozenFood}
              keyboardType={'numeric'}
              maxLength={4}
              style={tw('text-right')}
            />
          </View>
          <View flex marginR-v1>
            <InputText
              title={'label.createprospect.total'}
              placeholder="0"
              value={inputsData.total}
              isEditable={false}
              style={tw('text-right')}
            />
          </View>
        </View>
        {screenType !== 'Create' &&
          (!isEditable ? (
            <TouchableOpacity
              style={tw('mt-36px')}
              onPress={handleDelete}
              disabled={!isProspectDeletable}>
              <images.DeleteIcon />
            </TouchableOpacity>
          ) : null)}
      </View>
    </View>
  );
};

export default ProspectInfoComponent;
