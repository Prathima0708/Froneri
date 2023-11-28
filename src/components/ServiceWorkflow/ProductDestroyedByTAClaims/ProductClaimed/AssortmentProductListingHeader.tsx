import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';
import {tw} from 'src/tw';

const AssortmentProductListingHeader = () => {
  return (
    <View paddingH-v2 row centerV marginV-v06>
      <View width={306} style={tw('mr-50px')}>
        <Text text13M textBlack>
          Material Number and Description*
        </Text>
      </View>
      <View width={159} style={tw('mr-50px')}>
        <Text text13M textBlack>
          Last 52 Weeks
        </Text>
      </View>
      <View width={84} style={tw('mr-50px')}>
        <Text text13M textBlack>
          Quantity*
        </Text>
      </View>
      <View row>
        <View width={159} style={tw('mr-50px')}>
          <Text text13M textBlack>
            Sales Unit*
          </Text>
        </View>
        <View width={159} style={tw('mr-50px')}>
          <Text text13M textBlack>
            Value
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(AssortmentProductListingHeader);
