import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {PARTNER_DETAILS_TYPES} from 'src/utils/Constant';

interface PDTopTabComponentProps {
  handleChangeTab: any;
  parterDetailsSelectedValue: string;
}

const PDTopTabComponent = (props: PDTopTabComponentProps) => {
  const {handleChangeTab, parterDetailsSelectedValue} = props;

  const PARTER_DETAILS_FILTERS = [
    {id: 1, title: PARTNER_DETAILS_TYPES.SHIP_TO},
    {id: 2, title: PARTNER_DETAILS_TYPES.BILL_TO},
    {id: 3, title: PARTNER_DETAILS_TYPES.SOLD_TO},
    {id: 4, title: PARTNER_DETAILS_TYPES.PAYER},
  ];

  const handleNotesTab = (id: number) => {
    let parterDetailsSelectedValue = PARTNER_DETAILS_TYPES.SHIP_TO;
    if (id == 1) {
      parterDetailsSelectedValue = PARTNER_DETAILS_TYPES.SHIP_TO;
    } else if (id == 2) {
      parterDetailsSelectedValue = PARTNER_DETAILS_TYPES.BILL_TO;
    } else if (id == 3) {
      parterDetailsSelectedValue = PARTNER_DETAILS_TYPES.SOLD_TO;
    } else {
      parterDetailsSelectedValue = PARTNER_DETAILS_TYPES.PAYER;
    }
    handleChangeTab(parterDetailsSelectedValue);
  };

  return (
    <View row marginT-v2>
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
              <Text>{item.title}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default PDTopTabComponent;
