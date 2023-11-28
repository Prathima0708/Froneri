import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import React from 'react';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';

interface CLProductStatisticsPaginationComponentProps {
    totalCount: number;
    start: number;
    end: number;
    isLeftActive: boolean;
    isRightActive: boolean;
    onLeftIconPress: any;
    onRightIconPress: any;
}

const CLProductStatisticsPaginationComponent = (props: CLProductStatisticsPaginationComponentProps) => {
    const { totalCount, start, end, isLeftActive, isRightActive, onLeftIconPress, onRightIconPress } = props;

    const paginationTitle = `Showing ${start} - ${end} results of ${totalCount}`;

    return (
        <View row centerV spread padding-v2 >
            <Text text13R grey2>
                {paginationTitle}
            </Text>
            <View row centerV>
                <View row centerV>
                    <TouchableOpacity style={tw('mr-3')} disabled={!isLeftActive} onPress={onLeftIconPress}>
                        {isLeftActive ? <images.ActiveLeftIcon /> : <images.LeftIcon />}
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!isRightActive} onPress={onRightIconPress}>
                        {isRightActive ? <images.ActiveRightIcon /> : <images.RightIcon />}
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
};

export default CLProductStatisticsPaginationComponent;
