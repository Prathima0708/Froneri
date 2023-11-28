import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { memo } from 'react';
import { tw } from 'src/tw';

interface TAWishListingHeaderComponentProps {
  isEditable: boolean;
}

const TAWishListingHeaderComponent = (props: TAWishListingHeaderComponentProps) => {
  const { isEditable } = props;

  return (
    <View
      paddingH-v4
      row
      centerV
      paddingV-v1
      style={tw(
        'rounded-t-md bg-light-white border-default border-light-lavendar',
      )}>
      <View flex-2>
        <Text text13M textBlack>
          {'TA Description'}
        </Text>
      </View>
      <View flex-2 style={tw('ml-2')}>
        <Text text13M textBlack>
          {'Material Number'}
        </Text>
      </View>
      <View flex style={tw('ml-5')}>
        <Text text13M textBlack>
          {'Design'}
        </Text>
      </View>
      <View flex-2 style={tw('items-end mr-5')}>
        <Text text13M textBlack>
          {'Quantity'}
        </Text>
      </View>
      <View flex-2 style={tw('items-end mr-2')}>
        <Text text13M textBlack>
          {'Expected Turnover'}
        </Text>
      </View>
      <View flex-2 style={tw('items-end')}>
        <Text text13M textBlack>
          {'Price'}
        </Text>
      </View>
      {isEditable && <View flex />}
    </View>
  );
};

export default memo(TAWishListingHeaderComponent);
