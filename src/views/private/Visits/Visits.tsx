import React, { useState, FC, useRef, useEffect } from 'react';
import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { PrivateStackParamList } from 'src/routes/types';
import { PackedEvent, TimelineCalendarHandle } from '@howljs/calendar-kit';
import VisitsHeader from 'src/components/Header/VisitsHeader';
import { images } from 'src/assets/Images';
import VisitsTopTabComponents from 'src/components/Visits/VisitsTopTabComponents';
import {
  formatDate,
  getDateMonth,
  getOnlyTime,
  getOnlyTimeFromUTCDate,
  getWeekMonthRange,
} from 'src/utils/CommonUtil';
import DatePicker from 'src/components/DatePicker';
import Modal from 'src/components/Modal';
import CustomerInfoModal from 'src/components/Visits/CustomerInfoModal';
import { DATETIME_PICKER_MODE, VISIT_CALENDAR_STATUS } from 'src/utils/Constant';
import VisitsContoller from 'src/controller/VisitsController';
import { pageNameCLOverview } from 'src/routes/Routes';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import CalendarComponent from 'src/components/Visits/CalendarComponent';
import { ParametersValuesService } from 'src/services/ParametersValuesService';
import { VISIT_CALENDAR_DROPDOWN } from 'src/utils/DropdownConst';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';
import Dropdown from 'src/components/DropDown';
import { toast } from 'src/utils/Util';
import PLOverviewController from 'src/controller/PLOverviewController';

type VisitsProp = StackNavigationProp<PrivateStackParamList>;

const calendarWidth = (Dimensions.get('window').width / 100) * 94;

const Visits: FC = () => {
  const navigation = useNavigation<VisitsProp>();
  const [loading, setLoading] = useState(false);
  const [customerInfoVisible, setCustomerInfoVisible] = useState(false);
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState<any>({});
  const [selectedEvent, setSelectedEvent] = useState<PackedEvent>();
  const [calendarFilter, setCalendarFilter] = useState(
    VISIT_CALENDAR_STATUS.ALL,
  );
  const [dayMonth, setDayMonth] = useState(getWeekMonthRange(new Date()));
  const [calendarMode, setCalendarMode] = useState(
    VISIT_CALENDAR_DROPDOWN[1].value,
  );
  const [visits, setVisits] = useState([]);
  const [calendarStartDate, setCalendarStartDate] = useState('');
  const [calendarEndDate, setCalendarEndDate] = useState('');

  const isInitialSyncDone = useAppSelector(
    (state: RootState) => state.syncStatus.isInitialSyncDone,
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      goBackToCurrentDate();
      setCalendarFilter(VISIT_CALENDAR_STATUS.ALL);

      const todaysDate = new Date();
      const todaysDate2 = new Date();
      const mondayOffset = (todaysDate.getDay() + 6) % 7;
      const fridayOffset = (5 - todaysDate2.getDay() + 7) % 7;
      let endDate;

      const mondaysDate = new Date(
        todaysDate.setDate(todaysDate.getDate() - mondayOffset),
      );

      if (calendarMode === 'week') {
        endDate = new Date(
          todaysDate2.setDate(todaysDate2.getDate() + fridayOffset + 2),
        );
      } else {
        endDate = new Date(
          todaysDate2.setDate(todaysDate2.getDate() + fridayOffset),
        );
      }

      getVisits(formatDate(mondaysDate), formatDate(endDate));
    });

    return unsubscribe;
  }, [calendarMode]);

  useEffect(() => {
    if (calendarStartDate !== '' && calendarEndDate !== '') {
      getVisits(calendarStartDate, calendarEndDate);
    }
  }, [calendarFilter]);

  useEffect(() => {
    if (calendarStartDate !== '' && calendarEndDate !== '') {
      getVisits(calendarStartDate, calendarEndDate);
    }
  }, [calendarStartDate && calendarEndDate]);

  const calendarRef = useRef<TimelineCalendarHandle>(null);

  // Refreshing the visits
  const refreshVisits = () => {
    hideCustomerDetails();
    getVisits(calendarStartDate, calendarEndDate);
  };

  // Setting selected event when long press on event
  const onLongPressEvent = (event: PackedEvent) => {
    setSelectedEvent(event);
  };

  // Setting selected event when pressing outside of background
  const onPressCancel = () => {
    setSelectedEvent(undefined);
  };

  const checkThreshold = (startTime: string, endTime: string) => {
    const startThreshold = new Date(startTime);
    const endThreshold = new Date(endTime);

    const startTimeHour = startThreshold.getHours();
    const endTimeHour = endThreshold.getHours();

    if (startTimeHour >= 23 || endTimeHour <= 0) {
      return true;
    } else {
      return false;
    }
  };

  // called when the selected event item is dropped
  const onVisitDrop = async (event: any) => {
    const isOutsideThreshold = checkThreshold(event.start, event.end);
    if (isOutsideThreshold) {
      onPressCancel();
      return
    }

    const todaysDate = new Date();
    const callFromDateTime = new Date(event.call_from_datetime);
    const visitStartDateTime = new Date(event.start);
    const visitEndDateTime = new Date(event.end);
    const visitDate = formatDate(visitStartDateTime);
    const visitStart = getOnlyTime(
      `${formatDate(visitStartDateTime)} ${getOnlyTimeFromUTCDate(
        visitStartDateTime,
      )}`,
    );
    const visitEnd = getOnlyTime(
      `${formatDate(visitEndDateTime)} ${getOnlyTimeFromUTCDate(
        visitEndDateTime,
      )}`,
    );

    onPressCancel(); // release the drop control

    if (callFromDateTime === visitStartDateTime) {
      return;
    }

    if (
      event.call_status === VISITS_CALL_STATUS.ONHOLD ||
      event.call_status === VISITS_CALL_STATUS.ORDER ||
      event.call_status === VISITS_CALL_STATUS.NO_ORDER ||
      event.call_status === VISITS_CALL_STATUS.FINISHED ||
      event.call_status === VISITS_CALL_STATUS.CLOSED
    ) {
      toast.error({
        message: 'message.visits.paused_completed_validation_error',
      })
      return;
    }

    if (
      event.call_status === VISITS_CALL_STATUS.OPEN &&
      (visitStartDateTime.getDate() > todaysDate.getDate() ||
        visitStartDateTime.getDate() < todaysDate.getDate())
    ) {
      toast.error({
        message: "message.visits.in_progress_validation_error",
      })
      return;
    }

    if (visitStartDateTime.getDate() < todaysDate.getDate()) {
      const parametersValuesService = new ParametersValuesService();
      const parameterValue = Number(
        await parametersValuesService.getParameterValue(
          'Create_Past_Visit_In_Days',
        ),
      );

      if (parameterValue <= 0) {
        toast.error({
          message: 'message.visits.past_visits_validation_error'
        })
        return;
      }

      if (parameterValue > 0) {
        const daysDiff = Math.ceil(
          (todaysDate.getTime() - visitStartDateTime.getTime()) /
          (1000 * 3600 * 24),
        );

        if (daysDiff > parameterValue) {
          toast.error({
            message: 'message.visits.time_validation_error'
          })
          return;
        }
      } else if (visitStartDateTime < todaysDate) {
        toast.error({
          message: 'message.visits.past_visits_validation_error'
        })
        return;
      }
    }
    let obj = {
      idCall: event.id_call,
      callFromDateTime: `${visitDate} ${visitStart}:00`,
      callToDateTime: `${visitDate} ${visitEnd}:00`,
      idEmployeeObjective: event.id_employee_objective,
      visitType: event.visit_type,
      originalCallFromDateTime: event.call_from_datetime,
      originalCallToDateTime: event.call_to_datetime,
      visitPreparationNotes: event.visit_preparation_notes,
      preferedCallTime: visitStart.replace(':', ''),
    };

    VisitsContoller.updateEditVisit(obj)
      .then(res => {
        console.log('success', res);
      })
      .catch(err => {
        console.log('the err is', err);
      })
      .finally(() => {
        refreshVisits && refreshVisits();
      });
  };

  // Resetting the calendar to current date
  const goBackToCurrentDate = () => {
    const date = new Date();
    const optionalProps = {
      date: formatDate(date),
    };
    calendarRef.current?.goToDate(optionalProps);
  };

  // Setting the calendar filter when pressing on top tab
  const changeCalendarFilter = (data: string) => {
    setCalendarFilter(data);
  };

  // Calling every time the calendar is changed
  const onTimelineCalendarChange = (data: any) => {
    try {
      const timelineCalendarDate = new Date(data.date);
      let weekendDate = null;
      let startDate = '';
      let endDate = '';

      if (calendarMode === VISIT_CALENDAR_DROPDOWN[0].value) {
        startDate = formatDate(timelineCalendarDate);
        endDate = formatDate(timelineCalendarDate);
      } else if (calendarMode === VISIT_CALENDAR_DROPDOWN[1].value) {
        startDate = formatDate(timelineCalendarDate);
        weekendDate = new Date(
          timelineCalendarDate.setDate(timelineCalendarDate.getDate() + 4),
        );
        endDate = formatDate(weekendDate);
      } else {
        startDate = formatDate(timelineCalendarDate);
        weekendDate = new Date(
          timelineCalendarDate.setDate(timelineCalendarDate.getDate() + 6),
        );
        endDate = formatDate(weekendDate);
      }

      setCalendarStartDate(startDate);
      setCalendarEndDate(endDate);

      calendarMode == VISIT_CALENDAR_DROPDOWN[0].value
        ? setDayMonth(getDateMonth(new Date(data.date)))
        : setDayMonth(getWeekMonthRange(new Date(data.date)));
    } catch (error) {
      console.log(
        '🚀 ~ file: Visits.tsx:151 ~ onTimelineCalendarChange ~ error:',
        error,
      );
    }
  };

  // Setting the day and month when the date is changed
  const onDateTimePickerChange = (date: any) => {
    const optionalProps = {
      date: formatDate(date),
    };
    calendarRef.current?.goToDate(optionalProps);
    calendarMode == VISIT_CALENDAR_DROPDOWN[0].value
      ? setDayMonth(getDateMonth(date))
      : setDayMonth(getWeekMonthRange(date));
  };

  // Closing the customer details modal and refreshing the visits when the data is changed
  const hideCustomerDetails = () => {
    setCustomerInfoVisible(false);
  };

  // Hiding the customer details modal and navigating to customer landing page
  const startVisitPressed = (isOpenVisit: boolean = false) => {
    hideCustomerDetails();
    if (selectedCustomerInfo.status_type.toLowerCase() === 'p') {
      PLOverviewController.navigateToPLOverview(selectedCustomerInfo);
    } else {
      navigation.navigate(pageNameCLOverview as never, {
        customerInfo: {
          ...selectedCustomerInfo,
          call_status: isOpenVisit
            ? VISITS_CALL_STATUS.OPEN
            : selectedCustomerInfo.call_status,
        },
      } as never);
    }
  };

  // Getting the visits from the API
  const getVisits = async (startDate: string, endDate: string) => {
    try {
      console.log('startDate', startDate);
      console.log('endDate', endDate);

      if (!startDate || !endDate || !isInitialSyncDone) {
        return;
      }

      setLoading(true);

      let visits = await VisitsContoller.getVisits(startDate, endDate);

      if (calendarFilter === VISIT_CALENDAR_STATUS.MINE)
        visits = visits.filter(
          (visit: any) => visit.delegated == '0' || visit.delegated == null,
        );
      else if (calendarFilter === VISIT_CALENDAR_STATUS.DELEGATED)
        visits = visits.filter((visit: any) => visit.delegated == '1');

      console.log('visits', visits.length);

      setVisits(
        visits.map((visit: any) => ({
          ...visit,
          id: visit.id_call,
          start: visit.call_from_datetime,
          end: visit.call_to_datetime,
        })),
      );
    } catch (error) {
      console.log(
        '🚀 ~ file: VisitsHeader.tsx:27 ~ handleCreateVisits ~ error:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  // Showing the customer details modal when the event is pressed
  const handleEventPressed = (data: any) => {
    setSelectedCustomerInfo(data);
    setCustomerInfoVisible(true);
  };

  // Rendering the dropdown items
  const renderItem = (item: any) => {
    return (
      <View row centerV>
        <item.image />
        <Text
          style={tw(
            `${item.value === calendarMode
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
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <VisitsHeader />

      <View bg-white marginH-v2 marginB-v4 br40 flex padding-v4>
        <View row spread centerH>
          <View row>
            <VisitsTopTabComponents
              handleChangeCalendarFilter={(data: string) => {
                changeCalendarFilter(data);
              }}
              calendarFilterValue={calendarFilter}
            />
          </View>
          <View row>
            <View row center>
              <DatePicker
                mode={DATETIME_PICKER_MODE.DATE}
                onChange={(date: any) => {
                  onDateTimePickerChange(date);
                }}
                renderInput={() => {
                  return (
                    <TouchableOpacity
                      style={tw(
                        'flex-row justify-center items-center rounded-md border-default border-light-lavendar',
                      )}>
                      <Text marginH-v2 text13R textBlack>
                        {dayMonth}
                      </Text>
                      <images.CalendarIcon />
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                style={tw('ml-3 mr-2-1')}
                onPress={() => {
                  calendarRef.current?.goToPrevPage();
                }}>
                <images.DefaultLeftArrowIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={tw('mr-3')}
                onPress={() => {
                  calendarRef.current?.goToNextPage();
                }}>
                <images.DefaultRightArrowIcon />
              </TouchableOpacity>
            </View>
            <View row centerV>
              <TouchableOpacity
                style={tw(
                  'mr-4 border-default rounded-md border-light-lavendar py-2 px-8',
                )}
                onPress={goBackToCurrentDate}>
                <Text text13R textBlack>
                  label.visits.today
                </Text>
              </TouchableOpacity>
              <Dropdown
                extraStyle={'w-170px'}
                extraSelectedTextStyle={'w-6/12'}
                data={VISIT_CALENDAR_DROPDOWN}
                value={calendarMode}
                labelField={'label'}
                valueField={'value'}
                onChange={(item: any) => {
                  if (item.value === calendarMode) {
                    return;
                  }
                  setCalendarMode(item.value);
                }}
                renderItem={renderItem}
                renderLeftIcon={() => {
                  return calendarMode == VISIT_CALENDAR_DROPDOWN[0].value ? (
                    <images.DayIcon />
                  ) : calendarMode == VISIT_CALENDAR_DROPDOWN[1].value ? (
                    <images.WorkWeekIcon />
                  ) : (
                    <images.WeekIcon />
                  );
                }}
              />
            </View>
          </View>
        </View>

        <View flex marginT-v4>
          <CalendarComponent
            {...{
              calendarRef,
              visits,
              calendarMode,
              onLongPressEvent,
              selectedEvent,
              onVisitDrop,
              handleEventPressed,
              onPressCancel,
              calendarWidth,
              onTimelineCalendarChange,
              loading,
            }}
          />
        </View>
      </View>
      {customerInfoVisible ? (
        <Modal
          style={[tw('')]}
          visible={customerInfoVisible}
          transparent={true}
          enableModalBlur={false}
          overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
          <CustomerInfoModal
            data={selectedCustomerInfo}
            hideCustomerDetails={hideCustomerDetails}
            customerInfoVisible={customerInfoVisible}
            startVisitPressed={startVisitPressed}
            refreshVisits={refreshVisits}
            onPress={hideCustomerDetails}
          />
        </Modal>
      ) : null}
    </SafeAreaView>
  );
};

export default Visits;
