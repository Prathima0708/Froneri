import React, { useEffect, useState } from 'react';
import View from 'src/components/View';
import { images } from 'src/assets/Images';
import Text from 'src/components/Text';
import { TouchableOpacity } from 'react-native';
import CalendarDateItem from './CalendarDateItem';
import DatePicker from 'src/components/DatePicker';
import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { calculateCalendarDates } from 'src/utils/CommonUtil';
import CustomersSearchController from 'src/controller/CustomerSearchController';

type DateSelectionComponentProps = {
  onDatePress: any;
  allSelectedCustomersList: any;
  setAllSelectedCustomersList: any;
};

const DateSelectionComponent = (props: DateSelectionComponentProps) => {
  const { onDatePress, allSelectedCustomersList, setAllSelectedCustomersList } =
    props;

  const [selectedDate, setSelectedDate] = useState(new Date()); // Default selected date is today
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState('');
  const [lastDate] = useState<any>(new Date());

  const currentDate = selectedDate.toDateString().split(' ');

  useEffect(() => {
    getCalendarDates(selectedDate);
    getDaysToDecrease();
  }, []);

  const getDaysToDecrease = async () => {
    let days = await CustomersSearchController.getCreatePastVisitInDays();
    if (days !== '') {
      lastDate.setDate(lastDate.getDate() - days);
    }
  };

  const getCalendarDates = (data: any) => {
    const dates = calculateCalendarDates(data);
    setCalendarDates(dates);
  };

  const handleDatePicker = (date: any) => {
    setSelectedDate(date);
    getCalendarDates(date);
  };

  const handlePreviousWeek = () => {
    const date: any = selectedDate;
    date.setDate(date.getDate() - 8);
    if (lastDate < date) {
      setSelectedDate(date);
      getCalendarDates(date);
    } else {
      // Calculate the difference in milliseconds
      let difference = date - lastDate;

      // Convert the difference to days
      let daysDifference = difference / (1000 * 60 * 60 * 24);

      date.setDate(date.getDate() - daysDifference);
      setSelectedDate(date);
      getCalendarDates(date);
    }
  };

  const handleNextWeek = () => {
    const date = selectedDate;
    date.setDate(date.getDate() + 8);
    setSelectedDate(date);
    getCalendarDates(date);
  };

  const handleActiveDateChange = (date: string) => {
    setActiveDate(date);
    onDatePress(date);
  };

  return (
    <View spread flex>
      <View paddingH-v2 paddingT-v2>
        <DatePicker
          mode={DATETIME_PICKER_MODE.DATE}
          minimumDate={lastDate}
          onChange={handleDatePicker}
          renderInput={() => {
            return (
              <TouchableOpacity>
                <View row centerV bg-white paddingL-v2 paddingR-v1 br20 spread>
                  <Text text13R textBlack>
                    {currentDate[2]} {currentDate[1]} {currentDate[3]}
                  </Text>
                  <images.CalendarIcon />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View spread flex marginV-v1>
        <View center>
          <TouchableOpacity onPress={handlePreviousWeek}>
            <images.UpIcon />
          </TouchableOpacity>
        </View>
        <View flex spread>
          {calendarDates.map((item, i) => {
            return (
              <CalendarDateItem
                key={i.toString()}
                date={item}
                isActiveDate={activeDate}
                onDatePress={handleActiveDateChange}
                allSelectedCustomersList={allSelectedCustomersList}
                setAllSelectedCustomersList={setAllSelectedCustomersList}
              />
            );
          })}
        </View>
        <View center>
          <TouchableOpacity onPress={handleNextWeek}>
            <images.DownIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DateSelectionComponent;
