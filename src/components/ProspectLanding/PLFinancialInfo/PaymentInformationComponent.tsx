import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {tw} from 'src/tw';
import Dropdown from 'src/components/DropDown';

interface PaymentInformationComponentProps {
  paymentTermsDropdownData: any;
  paymentMethodsDropdownData: any;
  inputData: any;
  handleInputChange: any;
  errorMessages?: any;
  isEditable: boolean;
  mandatoryData: any;
}

const PaymentInformationComponent = (
  props: PaymentInformationComponentProps,
) => {
  const {
    inputData,
    handleInputChange,
    paymentTermsDropdownData,
    paymentMethodsDropdownData,
    errorMessages,
    isEditable,
    mandatoryData,
  } = props;

  const handlePaymentTerms = handleInputChange('paymentTerms');
  const handlePaymentMethods = handleInputChange('paymentMethods');

  const paymentTermsTitle = mandatoryData.paymentTerms
    ? 'Payment Terms*'
    : 'Payment Terms';
  const paymentMethodsTitle = mandatoryData.paymentMethods
    ? 'Payment Methods*'
    : 'Payment Methods';

  return (
    <View padding-v4 marginT-v2>
      <View centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Payment Information
        </Text>
      </View>
      <View marginT-v5 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={paymentTermsTitle}
            data={paymentTermsDropdownData}
            placeholder={isEditable && 'List of Items'}
            value={inputData.paymentTerms}
            labelField={'description'}
            valueField={'itemValue'}
            onChange={handlePaymentTerms}
            errorMsg={errorMessages.paymentTerms}
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={paymentMethodsTitle}
            data={paymentMethodsDropdownData}
            placeholder={isEditable && 'List of Items'}
            value={inputData.paymentMethods}
            labelField={'description'}
            valueField={'itemValue'}
            onChange={handlePaymentMethods}
            errorMsg={errorMessages.paymentMethods}
            isEditable={isEditable}
          />
        </View>
        <View style={tw('flex-1')} marginR-v2 />
        <View style={tw('flex-1')} />
      </View>
      <View row paddingV-v6>
        <View flex-1 marginR-v2 />
        <View flex-1 marginR-v2 />
      </View>
    </View>
  );
};

export default PaymentInformationComponent;
