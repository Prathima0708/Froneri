import React, {FC, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';

const ForgotPassword: FC = () => {
  useEffect(() => {}, []);

  return (
    <View style={tw('flex-1 bg-blue-500 ')}>
      <SafeAreaView>
        <Text>Screen: Forgot Password</Text>
      </SafeAreaView>
    </View>
  );
};

export default ForgotPassword;
