import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import View from 'src/components/View';
import {tw} from 'src/tw';

const LeftMenuLoader = () => {
  return (
    <View flex bg-white marginH-v2 paddingV-v4 br40 marginB-v2 spread>
      <View center padding-v2>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          borderRadius={6}
        />
        <SkeletonView
          style={tw('mt-1')}
          showContent={false}
          times={1}
          height={15}
          width={70}
        />
      </View>
      <View center>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          borderRadius={6}
        />
        <SkeletonView
          style={tw('mt-1')}
          showContent={false}
          times={1}
          height={15}
          width={70}
        />
      </View>
      <View center>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          borderRadius={6}
        />
        <SkeletonView
          style={tw('mt-1')}
          showContent={false}
          times={1}
          height={15}
          width={70}
        />
      </View>
      <View center>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          borderRadius={6}
        />
        <SkeletonView
          style={tw('mt-1')}
          showContent={false}
          times={1}
          height={15}
          width={70}
        />
      </View>
      <View center>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          borderRadius={6}
        />
        <SkeletonView
          style={tw('mt-1')}
          showContent={false}
          times={1}
          height={15}
          width={70}
        />
      </View>
      <View center>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          borderRadius={6}
        />
        <SkeletonView
          style={tw('mt-1')}
          showContent={false}
          times={1}
          height={15}
          width={70}
        />
      </View>
      <View center>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          borderRadius={6}
        />
        <SkeletonView
          style={tw('mt-1')}
          showContent={false}
          times={1}
          height={15}
          width={70}
        />
      </View>
    </View>
  );
};

export default LeftMenuLoader;
