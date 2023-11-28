import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {tw} from 'src/tw';
import {getLocaleNumberFormatter, getOnlyDate} from 'src/utils/CommonUtil';

const TAProfitabilityComponent = (props: any) => {
  const {taProfitabilityData} = props;
  let item: any = {};

  if (taProfitabilityData.length > 0) {
    item = taProfitabilityData[0];
  }
  const targetTurnover = item.taTargetTurnover
    ? getLocaleNumberFormatter(item.taTargetTurnover, 2).toString()
    : '0';
  const turnoverOfLast12Months = item.turnoverOfLast12Months
    ? getLocaleNumberFormatter(item.turnoverOfLast12Months, 2).toString()
    : '0';
  const profitability = item.profitability ? item.profitability : '0';
  const businessStartDate = item.businessStartDate
    ? getOnlyDate(item.businessStartDate)
    : '0';
  const expectedTurnoverIceCream = item.expectedTurnoverIceCream
    ? getLocaleNumberFormatter(item.expectedTurnoverIceCream, 2).toString()
    : '0';
  const numberOfTradeAssets = item.numberOfTradeAssets
    ? getLocaleNumberFormatter(item.numberOfTradeAssets).toString()
    : '0';
  return (
    <View
      br40
      marginH-v2
      padding-v4
      style={tw('border-default border-light-lavendar')}>
      <Text text18M textBlack>
        Trade Assets Profitability
      </Text>
      <View row spread marginT-v2>
        <View marginR-v2 right>
          <Text text13M textBlack>
            Target Turnover
          </Text>
          <Text text13R textBlack marginT-v03>
            {targetTurnover}
          </Text>
        </View>
        <View marginR-v2 right>
          <Text text13M textBlack>
            Last 12 Months Turnover
          </Text>
          <Text text13R textBlack marginT-v03>
            {turnoverOfLast12Months}
          </Text>
        </View>
        <View marginR-v2 right>
          <Text text13M textBlack>
            Profitability
          </Text>
          <Text text13R textBlack marginT-v03>
            {profitability}
          </Text>
        </View>
        <View marginR-v2 right>
          <Text text13M textBlack>
            Business Start Date
          </Text>
          <Text text13R textBlack marginT-v03>
            {businessStartDate}
          </Text>
        </View>
        <View marginR-v2 right>
          <Text text13M textBlack>
            Expected Turnover Ice Cream
          </Text>
          <Text text13R textBlack marginT-v03>
            {expectedTurnoverIceCream}
          </Text>
        </View>
        <View marginR-v2 right>
          <Text text13M textBlack>
            No. of Trade Assets
          </Text>
          <Text text13R textBlack marginT-v03>
            {numberOfTradeAssets}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TAProfitabilityComponent;
