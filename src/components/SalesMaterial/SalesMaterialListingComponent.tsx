import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text';

import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import {ColourPalette} from 'src/styles/config/ColoursStyles';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface ALlTasksListingComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
}

const ALlTasksListingComponent = (props: ALlTasksListingComponentProps) => {
  const {item, index, lastItem} = props;

  const filteredStatus = item?.status ? item?.status.trim() : '--';

  const description = item?.description ? item?.description.trim() : '--';
  const requestedDate = item?.requestedDate ? item?.requestedDate.trim() : '--';

  return (
    <TouchableOpacity>
      <View
        paddingH-v4
        row
        centerV
        height={72}
        style={[
          tw(
            `${
              lastItem ? 'rounded-b-md' : ''
            } border-t-default border-light-lavendar `,
          ),
          {backgroundColor: colors[index % colors.length]},
        ]}>
        <View flex-1 marginR-v4>
          <Text numberOfLines={2} text13R grey2>
            {description}
          </Text>
        </View>

        <View marginR-v6>
          <TouchableOpacity onPress={() => {}}>
            <images.DownArrowBlueIcon />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ALlTasksListingComponent);
