import React from 'react';
import { TouchableOpacity } from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { DELIVERY_MISTAKES_CLAIM, SERVICE_WORKFLOW } from 'src/utils/Constant';

interface ServiceWorkFlowTopTabComponentProps {
  handleChangeCalendarFilter?: any;
  calendarFilterValue?: string;
}
const DMCTopTabComponent = (props: ServiceWorkFlowTopTabComponentProps) => {
  const { handleChangeCalendarFilter, calendarFilterValue } = props;

  const DELIVERY_MISTAKES_DATA = [
    { id: 1, title: DELIVERY_MISTAKES_CLAIM.PRODUCT_DETAILS },
    { id: 2, title: DELIVERY_MISTAKES_CLAIM.CLAIMS_SETTLEMENTS },
  ];

  const handleFilter = (id: number) => {
    let filteredValue = DELIVERY_MISTAKES_CLAIM.PRODUCT_DETAILS;
    if (id == 1) {
      filteredValue = DELIVERY_MISTAKES_CLAIM.PRODUCT_DETAILS;
    } else if (id == 2) {
      filteredValue = DELIVERY_MISTAKES_CLAIM.CLAIMS_SETTLEMENTS;
    }
    handleChangeCalendarFilter(filteredValue);
  };
  return (
    <View row>
      {DELIVERY_MISTAKES_DATA.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${item.title == calendarFilterValue
                  ? 'bg-light-lightBlue1'
                  : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleFilter(item.id)}>
              {item.title == calendarFilterValue ? (
                <Text text13R darkBlue>
                  {item.title}
                </Text>
              ) : (
                <Text text13R grey2>
                  {item.title}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default DMCTopTabComponent;
