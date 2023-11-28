import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {CUSTOMER_DETAILS_TYPES} from 'src/utils/Constant';
import {TouchableOpacity} from 'react-native';

interface NotesTopTabComponentProps {
  handleChangeTab: any;
  customerDetailsSelectedValue: string;
}

const CustomerDetailsTopTabComponent = (props: NotesTopTabComponentProps) => {
  const {handleChangeTab, customerDetailsSelectedValue} = props;

  const CUSTOMER_DETAILS_FILTERS = [
    {id: 1, title: CUSTOMER_DETAILS_TYPES.GENERAL_INFORMATION},
    {id: 2, title: CUSTOMER_DETAILS_TYPES.CUSTOMER_HIERARCHY},
    {id: 3, title: CUSTOMER_DETAILS_TYPES.TERRITORY_INFORMATION},
  ];

  const handleNotesTab = (id: number) => {
    let customerDetailsSelectedValue =
      CUSTOMER_DETAILS_TYPES.GENERAL_INFORMATION;
    if (id == 1) {
      customerDetailsSelectedValue = CUSTOMER_DETAILS_TYPES.GENERAL_INFORMATION;
    } else if (id == 2) {
      customerDetailsSelectedValue = CUSTOMER_DETAILS_TYPES.CUSTOMER_HIERARCHY;
    } else {
      customerDetailsSelectedValue =
        CUSTOMER_DETAILS_TYPES.TERRITORY_INFORMATION;
    }
    handleChangeTab(customerDetailsSelectedValue);
  };

  return (
    <View row marginT-v2>
      {CUSTOMER_DETAILS_FILTERS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == customerDetailsSelectedValue
                    ? 'bg-light-lightBlue1'
                    : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleNotesTab(item.id)}>
              <Text
                style={tw(
                  `${
                    item.title == customerDetailsSelectedValue
                      ? 'text-light-darkBlue'
                      : 'text-light-grey2'
                  }`,
                )}>
                {item.title}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default CustomerDetailsTopTabComponent;
