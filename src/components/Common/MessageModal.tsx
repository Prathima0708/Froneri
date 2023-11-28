import { TouchableOpacity } from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import Modal from 'src/components/Modal';

interface MessageModalProps {
  title: string;
  subTitle?: string;
  isVisible: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  handleOnPressSuccess?: any;
  handleOnPressCancel?: any;
  isWarningMessage?: boolean;
  icon?: any;
}

const MessageModal = (props: MessageModalProps) => {
  const {
    isVisible,
    title,
    subTitle,
    handleOnPressSuccess,
    handleOnPressCancel,
    primaryButtonText,
    secondaryButtonText,
    isWarningMessage,
    icon,
  } = props;
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} padding-v4>
          <Text text18BO textBlack center style={tw("w-64")}>
            {title ? title : ''}
          </Text>
          {icon ? (
            <View style={tw('self-center mt-8 mb-30px')}>{icon}</View>
          ) : null}
          {subTitle ? (
            <Text text13R textBlack center marginT-v1 style={tw("w-64")}>
              {subTitle ? subTitle : ''}
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={handleOnPressSuccess}
            style={tw(
              `${isWarningMessage ? 'bg-light-red1' : 'bg-light-darkBlue'} ${secondaryButtonText ? '' : 'mb-3'
              } justify-center items-center rounded-md w-64 mt-6`,
            )}>
            <Text text13R white marginV-v2>
              {primaryButtonText ? primaryButtonText : 'label.general.ok'}
            </Text>
          </TouchableOpacity>
          {secondaryButtonText ? (
            <TouchableOpacity
              onPress={handleOnPressCancel}
              style={tw(
                ' justify-center items-center rounded-md w-64 mt-12px',
              )}>
              <Text text13R grey2 marginV-v2>
                {secondaryButtonText}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default MessageModal;
