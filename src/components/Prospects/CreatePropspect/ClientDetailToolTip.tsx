import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import React, { useState } from 'react';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

const ClientDetailToolTip = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  return (
    <Tooltip
      isVisible={infoVisible}
      content={
        <View centerV style={tw('w-56')}>
          <Text text13R white>
            msg.createprospect.get_info_details
          </Text>
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

export default ClientDetailToolTip;
