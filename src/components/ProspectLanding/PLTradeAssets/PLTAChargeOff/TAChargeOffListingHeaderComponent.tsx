import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';
import {tw} from 'src/tw';

const TAChargeOffListingHeaderComponent = () => {
  return (
    <View
      paddingH-v4
      row
      centerV
      paddingV-v1
      style={tw(
        'rounded-t-md bg-light-white border-default border-light-lavendar',
      )}>
      <View flex-2 style={tw('items-start')}>
        <Text text13M textBlack>
          {'TA Description'}
        </Text>
      </View>
      <View flex style={tw('items-end ml-10')}>
        <Text text13M textBlack>
          {'Material Number'}
        </Text>
      </View>
      <View flex style={tw('items-end ml-4')}>
        <Text text13M textBlack>
          {'Serial Number'}
        </Text>
      </View>
      <View flex style={tw('items-center ml-8')}>
        <Text text13M textBlack>
          {'Status'}
        </Text>
      </View>
      <View flex-2 style={tw('items-end mr-3')}>
        <Text text13M textBlack>
          {'Residual Value'}
        </Text>
      </View>
      <View flex style={tw('items-end')}>
        <Text text13M textBlack>
          {'Construction Date'}
        </Text>
      </View>
    </View>
  );
};

export default memo(TAChargeOffListingHeaderComponent);
