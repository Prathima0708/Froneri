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
import SalesMaterialsHeader from 'src/components/Header/SalesMaterialsHeader';
import {Card} from 'react-native-ui-lib';

import SalesMaterialComponent from 'src/components/SalesMaterial/SalesMaterialComponent';

type SalesMaterialsProp = StackNavigationProp<PrivateStackParamList>;

const SalesMaterials: FC = () => {
  const navigation = useNavigation<SalesMaterialsProp>();
  const {theme} = useContext(AppContext);
  let dispatch = useDispatch();

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <SalesMaterialsHeader />
      <View
        // center
        width={'100%'}
        style={tw(`flex-1 bg-${theme}-white rounded-12px flex-1 p-6`)}>
        <Card
          flex-1
          marginH-v2
          marginB-v3
          padding-v02
          cardStyle={tw('mt-10px flex-row')}>
          <SalesMaterialComponent />
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default SalesMaterials;
