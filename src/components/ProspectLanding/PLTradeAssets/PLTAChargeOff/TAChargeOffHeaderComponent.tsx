import React from 'react';

import View from 'src/components/View';
import InputText from 'src/components/InputText';

import { tw } from 'src/tw';

interface TAChargeOffHeaderComponentProps {
  formInputs: any;
}

const TAChargeOffHeaderComponent = (props: TAChargeOffHeaderComponentProps) => {
  const { formInputs } = props;

  const signedDate = formInputs?.signedDate ? formInputs.signedDate : '--';
  const updatedBy = formInputs?.updatedBy ? formInputs.updatedBy : '--';
  const updatedDate = formInputs?.updatedDate ? formInputs.updatedDate : '--';

  return (
    <View marginR-v1>
      <View row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Agreement Number'}
            keyBoardType="numeric"
            value={formInputs.agreementNumber}
            isEditable={false}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Type'}
            value={'TA Charge - Off'}
            isEditable={false}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Signed Date'}
            value={signedDate}
            isEditable={false}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={'Status'}
            value={formInputs.status}
            isEditable={false}
          />
        </View>
      </View>
      <View marginT-v6 row centerV>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Created By'}
            value={formInputs.createdBy}
            isEditable={false}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Created Date'}
            value={formInputs.createdDate}
            isEditable={false}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Updated By'}
            value={updatedBy}
            isEditable={false}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={'Updated Date'}
            value={updatedDate}
            isEditable={false}
          />
        </View>
      </View>
      <View marginT-v6 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default TAChargeOffHeaderComponent;
