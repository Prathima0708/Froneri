import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';
import {tw} from 'src/tw';

const PCFreeGoodsListingHeaderComponent = () => {
  return (
    <View
      paddingH-v4
      row
      centerV
      paddingV-v1
      style={tw(
        'rounded-t-md bg-light-white border-default border-light-lavendar',
      )}>
      <View flex-4>
        <Text text13M textBlack>
          {'Material Number and Description'}
        </Text>
      </View>
      <View flex style={tw('ml-20')}>
        <Text text13M textBlack>
          {'Quantity'}
        </Text>
      </View>
      <View flex style={tw('pr-10 ml-5')}>
        <Text text13M textBlack>
          {'Sales Unit'}
        </Text>
      </View>
      <View flex>
        <Text text13M textBlack>
          {'Value'}
        </Text>
      </View>
    </View>
  );
};

export default memo(PCFreeGoodsListingHeaderComponent);
