import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useMemo} from 'react';
import {tw} from 'src/tw';
import {TouchableOpacity} from 'react-native';
import InputText from 'src/components/InputText';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import CheckBox from 'src/components/CheckBox';

interface TaxAndTurnoverComponentProps {
  inputData: any;
  handleInputChange: any;
  handleSaveFinancialInfo: any;
  handleCancel: any;
  errorMessages: any;
  handleTaMinimumTurnoverExplained: any;
  isEditable: boolean;
  mandatoryData: any;
}

const TaxAndTurnoverComponent = (props: TaxAndTurnoverComponentProps) => {
  const {
    inputData,
    handleInputChange,
    handleSaveFinancialInfo,
    handleCancel,
    errorMessages,
    handleTaMinimumTurnoverExplained,
    isEditable,
    mandatoryData,
  } = props;

  const handleTaxPayerAccNumber = handleInputChange('taxPayerAccNumber');
  const handleSalesTaxIdNumber = handleInputChange('salesTaxIdNumber');
  // const handleTaMinimumTurnOver = handleInputChange('taMinimumTurnOver');
  const handleExpectedTurnOverOne = handleInputChange('expectedTurnOverOne');
  const handleExpectedTurnOverTwo = handleInputChange('expectedTurnOverTwo');
  const handleExpectedTurnOverThree = handleInputChange(
    'expectedTurnOverThree',
  );
  const handleTotalPotentialTurnOver = handleInputChange(
    'totalPotentialTurnOver',
  );

  // Total potential value
  const totalPotentialTurnOverVal = useMemo(() => {
    const totalVal =
      Number(inputData?.expectedTurnOverOne) +
      Number(inputData?.expectedTurnOverTwo) +
      Number(inputData?.expectedTurnOverThree);
    return totalVal.toString();
  }, [
    inputData?.expectedTurnOverOne,
    inputData?.expectedTurnOverThree,
    inputData?.expectedTurnOverTwo,
  ]);

  const taxPayerAccNumberTitle = mandatoryData.taxPayerAccNumber
    ? 'Tax Payer Account Number*'
    : 'Tax Payer Account Number';
  const salesTaxIdNumberTitle = mandatoryData.salesTaxIdNumber
    ? 'Sales Tax Identification Number*'
    : 'Sales Tax Identification Number';
  const expectedTurnover1Title = mandatoryData.expectedTurnOverOne
    ? 'Expected Turnover 1*'
    : 'Expected Turnover 1';
  const expectedTurnover2Title = mandatoryData.expectedTurnOverTwo
    ? 'Expected Turnover 2*'
    : 'Expected Turnover 2';
  const expectedTurnover3Title = mandatoryData.expectedTurnOverThree
    ? 'Expected Turnover 3*'
    : 'Expected Turnover 3';

  return (
    <View marginV-v2 paddingH-v4>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={taxPayerAccNumberTitle}
            placeholder={isEditable && 'Tax Payer Account Number'}
            value={inputData.taxPayerAccNumber}
            onChangeText={handleTaxPayerAccNumber}
            errorMsg={errorMessages.taxPayerAccNumber}
            maxLength={20}
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={salesTaxIdNumberTitle}
            placeholder={isEditable && 'Sales Tax Identification Number'}
            value={inputData.salesTaxIdNumber}
            onChangeText={handleSalesTaxIdNumber}
            errorMsg={errorMessages.salesTaxIdNumber}
            maxLength={12}
            isEditable={isEditable}
          />
        </View>
        <View flex-2 marginR-v2 marginT-v1 style={tw('border-light-lavendar')}>
          <View marginT-v4 row centerV>
            <CheckBox
              label="TA Minimum Turnover Explained"
              labelStyle={tw('text-light-grey2')}
              value={inputData.taMinimumTurnoverExplained}
              onValueChange={handleTaMinimumTurnoverExplained}
              color={
                inputData
                  ? ColourPalette.light.darkBlue
                  : ColourPalette.light.grey4
              }
              disabled={!isEditable}
            />
          </View>
        </View>
      </View>
      <View marginT-v6 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={expectedTurnover1Title}
            keyboardType="numeric"
            placeholder={isEditable && '0'}
            value={inputData.expectedTurnOverOne}
            onChangeText={handleExpectedTurnOverOne}
            errorMsg={errorMessages.expectedTurnOverOne}
            maxLength={100}
            isEditable={isEditable}
            style={tw('text-right')}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={expectedTurnover2Title}
            keyboardType="numeric"
            placeholder={isEditable && '0'}
            value={inputData.expectedTurnOverTwo}
            onChangeText={handleExpectedTurnOverTwo}
            errorMsg={errorMessages.expectedTurnOverTwo}
            maxLength={100}
            isEditable={isEditable}
            style={tw('text-right')}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={expectedTurnover3Title}
            keyboardType="numeric"
            placeholder={isEditable && '0'}
            value={inputData.expectedTurnOverThree}
            onChangeText={handleExpectedTurnOverThree}
            errorMsg={errorMessages.expectedTurnOverThree}
            maxLength={100}
            isEditable={isEditable}
            style={tw('text-right')}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={'Total Potential Turnover'}
            keyBoardType="numeric"
            value={totalPotentialTurnOverVal}
            onChangeText={handleTotalPotentialTurnOver}
            isEditable={false}
            style={tw('text-right')}
          />
        </View>
      </View>
    </View>
  );
};

export default TaxAndTurnoverComponent;
