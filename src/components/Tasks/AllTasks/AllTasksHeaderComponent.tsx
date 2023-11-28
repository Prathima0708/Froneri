import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';

const TasksHeaderComponent = () => {
  return (
    <View>
      <View paddingH-v4 row centerV marginV-v06>
        <View flex-2 marginR-v6>
          <Text text13M textBlack>
            Description
          </Text>
        </View>

        <View marginL-v4 flex-1 row>
          <View flex-1 marginR-v4>
            <Text text13M textBlack>
              Type
            </Text>
          </View>
          <View flex-1 marginR-v4>
            <Text text13M textBlack>
              Valid To
            </Text>
          </View>
          <View flex-1>
            <Text text13M textBlack>
              Valid From
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(TasksHeaderComponent);
