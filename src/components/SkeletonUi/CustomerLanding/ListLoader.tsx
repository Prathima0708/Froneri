import React from 'react';
import {Dimensions} from 'react-native';
import {SkeletonView} from 'react-native-ui-lib';
import Card from 'src/components/Card';
import View from 'src/components/View';
import {tw} from 'src/tw';

const contentWidth = (Dimensions.get('window').width / 100) * 85;
const contentHeight = (Dimensions.get('window').height / 100) * 9;

const ListLoader = () => {
  return (
    <Card centerH padding-v4 flex-1 marginR-v2 marginB-v2>
      <View flex-1>
        <SkeletonView
          height={contentHeight}
          width={contentWidth}
          times={7}
          style={tw('mt-2')}
          borderRadius={12}
        />
      </View>
    </Card>
  );
};

export default ListLoader;
