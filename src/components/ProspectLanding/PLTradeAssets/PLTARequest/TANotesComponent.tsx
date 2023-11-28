import React from 'react';

import View from 'src/components/View';
import Text from 'src/components/Text';
import InputText from 'src/components/InputText';
import TextError from 'src/components/TextError';

import { tw } from 'src/tw';

interface TANotesComponentProps {
  formInputs: any;
  setFormInputs: any;
  isEditable: boolean;
  setIsEditable: any;
  errorMessages: any;
  setErrorMessages: any;
  isFormEditable: boolean;
}

const TANotesComponent = (props: TANotesComponentProps) => {
  const { formInputs, setFormInputs, isEditable, setIsEditable, errorMessages, setErrorMessages, isFormEditable } = props

  const handleNotes = (text: string) => {
    setFormInputs((prevData: any) => ({
      ...prevData,
      notes: text,
    }))

    if (!isEditable) {
      setIsEditable(true)
    }

    setErrorMessages((prevData: any) => ({
      ...prevData,
      notes: '',
    }))
  };

  return (
    <View marginT-v2 row style={tw('border-light-lavendar')}>
      <View flex>
        <InputText
          title={'Notes*'}
          style={[tw('p-3 h-40'), { textAlignVertical: 'top' }]}
          multiline
          value={formInputs.notes}
          maxLength={500}
          onChangeText={handleNotes}
          isEditable={isFormEditable}
        />
        <View marginT-v1 style={tw('items-end')}>
          <Text text13M text90R>
            {`${formInputs.notes.length} / 500`}
          </Text>
        </View>
        <TextError errorMsg={errorMessages?.notes} />
      </View>
      <View flex />
    </View>
  );
};

export default TANotesComponent;
