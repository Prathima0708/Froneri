import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useEffect, useState} from 'react';
import {tw} from 'src/tw';
import {TouchableOpacity} from 'react-native';
import InputText from 'src/components/InputText';

type PVNotesBackOfficeComponentProps = {
  backOfficeNoteObj: any;
  isSaveEnable?: boolean;
  onChangeSaveEnable: () => void;
  onSave: (notes: string) => void;
};

const PVNotesBackOfficeComponent = (props: PVNotesBackOfficeComponentProps) => {
  const {
    backOfficeNoteObj: backOfficeNoteObjInitial,
    isSaveEnable,
    onChangeSaveEnable,
  } = props;
  const [backOfficeNoteObj, setBackOfficeNoteObj] = useState(
    backOfficeNoteObjInitial,
  );

  useEffect(() => {
    setBackOfficeNoteObj({...backOfficeNoteObj, notes: props.backOfficeNoteObj?.notes})
  },[props])

  const handleNotes = (value: string) => {
    onChangeSaveEnable();
    setBackOfficeNoteObj({...backOfficeNoteObj, notes: value});
  };

  // const isEnableSave = backOfficeNoteObj.notes ? true : false;
  const saveBtnStyle = isSaveEnable ? 'bg-light-darkBlue' : 'bg-light-white1';
  const saveTextStyle = isSaveEnable ? 'text-light-white' : 'text-light-grey1';

  return (
    <View flex padding-v4>
      <View centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          {'Back Office Note'}
        </Text>
        <View flex row right>
          <View marginL-v2>
            <TouchableOpacity
              style={tw('py-2 px-8 flex-row items-center ml-6')}
              onPress={() => {
                setBackOfficeNoteObj(backOfficeNoteObjInitial);
              }}>
              <Text text13R>
                {'  '}
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={tw(
              `${saveBtnStyle} border-light-lavendar border-default rounded-md py-2 px-8 flex-row items-center ml-6`,
            )}
            onPress={() => {
              props.onSave(backOfficeNoteObj.notes);
            }}>
            <Text text13R style={tw(`${saveTextStyle}`)}>
              {'  '}
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View marginT-v2 style={tw('border-light-lavendar')}>
        <InputText
          title={'Note'}
          style={[tw('p-3 h-56 max-w-5.6xl'), {textAlignVertical: 'top'}]}
          multiline
          value={backOfficeNoteObj.notes}
          enableErrors
          validate={[(value: string) => value.length > 500]}
          validationMessage={['Words limit reached']}
          validateOnStart={true}
          validateOnChange={true}
          validationMessagePosition={'down'}
          maxLength={500}
          onChangeText={(text: string) => handleNotes(text)}
        />
      </View>
    </View>
  );
};

export default PVNotesBackOfficeComponent;
