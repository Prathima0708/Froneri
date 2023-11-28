import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { memo } from 'react';

interface SWListingHeaderComponentProps {
  fromCLP?: boolean;
}

const SWListingHeaderComponent = (props: SWListingHeaderComponentProps) => {
  const { fromCLP = false } = props;

  return (
    <View paddingH-v4 row centerV marginV-v06>
      {!fromCLP && <View flex-2 marginR-v4>
        <Text text13M textBlack>
          Name
        </Text>
      </View>}
      <View flex-2 marginR-v4>
        <Text text13M textBlack>
          Request Type
        </Text>
      </View>
      <View flex-2 marginR-v4>
        <Text text13M textBlack>
          Description
        </Text>
      </View>
      <View flex-2 row>
        <View flex-1 marginR-v4>
          <Text text13M textBlack>
            Requested Date
          </Text>
        </View>
        <View flex-1>
          <Text text13M textBlack>
            Status
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(SWListingHeaderComponent);
