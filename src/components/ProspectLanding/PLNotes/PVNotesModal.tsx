import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import Modal from 'src/components/Modal';
import {images} from 'src/assets/Images';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {tw} from 'src/tw';
import InputText from 'src/components/InputText';
import {formatDateReverse} from 'src/utils/CommonUtil';
import ACLService from 'src/services/ACLService';

interface PVNotesModalProps {
  visible: boolean;
  setNoteModalVisible: any;
  prospectVisitNote: any;
  isNotesEditable?: boolean;
  onSaveNotesPress?: any;
  onEditNotesPress?: any;
}

const PVNotesModal = (props: PVNotesModalProps) => {
  const {
    visible,
    prospectVisitNote,
    setNoteModalVisible,
    isNotesEditable,
    onEditNotesPress,
    onSaveNotesPress,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isFieldEditable, setIsFieldEditable] = useState(false);
  const [prospectVisitNoteObj, setProspectVisitNoteObj] =
    useState(prospectVisitNote);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setProspectVisitNoteObj(prospectVisitNote);
      setErrorMsg('');
    }
  }, [prospectVisitNote, visible]);

  useEffect(() => {
    visible && !isNotesEditable && setIsFieldEditable(false);
  }, [isNotesEditable, visible]);

  const handleGoBack = async () => {
    await ACLService.saveAclGuardStatusToStorage(false);
    setNoteModalVisible(false);
    setIsFieldEditable(false);
  };

  const handleCancel = () => {
    setProspectVisitNoteObj(prospectVisitNote);
  };

  const handleNotes = (value: string) => {
    setProspectVisitNoteObj({...prospectVisitNoteObj, notes: value});
    setErrorMsg('');
  };

  const backArrowStyle = isNotesEditable ? 'ml-3' : 'ml-8';

  const cancelIcon = () => {
    return (
      <View margin-v1>
        <TouchableOpacity style={tw('py-2 px-2')} onPress={handleCancel}>
          <images.CancelIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const saveIcon = (isUpdate: boolean) => {
    return (
      <View margin-v1>
        <TouchableOpacity
          style={tw('py-2 px-2')}
          onPress={() => {
            if (isUpdate) {
              prospectVisitNoteObj?.notes?.length > 0
                ? onEditNotesPress(prospectVisitNoteObj)
                : setErrorMsg('Mandatory');
            } else {
              prospectVisitNoteObj?.notes?.length > 0
                ? onSaveNotesPress(prospectVisitNoteObj.notes)
                : setErrorMsg('Mandatory');
            }
          }}>
          <images.SaveIcon />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible}>
      <View bg-white style={[tw('flex-1 w-1/2'), {marginLeft: '50%'}]}>
        {isLoading ? (
          <View flex center>
            <ActivityIndicator
              color={ColourPalette.light.darkBlue}
              size="large"
            />
          </View>
        ) : (
          <View flex>
            <View centerH style={tw('flex-row p-12px justify-between')}>
              <View centerH centerV style={tw('flex-row')}>
                <TouchableOpacity onPress={handleGoBack}>
                  <images.DefaultLeftArrowIcon />
                </TouchableOpacity>
                <Text
                  text18
                  textBlack
                  marginT-v1
                  style={tw(`${backArrowStyle}`)}>
                  {isNotesEditable
                    ? 'Prospection Visit - Add Note'
                    : 'Prospection Visit Note'}
                </Text>
              </View>
              {!isNotesEditable ? (
                isFieldEditable ? (
                  <View center row>
                    {cancelIcon()}
                    {saveIcon(true)}
                  </View>
                ) : (
                  <View margin-v1>
                    <TouchableOpacity
                      style={tw('py-2 px-2')}
                      onPress={() => setIsFieldEditable(true)}>
                      <images.EditWithBorderIcon />
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                <View center row>
                  {cancelIcon()}
                  {saveIcon(false)}
                </View>
              )}
            </View>
            <View marginH-v4>
              <InputText
                title={'Note'}
                isEditable={
                  isNotesEditable ? true : isFieldEditable ? true : false
                }
                style={[
                  tw(
                    `p-3 h-40 ${
                      isNotesEditable
                        ? 'bg-light-white'
                        : isFieldEditable
                        ? 'bg-light-white'
                        : 'bg-light-white1'
                    }`,
                  ),
                  {textAlignVertical: 'top'},
                ]}
                multiline
                value={prospectVisitNoteObj?.notes}
                enableErrors
                validate={[(value: string) => value?.length > 500]}
                validationMessage={['Words limit reached']}
                validateOnStart={true}
                validateOnChange={true}
                validationMessagePosition={'down'}
                maxLength={1500}
                onChangeText={(text: string) => handleNotes(text)}
                errorMsg={errorMsg}
              />
              <View marginT-v1 style={tw('items-end')}>
                <Text text13M text90R>
                  {`${prospectVisitNoteObj?.notes?.length ?? 0} / 1500`}
                </Text>
              </View>
            </View>
            {!isNotesEditable ? (
              <View marginT-v3 row>
                <View flex marginL-v4>
                  <View
                    centerH
                    marginT-v2
                    style={tw('flex-row justify-between')}>
                    <Text text13M textBlack>
                      Employee name
                    </Text>
                  </View>
                  <Text marginT-v1 text13R>
                    {prospectVisitNoteObj?.employeeName
                      ? prospectVisitNoteObj?.employeeName
                      : '--'}
                  </Text>
                </View>
                <View flex>
                  <View
                    centerH
                    marginT-v2
                    style={tw('flex-row justify-between')}>
                    <Text text13M textBlack>
                      Created On
                    </Text>
                  </View>
                  <Text marginT-v1 text13R>
                    {prospectVisitNoteObj?.visitDate
                      ? formatDateReverse(
                          new Date(prospectVisitNoteObj?.visitDate),
                        )
                      : '--'}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default PVNotesModal;
