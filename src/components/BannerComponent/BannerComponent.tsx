import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { TouchableOpacity } from 'react-native';

interface BannerComponentProps {
  message: string;
  handleSync: () => void;
}
const BannerComponent = (props: BannerComponentProps) => {
  const { message, handleSync } = props;
  return (
    <View
      center
      row
      paddingV-v02
      style={[tw('relative bg-light-lightBlue3'), { bottom: 10 }]}>
      <Text text13R textBlack>
        {props.message}{' '}
      </Text>
      <TouchableOpacity onPress={handleSync} activeOpacity={0.9}>
        <Text text13R darkBlue2 style={{ textDecorationLine: 'underline' }}>
          Sync Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BannerComponent;
