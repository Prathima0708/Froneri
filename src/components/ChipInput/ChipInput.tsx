import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {ChipsInput} from 'react-native-ui-lib';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';

interface ChipInputProps {
  header?: string;
  isEditable?: boolean;
  noBorders?: boolean;
  style?: any;
}

const ChipInput = (props: ChipInputProps) => {
  const {header, noBorders, isEditable, style} = props;
  return (
    <View>
      {header ? (
        <Text text13M textBlack>
          {header}
        </Text>
      ) : null}
      <View>
        <ChipsInput
          {...props}
          defaultChipProps={{
            backgroundColor: ColourPalette.light.lightBlue1,
            labelStyle: ColourPalette.light.textBlack,
            containerStyle: {borderRadius: 6, borderWidth: 0},
            dismissColor: ColourPalette.light.grey2,
          }}
        />
      </View>
    </View>
  );
};

export default ChipInput;
