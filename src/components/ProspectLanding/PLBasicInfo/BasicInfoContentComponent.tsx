import View from 'src/components/View';
import React from 'react';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';

interface BasicInfoContentComponentProps {
  item: any;
  handleInputChange: any;
  errorMessages: any;
  isEditable: boolean;
  mandatoryData: any;
}

const BasicInfoContentComponent = (props: BasicInfoContentComponentProps) => {
  const {item, handleInputChange, errorMessages, isEditable, mandatoryData} =
    props;

  const handleName1 = handleInputChange('name1');

  const handleName2 = handleInputChange('name2');

  const handleName3 = handleInputChange('name3');

  const handleName4 = handleInputChange('name4');

  const handleEmail = handleInputChange('email');

  const handlePhoneNumber = handleInputChange('phoneNumber');

  const handleMobileNumber = handleInputChange('mobileNumber');

  const handleFax = handleInputChange('fax');

  const name1Title = `Name 1${mandatoryData.name1 == 1 ? '*' : ''}`;
  const name2Title = `Name 2${mandatoryData.name2 == 1 ? '*' : ''}`;
  const name3Title = `Name 3${mandatoryData.name3 == 1 ? '*' : ''}`;
  const name4Title = `Name 4${mandatoryData.name4 == 1 ? '*' : ''}`;
  const emailTitle = `Email${mandatoryData.email == 1 ? '*' : ''}`;
  const phoneNoTitle = `Phone Number${
    mandatoryData.phoneNumber == 1 ? '*' : ''
  }`;
  const mobileNoTitle = `Mobile Number${
    mandatoryData.mobileNumber == 1 ? '*' : ''
  }`;
  const faxTitle = `Fax${mandatoryData.fax == 1 ? '*' : ''}`;

  return (
    <View>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={name1Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.name1}
            onChangeText={handleName1}
            isEditable={isEditable}
            maxLength={35}
            errorMsg={errorMessages.name1}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={name2Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.name2}
            onChangeText={handleName2}
            isEditable={isEditable}
            maxLength={35}
            errorMsg={errorMessages.name2}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={name3Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.name3}
            onChangeText={handleName3}
            isEditable={isEditable}
            maxLength={35}
            errorMsg={errorMessages.name3}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={name4Title}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.name4}
            onChangeText={handleName4}
            isEditable={isEditable}
            maxLength={35}
            errorMsg={errorMessages.name4}
          />
        </View>
      </View>
      <View marginT-v5 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={emailTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.email}
            onChangeText={handleEmail}
            isEditable={isEditable}
            maxLength={50}
            errorMsg={errorMessages.email}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={phoneNoTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.phoneNumber}
            onChangeText={handlePhoneNumber}
            isEditable={isEditable}
            maxLength={20}
            keyboardType={'numeric'}
            errorMsg={errorMessages.phoneNumber}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={mobileNoTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.mobileNumber}
            onChangeText={handleMobileNumber}
            isEditable={isEditable}
            maxLength={20}
            keyboardType={'numeric'}
            errorMsg={errorMessages.mobileNumber}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={faxTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.fax}
            onChangeText={handleFax}
            isEditable={isEditable}
            maxLength={20}
            keyboardType={'numeric'}
            errorMsg={errorMessages.fax}
          />
        </View>
      </View>
      <View marginT-v7 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default BasicInfoContentComponent;
