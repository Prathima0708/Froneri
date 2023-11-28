import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { RCA_TYPES } from 'src/utils/Constant';

interface RCATopTabProps {
  handleChangeTab: any;
  RCASelectedValue: string;
}

const PLRCATopTabComponent = (props: RCATopTabProps) => {
  const { handleChangeTab, RCASelectedValue } = props;

  const handleRCATab = (id: number) => {
    let RCASelectedValue = RCA_TYPES[0].title;
    if (id == 1) {
      RCASelectedValue = RCA_TYPES[0].title;
    } else {
      RCASelectedValue = RCA_TYPES[1].title;
    }
    handleChangeTab(RCASelectedValue);
  };

  return (
    <View row>
      {RCA_TYPES.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${item.title == RCASelectedValue ? 'bg-light-lightBlue1' : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleRCATab(item.id)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default PLRCATopTabComponent;
