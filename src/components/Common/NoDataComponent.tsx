import View from 'src/components/View';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';
import React from 'react';

interface NoDataProps {
  title?: string;
  subTitle?: string;
}
const NoDataComponent = (props: NoDataProps) => {
  const {title, subTitle} = props;
  return (
    <View flex center>
      <Text textBlack text18M>
        {title ? title : 'No data'}
      </Text>
      <Text marginT-v1 marginB-v4 textBlack text13R>
        {subTitle ? subTitle : ''}
      </Text>
      <images.NoDataIcon />
    </View>
  );
};

export default NoDataComponent;
