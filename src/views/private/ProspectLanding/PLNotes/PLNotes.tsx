import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { PROSPECT_LANDING_SCREENS } from 'src/utils/Constant';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import Card from 'src/components/Card';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import PVNotesTitleHeaderComponent from 'src/components/ProspectLanding/PLNotes/PVNotesTitleHeaderComponent';
import PVNotesBackOfficeComponent from 'src/components/ProspectLanding/PLNotes/PVNotesBackOfficeComponent';
import PVNotesModal from 'src/components/ProspectLanding/PLNotes/PVNotesModal';
import PLNotesController from 'src/controller/PLNotesController';
import { toast } from 'src/utils/Util';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import ACLService from 'src/services/ACLService';

const PLNotes = () => {
  const [loading, setLoading] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [isNotesEditable, setIsNotesEditable] = useState(false);
  const [noteObj, setNoteObj] = useState({
    notes: '',
  });
  const [prospectVisitNotes, setProspectVisitNotes] = useState<any>([]);
  const [selectedVisitNotes, setSelectedVisitNotes] = useState<any>(null);
  const [isSaveEnable, setIsSaveEnable] = useState(false);

  useEffect(() => {
    getVisitNotes();
    getSRNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //save action callback for backoffice
  const saveActionCallback = (SRNote: string) => {
    setNoteObj({ ...noteObj, notes: SRNote });
    updateSRNotes(SRNote);
  };

  //edit visit notes callback action
  const updateVisitNotesPressed = (obj: any) => {
    if (!!obj.visitNoteId && obj.visitNoteId !== '') {
      updateVisitNotes(obj.notes, obj.visitNoteId);
    } else {
      setNoteModalVisible(false);
      toast.error({ message: 'Something went wrong' });
    }
  };

  //tap action on prospect visit notes item
  const setEditModalVisible = (isShow: boolean, item: any) => {
    setNoteModalVisible(isShow);
    let customSelectedObj = {
      notes: item?.internalMessage,
      employeeName: item?.employeeName,
      employeeNumber: item?.employeeNumber,
      visitDate: item?.visitDate,
      visitNoteId: item?.prospect_visit_notes_id,
    };
    setSelectedVisitNotes(customSelectedObj);
  };

  // Get Backoffice Notes
  const getSRNotes = () => {
    PLNotesController.getSRNotes()
      .then(res => {
        if (res.length > 0) {
          setNoteObj({ ...noteObj, notes: res[0].srNotes });
        }
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        });
      });
  };

  //update backoffice Notes
  const updateSRNotes = (SRNote: string) => {
    PLNotesController.updateSRNotes(SRNote)
      .then(async res => {
        if (res) {
          toast.success({ message: 'Back Office Note Updated' });
          setIsSaveEnable(false);
          await ACLService.saveAclGuardStatusToStorage(false);
        }
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        });
      });
  };

  //update Visit Notes
  const updateVisitNotes = (SRNote: string, visit_note_id: string) => {
    PLNotesController.updateOrInsertVisitNotes(SRNote, visit_note_id)
      .then(async res => {
        if (res) {
          setNoteModalVisible(false);
          getVisitNotes();
          toast.success({ message: 'Prospection Visit Notes Updated' });
          await ACLService.saveAclGuardStatusToStorage(false);
        } else {
          toast.error({ message: 'Something went wrong in update visit notes.' });
        }
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Error while updating the visit', err);
      });
  };

  //Inser prospection visit notes
  const insertVisitData = (notes: string) => {
    PLNotesController.updateOrInsertVisitNotes(notes).then(async res => {
      if (res) {
        setNoteModalVisible(false);
        getVisitNotes();
        toast.success({ message: 'Propspection Visit Notes Added' });
        await ACLService.saveAclGuardStatusToStorage(false);
      } else {
        toast.error({ message: 'Something went wrong in insert visit notes.' });
      }
    });
  };

  // Get Propspects Visit Notes
  const getVisitNotes = () => {
    PLNotesController.getVisitNotes()
      .then(res => {
        if (res.length > 0) {
          setProspectVisitNotes({ ...prospectVisitNotes, res });
        }
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Error while get prospect visit data', err);
      });
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <View flex>
        <ProspectLandingHeader
          fromPLP={true}
        />
        <View row flex>
          <PLLeftMenuComponent activeTab={PROSPECT_LANDING_SCREENS.NOTES} />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
              style={{ flexGrow: 1 }}>
              <View flex marginR-v2 marginB-v2>
                <Card flex-1>
                  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <PVNotesTitleHeaderComponent
                      notes={prospectVisitNotes?.res}
                      setNoteModalVisible={setEditModalVisible}
                      setIsNotesEditable={setIsNotesEditable}
                    />
                    <PVNotesBackOfficeComponent
                      backOfficeNoteObj={noteObj}
                      isSaveEnable={isSaveEnable}
                      onChangeSaveEnable={() => setIsSaveEnable(true)}
                      onSave={saveActionCallback}
                    />
                  </ScrollView>
                </Card>
                <PVNotesModal
                  visible={noteModalVisible}
                  setNoteModalVisible={setNoteModalVisible}
                  prospectVisitNote={selectedVisitNotes}
                  isNotesEditable={isNotesEditable}
                  onEditNotesPress={updateVisitNotesPressed}
                  onSaveNotesPress={insertVisitData}
                />
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withAuthScreen(PLNotes, true);
