import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderTurnoverDetailsProps {
  item: any;
  index: number;
  lastItem: boolean;
}

const RenderTurnoverDetailsComponent = (props: RenderTurnoverDetailsProps) => {
  const { item, index, lastItem } = props;

  const turnoverGroup = item?.descriptionLanguage || '';
  const description = item?.description && item?.description.trim() ? item?.description : '--';
  const isSubtotal = description === 'Subtotal'

  return (
    <View
      style={[
        tw(
          `${lastItem ? 'rounded-b-md' : ''
          } border-t-default border-light-lavendar`,
        ),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View marginH-v4 paddingV-v06 row centerV>
        <Text text13R grey2 text13BO={isSubtotal} textBlack={isSubtotal} flex-3 marginR-v5 numberOfLines={1}>
          {turnoverGroup}
        </Text>
        <View flex-4 marginR-v5>
          <Text text13R grey2 text13BO={isSubtotal} textBlack={isSubtotal} numberOfLines={1}>
            {description}
          </Text>
        </View>
        <View right flex-2 marginR-v5>
          <Text text13R grey2 text13BO={isSubtotal} textBlack={isSubtotal} numberOfLines={1}>
            {item.formattedTotalLY}
          </Text>
        </View>
        <View right flex-2 marginR-v5>
          <Text text13R grey2 text13BO={isSubtotal} textBlack={isSubtotal} numberOfLines={1}>
            {item.formattedYtdLY}
          </Text>
        </View>
        <View right flex-2 marginR-v5>
          <Text text13R grey2 text13BO={isSubtotal} textBlack={isSubtotal} numberOfLines={1}>
            {item.formattedYtdCY}
          </Text>
        </View>
        <View right flex-2 marginR-v5>
          <Text text13R grey2 text13BO={isSubtotal} textBlack={isSubtotal} numberOfLines={1}>
            {item.formattedGrowthCHF}
          </Text>
        </View>
        <View right flex-2 marginR-v5>
          <Text text13R grey2 text13BO={isSubtotal} textBlack={isSubtotal} numberOfLines={1}>
            {item.formattedGrowthPercentage}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RenderTurnoverDetailsComponent;
