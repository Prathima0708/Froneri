import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import View from 'src/components/View';
import {tw} from 'src/tw';

const CustomerLandingHeaderLoader = () => {
  return (
    <View row centerV marginB-v2 marginH-v2 br40>
      <SkeletonView
        showContent={false}
        times={1}
        height={36}
        width={36}
        style={tw('mr-10')}
        borderRadius={6}
      />
      <SkeletonView
        showContent={false}
        times={1}
        height={36}
        width={36}
        style={tw('mr-1')}
        borderRadius={6}
      />
      <SkeletonView
        showContent={false}
        times={1}
        height={27}
        width={137}
        style={tw('mr-5')}
        borderRadius={6}
      />
      <SkeletonView
        showContent={false}
        times={1}
        height={32}
        width={114}
        borderRadius={6}
      />
    </View>
  );
};

export default CustomerLandingHeaderLoader;
