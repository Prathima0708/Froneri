import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { memo } from 'react';
import { tw } from 'src/tw';

interface PillsComponentProps {
  item: {
    title?: string;
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
  };
}
const PillsComponent = (props: PillsComponentProps) => {
  const { item } = props;
  const title = item.title ? item.title : '';
  const bgColor = item.bgColor ? item.bgColor : '';
  const borderColor = item.borderColor ? item.borderColor : '';
  const textColor = item.textColor ? item.textColor : '';

  return (
    <>
      {title && (
        <View
          paddingH-v2
          center
          br20
          style={tw(
            `${bgColor || 'bg-light-white'} ${borderColor || 'border-light-white'
            } border-default self-start`,
          )}>
          <Text
            text13R
            style={tw(`${textColor || 'text-light-black'}`)}>
            {title}
          </Text>
        </View>
      )}
    </>
  );
};

export default memo(PillsComponent);
