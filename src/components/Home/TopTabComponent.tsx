import { StyleSheet } from 'react-native';
import React, { FunctionComponent } from 'react';
import { TouchableOpacity } from 'react-native-ui-lib';
import Text from 'src/components/Text';
import View from 'src/components/View';
import { tw } from 'src/tw';

interface TopTabComponentProps {
  Icon: FunctionComponent;
  title: string;
  active: boolean;
  value: number;
  style?: Object;
  handleVisitStatus: Function;
}

const TopTabComponent = (props: TopTabComponentProps) => {
  const { Icon, title, active, value, style, handleVisitStatus } = props;

  const handleTopVisitStatus = () => {
    // title -> open or paused or missed or completed status
    handleVisitStatus && handleVisitStatus(title);
  };

  return (
    <TouchableOpacity
      paddingB-v4
      row
      centerV
      centerH
      marginR-v5
      style={[
        tw(
          `border-light-darkBlue ${active ? 'border-b-2' : 'border-b-0'
          } relative`,
        ),
        {
          ...style,
          top: 2,
        },
      ]}
      onPress={handleTopVisitStatus}>
      <Icon />
      <Text
        text13M
        marginL-v1
        style={tw(
          `${active ? 'text-light-textBlack' : 'text-light-textLight'}`,
        )}>
        {title}
      </Text>
      <View
        marginL-12
        br60
        bg-offWhite
        paddingH-v2
        paddingV-1
        style={tw('border-default border-light-quartz')}>
        <Text textBlack text13R>
          {String(value)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TopTabComponent;