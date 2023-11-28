import React from 'react';
import {TouchableOpacity} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {DELEGATION} from 'src/utils/Constant';

interface DelegationTopTabComponentProps {
  handleChangeCalendarFilter: any;
  calendarFilterValue: string;
}
const DelegationTopTabComponent = (props: DelegationTopTabComponentProps) => {
  const {handleChangeCalendarFilter, calendarFilterValue} = props;

  const SERVICE_WORKFLOW_DATA = [
    {id: 1, title: DELEGATION.ALL},
    {id: 2, title: DELEGATION.VALID},
    {id: 3, title: DELEGATION.INVALID},
  ];

  const handleFilter = (id: number) => {
    let filteredValue;
    if (id === 1) {
      filteredValue = DELEGATION.ALL;
    } else if (id === 2) {
      filteredValue = DELEGATION.VALID;
    } else if (id === 3) {
      filteredValue = DELEGATION.INVALID;
    } else {
      filteredValue = DELEGATION.ALL;
    }
    handleChangeCalendarFilter(filteredValue);
  };
  return (
    <View row>
      {SERVICE_WORKFLOW_DATA.map(item => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title === calendarFilterValue
                    ? 'bg-light-lightBlue1'
                    : ''
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

export default DelegationTopTabComponent;
