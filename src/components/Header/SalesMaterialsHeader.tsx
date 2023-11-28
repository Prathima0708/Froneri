import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {useNavigation} from '@react-navigation/native';
import {images} from 'src/assets/Images';
import {TouchableOpacity} from 'react-native';

const SalesMaterialsHeader = () => {
  const navigation = useNavigation();

  const handleDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View centerH style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleDrawer}>
          <images.HamburgerIcon />
        </TouchableOpacity>
        <Text text26 textBlack marginT-v1 style={tw('ml-3')}>
          Sales Materials
        </Text>
      </View>
      <View center></View>
    </View>
  );
};

export default SalesMaterialsHeader;
