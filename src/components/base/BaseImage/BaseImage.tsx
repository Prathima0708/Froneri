import React from 'react';
import {Image, ImageProps} from 'react-native-ui-lib';

const BaseImage: React.FC<ImageProps> = (props: ImageProps) => {
  return (
    <>
      <Image {...props}></Image>
    </>
  );
};

export default BaseImage;
