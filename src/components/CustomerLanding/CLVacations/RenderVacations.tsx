import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {TouchableOpacity} from 'react-native';
import {tw} from 'src/tw';

interface RenderVacationsProps {
  item: any;
  index: number;
  onVacationPress: any;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const RenderVacations = (props: RenderVacationsProps) => {
  const {item, index, onVacationPress} = props;
  const fromDate = item.fromDate ? item.fromDate : '-';
  const toDate = item.toDate ? item.toDate : '-';
  const remark = item.remark ? item.remark : '-';

  const handleVacationOnPress = () => {
    onVacationPress && onVacationPress(item);
  };
  return (
    <TouchableOpacity onPress={handleVacationOnPress}>
      <View
        row
        centerV
        padding-v4
        style={{backgroundColor: colors[index % colors.length]}}>
        <Text text13R textBlack flex marginR-v2 numberOfLines={1}>
          {fromDate}
        </Text>
        <Text text13R textBlack flex marginR-v2 numberOfLines={1}>
          {toDate}
        </Text>
        <Text text13R textBlack flex-8 marginR-v2 numberOfLines={1}>
          {remark}
        </Text>

        <View flex>
          {item.isActiveVacation ? (
            <View row centerV>
              <View style={tw('bg-light-orange-400 h-3 w-3 rounded-md mr-1')} />
              <Text text13R darkBlue4>
                Active
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderVacations;
