import React, { useEffect, useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import InputText from 'src/components/InputText';
import Modal from 'src/components/Modal';
import { VISIT_TYPES } from 'src/utils/Constant';
import VisitsController from 'src/controller/VisitsController';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';
import Dropdown from 'src/components/DropDown';
import { toast } from 'src/utils/Util';

const VisitInfoUpcomingVisitModal = (props: any) => {
  const {
    visitDate,
    visitStartTime,
    visitEndTime,
    fromCustomerSearch,
    visitPreparationMessage,
    onSaveButtonPress,
    onFinishBtnPress,
    onBackPress,
    isVisible,
    isEdit = false,
    fromCLOverview = false,
    visitPreparationNotes = '',
    isLastVisit = false,
    isPausedVisit = false,
    idEmployeeObjective,
    callFromDateTime,
    callStatus,
  } = props;
  // only the current visit notes can be editable
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isEditable, setIsEditable] = useState(isEdit);
  const [visitNote, setVisitNote] = useState(visitPreparationNotes);
  const [visitObjectiveErrorMessage, setVisitObjectiveErrorMessage] =
    useState('');
  const [visitObjectives, setVisitObjectives] = useState([]);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState<any>({});
  const [value, setValue] = useState('');
  const [placeholderValue, setPlaceholderValue] = useState('');
  const [visitObjective, setVisitObjective] = useState(
    props?.visitObjective && props?.visitObjective.trim()
      ? props?.visitObjective
      : '--',
  );

  const name = props?.name1 || '';
  const name2 = props?.name2 && props?.name2.trim() ? props?.name2 : '--';
  const name3 = props?.name3 && props?.name3.trim() ? props?.name3 : '--';
  const address =
    props?.address && props?.address.trim() ? props?.address : '--';
  const visitTitle =
    props?.screen && props?.screen === 'lastVisit'
      ? 'Last Visit'
      : callStatus === VISITS_CALL_STATUS.OPEN ||
        callStatus === VISITS_CALL_STATUS.ONHOLD
        ? 'label.general.current_visit'
        : fromCustomerSearch
          ? 'label.general.upcoming_visit'
          : 'label.general.upcoming_visit';

  useEffect(() => {
    setupDropdown();
    setVisitNote(visitPreparationNotes);
  }, [isVisible, idEmployeeObjective]);

  useEffect(() => {
    if (callStatus === VISITS_CALL_STATUS.OPEN) {
      setIsShowEdit(true);
    }
  }, [callStatus]);

  useEffect(() => {
    setVisitNote(visitPreparationNotes);
    // logic to hide the edit btn
    const selectedDate = new Date(callFromDateTime);
    const currentDate = new Date();
    console.log('selectedDate', selectedDate);
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (
      selectedDate.getTime() === currentDate.getTime() ||
      callStatus === VISITS_CALL_STATUS.OPEN
    ) {
      setIsShowEdit(true);
    } else if (selectedDate > currentDate) {
      setIsShowEdit(false);
    }
  }, [visitPreparationNotes]);

  // Setup the visit objectives dropdown
  const setupDropdown = async () => {
    if (props?.screen === 'lastVisit') {
      setVisitObjective(
        props?.visitObjective && props?.visitObjective.trim()
          ? props?.visitObjective
          : '--',
      );
      return;
    }

    VisitsController.getEmployeesObjectives()
      .then(res => {
        const objectives = res.map((item: any) => ({
          ...item,
          label: item.descriptionLanguage1,
          value: item.idEmployeeObjective,
        }));
        const selectedObjective = res.find(
          (item: any) => item.idEmployeeObjective === idEmployeeObjective,
        );

        setVisitObjectives(objectives);
        if (selectedObjective) {
          setValue(selectedObjective.idEmployeeObjective);
          setPlaceholderValue(selectedObjective.descriptionLanguage1);
          setVisitObjective(selectedObjective.descriptionLanguage1);
          setSelectedDropdownItem(selectedObjective);
          setVisitObjectiveErrorMessage('');
        } else {
          setValue('');
          setPlaceholderValue('Select Visit Objective');
          setSelectedDropdownItem({});
          if (isEdit) {
            setVisitObjectiveErrorMessage('Please select visit objective');
          }
        }
      })
      .catch(err => {
        console.log('the err is', err);
      });
  };

  // Reset the data when cancel is pressed
  const onCancelPressed = () => {
    setVisitNote(visitPreparationNotes);
    setIsEditable(false);
  };

  const visitTypes = [
    {
      label: 'Fixed',
      value: VISIT_TYPES.PLANNED,
    },
    {
      label: 'Adhoc',
      value: VISIT_TYPES.ADHOC,
    },
    {
      label: 'Phone / Email',
      value: VISIT_TYPES.PHONE,
    },
  ];

  const visitType = visitTypes.find(
    (visit: any) => visit.value === props.visitType,
  )?.label;

  // Changing the edit status
  const changeEditStatus = () => {
    if (!isEditable) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
      setVisitObjective(selectedDropdownItem.descriptionLanguage1);
      onSaveButtonPress(visitNote, selectedDropdownItem.idEmployeeObjective);
    }
  };

  const onFinishPress = () => {
    if (visitObjectiveErrorMessage !== '') {
      toast.error({
        message: visitObjectiveErrorMessage
      })

      return;
    }

    if (visitNote.trim().length === 0) {
      toast.error({
        message: 'Please enter visit note'
      })
      return;
    }

    onFinishBtnPress(visitNote, selectedDropdownItem.idEmployeeObjective);
  };

  const handleBack = () => {
    if (!fromCLOverview) {
      setVisitNote(visitPreparationNotes);
      setIsEditable(false);
    } else {
      setVisitNote('');
    }
    onBackPress();
  };

  const handleDropDown = (item: any) => {
    setValue(item.value);
    setPlaceholderValue(item.label);
    setSelectedDropdownItem(item);
    setVisitObjectiveErrorMessage('');
  };

  // Rendering the dropdown items
  const renderItem = (item: any) => {
    return (
      <View centerV margin-v2>
        <Text
          style={tw(
            `${item.value === value
              ? 'text-light-darkBlue'
              : 'text-light-textBlack'
            } text-btn font-normal`,
          )}>
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View
        bg-white
        padding-v4
        style={[tw('flex-1 w-1/2'), { marginLeft: '50%' }]}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView>
            <View row centerV spread>
              <View row>
                <TouchableOpacity style={tw('mr-8')} onPress={handleBack}>
                  <images.LeftArrowIcon />
                </TouchableOpacity>
                <View row centerV>
                  <Text text18BO textBlack marginT-3>
                    {visitTitle}
                  </Text>
                </View>
              </View>
              {!fromCLOverview && !isPausedVisit && (
                <View row>
                  {isEditable && (
                    <TouchableOpacity
                      style={tw('mr-6')}
                      onPress={onCancelPressed}>
                      <images.CancelIcon />
                    </TouchableOpacity>
                  )}
                  {!isLastVisit && isShowEdit && (
                    <TouchableOpacity onPress={changeEditStatus}>
                      {isEditable ? <images.SaveIcon /> : <images.EditIcon />}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            <View>
              <View marginT-v6 row>
                <View flex marginR-v5>
                  <Text text13M textBlack>
                    Name 1
                  </Text>
                  <Text text13R textBlack marginT-v02 numberOfLines={1}>
                    {name}
                  </Text>
                </View>
                <View flex marginR-v5>
                  <Text text13M textBlack>
                    Name 2
                  </Text>
                  <Text text13R textBlack marginT-v02 numberOfLines={1}>
                    {name2}
                  </Text>
                </View>
                <View flex>
                  <Text text13M textBlack>
                    Name 3
                  </Text>
                  <Text text13R textBlack marginT-v02 numberOfLines={1}>
                    {name3}
                  </Text>
                </View>
              </View>
              <View marginT-v6>
                <Text text13M textBlack>
                  Address
                </Text>
                <Text text13R textBlack marginT-v02 numberOfLines={1}>
                  {address}
                </Text>
              </View>
              <View marginT-v6 row>
                <View flex marginR-v5>
                  <Text text13M textBlack>
                    Visit Date
                  </Text>
                  <Text text13R textBlack marginT-v02 numberOfLines={1}>
                    {visitDate}
                  </Text>
                </View>
                <View flex marginR-v5>
                  <Text text13M textBlack>
                    Visit Start
                  </Text>
                  <Text text13R textBlack marginT-v02 numberOfLines={1}>
                    {visitStartTime}
                  </Text>
                </View>
                <View flex>
                  <Text text13M textBlack>
                    Visit End
                  </Text>
                  <Text text13R textBlack marginT-v02 numberOfLines={1}>
                    {visitEndTime}
                  </Text>
                </View>
              </View>
              <View marginT-v6 row centerV>
                <View flex marginR-v2>
                  {isEditable ? (
                    <Dropdown
                      title={`Visit Objective${isEditable ? '*' : ''}`}
                      isEditable={isEditable}
                      placeholder={placeholderValue}
                      data={visitObjectives}
                      value={value}
                      labelField={'label'}
                      valueField={'value'}
                      onChange={handleDropDown}
                      renderItem={renderItem}
                    />
                  ) : (
                    <Text text13R textBlack marginT-v02 numberOfLines={1}>
                      {visitObjective}
                    </Text>
                  )}
                  {visitTitle === 'Current Visit' &&
                    isEditable &&
                    visitObjectiveErrorMessage ? (
                    <Text text13M red1 style={tw('mt-2')}>
                      {visitObjectiveErrorMessage}
                    </Text>
                  ) : null}
                </View>
                <View flex>
                  <View flex>
                    <Text text13M textBlack>
                      Visit Type
                    </Text>
                    <Text text13R textBlack marginT-v02 numberOfLines={1}>
                      {visitType}
                    </Text>
                  </View>
                </View>
              </View>
              <View marginT-v6>
                <InputText
                  title={`Visit Preparation Notes${isEditable ? '*' : ''}`}
                  style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
                  multiline
                  isEditable={isEditable}
                  value={visitNote}
                  enableErrors
                  validate={[(value: string) => value.length > 500]}
                  validationMessage={['Words limit reached']}
                  validateOnStart={true}
                  validateOnChange={true}
                  validationMessagePosition={'down'}
                  showCharCounter={isEditable}
                  maxLength={500}
                  onChangeText={(text: string) => setVisitNote(text)}
                />
                {visitNote.trim().length <= 0 && (
                  <Text text13M red1 style={tw('mt-2')}>
                    {visitPreparationMessage}
                  </Text>
                )}
              </View>
            </View>
            {fromCLOverview && (
              <View marginT-v6 row centerV right>
                <TouchableOpacity
                  style={tw(
                    'flex-row bg-light-darkBlue rounded-md px-8 py-2-1 justify-center items-center',
                  )}
                  onPress={onFinishPress}>
                  <images.FinishIcon />
                  <Text text13R white marginL-v1>
                    Finish Visit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default VisitInfoUpcomingVisitModal;
