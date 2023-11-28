import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { memo } from 'react';
import { tw } from 'src/tw';

const TATakeoverListingHeaderComponent = () => {
  return (
    <View
      flex
      paddingH-v4
      row
      centerV
      paddingV-v1
      style={tw(
        'rounded-t-md bg-light-white border-default border-light-lavendar',
      )}>
      <View flex-2 style={tw('items-start')}>
        <Text text13M textBlack>
          {'Description'}
        </Text>
      </View>
      <View flex >
        <Text text13M textBlack>
          {'Serial Number'}
        </Text>
      </View>
      <View flex-2 style={tw('items-end')} marginR-v6>
        <Text text13M textBlack>
          {'Price'}
        </Text>
      </View>
      <View flex-2 style={tw('items-end')}>
        <Text text13M textBlack>
          {'Expected Turnover'}
        </Text>
      </View>
      <View flex-2 style={tw('items-center')}>
        <Text text13M textBlack>
          {'TA Transfer'}
        </Text>
      </View>
      <View flex-2 style={tw('items-end mr-2')}>
        <Text text13M textBlack>
          {'Follow Up Action'}
        </Text>
      </View>
    </View>
  );
};

export default memo(TATakeoverListingHeaderComponent);
