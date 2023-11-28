import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { memo } from 'react';

const ListingHeaderPCModalComponent = () => {
  return (
    <View paddingH-v4 row centerV marginV-v06>
      <View flex-2 marginR-v4>
        <Text text13M textBlack>
          Territory
        </Text>
      </View>
      <View flex-3 marginR-v4>
        <Text text13M textBlack>
          Sales Representative
        </Text>
      </View>
      <View flex-2 marginR-v4>
        <Text text13M textBlack>
          Phone Number
        </Text>
      </View>
      <View flex-2>
        <Text text13M textBlack>
          Partner Function
        </Text>
      </View>
    </View>
  );
};

export default memo(ListingHeaderPCModalComponent);
