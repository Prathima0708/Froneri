import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import Image from 'src/components/Image';
import {TouchableOpacity} from 'react-native';
import TextError from 'src/components/TextError';
import {ColourPalette} from 'src/styles/config/ColoursStyles';

interface SignComponentProps {
  title?: string;
  handleSignPad: any;
  sign?: string;
  signeeName?: string;
  isEditable?: boolean;
  errorMsg?: string;
}
const SignComponent = (props: SignComponentProps) => {
  const {
    title,
    handleSignPad,
    sign,
    signeeName,
    errorMsg,
    isEditable = true,
  } = props;

  return (
    <View>
      <Text text13M textBlack>
        {title}
      </Text>
      <View row marginT-v1>
        <View
          flex
          br40
          center
          style={tw('border-default border-light-lavendar h-195px')}>
          {sign ? (
            <View center>
              <Image
                style={tw('w-195px h-16')}
                source={{
                  uri: sign,
                }}
              />
              <Text text13R textBlack>
                {signeeName}
              </Text>
            </View>
          ) : (
            <View center>
              <Text text13M textBlack marginB-v7>
                {'Capture Signature'}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[tw('px-10 py-2 absolute'), {bottom: 5}]}
            disabled={!isEditable}
            onPress={handleSignPad}>
            <Text
              text13R
              style={tw(
                `${isEditable ? 'text-light-darkBlue' : 'text-light-grey2'}`,
              )}>
              {sign ? 'Re-Capture' : 'Capture'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {errorMsg ? (
        <TextError
          errorMsg={errorMsg}
          errorStyleObj={{color: ColourPalette.light.red10}}
        />
      ) : null}
    </View>
  );
};

export default SignComponent;
