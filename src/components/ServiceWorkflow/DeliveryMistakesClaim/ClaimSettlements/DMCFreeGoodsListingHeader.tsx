import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';
import {tw} from 'src/tw';

const DMCFreeGoodsListingHeader = () => {
  return (
    <View paddingH-v2 row centerV marginV-v06>
      <View width={569} style={tw('mr-12px')}>
        <Text text13M textBlack>
          Material Number and Description*
        </Text>
      </View>
      <View width={134} style={tw('mr-12px')}>
        <Text text13M textBlack>
          Quantity
        </Text>
      </View>
      <View width={134} style={tw('mr-12px')}>
        <Text text13M textBlack>
          Sales Unit
        </Text>
      </View>
      <View row>
        <View width={134} style={tw('mr-12px')}>
          <Text text13M textBlack>
            Value
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(DMCFreeGoodsListingHeader);
