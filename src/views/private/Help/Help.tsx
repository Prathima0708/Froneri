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
import HelpHeader from 'src/components/Header/HelpHeader';

type HelpProp = StackNavigationProp<PrivateStackParamList>;

const Help: FC = () => {
  const navigation = useNavigation<HelpProp>();
  const {theme} = useContext(AppContext);
  let dispatch = useDispatch();

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <HelpHeader />
      <View centerH centerV style={tw(`flex-1 bg-${theme}-white p-2-1`)}>
        <Text appTheme>{'Help Screen'}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Help;
