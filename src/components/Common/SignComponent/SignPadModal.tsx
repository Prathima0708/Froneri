import { TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';

import View from 'src/components/View';
import Text from 'src/components/Text';
import Modal from 'src/components/Modal';
import InputText from 'src/components/InputText';
import { BUTTON_TYPE } from 'src/components/Button/ButtonType';

import { tw } from 'src/tw';

import { images } from 'src/assets/Images';

import ACLService from 'src/services/ACLService';

interface SignPadModalProps {
  isVisible: boolean;
  handleCancel: any;
  handleSaveSign: any;
  title: string;
  accountHolderName?: string;
}

const SignPadModal = (props: SignPadModalProps) => {
  const { isVisible, handleCancel, handleSaveSign, title, accountHolderName } =
    props;
  const [isActive, setIsActive] = useState(false);
  const [signeeName, setSigneeName] = useState('');
  const [sign, setSign] = useState('');

  useEffect(() => {
    handleSigneeName('');
    setIsActive(false);
    setSign('');
    const initialSigneeName = accountHolderName || '';
    setSigneeName(initialSigneeName)
  }, [isVisible]);

  const style = `.m-signature-pad {
    box-shadow: none; border: none;
    margin-left: 0px;
    margin-top: 0px;
  }
   .m-signature-pad--body
    canvas {
      background-color: rgba(0, 0, 0, 0);
    }
  .m-signature-pad--body {border: none}
  .m-signature-pad--footer {display: none; margin: 0px;}
  body,html {
     width: 100%;
     height: 100%;
  }
`;

  const handleSigneeName = (text: string) => {
    setSigneeName(text);
  };

  const handleSave = () => {
    handleSaveSign(signeeName, sign);
    handleCancel();
  };

  const ref = useRef<SignatureViewRef>(null);

  const reportFormDirty = () => {
    if (ACLService.isRouteGuardApplicable()) {
      ACLService.saveAclGuardStatusToStorage(true);
    }
  };

  const handleSignature = (signature: string) => {
    setSign(signature);
    setIsActive(true);
    reportFormDirty();
  };

  const handleClear = () => {
    ref.current?.clearSignature();
    setIsActive(false);
  };

  const handleEnd = () => {
    ref.current?.readSignature();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View center style={tw('h-full')}>
        <View br40 bg-white padding-v4 style={tw('w-1/2')}>
          <View center>
            <Text text18M textBlack>
              {title}
            </Text>
            <TouchableOpacity
              onPress={handleCancel}
              style={tw('absolute right-0')}>
              <images.CancelIcon />
            </TouchableOpacity>
          </View>
          <View marginT-v5>
            <InputText
              title="Name of Signee"
              value={signeeName}
              onChangeText={handleSigneeName}
            />
          </View>
          <View
            marginT-v5
            style={tw(
              'border-default rounded-md border-light-lavendar h-195px',
            )}>
            <SignatureScreen
              ref={ref}
              onEnd={handleEnd}
              onOK={handleSignature}
              descriptionText="Sign"
              webStyle={style}
            />
          </View>
          <View row centerV spread marginT-v2>
            <TouchableOpacity
              onPress={handleClear}
              disabled={!isActive}
              style={tw('p-2 rounded-md')}>
              <Text
                text13R
                style={tw(
                  `${isActive ? 'text-light-textBlack' : 'text-light-grey2'}`,
                )}>
                Clear Sign
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!isActive}
              style={tw(
                `${isActive
                  ? BUTTON_TYPE.PRIMARY_ENABLED
                  : BUTTON_TYPE.PRIMARY_DISABLED
                } px-36px`,
              )}>
              <Text
                text13R
                style={tw(
                  `${isActive
                    ? BUTTON_TYPE.PRIMARY_ENABLED_LABEL
                    : BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                  }`,
                )}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SignPadModal;
