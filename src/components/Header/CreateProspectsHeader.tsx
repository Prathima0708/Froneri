import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { useNavigation } from '@react-navigation/native';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';

const CreateProspectsHeader = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
    return true;
  };

  return (
    <View centerH style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleGoBack}>
          <images.DefaultLeftArrowIcon />
        </TouchableOpacity>
        <Text text26 textBlack marginT-v1 style={tw('ml-3')}>
          label.createprospect.create_new_prospect
        </Text>
      </View>
    </View>
  );
};

export default CreateProspectsHeader;
