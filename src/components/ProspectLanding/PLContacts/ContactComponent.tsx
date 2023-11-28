import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useEffect, useMemo, useState} from 'react';
import {tw} from 'src/tw';
import InputText from 'src/components/InputText';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import Dropdown from 'src/components/DropDown';
import {images} from 'src/assets/Images';

interface ContactComponentProps {
  titleData: any;
  item: any;
  isHideHeader?: boolean;
  setContact: any;
  mandatoryData?: any;
  errorMessages: any;
  isEditable: boolean;
  isButtonActive: boolean;
  setIsButtonActive: any;
}

const ContactComponent = (props: ContactComponentProps) => {
  const {
    item,
    isHideHeader,
    setContact,
    titleData,
    errorMessages,
    mandatoryData,
    isEditable,
    isButtonActive,
    setIsButtonActive,
  } = props;
  const [emailId, setEmailId] = useState('');
  const [designation, setDesignation] = useState('');

  const checkAndSetButtonActivity = () => {
    if (!isButtonActive) {
      setIsButtonActive(true);
    }
  };

  const handleTitle = (value: string) => {
    setContact({...item, title: value});
    checkAndSetButtonActivity();
  };

  const handlefirstName = (value: string) => {
    setContact({...item, firstName: value});
    checkAndSetButtonActivity();
  };

  const handleLastName = (value: string) => {
    setContact({...item, lastName: value});
    checkAndSetButtonActivity();
  };

  const handlePhoneNumber = (value: string) => {
    setContact({...item, phoneNumber: value});
    checkAndSetButtonActivity();
  };

  const handleMobileNumber = (value: string) => {
    setContact({...item, mobileNumber: value});
    checkAndSetButtonActivity();
  };

  const handleFaxNumber = (value: string) => {
    setContact({...item, faxNumber: value});
    checkAndSetButtonActivity();
  };

  const handleNotes = (value: string) => {
    setContact({...item, notes: value});
    checkAndSetButtonActivity();
  };

  const contactOneTitle = `Title${
    mandatoryData.designationContact1 === 1 ? '*' : ''
  }`;

  const contactTwoTitle = `Title${
    mandatoryData.designationContact2 === 1 ? '*' : ''
  }`;

  const contactOneFirstName = `First Name${
    mandatoryData.contact1FirstName === 1 ? '*' : ''
  }`;

  const contactTwoFirstName = `First Name${
    mandatoryData.contact2FirstName === 1 ? '*' : ''
  }`;

  const contactOneLastName = `Last Name${
    mandatoryData.contact1LastName === 1 ? '*' : ''
  }`;

  const contactTwoLastName = `Last Name${
    mandatoryData.contact2LastName === 1 ? '*' : ''
  }`;

  const contactOnePhoneNo = `Phone Number${
    mandatoryData.contact1PhoneNo === 1 ? '*' : ''
  }`;

  const contactTwoPhoneNo = `Phone Number${
    mandatoryData.contact2PhoneNo === 1 ? '*' : ''
  }`;

  const contactOneMobileNo = `Mobile Number${
    mandatoryData.contact1MobileNo === 1 ? '*' : ''
  }`;

  const contactTwoMobileNo = `Mobile Number${
    mandatoryData.contact2MobileNo === 1 ? '*' : ''
  }`;

  const contactOneFaxNo = `Fax Number${
    mandatoryData.contact1FaxNo === 1 ? '*' : ''
  }`;

  const contactTwoFaxNo = `Fax Number${
    mandatoryData.contact2FaxNo === 1 ? '*' : ''
  }`;

  const contactOneEmail = `Email${
    mandatoryData.contact1Email === 1 ? '*' : ''
  }`;

  const contactTwoEmail = `Email${
    mandatoryData.contact2Email === 1 ? '*' : ''
  }`;

  const contactOneNotes = `Notes${
    mandatoryData.contact1Notes === 1 ? '*' : ''
  }`;

  const contactTwoNotes = `Notes${
    mandatoryData.contact2Notes === 1 ? '*' : ''
  }`;

  const displayTitle = useMemo(() => {
    return isHideHeader ? 'Contact 1' : 'Contact 2';
  }, [isHideHeader]);

  const handleEmailId = (text: string) => {
    setEmailId(text);
    setContact({...item, email: text});
    checkAndSetButtonActivity();
  };

  useEffect(() => {
    setDesignation(item.title);
  }, [item.title]);

  return (
    <View padding-v4>
      {!isHideHeader && (
        <View marginB-v3 centerH style={tw('flex-row justify-between')}>
          <Text text18M textBlack>
            {displayTitle}
          </Text>
        </View>
      )}
      <View row>
        <View flex marginR-v2>
          <Text text13M textBlack>
            {isHideHeader ? contactOneTitle : contactTwoTitle}
          </Text>
          <View marginT-v02>
            <Dropdown
              style={tw(
                'mt-10 border-default border-light-lavendar rounded-md pl-2',
              )}
              isEditable={isEditable}
              itemTextStyle={tw('text-light-textBlack text-13px')}
              selectedTextStyle={tw('text-light-textBlack text-13px')}
              activeColor={ColourPalette.light.lightBlue1}
              labelField="label"
              valueField="value"
              maxHeight={200}
              containerStyle={tw(
                'border-default border-light-lavendar rounded-md py-10px',
              )}
              placeholder="Select Title"
              placeholderStyle={tw('text-btn font-normal text-light-grey2')}
              data={titleData}
              value={designation}
              onChange={handleTitle}
              errorMsg={
                isHideHeader
                  ? errorMessages.designationContact1
                  : errorMessages.designationContact2
              }
              renderRightIcon={() => <images.DownIcon />}
            />
          </View>
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={isHideHeader ? contactOneFirstName : contactTwoFirstName}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.firstName}
            onChangeText={handlefirstName}
            maxLength={35}
            errorMsg={
              isHideHeader
                ? errorMessages.contact1FirstName
                : errorMessages.contact2FirstName
            }
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={isHideHeader ? contactOneLastName : contactTwoLastName}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.lastName}
            onChangeText={handleLastName}
            maxLength={35}
            errorMsg={
              isHideHeader
                ? errorMessages.contact1LastName
                : errorMessages.contact2LastName
            }
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={isHideHeader ? contactOnePhoneNo : contactTwoPhoneNo}
            keyboardType="numeric"
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.phoneNumber}
            onChangeText={handlePhoneNumber}
            maxLength={20}
            errorMsg={
              isHideHeader
                ? errorMessages.contact1PhoneNo
                : errorMessages.contact2PhoneNo
            }
            isEditable={isEditable}
          />
        </View>
      </View>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={isHideHeader ? contactOneMobileNo : contactTwoMobileNo}
            keyboardType="numeric"
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.mobileNumber}
            onChangeText={handleMobileNumber}
            maxLength={20}
            errorMsg={
              isHideHeader
                ? errorMessages.contact1MobileNo
                : errorMessages.contact2MobileNo
            }
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={isHideHeader ? contactOneFaxNo : contactTwoFaxNo}
            keyboardType="numeric"
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item.faxNumber}
            onChangeText={handleFaxNumber}
            maxLength={20}
            errorMsg={
              isHideHeader
                ? errorMessages.contact1FaxNo
                : errorMessages.contact2FaxNo
            }
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v1 style={tw('border-light-lavendar')}>
          <InputText
            title={isHideHeader ? contactOneEmail : contactTwoEmail}
            value={item.email}
            keyboardType="email-address"
            onChangeText={handleEmailId}
            maxLength={50}
            errorMsg={
              isHideHeader
                ? errorMessages.contact1Email
                : errorMessages.contact2Email
            }
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 />
      </View>
      <View marginT-v3 row centerV>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <View>
            <InputText
              title={isHideHeader ? contactOneNotes : contactTwoNotes}
              style={[tw('p-3 h-40'), {textAlignVertical: 'top'}]}
              multiline
              value={item.notes}
              enableErrors
              validate={[(value: string) => value?.length > 40]}
              validationMessage={['Words limit reached']}
              validateOnStart={true}
              validateOnChange={true}
              validationMessagePosition={'down'}
              maxLength={40}
              onChangeText={(text: string) => handleNotes(text)}
              errorMsg={
                isHideHeader
                  ? errorMessages.contact1Notes
                  : errorMessages.contact2Notes
              }
              isEditable={isEditable}
            />
            <View marginT-v1 style={tw('items-end')}>
              <Text text13M text90R>
                {`${item.notes?.length} / 40`}
              </Text>
            </View>
          </View>
        </View>
        <View flex marginR-v2 />
      </View>
    </View>
  );
};

export default ContactComponent;
