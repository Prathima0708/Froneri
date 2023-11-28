import View from 'src/components/View';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import React from 'react';
import Modal from 'src/components/Modal';
import { ScrollView, TouchableOpacity } from 'react-native';
import PCModalContentComponent from './PCModalContentComponent';
import Text from 'src/components/Text';

interface NotesModalProps {
  isClaimsModalVisible: boolean;
  handleBack: any;
  item: any;
  handleInputChange: any;
  errorMessages: any;
  isEditable: boolean;
}

const PCModal = (props: NotesModalProps) => {
  const {
    isClaimsModalVisible,
    handleBack,
    item,
    handleInputChange,
    errorMessages,
    isEditable,
  } = props;

  const onBackPress = () => {
    handleBack();
  };

  return (
    <Modal
      visible={isClaimsModalVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View bg-white padding-v4 margin-v3 style={[tw('flex-1 rounded-md')]}>
        <View centerH marginB-v3 style={tw('flex-row justify-between')}>
          <Text text26M textBlack>
            Claim, Customer and Sales Rep Data
          </Text>
          <TouchableOpacity
            style={tw('border-default rounded-md border-light-lavendar')}
            onPress={onBackPress}>
            <images.CloseIcon />
          </TouchableOpacity>
        </View>
        <ScrollView marginT-v2>
          <PCModalContentComponent
            item={item}
            handleInputChange={handleInputChange}
            errorMessages={errorMessages}
            isEditable={isEditable}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PCModal;
