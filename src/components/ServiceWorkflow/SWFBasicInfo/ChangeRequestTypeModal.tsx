import {TouchableOpacity} from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import Modal from 'src/components/Modal';

interface ChangeRequestProps {
  visible: boolean;
  title?: string;
  subTitle?: string;
  onConfirmPress: any;
  onCancelPress: any;
}

const ChangeRequestTypeModal = (props: ChangeRequestProps) => {
  const {onConfirmPress, visible, title, subTitle, onCancelPress} = props;
  return (
    <Modal
      visible={visible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} padding-v4>
          <Text text18BO textBlack center>
            {title}
          </Text>
          <Text text13R textBlack center style={tw('mt-6px')}>
            {subTitle}
          </Text>
          <TouchableOpacity
            onPress={onConfirmPress}
            style={tw(
              'bg-light-darkBlue justify-center items-center rounded-md w-64 mt-6',
            )}>
            <Text text13R white marginV-v2>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancelPress}
            style={tw(' justify-center items-center rounded-md w-64 ')}>
            <Text text13R grey2 marginV-v2>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeRequestTypeModal;
