import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import React from 'react';
import Card from 'src/components/Card';
import { TouchableOpacity } from 'react-native';

interface TaskServiceTASalesComponentProps {
  title: string;
  count: number;
  onRightIconPress: any;
}

const TaskServiceTASalesComponent = (
  props: TaskServiceTASalesComponentProps,
) => {
  const { title, count, onRightIconPress } = props;
  return (
    <Card marginB-v2 row centerV paddingH-v4 paddingV-v3 spread>
      <Text text18M textBlack marginT-v1>
        {title}
      </Text>
      <View row centerV>
        <View marginR-v8 bg-lightGrey br20 paddingV-v02 paddingH-v1>
          <Text text13R textBlack>
            {count ? `${count}` : `0`}
          </Text>
        </View>
        <TouchableOpacity onPress={onRightIconPress}>
          <images.DefaultRightArrowIcon />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default TaskServiceTASalesComponent;
