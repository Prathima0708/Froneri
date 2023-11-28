import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { Dimensions } from 'react-native';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];
const width = Dimensions.get('window').width;

interface RenderLast10DeliveriesProps {
  item: any;
  index: number;
  last10DeliveriesDataHeader: Array<any>;
}

const RenderLast10DeliveriesComponent = (
  props: RenderLast10DeliveriesProps,
) => {
  const { item, index, last10DeliveriesDataHeader } = props;

  const deliveriesYTDCY = item.deliveriesYTDCY
    ? item.deliveriesYTDCY.toString()
    : '';
  const deliveriesYTDLY = item.deliveriesYTDLY
    ? item.deliveriesYTDLY.toString()
    : '';
  const growthValue = item.deliveriesYTDCY - item.deliveriesYTDLY;
  const growth = growthValue ? growthValue.toString() : '';

  return (
    <View
      style={[
        tw(`border-b-default border-light-lavendar`),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View marginH-v4 paddingV-v07 row centerV>
        <Text
          text13M
          grey2
          marginR-v5
          marginV-v1
          numberOfLines={1}
          style={{ width: (width / 100) * 9 }}>
          {item.turnoverGroup}
        </Text>
        <Text
          text13M
          grey2
          marginR-v5
          marginV-v1
          numberOfLines={1}
          style={{ width: (width / 100) * 25 }}>
          {item.description}
        </Text>
        <Text
          text13M
          grey2
          marginR-v5
          marginV-v1
          numberOfLines={1}
          style={{ width: (width / 100) * 7 }}>
          {item.materialNumber}
        </Text>
        <Text
          text13M
          grey2
          marginR-v5
          marginV-v1
          numberOfLines={1}
          style={[tw('text-right'), { width: (width / 100) * 7 }]}>
          {item.deliveriesLY}
        </Text>
        <Text
          text13M
          grey2
          marginR-v5
          marginV-v1
          numberOfLines={1}
          style={[tw('text-right'), { width: (width / 100) * 7 }]}>
          {deliveriesYTDLY}
        </Text>
        <Text
          text13M
          grey2
          marginR-v5
          marginV-v1
          numberOfLines={1}
          style={[tw('text-right'), { width: (width / 100) * 7 }]}>
          {deliveriesYTDCY}
        </Text>
        <Text
          text13M
          grey2
          marginV-v1
          numberOfLines={1}
          style={[tw('text-right'), { width: (width / 100) * 7 }]}>
          {growth}
        </Text>
        {last10DeliveriesDataHeader.map((header, i) => {
          // Check if the target value is present in the array
          const targetIndex = item.data.findIndex(
            (obj: any) => obj.deliveryDate == header.formattedDate,
          );

          if (targetIndex !== -1) {
            return (
              <Text
                key={i}
                text13M
                grey2
                marginL-v5
                marginV-v1
                numberOfLines={1}
                style={[tw('text-right'), { width: (width / 100) * 7 }]}>
                {item.data[targetIndex].quantity}
              </Text>
            );
          } else {
            return (
              <View
                key={i}
                marginL-v5
                marginV-v1
                style={{ width: (width / 100) * 7 }}></View>
            );
          }
        })}
      </View>
    </View>
  );
};

export default RenderLast10DeliveriesComponent;
