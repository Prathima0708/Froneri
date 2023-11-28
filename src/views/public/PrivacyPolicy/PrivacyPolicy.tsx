import React, {FC} from 'react';
import {SafeAreaView, Text, TouchableHighlight} from 'react-native';

const PrivacyPolicy: FC = () => (
  <SafeAreaView>
    <Text>Privacy Policy</Text>

    <TouchableHighlight>
      <Text>Go to home</Text>
    </TouchableHighlight>
  </SafeAreaView>
);

export default PrivacyPolicy;
