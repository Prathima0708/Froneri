import {TouchableOpacity} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {VACATIONS_TYPES} from 'src/utils/Constant';
import {tw} from 'src/tw';

interface CLVacationsTopTabComponentProps {
  handleChangeTab: any;
  vacationsSelectedValue: string;
}

const CLVacationsTopTabComponent = (props: CLVacationsTopTabComponentProps) => {
  const {handleChangeTab, vacationsSelectedValue} = props;

  const VACATIONS_FILTERS = [
    {id: 1, title: VACATIONS_TYPES.ALL_VACATIONS},
    {id: 2, title: VACATIONS_TYPES.PAST_VACATIONS},
  ];

  const handleVacationTab = (id: number) => {
    let vacationsSelectedValue = VACATIONS_TYPES.ALL_VACATIONS;
    if (id == 1) {
      vacationsSelectedValue = VACATIONS_TYPES.ALL_VACATIONS;
    } else {
      vacationsSelectedValue = VACATIONS_TYPES.PAST_VACATIONS;
    }
    handleChangeTab(vacationsSelectedValue);
  };

  return (
    <View row>
      {VACATIONS_FILTERS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == vacationsSelectedValue
                    ? 'bg-light-lightBlue1'
                    : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleVacationTab(item.id)}>
              <Text
                style={tw(
                  `${
                    item.title == vacationsSelectedValue
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

export default CLVacationsTopTabComponent;
