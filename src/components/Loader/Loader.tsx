import React from 'react';
import {LoaderScreen} from 'react-native-ui-lib';

interface LoaderProps {
  style: Object;
}
const Loader = (props: LoaderProps) => {
  const {style} = props;
  return <LoaderScreen containerStyle={style} {...props} />;
};

export default Loader;
