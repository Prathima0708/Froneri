import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {SafeAreaView} from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import {CUSTOMER_LANDING_SCREENS} from 'src/utils/Constant';

const CLTasks = () => {
  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader />
      <View flex row>
        <CLLeftMenuComponent activeTab={CUSTOMER_LANDING_SCREENS.TASKS} />
        <View flex marginR-v2 marginB-v2 row center>
          <Text>Tasks</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CLTasks;
