import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import { tw } from 'src/tw';

interface RenderMonthlyTurnoverProps {
  item: any;
  bgColor: string;
  dataType: string;
  headerItem: any;
}

const RenderMonthlyTurnoverComponent = (props: RenderMonthlyTurnoverProps) => {
  const { item, bgColor, dataType, headerItem } = props;

  let value = '', evolution = '';
  if (item[headerItem.descriptionLanguage]) {
    value = item[headerItem.descriptionLanguage][dataType].formattedValue
    evolution = item[headerItem.descriptionLanguage][dataType].formattedEvolution;
  }

  return (
    <View
      row
      centerV
      paddingH-v4
      style={[
        tw(`h-36px w-210px`),
        {
          backgroundColor: bgColor,
        },
      ]}>
      <Text text13R textBlack flex marginR-v4 style={tw('text-right')}>
        {value}
      </Text>
      <Text text13R textBlack flex style={tw('text-right')}>
        {evolution}
      </Text>
    </View>
  );
};

export default RenderMonthlyTurnoverComponent;
