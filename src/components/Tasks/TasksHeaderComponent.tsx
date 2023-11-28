import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {memo} from 'react';

interface TasksHeaderComponentProps {
  todaysTasks: boolean;
}

const TasksHeaderComponent = (props: TasksHeaderComponentProps) => {
  const {todaysTasks} = props;

  return (
    <View>
      <View paddingH-v4 row centerV marginV-v06>
        <View flex-2 marginR-v4>
          <Text text13M textBlack>
            Name
          </Text>
        </View>

        <View flex-4 marginR-v4>
          <Text text13M textBlack>
            Description
          </Text>
        </View>

        <View flex-3 row>
          <View flex-1 marginR-v4>
            <Text text13M textBlack>
              Valid From
            </Text>
          </View>
          <View flex-1 marginR-v4>
            <Text text13M textBlack>
              Valid To
            </Text>
          </View>
          <View flex-1>
            <Text text13M textBlack>
              Status
            </Text>
          </View>
        </View>
        <View marginL-v4 centerV></View>
      </View>
    </View>
  );
};

export default memo(TasksHeaderComponent);
