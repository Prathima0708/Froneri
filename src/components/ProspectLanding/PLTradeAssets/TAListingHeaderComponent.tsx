import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { memo } from 'react';
import { tw } from 'src/tw';

const TAListingHeaderComponent = () => {
  return (
    <View
      paddingH-v4
      row
      centerV
      paddingT-v1
      style={tw(
        'rounded-t-md bg-light-white border-default border-light-lavendar',
      )}>
      <View flex marginR-v4>
        <Text text13M textBlack>
          {'TA Loan Number'}
        </Text>
      </View>
      <View flex style={tw('items-center')}>
        <Text text13M textBlack>
          {'TA Wish'}
        </Text>
      </View>
      <View flex style={tw('items-center')}>
        <Text text13M textBlack>
          {'TA Take Over'}
        </Text>
      </View>
      <View flex style={tw('items-center')}>
        <Text text13M textBlack>
          {'Created By'}
        </Text>
      </View>
      <View flex style={tw('items-center')}>
        <Text text13M textBlack>
          {'Created Date'}
        </Text>
      </View>
      <View flex style={tw('items-center')}>
        <Text text13M textBlack>
          {'Status'}
        </Text>
      </View>
    </View>
  );
};

export default memo(TAListingHeaderComponent);
