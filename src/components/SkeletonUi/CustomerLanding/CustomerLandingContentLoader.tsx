import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import View from 'src/components/View';
import {tw} from 'src/tw';

const CustomerLandingContentLoader = () => {
  return (
    <View>
      <SkeletonView
        showContent={false}
        times={1}
        height={27}
        width={100}
        borderRadius={2}
      />
      <View row centerV marginT-v2>
        <SkeletonView
          showContent={false}
          times={5}
          height={19}
          width={400}
          borderRadius={2}
          style={tw('mt-4')}
        />
      </View>
    </View>
  );
};

export default CustomerLandingContentLoader;
