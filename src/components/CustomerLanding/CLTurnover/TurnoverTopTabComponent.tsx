import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {TURNOVER_TYPES} from 'src/utils/Constant';

interface TurnoverTopTabProps {
  handleChangeTab: any;
  turnoverSelectedValue: string;
}

const TurnoverTopTabComponent = (props: TurnoverTopTabProps) => {
  const {handleChangeTab, turnoverSelectedValue} = props;

  const handleTurnoverTab = (id: number) => {
    let turnoverSelectedValue = TURNOVER_TYPES[0].title;
    if (id == 1) {
      turnoverSelectedValue = TURNOVER_TYPES[0].title;
    } else if (id == 2) {
      turnoverSelectedValue = TURNOVER_TYPES[1].title;
    } else {
      turnoverSelectedValue = TURNOVER_TYPES[2].title;
    }
    handleChangeTab(turnoverSelectedValue);
  };

  return (
    <View row>
      {TURNOVER_TYPES.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == turnoverSelectedValue
                    ? 'bg-light-lightBlue1'
                    : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleTurnoverTab(item.id)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default TurnoverTopTabComponent;
