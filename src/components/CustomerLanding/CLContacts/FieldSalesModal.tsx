import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import React, { useEffect, useState } from 'react';
import { tw } from 'src/tw';
import Modal from 'src/components/Modal';
import { ScrollView, TouchableOpacity } from 'react-native';
import Dropdown from 'src/components/DropDown';
import InputText from 'src/components/InputText';
import DeleteModal from 'src/components/Common/DeleteModal';
import { mobileRegex, validateEmail } from 'src/utils/CommonUtil';

interface FieldSalesModalProps {
  item?: any;
  isModalVisible: boolean;
  isNewFieldSales: boolean;
  onBackPress: any;
  dropdownData: any;
  onSaveButtonPress: any;
  onDeletePress: any;
}

const FieldSalesModal = (props: FieldSalesModalProps) => {
  const {
    item,
    isModalVisible,
    isNewFieldSales,
    onBackPress,
    dropdownData,
    onSaveButtonPress,
    onDeletePress,
  } = props;

  // Input fields states
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fax, setFax] = useState('');
  const [emailId, setEmailId] = useState('');
  const [note, setNote] = useState('');

  // Edit and delete states
  const [isEditable, setIsEditable] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Error messages states
  const [titleErrorMessage, setTitleErrorMessage] = useState('');
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');
  const [faxErrorMessage, setFaxErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  // Setting input fields value
  useEffect(() => {
    setIsEditable(isNewFieldSales);
    if (isNewFieldSales) {
      resetInputFields();
    } else {
      fillUpdateData();
    }
  }, [item, isNewFieldSales]);

  // Reset input fields value
  const resetInputFields = () => {
    setTitle('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setMobileNumber('');
    setFax('');
    setEmailId('');
    setNote('');
  };

  // Fill input fields value for update
  const fillUpdateData = () => {
    const foundDropdownItem = dropdownData.find(
      (element: any) => element.label === item?.title,
    );

    setTitle(foundDropdownItem?.value || '');
    setFirstName(item?.firstName || '');
    setLastName(item?.lastName || '');
    setPhoneNumber(item?.phoneNumber || '');
    setMobileNumber(item?.mobileNumber || '');
    setFax(item?.fax || '');
    setEmailId(item?.email || '');
    setNote(item?.note || '');
  };

  // Emptying error messages and setting the initial value of input fields
  const onCancelPressed = () => {
    emptyErrorMessage();
    fillUpdateData();
    setIsEditable(false);
  };

  // Emptying error messages
  const emptyErrorMessage = () => {
    setTitleErrorMessage('');
    setFirstNameErrorMessage('');
    setLastNameErrorMessage('');
    setPhoneErrorMessage('');
    setMobileErrorMessage('');
    setFaxErrorMessage('');
    setEmailErrorMessage('');
  };

  // Validating input fields
  const validateInputs = () => {
    emptyErrorMessage();
    let isError = false;
    if (title === '') {
      setTitleErrorMessage('Select title');
      isError = true;
    } else {
      setTitleErrorMessage('');
    }

    if (firstName.trim() === '') {
      setFirstNameErrorMessage('Enter first name');
      isError = true;
    } else {
      setFirstNameErrorMessage('');
    }

    if (lastName.trim() === '') {
      setLastNameErrorMessage('Enter last name');
      isError = true;
    } else {
      setLastNameErrorMessage('');
    }

    if (phoneNumber.trim() !== '' && !mobileRegex.test(phoneNumber)) {
      setPhoneErrorMessage('Enter valid phone number');
      isError = true;
    } else {
      setPhoneErrorMessage('');
    }

    if (mobileNumber.trim() !== '' && !mobileRegex.test(mobileNumber)) {
      setMobileErrorMessage('Enter valid mobile number');
      isError = true;
    } else {
      setMobileErrorMessage('');
    }

    if (fax.trim().length > 0 && isNaN(Number(fax))) {
      setFaxErrorMessage('Enter valid fax number');
      isError = true;
    } else {
      setFaxErrorMessage('');
    }

    if (emailId.trim().length > 0 && !validateEmail(emailId.trim())) {
      setEmailErrorMessage('Enter valid email id');
      isError = true;
    } else {
      setEmailErrorMessage('');
    }

    return !isError;
  };

  // Validating input fields and saving the data
  const onSaveIconPress = () => {
    if (!validateInputs()) {
      return;
    }

    const foundDropdownItem = dropdownData.find(
      (element: any) => element.value === title,
    );

    const obj = {
      ...item,
      title: foundDropdownItem?.label,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber,
      mobileNumber,
      fax: fax.trim(),
      email: emailId.trim(),
      note: note.trim(),
    };
    onSaveButtonPress(obj);
    if (!isNewFieldSales) {
      setIsEditable(false);
    }
  };

  // Validating and saving the data or changing the edit status
  const changeEditStatus = () => {
    if (isEditable) {
      onSaveIconPress();
      // setIsEditable(!isEditable);
    } else {
      setIsEditable(!isEditable);
    }
  };

  // Hiding the modal and emptying the error messages
  const handleBack = () => {
    emptyErrorMessage();
    setIsEditable(false);
    onBackPress();
  };

  // Showing the delete modal
  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  // Hiding the delete modal
  const handleCancel = () => {
    setIsDeleteModalVisible(false);
  };

  // Hiding the delete modal and deleting the data
  const onPressDelete = () => {
    setIsDeleteModalVisible(false);
    onDeletePress(item.idCustomerContact);
  };

  const handleDropDown = (item: any) => {
    setTitle(item.value);
  };

  const handleFirstName = (text: string) => {
    setFirstNameErrorMessage('');
    setFirstName(text);
  };

  const handleLastName = (text: string) => {
    setLastNameErrorMessage('');
    setLastName(text);
  };

  const handlePhoneNumber = (text: string) => {
    setPhoneErrorMessage('');
    setPhoneNumber(text);
  };

  const handleMobileNumber = (text: string) => {
    setMobileErrorMessage('');
    setMobileNumber(text);
  };

  const handleFax = (text: string) => {
    setFaxErrorMessage('');
    setFax(text);
  };

  const handleEmailId = (text: string) => {
    setEmailErrorMessage('');
    setEmailId(text);
  };

  const handleNote = (text: string) => {
    setNote(text);
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View
        bg-white
        padding-v4
        style={[tw('flex-1 w-1/2'), { marginLeft: '50%' }]}>
        <View row centerV spread>
          <View row>
            {(isEditable == false || isNewFieldSales) && (
              <TouchableOpacity style={tw('mr-8')} onPress={handleBack}>
                <images.DefaultLeftArrowIcon />
              </TouchableOpacity>
            )}
            <View row centerV>
              <Text text18BO textBlack marginT-3>
                {isNewFieldSales
                  ? 'Add Field Sales Contact'
                  : 'Field Sales Contacts'}
              </Text>
            </View>
          </View>
          <View row>
            {isEditable && isNewFieldSales == false && (
              <TouchableOpacity
                style={tw('p-10px')}
                onPress={onCancelPressed}>
                <images.CancelIcon />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={changeEditStatus} style={tw('p-10px')} hitSlop={10}>
              {isEditable ? <images.SaveIcon /> : <images.EditIcon />}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <View marginT-v4>
            <Dropdown
              title="Title*"
              isEditable={isEditable}
              data={dropdownData}
              value={title}
              labelField={'label'}
              valueField={'value'}
              onChange={handleDropDown}
              errorMsg={titleErrorMessage}
            />
          </View>
          <View row marginT-v4>
            <View flex marginR-v2>
              <InputText
                title="First Name*"
                isEditable={isEditable}
                value={firstName}
                onChangeText={handleFirstName}
                errorMsg={firstNameErrorMessage}
              />
            </View>
            <View flex>
              <InputText
                title="Last Name*"
                isEditable={isEditable}
                value={lastName}
                onChangeText={handleLastName}
                errorMsg={lastNameErrorMessage}
              />
            </View>
          </View>
          <View row marginT-v4>
            <View flex marginR-v2>
              <InputText
                title="Phone Number"
                style={tw(`pl-2`)}
                value={phoneNumber}
                onChangeText={handlePhoneNumber}
                keyboardType="numeric"
                maxLength={20}
                isEditable={isEditable}
                errorMsg={phoneErrorMessage}
              />
            </View>
            <View flex>
              <InputText
                title="Mobile Number"
                style={tw(`pl-2`)}
                value={mobileNumber}
                onChangeText={handleMobileNumber}
                keyboardType="numeric"
                maxLength={20}
                isEditable={isEditable}
                errorMsg={mobileErrorMessage}
              />
            </View>
          </View>
          <View row marginT-v4>
            <View flex marginR-v2>
              <InputText
                title="Fax"
                isEditable={isEditable}
                value={fax}
                onChangeText={handleFax}
                keyboardType="numeric"
                maxLength={20}
                errorMsg={faxErrorMessage}
              />
            </View>

            <View flex>
              <View>
                <InputText
                  title="Email ID"
                  style={tw(`pl-2`)}
                  value={emailId}
                  onChangeText={handleEmailId}
                  keyboardType="email-address"
                  isEditable={isEditable}
                  errorMsg={emailErrorMessage}
                />
              </View>
            </View>
          </View>
          <View marginT-v4>
            <InputText
              title="Note"
              style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
              multiline
              isEditable={isEditable}
              value={note}
              enableErrors
              validate={[(value: string) => value.length > 500]}
              validationMessage={['Words limit reached']}
              validateOnChange={true}
              validationMessagePosition={'down'}
              showCharCounter={isEditable}
              maxLength={500}
              onChangeText={handleNote}
            />
          </View>
          {!isEditable && (
            <View marginT-v6>
              <TouchableOpacity onPress={handleDelete}>
                <images.DeleteIcon />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
      <DeleteModal
        onPressDelete={onPressDelete}
        onPressCancel={handleCancel}
        isDeleteModalVisible={isDeleteModalVisible}
        title={`Delete ${firstName} ${lastName}\nfrom contacts?`}
        subTitle={`Are you sure you want to delete\n${firstName} ${lastName} from contacts`}
      />
    </Modal>
  );
};

export default FieldSalesModal;
