import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { TouchableOpacity } from 'react-native';

interface ApplyFilterComponentProps {
  onPressClearFilter: any;
  onPressApplyFilter: any;
}
const ApplyFilterComponent = (props: ApplyFilterComponentProps) => {
  return (
    <View row right padding-v3>
      <TouchableOpacity
        onPress={props.onPressClearFilter}
        style={tw('justify-center items-center rounded-md')}>
        <Text darkBlue marginV-v06 marginH-v7>
          label.general.clear_filter
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.onPressApplyFilter}
        style={tw('justify-center items-center bg-light-darkBlue rounded-md')}>
        <Text white marginV-v06 marginH-v7>
          label.general.apply_filter
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ApplyFilterComponent;
