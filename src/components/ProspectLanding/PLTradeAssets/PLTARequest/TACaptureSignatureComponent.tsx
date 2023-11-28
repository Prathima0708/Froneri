import React, { useEffect, useState } from 'react';

import View from 'src/components/View';
import Text from 'src/components/Text';
import TextError from 'src/components/TextError';

import SignComponent from 'src/components/Common/SignComponent/SignComponent';
import SignPadModal from 'src/components/Common/SignComponent/SignPadModal';

import { tw } from 'src/tw';

interface TACaptureSignatureComponentProps {
  formInputs: any;
  setFormInputs: any;
  isEditable: boolean;
  setIsEditable: any;
  errorMessages: any;
  setErrorMessages: any;
  areSignaturesEditable: boolean;
}

const TACaptureSignatureComponent = (props: TACaptureSignatureComponentProps) => {
  const { formInputs, setFormInputs, isEditable, setIsEditable, errorMessages, setErrorMessages, areSignaturesEditable } = props

  const [isCustomerSignPad, setIsCustomerSignPad] = useState(false)
  const [isSignPadVisible, setIsSignPadVisible] = useState(false);

  const handleCustomerSignPad = () => {
    setIsSignPadVisible(true);
    setIsCustomerSignPad(true);
  };

  const handleEmployeeSignPad = () => {
    setIsSignPadVisible(true);
  };

  const handleCancelSignPad = () => {
    setIsSignPadVisible(false);
    setIsCustomerSignPad(false);
  }

  const handleSaveSign = (name: string, sign: string) => {
    if (isCustomerSignPad) {
      setFormInputs((prevData: any) => ({
        ...prevData,
        customerSignature: sign,
        customerSigneeName: name,
      }))

      setErrorMessages((prevData: any) => ({
        ...prevData,
        customerSignature: '',
      }))
    } else {
      setFormInputs((prevData: any) => ({
        ...prevData,
        employeeSignature: sign,
        employeeSigneeName: name,
      }))
      setErrorMessages((prevData: any) => ({
        ...prevData,
        employeeSignature: '',
      }))
    }

    setIsCustomerSignPad(false);
    setIsSignPadVisible(false);

    if (!isEditable) {
      setIsEditable(true)
    }
  };

  return (
    <View marginT-v4>
      <View centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Capture Signature
        </Text>
      </View>
      <View marginT-v3 row centerV>
        <View flex style={tw('border-light-lavendar')}>
          <SignComponent
            title="Customer Signature*"
            handleSignPad={handleCustomerSignPad}
            sign={formInputs.customerSignature}
            signeeName={formInputs.customerSigneeName}
            isEditable={areSignaturesEditable}
          />
          <TextError errorMsg={errorMessages?.customerSignature} />
        </View>
        <View width={10} />
        <View flex style={tw('border-light-lavendar')}>
          <SignComponent
            title="Employee Signature*"
            handleSignPad={handleEmployeeSignPad}
            sign={formInputs.employeeSignature}
            signeeName={formInputs.employeeSigneeName}
            isEditable={areSignaturesEditable}
          />
          <TextError errorMsg={errorMessages?.employeeSignature} />
        </View>
      </View>
      <SignPadModal
        title={isCustomerSignPad ? "Customer Signature" : "Employee Signature"}
        isVisible={isSignPadVisible}
        handleCancel={handleCancelSignPad}
        handleSaveSign={handleSaveSign}
        accountHolderName={isCustomerSignPad ? '' : formInputs.employeeSigneeName}
      />
      <View marginT-v4 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default TACaptureSignatureComponent;
