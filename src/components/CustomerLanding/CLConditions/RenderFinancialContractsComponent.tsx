import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {images} from 'src/assets/Images';
import {tw} from 'src/tw';
import {ScrollView, TouchableOpacity} from 'react-native';
import ExpandableSection from 'src/components/ExpandableSection';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface FinancialContractsProps {
  item: any;
  index: number;
  expandedItemIndex: number;
  onPressExpand: any;
}

const RenderFinancialContractsComponent = (props: FinancialContractsProps) => {
  const {item, index, expandedItemIndex, onPressExpand} = props;
  const isExpanded = index === expandedItemIndex;

  const contractNumber = item.contractNumber ? item.contractNumber : '--';
  const formattedContractStartDate = item.formattedContractStartDate
    ? item.formattedContractStartDate
    : '--';
  const formattedContractEndDate = item.formattedContractEndDate
    ? item.formattedContractEndDate
    : '--';
  const conditionDescription = item.conditionDescription
    ? item.conditionDescription
    : '--';
  const formattedTargetValue = item.formattedTargetValue
    ? item.formattedTargetValue
    : '--';
  const conditions = item.conditions ? item.conditions : [];
  const targetCustomer = item.targetCustomer ? item.targetCustomer : '';

  return (
    <View
      style={[
        tw(
          `${
            isExpanded
              ? 'border-0.5 border-light-grey3'
              : 'border-t-default border-light-lavendar'
          }`,
        ),
        {
          backgroundColor: colors[index % colors.length],
          marginBottom: isExpanded ? 2 : 0,
        },
      ]}>
      <View paddingH-v4 row centerV paddingV-v4>
        <Text text13R textBlack flex-5 marginR-v6 numberOfLines={1}>
          {contractNumber}
        </Text>
        <Text text13R textBlack flex-3 marginR-v6 numberOfLines={1}>
          {formattedContractStartDate}
        </Text>
        <Text text13R textBlack flex-3 marginR-v6 numberOfLines={1}>
          {formattedContractEndDate}
        </Text>
        <Text text13R textBlack flex-13 marginR-v6 numberOfLines={1}>
          {conditionDescription}
        </Text>
        <Text text13R textBlack flex-3 marginR-v6 numberOfLines={1}>
          {formattedTargetValue}
        </Text>
        <View flex-3 row centerV spread>
          <Text text13R textBlack numberOfLines={1}>
            {conditions.length.toString()}
          </Text>
          <TouchableOpacity onPress={() => onPressExpand(index)}>
            {isExpanded ? <images.UpIcon /> : <images.DownIcon />}
          </TouchableOpacity>
        </View>
      </View>
      <ExpandableSection expanded={isExpanded}>
        <View
          marginH-v4
          paddingV-v4
          style={tw('border-t-default border-light-grey2 border-opacity-25')}>
          <View
            padding-v3
            style={tw(
              'bg-light-white border-default border-light-lavendar rounded-12px',
            )}>
            <View row centerV>
              <Text text13M textBlack marginR-v06>
                Target Customers
              </Text>
              <Text text13R textBlack>
                {targetCustomer}
              </Text>
            </View>
          </View>
          {conditions.length > 0 && (
            <View
              marginT-v3
              style={tw('border-default border-light-lavendar rounded-md')}>
              <View
                paddingH-v3
                paddingV-v1
                row
                centerV
                style={tw('bg-light-white rounded-t-md')}>
                <Text text13M textBlack flex-3 marginR-v6>
                  Condition Start
                </Text>
                <Text
                  text13M
                  textBlack
                  flex-3
                  marginR-v4
                  style={tw('text-right')}>
                  Condition End
                </Text>
                <Text
                  text13M
                  textBlack
                  flex-4
                  marginR-v6
                  style={tw('text-right')}>
                  Target Product Group
                </Text>
                <Text
                  text13M
                  textBlack
                  flex-4
                  marginR-v6
                  style={tw('text-right')}>
                  Bonus Product Group
                </Text>
                <Text
                  text13M
                  textBlack
                  flex-4
                  marginR-v4
                  style={tw('text-right')}>
                  Initial Finance Amount
                </Text>
                <Text
                  text13M
                  textBlack
                  flex-3
                  marginR-v6
                  style={tw('text-right')}>
                  Bonus Factor
                </Text>
                <Text text13M textBlack flex-5 style={tw('text-right')}>
                  Expected Accrual Value
                </Text>
              </View>
              {conditions.map((data: any, i: number) => {
                return (
                  <View
                    paddingH-v3
                    paddingV-v1
                    key={i.toString()}
                    style={[
                      tw('rounded-b-md'),
                      {backgroundColor: colors[i % colors.length]},
                    ]}>
                    <View paddingV-v1 row centerV>
                      <Text text13M textBlack flex-3 marginR-v6>
                        {data.formattedConditionStartDate
                          ? data.formattedConditionStartDate
                          : '--'}
                      </Text>
                      <Text
                        text13M
                        textBlack
                        flex-3
                        marginR-v4
                        style={tw('text-right')}>
                        {data.formattedConditionEndDate
                          ? data.formattedConditionEndDate
                          : '--'}
                      </Text>
                      <Text
                        text13M
                        textBlack
                        flex-4
                        marginR-v6
                        style={tw('text-right')}>
                        {data.targetProductGroup
                          ? data.targetProductGroup
                          : '--'}
                      </Text>
                      <Text
                        text13M
                        textBlack
                        flex-4
                        marginR-v6
                        style={tw('text-right')}>
                        {data.bonusProductGroup ? data.bonusProductGroup : '--'}
                      </Text>
                      <Text
                        text13M
                        textBlack
                        flex-4
                        marginR-v4
                        style={tw('text-right')}>
                        {data.formattedInitialFinanceAmount
                          ? data.formattedInitialFinanceAmount
                          : '--'}
                      </Text>
                      <Text
                        text13M
                        textBlack
                        flex-3
                        marginR-v6
                        style={tw('text-right')}>
                        {data.bonusFactor ? data.bonusFactor + '%' : '--'}
                      </Text>
                      <Text text13M textBlack flex-5 style={tw('text-right')}>
                        {data.formattedExpectedAccrualValue
                          ? data.formattedExpectedAccrualValue + '%'
                          : '--'}
                      </Text>
                    </View>
                    <View
                      paddingH-v06
                      style={[
                        tw('my-4'),
                        {
                          backgroundColor:
                            colors[i % colors.length == 1 ? 0 : 1],
                        },
                      ]}>
                      <ScrollView horizontal={true}>
                        <View>
                          <View
                            paddingV-v06
                            style={tw(
                              'border-b-default border-light-grey2 border-opacity-25',
                            )}>
                            <Text>Target Value Range</Text>
                          </View>
                          <View paddingV-v06>
                            <Text>Penalty</Text>
                          </View>
                        </View>
                        {data.rangeData.map(
                          (
                            item: {
                              targetValueEnd: string;
                              targetValueStart: string;
                              bonusFactor: any;
                            },
                            i: {toString: () => React.Key | null | undefined},
                          ) => {
                            return (
                              <View key={i.toString()} right>
                                <View
                                  paddingL-v5
                                  paddingV-v06
                                  style={tw(
                                    'border-b-default border-light-grey2 border-opacity-25',
                                  )}>
                                  <Text text13R textBlack numberOfLines={1}>
                                    {item.targetValueEnd &&
                                    item.targetValueStart
                                      ? item.targetValueStart.toString() +
                                        ' - ' +
                                        item.targetValueEnd.toString()
                                      : '0'}
                                  </Text>
                                </View>
                                <View paddingV-v06 paddingL-v5>
                                  <Text text13R textBlack numberOfLines={1}>
                                    {item.bonusFactor
                                      ? item.bonusFactor.toString()
                                      : '0'}
                                  </Text>
                                </View>
                              </View>
                            );
                          },
                        )}
                      </ScrollView>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ExpandableSection>
    </View>
  );
};

export default RenderFinancialContractsComponent;
