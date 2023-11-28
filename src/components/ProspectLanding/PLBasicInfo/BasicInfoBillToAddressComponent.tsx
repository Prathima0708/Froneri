import View from 'src/components/View';
import React from 'react';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';

interface BasicInfoBillToAddressComponentProps {
  isEditable: boolean;
  countryDropdownData: any;
  item: any;
  handleInputChange: any;
  errorMessages: any;
  mandatoryData: any;
}

const BasicInfoBillToAddressComponent = (
  props: BasicInfoBillToAddressComponentProps,
) => {
  const {
    isEditable,
    countryDropdownData,
    item,
    handleInputChange,
    errorMessages,
    mandatoryData,
  } = props;

  const handleHouseNumber = handleInputChange('houseNumber');

  const handleAddress1 = handleInputChange('address1');

  const handleAddress2 = handleInputChange('address2');

  const handleAddress3 = handleInputChange('address3');

  const handleZipCode = handleInputChange('zipCode');

  const handlePOBox = handleInputChange('poBox');
  const handlePostalCodePOBox = handleInputChange('postalCodePOBox');
  const handleCityPOBox = handleInputChange('cityPOBox');

  const handleCity = handleInputChange('city');
  const handleCountry = handleInputChange('country');

  const houseNoTitle = `House Number${
    mandatoryData.houseNumber == 1 ? '*' : ''
  }`;
  const address1Title = `Address 1${mandatoryData.address1 == 1 ? '*' : ''}`;
  const address2Title = `Address 2${mandatoryData.address2 == 1 ? '*' : ''}`;
  const address3Title = `Address 3${mandatoryData.address3 == 1 ? '*' : ''}`;
  const zipCodeTitle = `Zip Code${mandatoryData.zipCode == 1 ? '*' : ''}`;
  const poBoxTitle = `P.O. Box${mandatoryData.poBox == 1 ? '*' : ''}`;
  const postalCodePoBoxTitle = `Postal Code P.O Box${
    mandatoryData.postalCodePOBox == 1 ? '*' : ''
  }`;
  const cityPoBoxTitle = `City P.O Box${
    mandatoryData.cityPOBox == 1 ? '*' : ''
  }`;
  const cityTitle = `City${mandatoryData.city == 1 ? '*' : ''}`;
  const countryTitle = `Country${mandatoryData.country == 1 ? '*' : ''}`;

  return (
    <View marginT-v2>
      <View centerH marginT-v2 style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Address
        </Text>
      </View>
      <View marginT-v3 row centerV>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={houseNoTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.houseNumber}
            onChangeText={handleHouseNumber}
            isEditable={isEditable}
            maxLength={10}
            errorMsg={errorMessages.houseNumber}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={address1Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.address1}
            onChangeText={handleAddress1}
            isEditable={isEditable}
            maxLength={40}
            errorMsg={errorMessages.address1}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={address2Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.address2}
            onChangeText={handleAddress2}
            isEditable={isEditable}
            maxLength={40}
            errorMsg={errorMessages.address2}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={address3Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.address3}
            onChangeText={handleAddress3}
            isEditable={isEditable}
            maxLength={40}
            errorMsg={errorMessages.address3}
          />
        </View>
      </View>
      <View marginT-v5 row centerV>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={zipCodeTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.zipCode}
            onChangeText={handleZipCode}
            isEditable={isEditable}
            maxLength={10}
            keyboardType={'numeric'}
            errorMsg={errorMessages.zipCode}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={poBoxTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.poBox}
            onChangeText={handlePOBox}
            isEditable={isEditable}
            maxLength={10}
            errorMsg={errorMessages.poBox}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={postalCodePoBoxTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.postalCodePOBox}
            onChangeText={handlePostalCodePOBox}
            isEditable={isEditable}
            maxLength={10}
            errorMsg={errorMessages.postalCodePOBox}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={cityPoBoxTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.cityPOBox}
            onChangeText={handleCityPOBox}
            isEditable={isEditable}
            maxLength={10}
            errorMsg={errorMessages.cityPOBox}
          />
        </View>
      </View>
      <View marginV-v5 row centerV>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={cityTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.city}
            onChangeText={handleCity}
            isEditable={isEditable}
            maxLength={50}
            errorMsg={errorMessages.city}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={countryTitle}
            isEditable={isEditable}
            data={countryDropdownData}
            placeholder="Select Country"
            value={item.country}
            labelField={'description'}
            valueField={'discoveryListValuesId'}
            onChange={handleCountry}
            errorMsg={errorMessages.country}
          />
        </View>
        <View flex marginR-v2 />
        <View flex />
      </View>
      <View row paddingV-v6>
        <View flex-1 marginR-v2 />
        <View flex-1 marginR-v2 />
      </View>
    </View>
  );
};

export default BasicInfoBillToAddressComponent;
