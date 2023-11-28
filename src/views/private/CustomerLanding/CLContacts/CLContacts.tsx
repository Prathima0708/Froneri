import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import { CUSTOMER_LANDING_SCREENS } from 'src/utils/Constant';
import Card from 'src/components/Card';
import { images } from 'src/assets/Images';
import RenderContact from 'src/components/CustomerLanding/CLContacts/RenderContact';
import FieldSalesModal from 'src/components/CustomerLanding/CLContacts/FieldSalesModal';
import CLContactsController from 'src/controller/CLContactsController';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import { FlatList } from 'react-native-gesture-handler';
import { setContactsInfo } from 'src/reducers/CustomerLandingSlice';
import CLOverviewController from 'src/controller/CLOverviewController';
import { toast } from 'src/utils/Util';

const CLContacts = () => {
  // States for the modal and loading
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewFieldSales, setIsNewFieldSales] = useState(false);

  // Data states for the tele sales and field sales
  const [telesalesData, setTelesalesData] = useState<any>([]);
  const [dropdownData, setDropdownData] = useState([]);
  const [telesalesContactItem, setTelesalesContactItem] = useState({});

  // Redux states
  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  const telesalesContactInfo = useAppSelector(
    (state: RootState) => state.customerLanding.contactsInfo,
  );

  const dispatch = useAppDispatch();

  // Setting the tele sales data and dropdown data on component mount
  useEffect(() => {
    getData();
  }, []);

  // Get the contacts data and dropdown data
  const getData = async () => {
    getTelesalesContacts();
    getDropdownData();
  };

  // Setting the tele sales contacts data using the customer info data of overview screen
  const getTelesalesContacts = () => {
    const teleSalesContact1Data = {
      title: customerInfoData.title ? customerInfoData.title : '',
      name: customerInfoData?.contact1Name,
      phone1: customerInfoData?.contact1Phone1,
      phone2: customerInfoData?.contact1Phone2,
      email: customerInfoData?.contact1MailAddress,
      description: customerInfoData?.contact1Description,
    };
    const teleSalesContact2Data = {
      title: customerInfoData.title ? customerInfoData.title : '',
      name: customerInfoData?.contact2Name,
      phone1: customerInfoData?.contact2Phone1,
      phone2: customerInfoData?.contact2Phone2,
      email: customerInfoData?.contact2MailAddress,
      description: customerInfoData?.contact2Description,
    };

    setTelesalesData([teleSalesContact1Data, teleSalesContact2Data]);
  };

  // Fetching the dropdown data
  const getDropdownData = () => {
    CLContactsController.getDropdownData()
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
        })
        console.log('Dropdown err :>> ', err);
      });
  };

  // Hiding the modal and setting the isNewFieldSales to false
  const handleBackPress = () => {
    setIsModalVisible(false);
    setIsNewFieldSales(false);
  };

  // Opening the modal in create mode
  const handleNewFieldModal = () => {
    setTelesalesContactItem({});
    setIsModalVisible(true);
    setIsNewFieldSales(true);
  };

  // Opening the modal in edit mode
  const handleFieldModal = (telesalesContactItem: any) => {
    setTelesalesContactItem(telesalesContactItem);
    setIsModalVisible(true);
  };

  // Creating/Updating the contact details on save button press
  const onSaveButtonPress = (contactDetails: any) => {
    console.log('contactDetails :>> ', contactDetails);
    CLContactsController.createOrUpdateContactDetails(contactDetails)
      .then(success => {
        console.log('Create/Update contacts response', success);
        if (!success) {
          toast.error({
            message: 'Something went wrong',
          })
          return;
        }

        handleBackPress();

        getContactsData();
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('Error while creating the contacts', err);
      });
  };

  // Deleting the contact details on delete button press
  const onDeletePress = (idCustomerContact: string) => {
    console.log('idCustomerContact :>> ', idCustomerContact);
    CLContactsController.deleteContact(idCustomerContact)
      .then(success => {
        console.log('Delete contact response', success);
        if (!success) {
          toast.error({
            message: 'Something went wrong',
          })
          return;
        }

        handleBackPress();
        getContactsData();
        setTelesalesContactItem({});
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('Error while creating the contacts', err);
      });
  };

  // Fetching the contacts data of the customer
  const getContactsData = () => {
    CLOverviewController.getContacts(customerInfoData)
      .then((contacts: any) => {
        dispatch(setContactsInfo({ contactsInfo: contacts }));
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log(
          '🚀 ~ file: CLOverview.tsx:100 ~ CLOverviewController.getContacts ~ error:',
          error,
        );
      });
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader />
      <View flex row>
        <CLLeftMenuComponent activeTab={CUSTOMER_LANDING_SCREENS.CONTACTS} />
        <Card flex-1 marginR-v2 marginB-v2 padding-v4 row>
          <View flex marginR-v4>
            <Text text18M textBlack>
              Field Sales Contacts
            </Text>
            <View marginT-v2>
              <FlatList
                data={telesalesContactInfo}
                keyExtractor={item => item.idCustomerContact}
                renderItem={({ item }) => (
                  <RenderContact
                    item={item}
                    onPressFieldModal={handleFieldModal}
                    isFieldSalesContact={true}
                    isTeleSalesContact={false}
                  />
                )}
                contentContainerStyle={tw('pb-1')}
              />
            </View>
            {telesalesContactInfo.length < 2 && (
              <TouchableOpacity
                style={tw('flex-row items-center p-3')}
                onPress={handleNewFieldModal}>
                <images.PlusIconWithBorder />
                <Text text13R marginL-v1 style={tw('text-light-darkBlue')}>
                  Add Field Sales Contact
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View flex>
            <Text text18M textBlack>
              Tele Sales Contacts
            </Text>
            <View marginT-v2>
              <FlatList
                data={telesalesData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <RenderContact
                    item={item}
                    isFieldSalesContact={false}
                    isTeleSalesContact={true}
                  />
                )}
                contentContainerStyle={tw('pb-1')}
              />
            </View>
          </View>
        </Card>
      </View>
      <FieldSalesModal
        isModalVisible={isModalVisible}
        isNewFieldSales={isNewFieldSales}
        onBackPress={handleBackPress}
        item={telesalesContactItem}
        dropdownData={dropdownData}
        onSaveButtonPress={onSaveButtonPress}
        onDeletePress={onDeletePress}
      />
    </SafeAreaView>
  );
};

export default CLContacts;
