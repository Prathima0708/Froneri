import React from 'react';
import {TouchableOpacity} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {SERVICE_WORKFLOW, TASKS} from 'src/utils/Constant';

interface TasksTopTabComponentProps {
  handleChangeCalendarFilter: any;
  calendarFilterValue: string;
}
const TasksTopTabComponent = (props: TasksTopTabComponentProps) => {
  const {handleChangeCalendarFilter, calendarFilterValue} = props;

  const TASKS_DATA = [
    {id: 1, title: TASKS.ALL},
    {id: 2, title: TASKS.OPEN},
    {id: 3, title: TASKS.INPROGRESS},
    {id: 4, title: TASKS.COMPLETED},
  ];

  const handleFilter = (id: number) => {
    let filteredValue;
    if (id === 1) {
      filteredValue = TASKS.ALL;
    } else if (id === 2) {
      filteredValue = TASKS.OPEN;
    } else if (id === 3) {
      filteredValue = TASKS.INPROGRESS;
    } else {
      filteredValue = TASKS.COMPLETED;
    }
    handleChangeCalendarFilter(filteredValue);
  };
  return (
    <View row>
      {TASKS_DATA.map(item => {
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

export default TasksTopTabComponent;
