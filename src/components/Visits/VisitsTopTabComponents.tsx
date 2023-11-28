import React from 'react';
import { TouchableOpacity } from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { VISIT_CALENDAR_STATUS } from 'src/utils/Constant';

interface VisitsTopTabComponentsProps {
  handleChangeCalendarFilter: any;
  calendarFilterValue: string;
}
const VisitsTopTabComponents = (props: VisitsTopTabComponentsProps) => {
  const { handleChangeCalendarFilter, calendarFilterValue } = props;

  const CUSTOMERS_FILTERS = [
    { id: 1, title: VISIT_CALENDAR_STATUS.ALL },
    { id: 2, title: VISIT_CALENDAR_STATUS.MINE },
    { id: 3, title: VISIT_CALENDAR_STATUS.DELEGATED },
  ];

  const handleFilter = (id: number) => {
    let filteredValue;
    if (id === 1) {
      filteredValue = VISIT_CALENDAR_STATUS.ALL;
    } else if (id === 2) {
      filteredValue = VISIT_CALENDAR_STATUS.MINE;
    } else {
      filteredValue = VISIT_CALENDAR_STATUS.DELEGATED;
    }
    handleChangeCalendarFilter(filteredValue);
  };
  return (
    <View row>
      {CUSTOMERS_FILTERS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${item.title === calendarFilterValue ? 'bg-light-lightBlue1' : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleFilter(item.id)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default VisitsTopTabComponents;
