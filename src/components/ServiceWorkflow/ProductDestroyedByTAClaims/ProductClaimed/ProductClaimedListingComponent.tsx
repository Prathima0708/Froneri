import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import React, {memo} from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {images} from 'src/assets/Images';
let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface ProductClaimedListingListingProps {
  item: any;
  index: number;
  lastItem: boolean;

  onItemSelected: (index: number) => void;
}
const ProductClaimedListingComponent = (
  props: ProductClaimedListingListingProps,
) => {
  const {item, index, lastItem} = props;

  return (
    <View
      paddingH-v4
      row
      centerV
      height={72}
      paddingV-v1
      style={[
        tw(
          `${
            lastItem ? 'rounded-b-md' : ''
          } border-t-default border-light-lavendar `,
        ),
        {backgroundColor: colors[index % colors.length]},
      ]}>
      <View marginR-v4 width={'10%'}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.onItemSelected(index);
          }}>
          <View marginR-v2>
            {item.selection ? (
              <images.CheckBox />
            ) : (
              <View
                style={tw(
                  `h-6 w-6 border-default rounded-md border-light-grey4 bg-light-white`,
                )}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View marginR-v4 width={'15%'}>
        <Text numberOfLines={1} text13R grey2>
          {item?.manufacturerSerialNumber}
        </Text>
      </View>
      <View row centerV marginV-v1 marginR-v4 width={'35%'}>
        <TouchableOpacity>
          <Text numberOfLines={1} text13R textBlack>
            {item?.materialDescription}
          </Text>
        </TouchableOpacity>
      </View>
      <View marginR-v4 width={'20%'}>
        <Text numberOfLines={1} text13R grey2>
          {item?.equipmentNumber}
        </Text>
      </View>
      <View marginR-v4 width={'20%'}>
        <Text numberOfLines={2} text13R grey2>
          {item?.installedDate}
        </Text>
      </View>
    </View>
  );
};

export default memo(ProductClaimedListingComponent);
