import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {useNavigation} from '@react-navigation/native';
import {images} from 'src/assets/Images';
import {TouchableOpacity} from 'react-native';
interface TasksHeaderProps {
  heading: string;
  subHeading: string;
  handleTaskNavigation: () => void;
}
const TasksHeader = (props: TasksHeaderProps) => {
  const navigation = useNavigation();
  const {heading, subHeading} = props;

  const handleBackBtn = () => {
    navigation.goBack();
  };

  return (
    <View centerH style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleBackBtn}>
          <images.LeftArrowIcon />
        </TouchableOpacity>
        <Text text26 textBlack marginT-v1 style={tw('ml-3')}>
          {heading}
        </Text>
        <TouchableOpacity onPress={props.handleTaskNavigation}>
          <Text text16 bold darkBlue marginT-v1 style={tw('ml-3')}>
            {subHeading}
          </Text>
        </TouchableOpacity>
      </View>
      <View center></View>
    </View>
  );
};

export default TasksHeader;
