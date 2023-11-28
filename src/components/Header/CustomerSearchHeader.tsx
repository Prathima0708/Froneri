import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler, TouchableOpacity } from 'react-native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { images } from 'src/assets/Images';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import Hint from 'src/components/Hint';
import VisitsContoller from 'src/controller/VisitsController';
import { pageNameVisits } from 'src/routes/Routes';
import { toast } from 'src/utils/Util';
import { i18nextFormatter } from 'src/locale';

interface CustomerSearchHeaderProps {
  setScreenLoading: any;
  allSelectedCustomersList: any;
  setAllSelectedCustomersList: any;
  fromScreen: string;
  onBackPress: Function;
}
const CustomerSearchHeader = (props: CustomerSearchHeaderProps) => {
  const {
    setScreenLoading,
    allSelectedCustomersList,
    setAllSelectedCustomersList,
    fromScreen,
    onBackPress,
  } = props;

  const [infoVisible, setInfoVisible] = useState(false);
  const [customerSearchVisible, setCustomerSearchVisible] = useState(false);
  const [customersCount, setCustomersCount] = useState(0);
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack();
        return true;
      });

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', () => {
          navigation.goBack();
          return true
        })
      };
    }, [fromScreen]),
  );

  useEffect(() => {
    if (allSelectedCustomersList.length > 0) {
      let count = 0;
      setCustomerSearchVisible(true);
      allSelectedCustomersList.forEach((selectedCustomers: any) => {
        count += selectedCustomers.data.length;
      });
      setCustomersCount(count);

      if (count === 0) {
        setCustomerSearchVisible(false);
      }
    } else {
      setCustomerSearchVisible(false);
    }
  }, [allSelectedCustomersList]);

  // When user press back button then navigating to previous screen if the user is from drawer menu or home screen, otherwise navigating to visits screen
  useEffect(() => {
    const backAction = () => {
      if (fromScreen === pageNameVisits) {
        navigation.navigate(pageNameVisits as never);
        return;
      }

      navigation.goBack();
      onBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // Opening drawer menu if the user is from drawer menu or home screen, otherwise navigating to visits screen
  const handleGoBack = () => {
    if (!fromScreen || fromScreen !== pageNameVisits) {
      navigation.openDrawer();
      return;
    }

    setAllSelectedCustomersList([]);
    setScreenLoading(false);
    if (fromScreen === pageNameVisits) {
      navigation.navigate(pageNameVisits as never);
    } else {
      navigation.goBack();
    }
    onBackPress();
    return true;
  };

  const createVisits = async () => {
    try {
      if (allSelectedCustomersList.length === 0) {
        return;
      }

      setScreenLoading(true);

      for (const selectedCustomerList of allSelectedCustomersList) {
        for (const data of selectedCustomerList.data) {
          if (data.customerShipTo === "") {
            toast.error({
              message: 'Visit cannot be created for the prospect until the prospect number is generated',
            });
            return
          }
        }
      }

      await VisitsContoller.createVisits(allSelectedCustomersList);

      setAllSelectedCustomersList([]);

      handleGoBack();
    } catch (error) {
      console.log('Create Visit error => ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
    } finally {
      setScreenLoading(false);
    }
  };

  return (
    <View centerH bg-lightGrey style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleGoBack}>
          {fromScreen && fromScreen === pageNameVisits ? (
            <images.DefaultLeftArrowIcon />
          ) : (
            <images.HamburgerIcon />
          )}
        </TouchableOpacity>
        <Text text26 textBlack marginT-v1 style={tw('mx-3')}>
          {fromScreen === pageNameVisits ? 'label.customersearch.create_visits' : 'label.general.customers'}
        </Text>
        {fromScreen === pageNameVisits && (
          <Hint
            marginL-v2
            visible={infoVisible}
            borderRadius={6}
            offset={10}
            message={`${i18nextFormatter('label.customersearch.create_visit_hint_1')}${'\n'}${i18nextFormatter('label.customersearch.create_visit_hint_2')}${'\n'}${i18nextFormatter('label.customersearch.create_visit_hint_3')}${'\n'}${'\n'}${i18nextFormatter('label.customersearch.create_visit_hint_4')}${'\n'}${i18nextFormatter('label.customersearch.create_visit_hint_5')}`}
            color={ColourPalette.light.black}
            onBackgroundPress={() => setInfoVisible(false)}>
            <TouchableOpacity onPress={() => setInfoVisible(!infoVisible)}>
              <images.InfoIcon />
            </TouchableOpacity>
          </Hint>
        )}
      </View>
      {fromScreen === pageNameVisits && (
        <View center>
          {customerSearchVisible ? (
            <TouchableOpacity
              style={tw(
                'bg-light-darkBlue rounded-md items-center border-light-lavendar border-default',
              )}
              onPress={createVisits}>
              <View row center marginV-v06 marginH-v7>
                <Text white text13R>
                  label.customersearch.create_visits
                </Text>
                <Text white text13R>
                  {' '}
                  {customersCount >= 10
                    ? `(${customersCount})`
                    : `(0${customersCount})`}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View
              bg-white1
              br20
              paddingV-v06
              paddingH-v6
              center
              style={tw('border-light-lavendar border-default')}>
              <Text grey1 text13R>
                label.customersearch.create_visits
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CustomerSearchHeader;
