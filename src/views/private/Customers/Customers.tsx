import React, {useEffect, useState, useContext, FC} from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {AppContext} from 'src/provider/AppProvider';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {PrivateStackParamList} from 'src/routes/types';

import {useDispatch} from 'react-redux';
import CustomersHeader from 'src/components/Header/CustomersHeader';

type CustomersProp = StackNavigationProp<PrivateStackParamList>;

const Customers: FC = () => {
  const navigation = useNavigation<CustomersProp>();
  const {theme} = useContext(AppContext);
  let dispatch = useDispatch();

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomersHeader />
      <View centerH centerV style={tw(`flex-1 bg-${theme}-white p-2-1`)}>
        <Text appTheme>{'Customers Screen'}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Customers;
