import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';
import {tw} from 'src/tw';

const OtherProductListingHeader = () => {
  return (
    <View paddingH-v3 row centerV marginV-v06>
      <View width={310} style={tw('mr-50px')}>
        <Text text13M textBlack>
          Material Number and Description*
        </Text>
      </View>
      <View width={160} style={tw('mr-50px')}>
        <Text text13M textBlack>
          Product Group
        </Text>
      </View>
      <View width={90} style={tw('mr-50px')}>
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

export default memo(OtherProductListingHeader);
