import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';

const DelegationListingHeader = () => {
  return (
    <View>
      <View paddingH-v4 row centerV marginV-v06>
        <View flex-2 marginR-v4>
          <Text text12M textBlack>
            Primary Employee Name
          </Text>
        </View>
        <View flex-2 marginR-v4>
          <Text text12M textBlack>
            Secondary Employee Name
          </Text>
        </View>
        <View flex-1 marginR-v4>
          <Text text12M textBlack>
            Valid From
          </Text>
        </View>
        <View flex-1>
          <Text text12M textBlack>
            Valid To
          </Text>
        </View>
        <View flex-4>
          <Text text12M textBlack>
            Comments
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(DelegationListingHeader);
