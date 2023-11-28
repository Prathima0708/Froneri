import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';
import {tw} from 'src/tw';

const PVNotesListingHeaderComponent = () => {
  return (
    <View paddingH-v4 row centerV marginV-v06>
      <View flex-8 marginR-v4>
        <Text text13M textBlack>
          {'Note'}
        </Text>
      </View>
      <View flex-2 marginR-v4 style={tw('items-center')}>
        <Text text13M textBlack style={tw('pl-2')}>
          {'Employee Name'}
        </Text>
      </View>
      <View flex style={tw('items-end')}>
        <Text text13M textBlack>
          {'Created On'}
        </Text>
      </View>
    </View>
  );
};

export default memo(PVNotesListingHeaderComponent);
