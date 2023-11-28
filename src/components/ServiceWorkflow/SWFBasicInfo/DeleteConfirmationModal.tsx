import { TouchableOpacity } from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import Modal from 'src/components/Modal';

interface DeleteConfirmationProps {
  onDeletePress: () => void;
  onCancelPress: () => void;
  visible: boolean;
  title?: string;
  subTitle?: string;
}

const DeleteConfirmationModal = (props: DeleteConfirmationProps) => {
  const { onCancelPress, onDeletePress, visible, title, subTitle } = props;
  return (
    <Modal
      visible={visible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} padding-v4>
          <Text text18BO textBlack center>
            {title ? title : 'Delete'}
          </Text>
          <images.DustBinIcon style={tw('self-center my-8')} />
          <Text text13R textBlack center style={tw('w-64')}>
            {subTitle ? subTitle : 'Are you sure you want to delete?'}
          </Text>
          <TouchableOpacity
            onPress={onDeletePress}
            style={tw(
              'bg-light-red1 justify-center items-center rounded-md w-64 mt-6',
            )}>
            <Text text13R white marginV-v2>
              msg.createprospect.delete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancelPress}
            style={tw(' justify-center items-center rounded-md w-64 mt-12px')}>
            <Text text13R grey2 marginV-v2>
              btn.general.cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;
