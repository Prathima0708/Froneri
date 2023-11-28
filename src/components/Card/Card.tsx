import React from 'react';
import View from 'src/components/View';

interface CardProps {
  cardStyle?: Object;
  children?: any;
}

const Card = (props: CardProps) => {
  return (
    <View
      {...props}
      bg-white
      style={[
        {
          shadowColor: '#2222220F',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 0.1,
          shadowRadius: 12,
          borderRadius: 12,
          ...props.cardStyle,
        },
      ]}>
      {props.children}
    </View>
  );
};

export default Card;
