import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { useNavigation } from '@react-navigation/native';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import {
  pageNameCreateProspect,
} from 'src/routes/Routes';

interface ProspectHeaderProps {
}

const ProspectsHeader = (props: ProspectHeaderProps) => {
  const navigation = useNavigation<any>();

  const handleGoBack = () => {
    navigation.openDrawer();
  };

  const handleCustomerSearch = () => {
    navigation.navigate(pageNameCreateProspect as never, { screenType: 'Create' } as never);
  };

  return (
    <View centerH style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleGoBack}>
          <images.HamburgerIcon />
        </TouchableOpacity>
        <Text text26 textBlack marginT-v1 style={tw('ml-3')}>
          label.general.prospects
        </Text>
      </View>
      <View center>
        <TouchableOpacity
          style={tw(
            'bg-light-darkBlue rounded-md py-2 px-8 flex-row items-center ml-6',
          )}
          onPress={handleCustomerSearch}>
          <images.PlusIcon />
          <Text white text13R>
            {'  '}
          </Text>
          <Text white text13R>
            label.general.create
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProspectsHeader;
