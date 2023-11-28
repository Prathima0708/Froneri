import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {Dimensions} from 'react-native';

const titleHeight = (Dimensions.get('window').height / 100) * 3.1;
const iconWidth = (Dimensions.get('window').width / 100) * 2.5;
const iconHeight = (Dimensions.get('window').height / 100) * 4;

const VisitsHeaderSkeleton = () => {
  return (
    <View marginB-v2 row spread>
      <View row centerV>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={36}
          style={tw('mr-4 ml-3')}
          borderRadius={6}
        />
        <SkeletonView showContent={false} times={1} height={36} width={67} />
      </View>
      <View row centerV>
        <SkeletonView
          showContent={false}
          times={1}
          height={36}
          width={132}
          style={tw('mr-3')}
        />
      </View>
    </View>
  );
};

export default VisitsHeaderSkeleton;
