import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderProductStatisticsProps {
  item: any;
  index: number;
  lastItem: boolean;
}

const RenderProductStatisticsComponent = (
  props: RenderProductStatisticsProps,
) => {
  const {item, index, lastItem} = props;
  const formatterMaterialNumber = item.formatterMaterialNumber
    ? item.formatterMaterialNumber
    : '';
  const materialDescription = item.materialDescription
    ? item.materialDescription
    : '';
  const formatterQuantity = item.formatterQuantity
    ? item.formatterQuantity
    : '';
  const formatterNetAmount = item.formatterNetAmount
    ? item.formatterNetAmount
    : '';
  const priceUnit = item.priceUnit ? item.priceUnit : '';
  const formatterUnitPrice = item.formatterUnitPrice
    ? item.formatterUnitPrice
    : '';

  return (
    <View
      style={[
        tw(
          `${
            lastItem ? 'rounded-b-md' : ''
          } border-t-default border-light-lavendar`,
        ),
        {backgroundColor: colors[index % colors.length]},
      ]}>
      <View paddingH-v4 row centerV paddingV-v1>
        <View flex-3 row centerV marginR-v6>
          <Text text13R textBlack numberOfLines={1}>
            {formatterMaterialNumber}
          </Text>
        </View>
        <View flex-12 row centerV marginR-v6>
          <Text text13R textBlack numberOfLines={1}>
            {materialDescription}
          </Text>
        </View>
        <View flex row centerV marginR-v6>
          <Text text13R textBlack numberOfLines={1}>
            {formatterQuantity}
          </Text>
        </View>
        <View flex-2 row centerV marginR-v6 right>
          <Text text13R textBlack numberOfLines={1}>
            {formatterNetAmount}
          </Text>
        </View>
        <View flex-2 row centerV marginR-v6>
          <Text text13R textBlack numberOfLines={1}>
            {priceUnit}
          </Text>
        </View>
        <View flex-2 row centerV right>
          <Text text13R textBlack numberOfLines={1}>
            {formatterUnitPrice}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RenderProductStatisticsComponent;
