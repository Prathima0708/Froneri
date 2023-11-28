import React, {FC} from 'react';
import {SafeAreaView, Text, TouchableHighlight} from 'react-native';

const TermsAndConditions: FC = () => {
  return (
    <SafeAreaView>
      <Text>Screen: Terms & Conditions</Text>

      <TouchableHighlight>
        <Text>Go to home</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
