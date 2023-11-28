import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {CONDITION_FILTERS} from 'src/utils/Constant';

interface ConditionsTopTabProps {
  handleChangeTab: any;
  conditionsSelectedValue: string;
  conditionContractsData?: any;
  financialContractsData?: any;
  salesDealsConditionData?: any;
}

const ConditionsTopTabComponent = (props: ConditionsTopTabProps) => {
  const {
    handleChangeTab,
    conditionsSelectedValue,
    conditionContractsData,
    financialContractsData,
    salesDealsConditionData,
  } = props;

  const handleConditionsTab = (id: number) => {
    let conditionsSelectedValue = CONDITION_FILTERS[0].title;
    if (id == 1) {
      conditionsSelectedValue = CONDITION_FILTERS[0].title;
    } else if (id == 2) {
      conditionsSelectedValue = CONDITION_FILTERS[1].title;
    } else {
      conditionsSelectedValue = CONDITION_FILTERS[2].title;
    }
    handleChangeTab(conditionsSelectedValue);
  };

  return (
    <View row>
      {CONDITION_FILTERS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == conditionsSelectedValue
                    ? 'bg-light-lightBlue1'
                    : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleConditionsTab(item.id)}>
              <Text center>
                {item.id == 1 && conditionContractsData.length > 0
                  ? item.title +
                    ` (${conditionContractsData.length.toString()})`
                  : item.id == 2 && financialContractsData.length > 0
                  ? item.title +
                    ` (${financialContractsData.length.toString()})`
                  : item.id == 3 && salesDealsConditionData.length > 0
                  ? item.title +
                    ` (${salesDealsConditionData.length.toString()})`
                  : item.title}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default ConditionsTopTabComponent;
