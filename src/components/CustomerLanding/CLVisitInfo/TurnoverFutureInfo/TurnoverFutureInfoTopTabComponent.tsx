import {TouchableOpacity} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {TURNOVER_FUTURE_INFO_TYPES} from 'src/utils/Constant';
import {tw} from 'src/tw';

interface TurnoverFutureInfoTopTabComponentProps {
  handleChangeTab: any;
  turnoverFutureInfoSelectedValue: string;
}

const TurnoverFutureInfoTopTabComponent = (
  props: TurnoverFutureInfoTopTabComponentProps,
) => {
  const {handleChangeTab, turnoverFutureInfoSelectedValue} = props;

  const CUSTOMER_DETAILS_FILTERS = [
    {id: 1, title: TURNOVER_FUTURE_INFO_TYPES.NEXT_VISITS},
    {id: 2, title: TURNOVER_FUTURE_INFO_TYPES.NEXT_DELIVERIES},
    {id: 3, title: TURNOVER_FUTURE_INFO_TYPES.VISIT_NOTES},
  ];

  const handleNotesTab = (id: number) => {
    let turnoverFutureInfoSelectedValue =
      TURNOVER_FUTURE_INFO_TYPES.NEXT_VISITS;
    if (id == 1) {
      turnoverFutureInfoSelectedValue = TURNOVER_FUTURE_INFO_TYPES.NEXT_VISITS;
    } else if (id == 2) {
      turnoverFutureInfoSelectedValue =
        TURNOVER_FUTURE_INFO_TYPES.NEXT_DELIVERIES;
    } else {
      turnoverFutureInfoSelectedValue = TURNOVER_FUTURE_INFO_TYPES.VISIT_NOTES;
    }
    handleChangeTab(turnoverFutureInfoSelectedValue);
  };

  return (
    <View row>
      {CUSTOMER_DETAILS_FILTERS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == turnoverFutureInfoSelectedValue
                    ? 'bg-light-lightBlue1'
                    : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleNotesTab(item.id)}>
              <Text
                style={tw(
                  `${
                    item.title == turnoverFutureInfoSelectedValue
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

export default TurnoverFutureInfoTopTabComponent;
