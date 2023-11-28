import {TouchableOpacity} from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';
import {tw} from 'src/tw';
import Modal from 'src/components/Modal';

interface OfflineModalProps {
  onPressOk: any;
  visible: boolean;
  showFlightModeBtn: boolean;
  showNetInfoText: boolean;
}

const OfflineModal = (props: OfflineModalProps) => {
  const {visible, onPressOk, showFlightModeBtn, showNetInfoText} = props;
  return (
    <Modal
      visible={visible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} paddingH-v4 paddingV-v6>
          <Text text18BO textBlack center>
            {showFlightModeBtn
              ? `You're Offline! \n Turn flight mode off`
              : `You're Offline`}
          </Text>
          <images.OfflineIcon style={tw('self-center my-8')} />
          {showNetInfoText && (
            <Text text13R textBlack center>
              Enable wifi/mobile data to access this{'\n'}information
            </Text>
          )}

          <TouchableOpacity
            onPress={onPressOk}
            style={tw(
              'bg-light-darkBlue justify-center items-center rounded-md w-64 mt-6',
            )}>
            <Text text13R white marginV-v2>
              OK
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={onPressOk}
            style={tw(' justify-center items-center rounded-md w-64 mt-12px')}>
            <Text text13R grey2 marginV-v2>
              Cancel
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

export default OfflineModal;
