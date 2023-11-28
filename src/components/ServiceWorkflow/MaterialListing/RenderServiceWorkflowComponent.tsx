import React, { memo } from 'react';

import View from 'src/components/View';
import Text from 'src/components/Text';

import { tw } from 'src/tw';

import { ColourPalette } from 'src/styles/config/ColoursStyles';

import { formatDateReverse } from 'src/utils/CommonUtil';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderCustomerSearchProps {
  item: any;
  index: number;
  lastItem: boolean;
}
const RenderServiceWorkflowComponent = (props: RenderCustomerSearchProps) => {
  const { item, index, lastItem } = props;

  const material = item.materialNumber ? item?.materialNumber : '--';
  const description = item.materialDescription
    ? item?.materialDescription?.trim()
    : '--';
  const equipment = item.equipmentNumber ? item?.equipmentNumber : '--';
  const brand = item.brand ? item?.brand?.trim() : '--';
  const installedDate = item.installedDate ? item?.installedDate?.trim() : '--';

  return (
    <View
      paddingH-v4
      row
      centerV
      paddingV-v06
      style={[
        tw(
          `${lastItem ? 'rounded-b-md' : ''
          } border-t-default border-light-lavendar`,
        ),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View flex row centerV marginR-v4>
        <View marginR-v4>
          <Text numberOfLines={1} text13R textBlack>
            {{ material }}
          </Text>
        </View>
      </View>
      <View flex-4 marginR-v4>
        <Text numberOfLines={1} text13R grey2>
          {description}
        </Text>
      </View>
      <View flex marginR-v4>
        <Text numberOfLines={1} text13R grey2>
          {{ equipment }}
        </Text>
      </View>
      <View flex marginR-v4>
        <Text numberOfLines={1} text13R grey2>
          {brand}
        </Text>
      </View>
      <View flex>
        <Text numberOfLines={1} text13R grey2>
          {installedDate ? formatDateReverse(new Date(installedDate)) : ''}
        </Text>
      </View>
    </View>
  );
};

export default memo(RenderServiceWorkflowComponent);
