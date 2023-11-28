import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {TA_CLAIMS_TYPES} from 'src/utils/Constant';

interface TAClaimsTopTabProps {
  handleChangeTab: any;
  SelectedValue: string;
}

const TAClaimsTopTabComponent = (props: TAClaimsTopTabProps) => {
  const {handleChangeTab, SelectedValue} = props;

  const handleTAClaimsTab = (id: number) => {
    let SelectedValue = TA_CLAIMS_TYPES[0].title;
    if (id == 1) {
      SelectedValue = TA_CLAIMS_TYPES[0].title;
    } else {
      SelectedValue = TA_CLAIMS_TYPES[1].title;
    }
    handleChangeTab(SelectedValue);
  };

  return (
    <View row>
      {TA_CLAIMS_TYPES.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == SelectedValue ? 'bg-light-lightBlue1' : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleTAClaimsTab(item.id)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default TAClaimsTopTabComponent;
