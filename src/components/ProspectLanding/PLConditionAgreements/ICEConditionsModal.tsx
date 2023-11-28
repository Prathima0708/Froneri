import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native';
import { RichEditor } from "react-native-pell-rich-editor";

import Modal from 'src/components/Modal';
import View from 'src/components/View';
import Text from 'src/components/Text';

import { images } from 'src/assets/Images';

interface ICEConditionsModalProps {
  isVisible: boolean
  disabled: boolean
  richTextRef: any
  onChange: any
  htmlContent: string
  onCancelPress: any
}

const ICEConditionsModal = (props: ICEConditionsModalProps) => {
  const { isVisible, disabled, richTextRef, onChange, htmlContent, onCancelPress } = props

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}
    >
      <View flex-1 padding-v4 bg-white>
        <ScrollView>
          <View row spread centerV>
            <Text text18BO textBlack>
              Agreement
            </Text>
            <TouchableOpacity onPress={onCancelPress}>
              <images.CancelIcon />
            </TouchableOpacity>
          </View>
          <RichEditor
            ref={richTextRef}
            onChange={onChange}
            initialContentHTML={htmlContent}
            disabled={disabled}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

export default ICEConditionsModal