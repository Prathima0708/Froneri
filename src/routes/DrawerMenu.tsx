import { Alert, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import View from 'src/components/View';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { images } from 'src/assets/Images';
import Text from 'src/components/Text';
import { getAppVersion } from 'src/utils/CommonUtil';
import { pageNameCustomerSearch, pageNameHelp, pageNameHome } from './Routes';
import LogoutModal from 'src/components/Home/LogoutModal';
import LoginService from 'src/services/LoginService';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import { authFailure } from 'src/reducers/AuthSlice';
import { toast } from 'src/utils/Util';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const DrawerMenuItem = (props: any) => {
  const { item, state, navigation, isInitialSyncDone, t } = props;

  const isFocused = getActiveRouteState(state.routes, state.index, item.name);

  const icon = () => (
    <View style={tw('h-36px w-36px justify-center items-center')}>
      {isFocused ? <item.activeImage /> : <item.inactiveImage />}
    </View>
  );

  return (
    <DrawerItem
      label={t(item.label)}
      labelStyle={isFocused ? styles.drawerActive : styles.labelStyles}
      icon={icon}
      style={tw('mx-px')}
      onPress={() => {
        if (
          !isInitialSyncDone &&
          item.name !== pageNameHelp &&
          item.name !== pageNameHome
        ) {
          toast.info({
            message: 'Please sync the data first'
          })
          return;
        }

        // Reset the stack to the home screen and then navigate to the page
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: pageNameHome },
              {
                name: item.name,
              },
            ],
          })
        );
      }}
    />
  );
};

const DrawerMenu = (props: any) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isInitialSyncDone = useAppSelector(
    (state: RootState) => state.syncStatus.isInitialSyncDone,
  );

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { navigation, drawerMenuItems, state } = props;
  const appVersion = getAppVersion();
  const handleCloseMenu = () => {
    navigation.closeDrawer();
  };

  const handleLogout = () => {
    LoginService.logOut()
      .then(() => {
        console.log('Logged out');
        dispatch(authFailure({ isAuthenticatedUser: false }));
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong'
        })
        console.log('logout error :>> ', error);
      })
      .finally(() => setIsLogoutModalVisible(false));
  };

  const handleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <DrawerContentScrollView {...props}>
        <View style={tw('flex-row items-center m-3')}>
          <TouchableOpacity onPress={handleCloseMenu}>
            <images.CloseIcon height={34} width={34} />
          </TouchableOpacity>
          <View marginT-v1 style={tw('ml-3')}>
            <images.FroneriIcon />
          </View>
        </View>
        {drawerMenuItems.map((item: any) => (
          <DrawerMenuItem
            key={item.name}
            item={item}
            state={state}
            navigation={navigation}
            isInitialSyncDone={isInitialSyncDone}
            t={t}
          />
        ))}
      </DrawerContentScrollView>
      <View row centerV margin-v2 marginB-v4 spread>
        <TouchableOpacity
          style={tw('flex-row items-center flex-1')}
          onPress={handleLogoutModal}>
          <images.LogoutIcon />
          <Text text13R textBlack marginL-v2>
            label.general.logout
          </Text>
        </TouchableOpacity>
        <Text text12R style={tw('text-light-secondaryGrey text-right')}>
          {'V' + appVersion}
        </Text>
      </View>
      <LogoutModal
        onPressLogout={handleLogout}
        onPressCancel={handleLogoutModal}
        isModalVisible={isLogoutModalVisible}
      />
    </SafeAreaView>
  );
};

export default DrawerMenu;

const getActiveRouteState = function (
  routes: any,
  index: number,
  name: string,
) {
  return routes[index].name.toLowerCase().indexOf(name.toLowerCase()) >= 0;
};

const styles = StyleSheet.create({
  labelStyles: {
    fontSize: 13,
    color: ColourPalette.light.textBlack,
    fontFamily: 'Heebo-Regular',
    marginLeft: -18,
  },
  drawerStyle: {
    padding: 0,
    paddingVertical: 0,
  },
  drawerActive: {
    fontSize: 13,
    color: ColourPalette.light.darkBlue,
    fontFamily: 'Heebo-Regular',
    marginLeft: -18,
  },
});
