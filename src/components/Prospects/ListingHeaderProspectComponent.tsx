import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { memo } from 'react';

const ListingHeaderProspectComponent = () => {
  return (
    <View paddingH-v4 row centerV marginV-v06>
      <View flex-3 marginR-v4>
        <Text text13M textBlack>
          label.general.name
        </Text>
      </View>
      <View flex-2 marginR-v4>
        <Text text13M textBlack>
          label.general.status
        </Text>
      </View>
      <View flex-3 marginR-v4>
        <Text text13M textBlack>
          label.general.address
        </Text>
      </View>
      <View flex marginR-v4>
        <Text text13M textBlack>
          label.general.prospect_no
        </Text>
      </View>
      <View flex-2>
        <Text text13M textBlack>
          label.prospectlisting.industry_code
        </Text>
      </View>
    </View>
  );
};

export default memo(ListingHeaderProspectComponent);
