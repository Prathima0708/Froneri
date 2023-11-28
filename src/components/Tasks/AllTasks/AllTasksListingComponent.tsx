import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text';

import {tw} from 'src/tw';

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
        <View flex-2 marginR-v4>
          <Text numberOfLines={2} text13R grey2>
            {description}
          </Text>
        </View>

        <View flex-1 row>
          <View flex-1 marginR-v4>
            <Text numberOfLines={2} text13R grey2>
              {filteredStatus}
            </Text>
          </View>
          <View flex-1 marginR-v4>
            <Text numberOfLines={1} text13R grey2>
              {requestedDate}
            </Text>
            {/* {item?.overdue ? (
              <View row style={tw('mt-6px items-center')}>
                <View style={tw('w-2 h-2 rounded-md mr-2 bg-light-red1')} />
                <Text
                  numberOfLines={1}
                  text13R
                  red800
                  style={tw('self-center')}>
                  Overdue
                </Text>
              </View>
            ) : null} */}
          </View>
          <View flex-1>
            <Text numberOfLines={1} text13R grey2>
              {requestedDate}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ALlTasksListingComponent);
