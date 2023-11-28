import React from 'react';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import Text from 'src/components/Text';
import View from 'src/components/View';

import { images } from 'src/assets/Images';
import { toast } from 'src/utils/Util';
import { tw } from 'src/tw';

interface CopyTextComponentProps {
    text: string;
    onTextPress?: any;
    iconStyle?: any;
    viewStyle?: any;
    [key: string]: any;
}

const CopyTextComponent = (props: CopyTextComponentProps) => {
    const { text, onTextPress, iconStyle, viewStyle, ...textProps } = props;

    const copyText = () => {
        Clipboard.setString(text.trim());
        toast.info({
            message: "Copied to clipboard"
        })
    }

    return (
        <View row {...viewStyle}>
            <TouchableOpacity onPress={onTextPress} disabled={!onTextPress}>
                <Text {...textProps}>
                    {text ? text.trim() : ''}
                </Text>
            </TouchableOpacity>
            <View {...iconStyle}>
                {text && text !== '-' && text !== '--' &&
                    <TouchableOpacity onPress={copyText} style={tw('ml-2-1')} hitSlop={{
                        top: 8,
                        bottom: 8,
                        left: 8,
                        right: 8
                    }}>
                        <images.TextCopyIcon />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};

export default CopyTextComponent;
