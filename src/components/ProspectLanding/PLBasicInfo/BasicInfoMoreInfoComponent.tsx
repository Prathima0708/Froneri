import View from 'src/components/View';
import React from 'react';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';
import TextError from 'src/components/TextError';

interface BasicInfoMoreInfoComponentProps {
  item: any;
  handleInputChange: any;
  errorMessages: any;
  languageDropdownData: any;
  isEditable: boolean;
  mandatoryData: any;
}

const BasicInfoMoreInfoComponent = (props: BasicInfoMoreInfoComponentProps) => {
  const {
    item,
    handleInputChange,
    errorMessages,
    languageDropdownData,
    isEditable,
    mandatoryData,
  } = props;

  const handlePreviousCustomerShipTp = handleInputChange(
    'previousCustomerShipTo',
  );

  const handleWebsite = handleInputChange('website');

  const handleShopNumber = handleInputChange('shopNumber');

  const handleLanguage = handleInputChange('language');

  const previousTitle = `Previous Customer Ship To Number${mandatoryData.previousCustomerShipTo == 1 ? '*' : ''
    }`;
  const websiteTitle = `Website${mandatoryData.website == 1 ? '*' : ''}`;
  const shopNumberTitle = `Shop number / Filial Number${mandatoryData.shopNumber == 1 ? '*' : ''
    }`;
  const languageTitle = `Language${mandatoryData.language == 1 ? '*' : ''}`;

  return (
    <View marginV-v2>
      <View centerH marginT-v2 style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          More Info
        </Text>
      </View>
      <View row>
        <View flex marginR-v2 marginT-v3>
          <InputText
            title={previousTitle}
            keyboardType="numeric"
            value={item.previousCustomerShipTo}
            onChangeText={handlePreviousCustomerShipTp}
            isEditable={isEditable}
            maxLength={10}
            errorMsg={errorMessages.previousCustomerShipTo}
          />
        </View>
        <View flex marginT-v3 marginR-v2>
          <View>
            <Text text13M textBlack>
              {websiteTitle}
            </Text>
            <View
              flex
              row
              marginT-v1
              paddingB-1
              style={tw('border-default rounded-md border-light-lavendar')}>
              <View
                flex-1
                style={tw('bg-light-lavendar justify-center items-center')}>
                <Text text12R textGrey>
                  {'https://'}
                </Text>
              </View>
              <View flex-3>
                <InputText
                  value={item.website}
                  onChangeText={handleWebsite}
                  noBorders
                  isEditable={isEditable}
                  maxLength={50}
                  style={tw('h-33px')}
                />
              </View>
            </View>
          </View>
          {errorMessages.website && (
            <TextError errorMsg={errorMessages.website} />
          )}
        </View>

        <View flex marginT-v3 marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={shopNumberTitle}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.shopNumber}
            onChangeText={handleShopNumber}
            isEditable={isEditable}
            maxLength={40}
            errorMsg={errorMessages.shopNumber}
          />
        </View>
        <View flex marginT-v3 style={tw('border-light-lavendar')}>
          <Dropdown
            title={languageTitle}
            isEditable={isEditable}
            data={languageDropdownData}
            placeholder="Select Language"
            value={item.language}
            labelField={'descriptionLanguage'}
            valueField={'languageKey'}
            onChange={handleLanguage}
            errorMsg={errorMessages.language}
          />
        </View>
      </View>
    </View>
  );
};

export default BasicInfoMoreInfoComponent;
