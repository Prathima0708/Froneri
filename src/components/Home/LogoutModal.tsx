import { TouchableOpacity } from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import Modal from 'src/components/Modal';

interface LogoutModalProps {
  onPressLogout: any;
  onPressCancel: any;
  isModalVisible: boolean;
}

const LogoutModal = (props: LogoutModalProps) => {
  const { onPressCancel, onPressLogout, isModalVisible } = props;

  return (
    <Modal visible={isModalVisible}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} padding-v4>
          <Text text18BO textBlack center marginT-v2 style={tw('w-64')}>
            msg.home.want_to_logout
          </Text>
          <TouchableOpacity
            onPress={onPressLogout}
            style={tw(
              'bg-light-red1 justify-center items-center rounded-md w-64 mt-6',
            )}>
            <Text text13R white marginV-v2>
              btn.home.yes_logout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressCancel}
            style={tw(' justify-center items-center rounded-md w-64 mt-12px')}>
            <Text text13R grey2 marginV-v2>
              btn.home.no_cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
