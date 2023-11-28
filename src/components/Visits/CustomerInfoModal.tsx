import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import { DATETIME_PICKER_MODE, VISIT_TYPES } from 'src/utils/Constant';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import RadioButton from 'src/components/RadioButton';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import {
  formatDate,
  formatDateReverse,
  getISOCurrentDate,
  getOnlyDate,
  getOnlyTime,
  getOnlyTimeFromUTCDate,
} from 'src/utils/CommonUtil';
import DateTimePicker from 'src/components/DateTimePicker';
import VisitsContoller from 'src/controller/VisitsController';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';
import { ParametersValuesService } from 'src/services/ParametersValuesService';
import TextError from '../TextError';
import CustomerIconComponent from '../Common/CustomerIconComponent';
import DeleteModal from '../Common/DeleteModal';
import { pageNameCLOverview } from 'src/routes/Routes';
import CLOverviewController from 'src/controller/CLOverviewController';
import Dropdown from 'src/components/DropDown';
import PLOverviewController from 'src/controller/PLOverviewController';
import { toast } from 'src/utils/Util';
import CopyTextComponent from '../Common/CopyTextComponent';

const CustomerInfoModal = (props: any) => {
  let { data: customerData, onPress, startVisitPressed, refreshVisits } = props;

  const [data, setData] = useState(customerData);

  const navigation = useNavigation();
  const { t } = useTranslation()

  const [isApiCalled, setIsApiCalled] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isStartVisible, setIsStartVisible] = useState(true);
  const [isEditVisible, setIsEditVisible] = useState(true);
  const [isDeleteVisible, setIsDeleteVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [visitObjectives, setVisitObjectives] = useState([]);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState<any>({});

  const [value, setValue] = useState('');
  const [placeholderValue, setPlaceholderValue] = useState('');
  const [visitDateErrorMessage, setVisitDateErrorMessage] = useState('');
  const [visitStartErrorMessage, setVisitStartErrorMessage] = useState('');
  const [visitEndErrorMessage, setVisitEndErrorMessage] = useState('');
  const [visitObjectiveErrorMessage, setVisitObjectiveErrorMessage] =
    useState('');
  const [visitTypeErrorMessage, setVisitTypeErrorMessage] = useState('');
  const [pastVisitInDays, setPastVisitInDays] = useState(0);

  const [visitDate, setVisitDate] = useState(
    formatDate(new Date(data.call_from_datetime)),
  );
  const [visitStart, setVisitStart] = useState(
    data?.call_from_datetime ? getOnlyTime(data.call_from_datetime) : '',
  );
  const [visitEnd, setVisitEnd] = useState(data?.call_to_datetime ? getOnlyTime(data.call_to_datetime) : "");
  const [visitType, setVisitType] = useState(data.visit_type);
  const [visitNote, setVisitNote] = useState(
    data.visit_preparation_notes ? data.visit_preparation_notes : '',
  );

  const renderVisitDate = formatDateReverse(new Date(visitDate));
  const visitTitle =
    data?.call_status && data?.call_status === VISITS_CALL_STATUS.INITIAL
      ? 'label.general.start_visit'
      : data?.call_status && data?.call_status === VISITS_CALL_STATUS.ONHOLD
        ? 'label.general.resume_visit'
        : 'label.general.continue';

  useEffect(() => {
    setIsLoading(true);
    checkAndHideButtons();
    setupDropdown();
  }, []);

  const checkAndHideButtons = async () => {
    // Hide the start, edit and delete button if the visit is completed
    if (
      data.call_status === VISITS_CALL_STATUS.ORDER ||
      data.call_status === VISITS_CALL_STATUS.NO_ORDER ||
      data.call_status === VISITS_CALL_STATUS.FINISHED ||
      data.call_status === VISITS_CALL_STATUS.CLOSED
    ) {
      setIsStartVisible(false);
      setIsEditVisible(false);
      setIsDeleteVisible(false);
    }
    //  Hide the start button if the visit is in future
    else if (
      formatDate(new Date(data.call_from_datetime)) > formatDate(new Date())
    ) {
      setIsStartVisible(false);
    }
    // Hide the edit and delete button if the visit is on paused
    else if (data.call_status === VISITS_CALL_STATUS.ONHOLD) {
      setIsEditVisible(false);
      setIsDeleteVisible(false);
    }
    // Hide the edit button if the visit is in past and Create_Past_Visit_In_Days is 0
    else if (new Date(data.call_from_datetime) < new Date()) {
      const parametersValuesService = new ParametersValuesService();
      const parameterValue = Number(
        await parametersValuesService.getParameterValue(
          'Create_Past_Visit_In_Days',
        ),
      );

      if (parameterValue <= 0) {
        setIsEditVisible(false);
      }

      setPastVisitInDays(parameterValue);
    }
  };

  // Setup the visit objectives dropdown
  const setupDropdown = async () => {
    VisitsContoller.getEmployeesObjectives()
      .then(res => {
        const objectives = res.map((item: any) => ({
          ...item,
          label: item.descriptionLanguage1,
          value: item.idEmployeeObjective,
        }));
        const selectedObjective = res.find(
          (item: any) =>
            item.idEmployeeObjective === data.id_employee_objective,
        );

        setVisitObjectives(objectives);
        if (selectedObjective) {
          setValue(selectedObjective.idEmployeeObjective);
          setPlaceholderValue(selectedObjective.descriptionLanguage1);
          setSelectedDropdownItem(selectedObjective);
        } else {
          setValue('');
          setPlaceholderValue('');
          setSelectedDropdownItem({});
        }
      })
      .catch(err => {
        console.log('the err is', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Empty the error messages
  const emptyErrorMessages = () => {
    setVisitDateErrorMessage('');
    setVisitStartErrorMessage('');
    setVisitEndErrorMessage('');
    setVisitObjectiveErrorMessage('');
    setVisitTypeErrorMessage('');
  };

  // Validating and saving the visit
  const validateAndSaveVisit = async () => {
    if (visitDate === '') {
      setVisitDateErrorMessage('Mandatory');
      return;
    } else if (visitStart === '') {
      setVisitStartErrorMessage('Mandatory');
      return;
    } else if (visitEnd === '') {
      setVisitEndErrorMessage('Mandatory');
      return;
    } else if (value === '') {
      setVisitObjectiveErrorMessage('Mandatory');
      return;
    } else if (visitType === '') {
      setVisitTypeErrorMessage('Mandatory');
      return;
    }

    emptyErrorMessages();

    const selectedVisitDate = new Date(visitDate);
    const todaysDate = new Date();

    if (
      pastVisitInDays > 0 &&
      selectedVisitDate.getDate() < todaysDate.getDate()
    ) {
      const daysDiff = Math.ceil(
        (todaysDate.getTime() - selectedVisitDate.getTime()) /
        (1000 * 3600 * 24),
      );

      if (daysDiff > pastVisitInDays) {
        toast.error({
          message: t("message.home.past_visit_error_1") + "\n" +
            pastVisitInDays + " " +
            t('message.home.past_visit_error_2'),
          duration: 4000,
        })
        return;
      }
    }

    if (selectedVisitDate > todaysDate) {
      setIsStartVisible(false);
    } else {
      setIsStartVisible(true);
    }

    let obj = {
      idCall: data.id_call,
      callFromDateTime: `${visitDate} ${visitStart}:00`,
      callToDateTime: `${visitDate} ${visitEnd}:00`,
      idEmployeeObjective: value,
      visitType: visitType,
      originalCallFromDateTime: data.call_from_datetime,
      originalCallToDateTime: data.call_to_datetime,
      visitPreparationNotes: visitNote,
      preferedCallTime: visitStart.replace(':', ''),
    };

    console.log('the obj is', obj);
    VisitsContoller.updateEditVisit(obj)
      .then(res => {
        const newData = {
          ...data,
          call_from_datetime: `${visitDate} ${visitStart}:00`,
          call_to_datetime: `${visitDate} ${visitEnd}:00`,
          id_employee_objective: value,
          visit_type: visitType,
          visit_preparation_notes: visitNote,
        };
        setData(newData);
        console.log('success', res);
      })
      .catch(err => {
        console.log('the err is', err);
      })
      .finally(() => {
        setIsEditable(false);
        setIsApiCalled(true);
      });
  };

  // Changing the edit status
  const changeEditStatus = () => {
    if (!isEditable) {
      setIsEditable(true);
    } else {
      validateAndSaveVisit();
    }
  };

  // Deleting the visit and closing the modal
  const handleDeleteVisits = () => {
    VisitsContoller.updateDeleteVisit(data.id_call)
      .then(res => {
        console.log('success', res);
      })
      .catch(err => {
        console.log('the err is', err);
      })
      .finally(() => {
        setIsDeleteModalVisible(false);
        refreshVisits && refreshVisits();
      });
  };

  // Starting the visit
  const handleStartVisit = () => {
    if (value === '') {
      toast.error({
        message: 'message.home.add_visit_objective',
      })
      return;
    }

    VisitsContoller.getOpenVisits()
      .then(visits => {
        console.log('visits :>> ', visits);
        if (visits.length > 0 && visits[0]?.idCall !== data.id_call) {
          let inProgressVisitDate = visits[0].callFromDatetime
            ? getOnlyDate(visits[0].callFromDatetime)
            : '';

          let inProgressVisitTime = visits[0].callFromDatetime
            ? getOnlyTime(visits[0].callFromDatetime)
            : '';

          toast.info({
            message: `${t('message.home.visit_already_in_progress_error_1')} ${inProgressVisitDate} ${t('message.home.visit_already_in_progress_error_2')} ${inProgressVisitTime}.\n${t('message.home.visit_already_in_progress_error_3')}`,
            duration: 5000,
          })

          return;
        }
        if (
          data?.call_status &&
          data?.call_status === VISITS_CALL_STATUS.INITIAL
        ) {
          VisitsContoller.updateStartVisit(data.id_call)
            .then(res => {
              console.log('success', res);
              startVisitPressed && startVisitPressed(true);
            })
            .catch(err => {
              startVisitPressed && startVisitPressed();
            });
        } else {
          if (data?.call_status === VISITS_CALL_STATUS.ONHOLD) {
            CLOverviewController.resumeVisit(data.id_call)
              .then(() => {
                console.log('Visit resumed successfully');
              })
              .catch(error => {
                toast.error({
                  message: 'Something went wrong',
                })
                console.log('error while resuming the visit :>> ', error);
              })
              .finally(() => {
                startVisitPressed && startVisitPressed();
              });
          } else {
            startVisitPressed && startVisitPressed();
          }
        }
      })
      .catch(error => {
        console.log('error while fetching the open visits', error);
      });
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

  // Reset the data when cancel is pressed
  const onCancelPressed = async () => {
    setIsLoading(true);
    setIsEditable(false);
    setVisitDate(formatDate(new Date(data.call_from_datetime)));
    setVisitStart(getOnlyTime(data.call_from_datetime));
    setVisitEnd(getOnlyTime(data.call_to_datetime));
    await setupDropdown();
    setVisitType(data.visit_type);
    setVisitNote(
      data.visit_preparation_notes ? data.visit_preparation_notes : '',
    );
  };

  const handleVisitDate = (date: any) => {
    console.log('date', date);
    setVisitDate(formatDate(date));
  };

  const handleVisitStartTime = (time: any) => {
    const startTime = new Date(visitDate + ' ' + getOnlyTimeFromUTCDate(time));
    const endTime = new Date(visitDate + ' ' + visitEnd);
    if (startTime > endTime) {
      const standardDuration = selectedDropdownItem.standardDuration
        ? selectedDropdownItem.standardDuration
        : 30;
      startTime.setMinutes(startTime.getMinutes() + standardDuration);
      setVisitEnd(getOnlyTimeFromUTCDate(startTime));
    }
    setVisitStart(getOnlyTimeFromUTCDate(time));
  };

  const handleVisitEndTime = (time: any) => {
    const startTime = new Date(visitDate + ' ' + visitStart);
    const endTime = new Date(visitDate + ' ' + getOnlyTimeFromUTCDate(time));
    if (startTime > endTime) {
      const standardDuration = selectedDropdownItem.standardDuration
        ? selectedDropdownItem.standardDuration
        : 30;
      startTime.setMinutes(startTime.getMinutes() + standardDuration);
      setVisitEnd(getOnlyTimeFromUTCDate(startTime));
    } else {
      setVisitEnd(getOnlyTimeFromUTCDate(time));
    }
  };

  const handleDropDown = (item: any) => {
    setValue(item.value);
    setPlaceholderValue(item.label);
    setVisitObjectiveErrorMessage('');
    setSelectedDropdownItem(item);
  };

  const handleBack = () => {
    if (isApiCalled) {
      refreshVisits();
    } else {
      onPress && onPress();
    }
  };

  const onCustomerNamePress = () => {
    let idCall = '';

    if (
      getOnlyDate(data.call_from_datetime) ===
      getOnlyDate(getISOCurrentDate()) &&
      data.call_status !== VISITS_CALL_STATUS.FINISHED
    ) {
      idCall = data.id_call;
    }

    if (data.call_status === VISITS_CALL_STATUS.OPEN) {
      idCall = data.id_call;
    }

    handleBack();

    if (data.status_type.toLowerCase() === 'p') {
      const preparedData = {
        ...data,
        id_call: idCall,
      }
      PLOverviewController.navigateToPLOverview(preparedData);
      return;
    }

    navigation.navigate(
      pageNameCLOverview as never,
      {
        customerInfo: {
          ...data,
          id_call: idCall,
        },
      } as never,
    );
  };

  return (
    <View
      bg-white
      padding-v4
      style={[tw('flex-1 w-1/2'), { marginLeft: '50%' }]}
      key={data.id_call}>
      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={ColourPalette.light.darkBlue}
          style={tw('flex-1')}
        />
      ) : (
        <KeyboardAvoidingView>
          <View row centerV>
            {!isEditable && (
              <TouchableOpacity style={tw('mr-8')} onPress={handleBack}>
                <images.DefaultLeftArrowIcon />
              </TouchableOpacity>
            )}
            <View marginR-v4>
              <CustomerIconComponent
                item={{ ...data, visit_type: visitType }}
              />
            </View>
            <View flex row centerV>
              <TouchableOpacity
                onPress={onCustomerNamePress}
                style={{ maxWidth: 340 }}>
                <Text
                  text18BO
                  textBlack
                  marginT-3
                  marginR-v3
                  numberOfLines={1}
                  style={[tw('underline'), { maxWidth: 340 }]}>
                  {data.customer_name}
                </Text>
              </TouchableOpacity>
              {data?.call_status === VISITS_CALL_STATUS.OPEN && (
                <View row centerV marginR-v2>
                  <View
                    style={tw(
                      'bg-light-lightGreen h-3 w-3 rounded-md mr-1',
                    )}></View>
                  <Text text13R darkBlue4>
                    label.general.in_progress
                  </Text>
                </View>
              )}
            </View>
            <View row>
              {isEditable && (
                <TouchableOpacity
                  style={tw('mr-6')}
                  onPress={() => onCancelPressed()}>
                  <images.CancelIcon />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={changeEditStatus}>
                {isEditable ? (
                  <images.SaveIcon />
                ) : isEditVisible ? (
                  <images.EditIcon />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
            <View>
              <View marginT-v6 row>
                <View flex>
                  <Text text13M textBlack>
                    label.general.customer_no
                  </Text>
                  <CopyTextComponent
                    text13R grey2
                    text={data.customer_ship_to}
                    viewStyle={{ 'centerV': true }}
                  />
                </View>
                <View flex>
                  <Text text13M textBlack>
                    label.general.address
                  </Text>
                  <CopyTextComponent
                    text13R grey2
                    text={data.address1}
                    viewStyle={{ 'centerV': true }}
                  />
                </View>
              </View>
              <View marginT-v6 row>
                <View flex-2>
                  <Text text13M textBlack>
                    label.general.visit_date*
                  </Text>
                  <DateTimePicker
                    mode={'date'}
                    editable={isEditable}
                    onChange={handleVisitDate}
                    maximumDate={
                      data.call_status === VISITS_CALL_STATUS.OPEN
                        ? new Date()
                        : new Date(2040, 1, 1)
                    }
                    renderInput={() => {
                      return (
                        <View>
                          <TouchableOpacity
                            style={tw(
                              `${isEditable
                                ? 'bg-light-white'
                                : 'bg-light-white1'
                              } flex-row items-center rounded-md border-default border-light-lavendar px-3 justify-between mr-3 mt-1`,
                            )}>
                            <Text
                              text13R
                              style={tw(
                                `${isEditable
                                  ? 'text-light-textBlack'
                                  : 'text-light-grey1'
                                }`,
                              )}>
                              {renderVisitDate}
                            </Text>
                            <images.CalendarIcon />
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    value={new Date(visitDate)}
                    errorMsg={visitDateErrorMessage}
                  />
                </View>
                <View flex>
                  <Text text13M textBlack>
                    label.general.visit_start*
                  </Text>
                  <DateTimePicker
                    mode={DATETIME_PICKER_MODE.TIME}
                    editable={isEditable}
                    onChange={handleVisitStartTime}
                    renderInput={() => {
                      return (
                        <View>
                          <TouchableOpacity
                            style={tw(
                              `${isEditable
                                ? 'bg-light-white'
                                : 'bg-light-white1'
                              } flex-row items-center rounded-md border-default border-light-lavendar py-2 px-3 justify-between mr-6px mt-1`,
                            )}>
                            <Text
                              text13R
                              style={tw(
                                `${isEditable
                                  ? 'text-light-textBlack'
                                  : 'text-light-grey1'
                                }`,
                              )}>
                              {visitStart}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    is24Hour={true}
                    value={new Date(visitDate + ' ' + visitStart)}
                    errorMsg={visitStartErrorMessage}
                  />
                </View>
                <View flex>
                  <Text text13M textBlack>
                    label.general.visit_end*
                  </Text>
                  <DateTimePicker
                    mode={DATETIME_PICKER_MODE.TIME}
                    editable={isEditable}
                    onChange={handleVisitEndTime}
                    renderInput={() => {
                      return (
                        <View>
                          <TouchableOpacity
                            style={tw(
                              `${isEditable
                                ? 'bg-light-white'
                                : 'bg-light-white1'
                              } flex-row items-center rounded-md border-default border-light-lavendar py-2 px-3 justify-between mr-6px mt-1`,
                            )}>
                            <Text
                              text13R
                              style={tw(
                                `${isEditable
                                  ? 'text-light-textBlack'
                                  : 'text-light-grey1'
                                }`,
                              )}>
                              {visitEnd}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    is24Hour={true}
                    value={new Date(visitDate + ' ' + visitEnd)}
                    errorMsg={visitEndErrorMessage}
                    errorClassName={'ml-1'}
                  />
                </View>
              </View>
              <View marginT-v6>
                <Dropdown
                  title="label.general.visit_objective*"
                  isEditable={isEditable}
                  placeholder={placeholderValue}
                  data={visitObjectives}
                  value={value}
                  labelField={'label'}
                  valueField={'value'}
                  onChange={handleDropDown}
                  renderItem={renderItem}
                />
                {visitObjectiveErrorMessage ? (
                  <TextError
                    errorMsg={visitObjectiveErrorMessage}
                    errorClassName={'text-light-red-700'}
                  />
                ) : null}
              </View>
              <View marginT-v6>
                <Text text13M textBlack>
                  label.general.visit_type*
                </Text>
                <View style={tw('mt-1')}>
                  <RadioButton
                    onValueChange={value => {
                      setVisitType(value);
                    }}
                    initialValue={visitType}
                    disabled={!isEditable}
                    color={ColourPalette.light.darkBlue}
                    data={[
                      {
                        label: t('label.general.fixed'),
                        value: VISIT_TYPES.PLANNED,
                      },
                      {
                        label: t('label.general.adhoc'),
                        value: VISIT_TYPES.ADHOC,
                      },
                      {
                        label: t('label.general.phone_email'),
                        value: VISIT_TYPES.PHONE,
                      },
                    ]}
                    errorMsg={visitTypeErrorMessage}
                  />
                </View>
              </View>
              <View marginT-v1>
                <InputText
                  style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
                  title="label.general.visit_preparation_notes"
                  multiline
                  isEditable={isEditable}
                  value={visitNote}
                  enableErrors
                  validate={[(value: string) => value.length > 500]}
                  validationMessage={['Words limit reached']}
                  validateOnStart={true}
                  validateOnChange={true}
                  validationMessagePosition={'down'}
                  showCharCounter
                  maxLength={500}
                  onChangeText={(text: string) => setVisitNote(text)}
                />
              </View>
              {!isEditable && (
                <View marginT-v6 row centerV>
                  <View flex>
                    {isDeleteVisible ? (
                      <TouchableOpacity
                        onPress={() => setIsDeleteModalVisible(true)}>
                        <images.DeleteIcon />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <View flex style={tw('items-end justify-end')}>
                    {isStartVisible ? (
                      <View>
                        <TouchableOpacity
                          style={tw(
                            'flex-row bg-light-darkBlue rounded-md px-8 py-2-1 justify-center items-center',
                          )}
                          onPress={handleStartVisit}>
                          <images.PlayIcon />
                          <Text text13R white marginL-v1>
                            {visitTitle}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          <DeleteModal
            onPressDelete={handleDeleteVisits}
            onPressCancel={() => setIsDeleteModalVisible(false)}
            isDeleteModalVisible={isDeleteModalVisible}
            title={t('msg.createprospect.delete') + "\n" + t('label.home.customer_visit') + '?'}
            subTitle={`label.home.delete_customer_visit_confirmation`}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default CustomerInfoModal;
