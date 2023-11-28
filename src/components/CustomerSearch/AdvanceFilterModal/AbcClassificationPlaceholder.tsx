import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';

const AbcClassificationPlaceholder = (props: any) => {
  return (
    <View>
      <Text numberOfLines={1} style={tw('w-210px')}>
        {props.data.map((e: any, i: number, r: any) => {
          return (
            <Text key={e.descriptionLanguage}>
              {e.descriptionLanguage}
              {i + 1 === r.length ? '' : ', '}
            </Text>
          );
        })}
      </Text>
    </View>
  );
};

export default AbcClassificationPlaceholder;
