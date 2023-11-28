import View from 'src/components/View';
import React from 'react';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';
interface BasicInfoAddressComponentProps {
  isEditable: boolean;
  countryDropdownData: any;
  item: any;
  handleInputChange: any;
  errorMessages: any;
  mandatoryData: any;
  statusType: string;
}

const BasicInfoAddressComponent = (props: BasicInfoAddressComponentProps) => {
  const {
    isEditable,
    countryDropdownData,
    item,
    handleInputChange,
    errorMessages,
    mandatoryData,
    statusType,
  } = props;

  const handleHouseNumber = handleInputChange('houseNumber');

  const handleAddress1 = handleInputChange('address1');

  const handleAddress2 = handleInputChange('address2');

  const handleAddress3 = handleInputChange('address3');

  const handleStreet3 = handleInputChange('coOrStreet3');

  const handleZipCode = handleInputChange('zipCode');

  const handlePOBox = handleInputChange('poBox');

  const handleCity = handleInputChange('city');

  const handleCountry = handleInputChange('country');

  const handleLatitude = handleInputChange('latitude');

  const handleLongitude = handleInputChange('longitude');

  const houseNoTitle = `House Number${
    mandatoryData.houseNumber == 1 ? '*' : ''
  }`;
  const Address1Title = `Address 1${mandatoryData.address1 == 1 ? '*' : ''}`;
  const Address2Title = `Address 2${mandatoryData.address2 == 1 ? '*' : ''}`;
  const Address3Title = `Address 3${mandatoryData.address3 == 1 ? '*' : ''}`;
  const zipCodeTitle = `Zip Code${mandatoryData.zipCode == 1 ? '*' : ''}`;
  const poBoxTitle = `P.O. Box${mandatoryData.poBox == 1 ? '*' : ''}`;
  const cityTitle = `City${mandatoryData.city == 1 ? '*' : ''}`;
  const countryTitle = `Country${mandatoryData.country == 1 ? '*' : ''}`;

  let countryDropdownValueField = '';
  if (statusType.toLowerCase() == 'p') {
    countryDropdownValueField = 'discoveryListValuesId';
  } else {
    countryDropdownValueField = 'itemValue';
  }

  return (
    <View marginT-v2>
      <View centerH marginT-v2 style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Address
        </Text>
      </View>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={houseNoTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.houseNumber}
            onChangeText={handleHouseNumber}
            maxLength={10}
            errorMsg={errorMessages.houseNumber}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={Address1Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.address1}
            onChangeText={handleAddress1}
            maxLength={40}
            errorMsg={errorMessages.address1}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={Address2Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.address2}
            onChangeText={handleAddress2}
            maxLength={40}
            errorMsg={errorMessages.address2}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={Address3Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.address3}
            onChangeText={handleAddress3}
            maxLength={40}
            errorMsg={errorMessages.address3}
          />
        </View>
      </View>
      <View marginT-v5 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={zipCodeTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.zipCode}
            onChangeText={handleZipCode}
            maxLength={10}
            keyboardType={'numeric'}
            errorMsg={errorMessages.zipCode}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={poBoxTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.poBox}
            onChangeText={handlePOBox}
            maxLength={10}
            errorMsg={errorMessages.poBox}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={cityTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.city}
            onChangeText={handleCity}
            maxLength={50}
            errorMsg={errorMessages.city}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title={countryTitle}
            isEditable={isEditable}
            data={countryDropdownData}
            placeholder="Select Country"
            value={item.country}
            labelField={'description'}
            valueField={countryDropdownValueField}
            onChange={handleCountry}
            errorMsg={errorMessages.country}
          />
        </View>
      </View>
      <View marginT-v5 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'C/O'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.coOrStreet3}
            onChangeText={handleStreet3}
            maxLength={40}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Latitude'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.latitude}
            onChangeText={handleLatitude}
            maxLength={10}
            keyboardType={'numeric'}
            errorMsg={errorMessages.latitude}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Longitude'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={isEditable}
            value={item.longitude}
            onChangeText={handleLongitude}
            maxLength={10}
            keyboardType={'numeric'}
            errorMsg={errorMessages.longitude}
          />
        </View>
        <View flex />
      </View>
      <View marginT-v7 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default BasicInfoAddressComponent;
