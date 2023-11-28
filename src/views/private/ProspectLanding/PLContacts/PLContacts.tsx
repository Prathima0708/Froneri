import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PROSPECT_LANDING_SCREENS } from 'src/utils/Constant';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import Card from 'src/components/Card';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import ContactComponent from 'src/components/ProspectLanding/PLContacts/ContactComponent';
import PLContactsController from 'src/controller/PLContactsController';
import { toast } from 'src/utils/Util';
import { mobileRegex, validateEmail } from 'src/utils/CommonUtil';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import ACLService from 'src/services/ACLService';
import MessageModal from 'src/components/Common/MessageModal';
import Text from 'src/components/Text';
import { BUTTON_TYPE } from 'src/components/Button/ButtonType';

export interface IContactInfo {
  title: object | null | undefined;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  mobileNumber: string;
  faxNumber: string;
  email: string;
  notes: string;
}

const PLContacts = () => {
  const [loading, setLoading] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false); // Cancel modal state
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [dropdownData, setDropdownData] = useState<any>([]);
  const [message, setMessage] = useState<string>('');
  const [contactOne, setContactOne] = useState<IContactInfo>({
    title: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    mobileNumber: '',
    faxNumber: '',
    email: '',
    notes: '',
  });
  const [contactTwo, setContactTwo] = useState<IContactInfo>({
    title: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    mobileNumber: '',
    faxNumber: '',
    email: '',
    notes: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    designationContact1: '',
    contact1FirstName: '',
    contact1LastName: '',
    contact1PhoneNo: '',
    contact1MobileNo: '',
    contact1FaxNo: '',
    contact1Email: '',
    contact1Notes: '',
    designationContact2: '',
    contact2FirstName: '',
    contact2LastName: '',
    contact2PhoneNo: '',
    contact2MobileNo: '',
    contact2FaxNo: '',
    contact2Email: '',
    contact2Notes: '',
  });
  const [mandatoryData, setMandatoryData] = useState({
    designationContact1: 0,
    contact1FirstName: 0,
    contact1LastName: 0,
    contact1PhoneNo: 0,
    contact1MobileNo: 0,
    contact1FaxNo: 0,
    contact1Email: 0,
    contact1Notes: 0,
    designationContact2: 0,
    contact2FirstName: 0,
    contact2LastName: 0,
    contact2PhoneNo: 0,
    contact2MobileNo: 0,
    contact2FaxNo: 0,
    contact2Email: 0,
    contact2Notes: 0,
  });

  const prospectInfo = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );
  const statusType = prospectInfo.statusType ? prospectInfo.statusType : 'c';
  const isEditable = statusType.toLowerCase() === 'p';

  useEffect(() => {
    /** get title data for dropdown **/
    getDropdownData();
    getMandatoryFieldsConfig();
  }, []);

  useEffect(() => {
    /** get contact information **/
    getContactInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownData]);

  // Get Mandatory field
  const getMandatoryFieldsConfig = async () => {
    try {
      const mandatoryFieldsConfig =
        await PLContactsController.getMandatoryFieldsConfig();
      setMandatoryData(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };
  // Get Contact Information
  const getContactInfo = () => {
    PLContactsController.getContactsData()
      .then(res => {
        if (res.length > 0) {
          const {
            firstNameContact1,
            firstNameContact2,
            lastNameContact1,
            lastNameContact2,
            mobileNumContact1,
            mobileNumContact2,
            phoneNumContact1,
            phoneNumContact2,
            comment1,
            comment2,
            designationContact1,
            designationContact2,
            emailContact1,
            emailContact2,
            faxNumContact1,
            faxNumContact2,
          } = res[0];
          let contactOneTitle = dropdownData.find(
            (i: any) => i.label === designationContact1,
          );
          let contactTwoTitle = dropdownData.find(
            (i: any) => i.label === designationContact2,
          );
          setContactOne({
            ...contactOne,
            title: contactOneTitle,
            firstName: firstNameContact1,
            lastName: lastNameContact1,
            phoneNumber: phoneNumContact1,
            mobileNumber: mobileNumContact1,
            faxNumber: faxNumContact1,
            email: emailContact1,
            notes: comment1,
          });
          setContactTwo({
            ...contactTwo,
            title: contactTwoTitle,
            firstName: firstNameContact2,
            lastName: lastNameContact2,
            phoneNumber: phoneNumContact2,
            mobileNumber: mobileNumContact2,
            faxNumber: faxNumContact2,
            email: emailContact2,
            notes: comment2,
          });
        }
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Get contact err :>> ', err);
      });
  };

  // Fetching the dropdown data
  const getDropdownData = () => {
    PLContactsController.getContactDropdownData()
      .then(res => {
        if (res.length > 0) {
          let dropdownData = res.filter(
            (dropdownItem: any) => dropdownItem.personTitle !== '',
          );
          dropdownData = dropdownData.map(
            (dropdownItem: any, index: number) => ({
              label: dropdownItem.personTitle,
              value: `${index + 1}`,
            }),
          );

          setDropdownData(dropdownData);
        } else {
          setDropdownData([]);
        }
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Dropdown err :>> ', err);
      });
  };

  /** check validate inputs **/
  const validateInputs = () => {
    setErrorMessages({
      designationContact1: '',
      contact1FirstName: '',
      contact1LastName: '',
      contact1PhoneNo: '',
      contact1MobileNo: '',
      contact1FaxNo: '',
      contact1Email: '',
      contact1Notes: '',
      designationContact2: '',
      contact2FirstName: '',
      contact2LastName: '',
      contact2PhoneNo: '',
      contact2MobileNo: '',
      contact2FaxNo: '',
      contact2Email: '',
      contact2Notes: '',
    });

    let isError = false;
    if (
      mandatoryData.designationContact1 &&
      (contactOne.title == null || contactOne.title?.label?.trim() === '')
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        designationContact1: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.designationContact2 &&
      (contactTwo.title == null || contactTwo.title?.label?.trim() === '')
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        designationContact2: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.contact1FirstName && contactOne.firstName.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1FirstName: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.contact2FirstName && contactTwo.firstName.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2FirstName: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.contact1LastName && contactOne.lastName.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1LastName: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.contact2LastName && contactTwo.lastName.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2LastName: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.contact1PhoneNo && contactOne.phoneNumber.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1PhoneNo: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactOne.phoneNumber.trim() !== '' &&
      !mobileRegex.test(contactOne.phoneNumber)
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1PhoneNo: 'Invalid',
      }));
      isError = true;
    }

    if (mandatoryData.contact2PhoneNo && contactTwo.phoneNumber.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2PhoneNo: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactTwo.phoneNumber.trim() !== '' &&
      !mobileRegex.test(contactTwo.phoneNumber)
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2PhoneNo: 'Invalid',
      }));
      isError = true;
    }

    if (
      mandatoryData.contact1MobileNo &&
      contactOne.mobileNumber.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1MobileNo: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactOne.mobileNumber.trim() !== '' &&
      !mobileRegex.test(contactOne.mobileNumber)
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1MobileNo: 'Invalid',
      }));
      isError = true;
    }

    if (
      mandatoryData.contact2MobileNo &&
      contactTwo.mobileNumber.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2MobileNo: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactTwo.mobileNumber.trim() !== '' &&
      !mobileRegex.test(contactTwo.mobileNumber)
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2MobileNo: 'Invalid',
      }));
      isError = true;
    }

    if (mandatoryData.contact1FaxNo && contactOne.faxNumber.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1FaxNo: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactOne.faxNumber.trim() !== '' &&
      isNaN(Number(contactOne.faxNumber))
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1FaxNo: 'Invalid',
      }));
      isError = true;
    }

    if (mandatoryData.contact2FaxNo && contactTwo.faxNumber.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2FaxNo: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactTwo.faxNumber.trim() !== '' &&
      isNaN(Number(contactTwo.faxNumber))
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2FaxNo: 'Invalid',
      }));
      isError = true;
    }

    if (mandatoryData.contact1Email && contactOne.email.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1Email: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactOne.email.trim().length > 0 &&
      !validateEmail(contactOne.email.trim())
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1Email: 'Invalid',
      }));
      isError = true;
    }

    if (mandatoryData.contact2Email && contactTwo.email.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2Email: 'Mandatory',
      }));
      isError = true;
    }

    if (
      contactTwo.email.trim().length > 0 &&
      !validateEmail(contactTwo.email.trim())
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2Email: 'Invalid',
      }));
      isError = true;
    }

    if (mandatoryData.contact1Notes && contactOne.notes.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact1Notes: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.contact2Notes && contactTwo.notes.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        contact2Notes: 'Mandatory',
      }));
      isError = true;
    }
    return isError;
  };

  /** on save contact info **/
  const handleSave = () => {
    try {
      if (validateInputs()) {
        return;
      } else {
        PLContactsController.updateOrInsertDiscoveryContacts(
          contactOne,
          contactTwo,
        )
          .then(async () => {
            await ACLService.saveAclGuardStatusToStorage(false);
            setIsButtonActive(false);
            toast.success({ message: 'Changes Saved Successfully.' });
          })
          .catch(err => {
            toast.error({
              message: 'Something went wrong',
            });
            console.log('insert contact err :>> ', err);
          });
      }
    } catch (error) {
      toast.error({
        message: 'Changes failed',
      });
      console.log('contact err :>> ', error);
    }
  };

  const handleCancel = () => {
    setIsCancelModalVisible((prevData: any) => !prevData);
  };

  const handleDiscard = () => {
    setIsCancelModalVisible((prevData: any) => !prevData);
    getContactInfo();
    setIsButtonActive(false);
    ACLService.saveAclGuardStatusToStorage(false);
  };

  const stickyHeader = () => {
    return (
      <View padding-v4 centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Contact 1
        </Text>
        {isEditable && (
          <View row>
            <TouchableOpacity
              onPress={handleCancel}
              disabled={!isButtonActive}
              style={tw('p-2 rounded-md')}>
              <Text
                text13R
                style={tw(
                  `${isButtonActive ? 'text-light-textBlack' : 'text-light-grey2'
                  }`,
                )}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw(
                `${isButtonActive
                  ? BUTTON_TYPE.PRIMARY_ENABLED
                  : BUTTON_TYPE.PRIMARY_DISABLED
                } px-36px ml-36px`,
              )}
              onPress={handleSave}>
              <Text
                text13R
                style={tw(
                  `${isButtonActive
                    ? BUTTON_TYPE.PRIMARY_ENABLED_LABEL
                    : BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                  }`,
                )}>
                {'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <View flex>
        <ProspectLandingHeader message={message}
          fromPLP={true}
        />
        <View row flex>
          <PLLeftMenuComponent activeTab={PROSPECT_LANDING_SCREENS.CONTACTS} />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <View flex marginR-v2 marginB-v2>
              <Card flex-1>
                {/** sticky header **/}
                {stickyHeader()}
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}>
                  <ContactComponent
                    titleData={dropdownData}
                    item={contactOne}
                    setContact={setContactOne}
                    isHideHeader={true}
                    errorMessages={errorMessages}
                    mandatoryData={mandatoryData}
                    isEditable={isEditable}
                    setIsButtonActive={setIsButtonActive}
                    isButtonActive={isButtonActive}
                  />
                  <View
                    marginT-v1
                    marginH-v2
                    style={tw('bg-light-lavendar h-px')}
                  />
                  <ContactComponent
                    titleData={dropdownData}
                    item={contactTwo}
                    setContact={setContactTwo}
                    isHideHeader={false}
                    errorMessages={errorMessages}
                    mandatoryData={mandatoryData}
                    isEditable={isEditable}
                    setIsButtonActive={setIsButtonActive}
                    isButtonActive={isButtonActive}
                  />
                </ScrollView>
              </Card>
              <MessageModal
                isVisible={isCancelModalVisible}
                title="Discard the Changes?"
                subTitle="Your unsaved edits will be lost"
                primaryButtonText="Yes, Discard"
                secondaryButtonText="No, Keep the changes"
                handleOnPressSuccess={handleDiscard}
                handleOnPressCancel={handleCancel}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withAuthScreen(PLContacts, true);
