import React, { useState, useEffect } from 'react';
import View from 'src/components/View';
import { tw } from 'src/tw';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import { SafeAreaView } from 'react-native';
import { CUSTOMER_LANDING_SCREENS } from 'src/utils/Constant';
import NotesComponent from 'src/components/CustomerLanding/CLBasicInfo/Notes/NotesComponent';
import PartnerDetailsComponent from 'src/components/CustomerLanding/CLBasicInfo/PartnerDetails/PartnerDetailsComponent';
import CustomerDetailsComponent from 'src/components/CustomerLanding/CLBasicInfo/CustomerDetails/CustomerDetailsComponent';
import NotesModal from 'src/components/CustomerLanding/CLBasicInfo/Notes/NotesModal';
import CLBasicInfoController from 'src/controller/CLBasicInfoController';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import { toast } from 'src/utils/Util';

const CLBasicInfo = () => {
  const [loading, setLoading] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState({
    customersShipToInfo: {},
    customersBillToInfo: {},
    customersSoldToInfo: {},
    customersPayerInfo: {},
  });

  const [customerDetails, setCustomerDetails] = useState({
    generalInfo: {},
    hierarchyInfo: {},
    territoryInfo: {},
  });

  /**
   * note: Telesales notes can't be edited
   * Max 3 notes can be added for Field sales
   */
  const [customerNotes, setCustomerNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState({});
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [isCreateNewNote, setIsCreateNewNote] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    setLoading(true);
    handlePartnerDetails();
    handleCustomerDetails();
    handleCustomerNotes();
  }, []);

  // get partner details
  const handlePartnerDetails = () => {
    CLBasicInfoController.getPartnerDetails()
      .then(res => setPartnerDetails(res))
      .catch(err => {
        console.log('err', err);
      });
  };

  // get customer details
  const handleCustomerDetails = () => {
    CLBasicInfoController.getCustomerDetails()
      .then(res => setCustomerDetails(res))
      .catch(err => {
        console.log('err', err);
      });
  };

  // get customer notes
  const handleCustomerNotes = () => {
    CLBasicInfoController.getCustomerNotes()
      .then(res => {
        setCustomerNotes(res);
        console.log('getCustomerNotes', res);
      })
      .catch(err => {
        console.log('err', err);
      })
      .finally(() => setLoading(false));
  };

  const handleNotesModalBack = () => {
    setIsNotesModalVisible(false);
    setIsCreateNewNote(false);
    setIsEditable(false);
  };

  const handleAddNote = () => {
    if (customerNotes.length >= 6) {
      toast.error({
        message: 'You can add maximum 6 notes',
      })
      return;
    }
    setSelectedNotes({});
    setIsNotesModalVisible(true);
    setIsCreateNewNote(true);
  };

  const handleNotes = (item: any) => {
    console.log('seleced item', item);
    setIsNotesModalVisible(true);
    setIsCreateNewNote(false);
    setIsEditable(false);
    setSelectedNotes(item);
  };

  const handleIsEditable = (obj: any) => {
    if (isEditable || isCreateNewNote) {
      console.log('edit mode called');
      CLBasicInfoController.createOrUpdateCustomerNotes(obj)
        .then(res => {
          console.log('update success');
          handleCustomerNotes();
          if (isCreateNewNote || obj.type == '1') {
            setIsNotesModalVisible(false);
          }
        })
        .catch(err => {
          console.log('err', err);
        });
    }

    setIsEditable(!isEditable);
  };
  const handleDeleteNotes = (obj: any) => {
    CLBasicInfoController.deleteCustomerNotes(obj)
      .then(res => {
        console.log('delete success');
        handleCustomerNotes();

        setIsNotesModalVisible(false);
      })
      .catch(err => {
        console.log('err', err);
        toast.error({
          message: 'Something went wrong',
        })
        setIsNotesModalVisible(false);
      });
  };
  const handleNoteCancel = () => {
    setIsCreateNewNote(false);
    setIsEditable(false);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <View flex>
        <CustomerLandingHeader />

        <View flex row>
          <CLLeftMenuComponent
            activeTab={CUSTOMER_LANDING_SCREENS.BASIC_INFO}
          />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <View flex marginR-v2 marginB-v2>
              <View flex-13 marginB-v2 row>
                <PartnerDetailsComponent partnerDetails={partnerDetails} />
                <CustomerDetailsComponent customerDetails={customerDetails} />
              </View>
              <NotesComponent
                customerNotes={customerNotes}
                onPressAddNote={handleAddNote}
                onPressNotes={handleNotes}
              />
            </View>
          )}
        </View>
        <NotesModal
          isNotesModalVisible={isNotesModalVisible}
          isModalEditable={isCreateNewNote ? true : isEditable}
          isNewNote={isCreateNewNote}
          handleBack={handleNotesModalBack}
          handleIsEditable={handleIsEditable}
          selectedNotes={selectedNotes}
          handleNoteCancel={handleNoteCancel}
          handleDeleteNotes={handleDeleteNotes}
        />
      </View>
    </SafeAreaView>
  );
};

export default CLBasicInfo;
