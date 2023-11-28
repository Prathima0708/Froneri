import React from 'react';
import { Modal as UIModal } from 'react-native-ui-lib';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../../App';

const Modal = (props: any) => {
  return (
    <UIModal
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}
      {...props}>
      {props.children}
      <Toast config={toastConfig} />
    </UIModal>
  );
};

export default Modal;
