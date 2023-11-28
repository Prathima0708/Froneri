import {TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderPCModalComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
}
const RenderPCModalComponent = (props: RenderPCModalComponentProps) => {
  const {index, lastItem, item} = props;

  const handleNavigation = () => {};

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View
        paddingH-v4
        row
        centerV
        paddingV-v4
        style={[
          tw(
            `${
              lastItem ? 'rounded-b-md' : ''
            } border-t-default border-light-lavendar`,
          ),
          {backgroundColor: colors[index % colors.length]},
        ]}>
        <View flex-2 marginR-v4>
          <Text numberOfLines={1} text13R grey2>
            {item.territory}
          </Text>
        </View>
        <View flex-3 marginR-v4>
          <Text numberOfLines={1} text13R grey2>
            {item.salesRep}
          </Text>
        </View>
        <View flex-2 marginR-v4>
          <Text numberOfLines={1} text13R grey2>
            {item.phone}
          </Text>
        </View>
        <View flex-2>
          <Text numberOfLines={1} text13R grey2>
            {item.pf}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RenderPCModalComponent);
