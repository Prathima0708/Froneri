import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useState} from 'react';
import RadioButton from 'src/components/RadioButton';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {MONTHLY_TURNOVER_DISPLAY_TYPES} from 'src/utils/Constant';
import {tw} from 'src/tw';
import RenderMonthlyTurnoverComponent from './RenderMonthlyTurnoverComponent';
import {ScrollView} from 'react-native';

interface MonthlyTurnoverProps {
  headerData: Array<any>;
  monthlyTurnoverData: Array<any>;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const MonthlyTurnoverComponent = (props: MonthlyTurnoverProps) => {
  const {headerData, monthlyTurnoverData} = props;

  const [displayType, setDisplayType] = useState(
    MONTHLY_TURNOVER_DISPLAY_TYPES[0].value,
  );

  const handleDisplayType = (data: any) => {
    setDisplayType(data);
  };

  const currentMonth = new Date().getMonth();

  const renderHeader = () => {
    return (
      <View style={tw('border-l-default border-light-lavendar ')}>
        <View
          row
          paddingH-v2
          style={tw(
            'h-36px border-t-default border-light-lavendar rounded-md',
          )}>
          {headerData.map((headerItem, i, row) => {
            let isLast = false;
            if (i + 1 === row.length) {
              isLast = true;
            }
            return (
              <View
                key={headerItem.descriptionLanguage}
                style={tw(
                  `${
                    isLast ? 'border-r-default rounded-r-md' : ''
                  } border-b-default border-light-lavendar`,
                )}>
                <View
                  centerV
                  paddingH-v4
                  style={tw(
                    `h-36px w-210px border-t-default border-light-lavendar`,
                  )}>
                  <Text text13M textBlack style={tw('text-right')}>
                    {headerItem.descriptionLanguage}
                  </Text>
                </View>
                <View
                  row
                  centerV
                  paddingH-v3
                  style={[
                    tw(
                      'h-36px w-223px border-t-default  border-light-lavendar',
                    ),
                    {borderRightWidth: 0.5},
                  ]}>
                  <Text
                    text13M
                    textBlack
                    flex
                    marginR-v4
                    style={tw('text-right')}>
                    Value
                  </Text>
                  <Text text13M textBlack flex style={tw('text-right')}>
                    Evolution
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View marginL-v2 centerV style={[tw('h-36px ')]}>
          <Text text13M textBlack>
            Month
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View flex>
      <View right row centerV marginT-v3>
        <Text text13M textBlack marginR-v4>
          Display
        </Text>
        <RadioButton
          onValueChange={handleDisplayType}
          initialValue={displayType}
          color={ColourPalette.light.darkBlue}
          data={MONTHLY_TURNOVER_DISPLAY_TYPES}
          containerStyle={tw('mr-10')}
          labelStyle={tw('text-13px font-normal')}
        />
      </View>
      {renderHeader()}
      <ScrollView style={tw('')}>
        <View row flex>
          <View style={tw('border-l-default border-light-lavendar ')}>
            <View style={tw('h-36px border-t-default border-light-lavendar')}>
              {monthlyTurnoverData.map((month, i) => {
                return (
                  <View
                    paddingH-v3
                    center
                    key={month.id}
                    style={[
                      tw('h-36px'),
                      {
                        backgroundColor:
                          currentMonth == i
                            ? ColourPalette.light.white5
                            : colors[i % colors.length],
                      },
                    ]}>
                    <Text text13M textBlack>
                      {month.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <ScrollView style={tw('')} horizontal>
            {headerData.map((headerItem, i, row) => {
              let isLast = false;
              if (i + 1 === row.length) {
                isLast = true;
              }
              return (
                <View
                  key={headerItem.descriptionLanguage}
                  style={tw(
                    `${
                      isLast ? 'border-r-default rounded-r-md' : ''
                    } border-b-default border-light-lavendar`,
                  )}>
                  {monthlyTurnoverData.map((item, i, row) => {
                    return (
                      <RenderMonthlyTurnoverComponent
                        key={item.id}
                        item={item}
                        bgColor={
                          currentMonth == i
                            ? ColourPalette.light.white5
                            : colors[i % colors.length]
                        }
                        dataType={displayType}
                        headerItem={headerItem}
                      />
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default MonthlyTurnoverComponent;
