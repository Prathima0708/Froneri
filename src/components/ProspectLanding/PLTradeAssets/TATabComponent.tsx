import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {TA_TAB_TYPES} from 'src/utils/Constant';

interface TATabComponentProps {
  handleChangeTab: any;
  taSelectedValue: string;
}

const TATabComponent = (props: TATabComponentProps) => {
  const {handleChangeTab, taSelectedValue} = props;

  const TRADE_ASSET_DETAILS = [
    {id: 1, title: TA_TAB_TYPES.ALL},
    {id: 2, title: TA_TAB_TYPES.TA_REQUEST},
    {id: 3, title: TA_TAB_TYPES.TA_CHARGE_OFF},
  ];

  const handleNotesTab = (id: number) => {
    let taSelectedVal = TA_TAB_TYPES.ALL;
    if (id === 1) {
      taSelectedVal = TA_TAB_TYPES.ALL;
    } else if (id === 2) {
      taSelectedVal = TA_TAB_TYPES.TA_REQUEST;
    } else if (id === 3) {
      taSelectedVal = TA_TAB_TYPES.TA_CHARGE_OFF;
    }
    handleChangeTab(taSelectedVal);
  };

  return (
    <View row>
      {TRADE_ASSET_DETAILS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == taSelectedValue ? 'bg-light-lightBlue1' : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleNotesTab(item.id)}>
              <Text
                text13R
                darkBlue
                style={tw(
                  `${
                    item.title == taSelectedValue
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

export default TATabComponent;
