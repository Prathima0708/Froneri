import { TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface SWTraceGridBasicInfoComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
}
const SWTraceGridBasicInfoComponent = (
  props: SWTraceGridBasicInfoComponentProps,
) => {
  const { item, index, lastItem } = props;

  const employee = item?.employee ? item?.employee.trim() : '';
  const action = item?.action ? item?.action.trim() : '';
  const eventDatetime = item?.eventDatetime ? item?.eventDatetime.trim() : '';

  return (
    <View
      paddingH-v4
      row
      centerV
      height={72}
      paddingV-v1
      style={[
        tw(
          `${lastItem ? 'rounded-b-md' : ''
          } border-t-default border-light-lavendar `,
        ),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View row centerV marginV-v1 marginR-v4 width={'40%'}>
        <TouchableOpacity>
          <Text numberOfLines={1} text13R textBlack>
            {employee}
          </Text>
        </TouchableOpacity>
      </View>
      <View marginR-v4 width={'40%'}>
        <Text numberOfLines={1} text13R grey2>
          {action}
        </Text>
      </View>
      <View marginR-v4 width={'20%'}>
        <Text numberOfLines={2} text13R grey2>
          {eventDatetime}
        </Text>
      </View>
    </View>
  );
};

export default memo(SWTraceGridBasicInfoComponent);
