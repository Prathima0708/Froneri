import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React, {useState} from 'react';
import {images} from 'src/assets/Images';
import {TouchableOpacity} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

const CLContactHistoryToolTip = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  return (
    <Tooltip
      isVisible={infoVisible}
      content={
        <View>
          <View row centerV>
            <View
              br40
              marginR-v2
              style={tw('border-l-4 border-light-darkBlue3')}>
              <Text></Text>
            </View>
            <Text text13R white>
              Present Confirmation Call
            </Text>
          </View>
          <View row centerV marginT-v2>
            <View br40 marginR-v2 style={tw('border-l-4 border-light-yellow2')}>
              <Text></Text>
            </View>
            <Text text13R white>
              Change in Delivery Date
            </Text>
          </View>
          <View row centerV marginT-v2>
            <View br40 marginR-v2 style={tw('border-l-4 border-light-green1')}>
              <Text></Text>
            </View>
            <Text text13R white>
              Visit
            </Text>
          </View>
        </View>
      }
      backgroundColor={'rgba(0,0,0,0)'}
      contentStyle={[tw('bg-light-black p-4 rounded-md')]}
      placement="bottom"
      showChildInTooltip={false}
      onClose={() => setInfoVisible(false)}>
      <TouchableOpacity onPress={() => setInfoVisible(!infoVisible)}>
        <images.InfoIcon />
      </TouchableOpacity>
    </Tooltip>
  );
};

export default CLContactHistoryToolTip;
