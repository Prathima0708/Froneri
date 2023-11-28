import {TouchableOpacity} from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';
import {tw} from 'src/tw';
import Modal from 'src/components/Modal';

interface DeleteWarningProps {
  onSubmit: any;
  visible: boolean;
  title?: string;
  subTitle?: string;
}

const DeleteWarningModal = (props: DeleteWarningProps) => {
  const {onSubmit, visible, title, subTitle} = props;
  return (
    <Modal
      visible={visible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View flex center>
        <View bg-white br40 style={tw('w-305px self-center')} padding-v4>
          <Text text18BO textBlack center>
            {title ? title : 'Delete'}
          </Text>
          <images.WarningIcon style={tw('self-center my-8')} />
          <Text text13R textBlack center>
            {subTitle ? subTitle : 'Are you sure you want to delete'}
          </Text>
          <TouchableOpacity
            onPress={onSubmit}
            style={tw(
              'bg-light-red1 justify-center items-center rounded-md w-64 mt-6',
            )}>
            <Text text13R white marginV-v2>
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteWarningModal;
