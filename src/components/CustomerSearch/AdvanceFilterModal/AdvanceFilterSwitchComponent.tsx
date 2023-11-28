import React, {useState} from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import Switch from 'src/components/Switch';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {tw} from 'src/tw';

interface AdvanceFilterSwitchComponentProps {
  title: string;
  isEnabled: boolean;
  handleToggleSwitch: any;
}
const AdvanceFilterSwitchComponent = (
  props: AdvanceFilterSwitchComponentProps,
) => {
  const {isEnabled, handleToggleSwitch} = props;
  // const [isEnabled, setIsEnabled] = useState(false);
  return (
    <View row centerV marginT-v4>
      <Text text13R textBlack marginR-v4 style={tw('w-136px')}>
        {props.title}
      </Text>
      <Switch
        offColor={ColourPalette.light.greyCloud}
        onColor={ColourPalette.light.darkBlue}
        thumbColor={ColourPalette.light.white}
        onValueChange={handleToggleSwitch}
        value={isEnabled}
        style={{marginRight: 45}}
      />
    </View>
  );
};

export default AdvanceFilterSwitchComponent;
