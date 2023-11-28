import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {removeLeadingZeroes} from 'src/utils/CommonUtil';

interface OrderProps {
  item: any;
  index: number;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const RenderOrderComponent = (props: OrderProps) => {
  const {item, index} = props;

  const materialNumber = item.materialNumber
    ? removeLeadingZeroes(item.materialNumber)
    : '--';
  const materialDescription = item.materialDescription
    ? item.materialDescription
    : '--';
  const formattedTotalQuantity = item.formattedTotalQuantity
    ? item.formattedTotalQuantity
    : '--';
  const formattedRegularQuantity = item.formattedRegularQuantity
    ? item.formattedRegularQuantity
    : '--';
  const formattedFreeQuantity = item.formattedFreeQuantity
    ? item.formattedFreeQuantity
    : '--';

  const salesUnit = item.salesUnit ? item.salesUnit : '--';
  const formattedNetAmount = item.formattedNetAmount
    ? item.formattedNetAmount
    : '--';
  return (
    <View
      row
      centerV
      paddingH-v3
      paddingV-v06
      style={{backgroundColor: colors[index % colors.length]}}>
      <Text text13R textBlack flex marginR-v3 numberOfLines={1}>
        {materialNumber}
      </Text>
      <Text text13R textBlack flex-4 marginR-v3 numberOfLines={1}>
        {materialDescription}
      </Text>
      <Text text13R textBlack flex marginR-v3 numberOfLines={1}>
        {formattedTotalQuantity}
      </Text>
      <Text text13R textBlack flex marginR-v3 numberOfLines={1}>
        {formattedRegularQuantity}
      </Text>
      <Text text13R textBlack flex marginR-v3 numberOfLines={1}>
        {formattedFreeQuantity}
      </Text>
      <Text text13R textBlack flex marginR-v3 numberOfLines={1}>
        {salesUnit}
      </Text>
      <View flex right>
        <Text text13R textBlack numberOfLines={1}>
          {formattedNetAmount}
        </Text>
      </View>
    </View>
  );
};

export default RenderOrderComponent;
