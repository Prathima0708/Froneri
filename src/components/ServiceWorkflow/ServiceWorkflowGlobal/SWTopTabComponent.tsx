import React from 'react';
import { TouchableOpacity } from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { SERVICE_WORKFLOW } from 'src/utils/Constant';

interface ServiceWorkFlowTopTabComponentProps {
  handleChangeCalendarFilter: any;
  calendarFilterValue: string;
}
const SWTopTabComponent = (props: ServiceWorkFlowTopTabComponentProps) => {
  const { handleChangeCalendarFilter, calendarFilterValue } = props;

  const SERVICE_WORKFLOW_DATA = [
    { id: 1, title: SERVICE_WORKFLOW.TODO },
    { id: 2, title: SERVICE_WORKFLOW.OPEN },
    { id: 3, title: SERVICE_WORKFLOW.INPROGRESS },
    { id: 4, title: SERVICE_WORKFLOW.COMPLETED },
  ];

  const handleFilter = (id: number) => {
    let filteredValue;
    if (id === 1) {
      filteredValue = SERVICE_WORKFLOW.TODO;
    } else if (id === 2) {
      filteredValue = SERVICE_WORKFLOW.OPEN;
    } else if (id === 3) {
      filteredValue = SERVICE_WORKFLOW.INPROGRESS;
    } else {
      filteredValue = SERVICE_WORKFLOW.COMPLETED;
    }
    handleChangeCalendarFilter(filteredValue);
  };
  return (
    <View row>
      {SERVICE_WORKFLOW_DATA.map((item) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${item.title === calendarFilterValue
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

export default SWTopTabComponent;
