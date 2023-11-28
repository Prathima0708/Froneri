import View from 'src/components/View';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';
import {tw} from 'src/tw';
import React, {useEffect, useState} from 'react';
import Modal from 'src/components/Modal';
import {TouchableOpacity} from 'react-native';
import InputText from 'src/components/InputText';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import DateTimePicker from 'src/components/DateTimePicker';
import {formatDateReverse} from 'src/utils/CommonUtil';
import {DATETIME_PICKER_MODE, NOTES} from 'src/utils/Constant';
import DeleteModal from 'src/components/Common/DeleteModal';

interface NotesModalProps {
  isNotesModalVisible: boolean;
  isNewNote: boolean;
  isModalEditable: boolean;
  handleBack: any;
  handleIsEditable: any;
  selectedNotes: any;
  handleNoteCancel: any;
  handleDeleteNotes: any;
}

const NotesModal = (props: NotesModalProps) => {
  const {
    isNotesModalVisible,
    isNewNote,
    handleBack,
    isModalEditable,
    handleIsEditable,
    selectedNotes,
    handleNoteCancel,
    handleDeleteNotes,
  } = props;
  const [errorMsg, setErrorMsg] = useState('');
  const [note, setNote] = useState('');
  const [validTillDate, setValidTillDate] = useState<string | Date>('');
  const [creationDateString, setCreationDateString] = useState('');
  const [name, setName] = useState('');

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    if (!isNewNote) {
      const note = selectedNotes.internalMessages
        ? selectedNotes.internalMessages
        : '';

      let validToDate = selectedNotes.validToDate
        ? selectedNotes.validToDate
        : '';
      if (validToDate.length > 0) {
        console.log('validToDate', new Date(validToDate));
        setValidTillDate(new Date(validToDate));
      } else {
        setValidTillDate('');
      }
      let creationDate = selectedNotes.creationDate
        ? selectedNotes.creationDate
        : '';
      if (creationDate.length > 0) {
        setCreationDateString(formatDateReverse(new Date(creationDate)));
      } else {
        setCreationDateString('');
      }
      const name = selectedNotes.employeeName ? selectedNotes.employeeName : '';
      setName(name);
      setNote(note);
    }
    if (isNewNote) {
      setValidTillDate('');

      setName('');
      setNote('');
    }
  }, [selectedNotes]);

  console.log('isModalEditable', isModalEditable);

  const changeEditStatus = () => {
    if (isModalEditable) {
      if (note.length == 0) {
        setErrorMsg('Please enter note');
        return;
      }
      let formattedValidTill = '';
      if (validTillDate != '') {
        const dateString = validTillDate.toISOString();
        formattedValidTill = dateString.replace('T', ' ').replace('Z', '');
      }

      console.log(formattedValidTill);
      let obj = {
        ...selectedNotes,
        body: note,
        validTill: formattedValidTill,
      };
      handleIsEditable(obj);
    } else {
      handleIsEditable({});
    }
  };
  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };
  const handleDeleteNotesPressed = () => {
    handleDeleteNotes(selectedNotes);
    setIsDeleteModalVisible(false);
  };

  const handleVisitTill = (date: any) => {
    console.log(formatDateReverse(date));
    setValidTillDate(date);
  };

  const onBackPress = () => {
    handleBack();
  };

  const onChangeText = (text: string) => {
    setNote(text);
    setErrorMsg('');
  };

  const handleCancel = () => {
    const note = selectedNotes.internalMessages
      ? selectedNotes.internalMessages
      : '';
    setNote(note);
    let validToDate = selectedNotes.validToDate
      ? selectedNotes.validToDate
      : '';
    if (validToDate.length > 0) {
      console.log('validToDate', new Date(validToDate));
      setValidTillDate(new Date(validToDate));
    }
    handleNoteCancel();
  };
  return (
    <Modal
      visible={isNotesModalVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View
        bg-white
        padding-v4
        style={[tw('flex-1 w-1/2'), {marginLeft: '50%'}]}>
        <View row centerV spread>
          <View row>
            <TouchableOpacity style={tw('mr-8')} onPress={onBackPress}>
              <images.LeftArrowIcon />
            </TouchableOpacity>
            <View row centerV>
              <Text text18BO textBlack marginT-3>
                {isNewNote ? 'Create New Note' : 'Note'}
              </Text>
            </View>
          </View>
          <View row>
            {isModalEditable && !isNewNote && (
              <TouchableOpacity style={tw('mr-6')} onPress={handleCancel}>
                <images.CancelIcon />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={changeEditStatus}>
              {isModalEditable ? <images.SaveIcon /> : <images.EditIcon />}
            </TouchableOpacity>
          </View>
        </View>
        <View marginT-v1>
          <InputText
            title="Note"
            style={[tw(`p-3 h-40`), {textAlignVertical: 'top'}]}
            placeholder="Add your notes here..."
            multiline
            isEditable={isModalEditable}
            value={note}
            enableErrors
            validate={[(value: string) => value.length > 500]}
            validationMessage={['Words limit reached']}
            validateOnStart={true}
            validateOnChange={true}
            validationMessagePosition={'down'}
            showCharCounter={isModalEditable}
            maxLength={500}
            onChangeText={(text: string) => onChangeText(text)}
            errorMsg={errorMsg}
          />
        </View>
        {!isNewNote && (
          <View row centerV marginT-v6>
            <View>
              <Text text13M textBlack>
                Employee Name
              </Text>
              <Text text13R grey1 marginT-v1>
                {name}
              </Text>
            </View>
            <View style={tw('ml-32')}>
              <Text text13M textBlack>
                Created On
              </Text>
              <Text text13R grey1 marginT-v1>
                {creationDateString}
              </Text>
            </View>
          </View>
        )}
        <View marginT-v6>
          <Text text13M textBlack>
            Valid Till
          </Text>
          <DateTimePicker
            dateFormat={'DD-MM-YYYY'}
            mode={DATETIME_PICKER_MODE.DATE}
            editable={isModalEditable}
            onChange={handleVisitTill}
            minimumDate={new Date()}
            renderInput={({value}) => {
              return (
                <View>
                  <TouchableOpacity
                    style={tw(
                      `${
                        isModalEditable ? 'bg-light-white' : 'bg-light-white1'
                      } flex-row items-center rounded-md border-default border-light-lavendar pl-3 justify-between  mt-1 w-32`,
                    )}>
                    <Text
                      text13R
                      style={tw(
                        `${
                          isModalEditable
                            ? 'text-light-textBlack'
                            : 'text-light-grey1'
                        }`,
                      )}>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </TouchableOpacity>
                </View>
              );
            }}
            value={validTillDate}
          />
        </View>
        {!isModalEditable ? (
          <View marginT-v12>
            <TouchableOpacity onPress={handleDelete}>
              <images.DeleteIcon />
            </TouchableOpacity>
          </View>
        ) : null}
        <DeleteModal
          onPressDelete={handleDeleteNotesPressed}
          onPressCancel={() => setIsDeleteModalVisible(false)}
          isDeleteModalVisible={isDeleteModalVisible}
          title={`Delete\nCustomer Note?`}
          subTitle={`Are you sure you want to delete\nthis note`}
        />
      </View>
    </Modal>
  );
};

export default NotesModal;
