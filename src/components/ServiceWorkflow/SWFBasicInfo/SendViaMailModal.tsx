import {TouchableOpacity} from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import Modal from 'src/components/Modal';

interface SendViaEmailProps {
  onSubmit: any;
  visible: boolean;
  title?: string;
  buttonName?: string;
}

const SendViaEmailModal = (props: SendViaEmailProps) => {
  const {onSubmit, visible, title, buttonName} = props;
  return (
    <Modal
      visible={visible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View flex center>
        <View bg-white br40 style={tw('w-305px self-center')} padding-v4>
          <Text text18BO textBlack center>
            {title}
          </Text>
          <TouchableOpacity
            onPress={onSubmit}
            style={tw(
              'bg-light-darkBlue justify-center items-center rounded-md w-64 mt-6',
            )}>
            <Text text13R white marginV-v2>
              {buttonName}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SendViaEmailModal;
