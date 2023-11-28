import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {tw} from 'src/tw';

const PLCAListingHeaderComponent = () => {
  return (
    <View
      row
      centerV
      paddingV-v06
      paddingH-v4
      style={tw('border-default border-light-lavendar rounded-t-md')}>
      <Text flex-2 text13M textBlack marginR-v5>
        Condition Agreement Number
      </Text>
      <Text flex-2 text13M textBlack marginR-v5>
        Type
      </Text>
      <Text flex text13M textBlack marginR-v5>
        Created By
      </Text>
      <Text flex text13M textBlack marginR-v5>
        Created Date
      </Text>
      <Text flex text13M textBlack>
        Status
      </Text>
    </View>
  );
};

export default PLCAListingHeaderComponent;
