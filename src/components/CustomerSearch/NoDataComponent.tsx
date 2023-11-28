import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';

const NoDataComponent = (props: any) => {
  return (
    <View flex center>
      <Text grey1 text12M marginB-v9>
        {'No Data Found'}
      </Text>

      {/* <images.NoDataIcon /> */}
    </View>
  );
};

export default NoDataComponent;
