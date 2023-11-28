import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';

const TasksHeaderComponent = () => {
  return (
    <View>
      <View paddingH-v4 row centerV marginV-v06>
        <View flex-1 marginR-v6>
          <Text text13M textBlack>
            Description
          </Text>
        </View>
        <View marginR-v6>
          <Text text13M textBlack>
            Action
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(TasksHeaderComponent);
