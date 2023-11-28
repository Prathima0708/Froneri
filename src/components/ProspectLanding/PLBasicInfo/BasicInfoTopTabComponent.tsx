import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {CLIENT_DETAILS_TYPES} from 'src/utils/Constant';

interface BasicInfoTopTabComponentProps {
  handleChangeTab: any;
  parterDetailsSelectedValue: string;
}

const BasicInfoTopTabComponent = (props: BasicInfoTopTabComponentProps) => {
  const {handleChangeTab, parterDetailsSelectedValue} = props;

  const PARTER_DETAILS_FILTERS = [
    {id: 1, title: CLIENT_DETAILS_TYPES.SHIP_TO},
    {id: 2, title: CLIENT_DETAILS_TYPES.BILL_TO},
    {id: 3, title: CLIENT_DETAILS_TYPES.ALTERNATE_DELIVERY_ADDRESS},
  ];

  const handleNotesTab = (id: number) => {
    let parterDetailsSelectedValue = CLIENT_DETAILS_TYPES.SHIP_TO;
    if (id == 1) {
      parterDetailsSelectedValue = CLIENT_DETAILS_TYPES.SHIP_TO;
    } else if (id == 2) {
      parterDetailsSelectedValue = CLIENT_DETAILS_TYPES.BILL_TO;
    } else if (id == 3) {
      parterDetailsSelectedValue =
        CLIENT_DETAILS_TYPES.ALTERNATE_DELIVERY_ADDRESS;
    }
    handleChangeTab(parterDetailsSelectedValue);
  };

  return (
    <View row>
      {PARTER_DETAILS_FILTERS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == parterDetailsSelectedValue
                    ? 'bg-light-lightBlue1'
                    : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleNotesTab(item.id)}>
              <Text
                text13R
                darkBlue
                style={tw(
                  `${
                    item.title == parterDetailsSelectedValue
                      ? 'text-light-darkBlue'
                      : 'text-light-grey1'
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

export default BasicInfoTopTabComponent;
