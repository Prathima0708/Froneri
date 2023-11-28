import React from 'react';
import {TouchableOpacity} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {CUSTOMER_TYPES} from 'src/utils/Constant';

interface CustomerSearchTopTabComponentProps {
  handleChangeCalendarFilter: any;
  calendarFilterValue: string;
}
const CustomerSearchTopTabComponent = (
  props: CustomerSearchTopTabComponentProps,
) => {
  const {handleChangeCalendarFilter, calendarFilterValue} = props;

  const CUSTOMERS_FILTERS = [
    {id: 1, title: CUSTOMER_TYPES.ALL},
    {id: 2, title: CUSTOMER_TYPES.CUSTOMERS},
    {id: 3, title: CUSTOMER_TYPES.PROSPECT},
    {id: 4, title: CUSTOMER_TYPES.DIRECT},
    {id: 5, title: CUSTOMER_TYPES.INDIRECT},
  ];

  const handleFilter = (id: number) => {
    let filteredValue = CUSTOMER_TYPES.ALL;
    if (id == 1) {
      filteredValue = CUSTOMER_TYPES.ALL;
    } else if (id == 2) {
      filteredValue = CUSTOMER_TYPES.CUSTOMERS;
    } else if (id == 3) {
      filteredValue = CUSTOMER_TYPES.PROSPECT;
    } else if (id == 4) {
      filteredValue = CUSTOMER_TYPES.DIRECT;
    } else {
      filteredValue = CUSTOMER_TYPES.INDIRECT;
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
                `${
                  item.title == calendarFilterValue ? 'bg-light-lightBlue1' : ''
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

export default CustomerSearchTopTabComponent;
