import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {Dimensions} from 'react-native';

const titleHeight = (Dimensions.get('window').height / 100) * 3.1;
const iconWidth = (Dimensions.get('window').width / 100) * 2.5;
const iconHeight = (Dimensions.get('window').height / 100) * 4;

const HeaderSkeleton = () => {
  return (
    <View marginB-v2 row spread>
      <View row centerV>
        <SkeletonView
          showContent={false}
          times={1}
          height={iconHeight}
          width={iconWidth}
          style={tw('mr-4')}
          borderRadius={6}
        />
        <SkeletonView showContent={false} times={1} height={titleHeight} />
      </View>
      <View row centerV>
        <SkeletonView
          showContent={false}
          times={1}
          height={12}
          width={37}
          style={tw('mr-3')}
        />
        <SkeletonView
          showContent={false}
          times={1}
          height={iconHeight}
          width={iconWidth}
          style={tw('mr-10')}
          borderRadius={6}
        />
        <SkeletonView
          showContent={false}
          times={1}
          height={iconHeight}
          width={iconWidth}
          borderRadius={6}
        />
      </View>
    </View>
  );
};

export default HeaderSkeleton;
