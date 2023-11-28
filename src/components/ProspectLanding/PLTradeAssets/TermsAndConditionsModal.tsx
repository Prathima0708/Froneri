import React from 'react'
import { Dimensions, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';

import Modal from 'src/components/Modal';
import Text from 'src/components/Text';
import View from 'src/components/View';

import { images } from 'src/assets/Images';

interface TermsAndConditionsModalProps {
    isVisible: boolean;
    onCancelPress: any;
    filePath: string
}

const TermsAndConditionsModal = (props: TermsAndConditionsModalProps) => {
    const { isVisible, onCancelPress, filePath } = props

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            enableModalBlur={false}
            overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}
        >
            <View flex-1 padding-v4 bg-white>
                <View row spread centerV>
                    <Text text18BO textBlack>
                        {'Terms & Conditions'}
                    </Text>
                    <TouchableOpacity onPress={onCancelPress}>
                        <images.CancelIcon />
                    </TouchableOpacity>
                </View>
                {filePath ? <Pdf
                    source={{ uri: `bundle-assets://pdfs/${filePath}`, cache: true }}
                    style={{
                        flex: 1,
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                    }} /> :
                    <View flex center>
                        <Text text18BO textBlack>
                            No data
                        </Text>
                    </View>}
            </View>
        </Modal>
    );
}

export default TermsAndConditionsModal