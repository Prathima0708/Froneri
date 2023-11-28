import React, {useEffect, FC} from 'react';
import SplashScreen from 'react-native-splash-screen';
import PrimaryContainer from './src/containers/PrimaryContainer';
import {useDispatch} from 'react-redux';

import {authFailure, authSuccess} from 'src/reducers/AuthSlice';
import LoginService from 'src/services/LoginService';
import {walkthroughSuccess} from 'src/reducers/WalkthroughSlice';
import NetInfo from '@react-native-community/netinfo';
import UserContextService from 'src/services/UserContextService';
import CustomToast from 'src/components/Toast';
import Toast from 'react-native-toast-message';
import {LogBox} from 'react-native';

export const toastConfig = {
  customToast: (props: any) => <CustomToast {...props.props} />,
};

const App: FC = () => {
  let dispatch = useDispatch();

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 200);
    //check if user is already logged in
    LoginService.getUserInfo()
      .then(res => {
        if (res.isDummyToken) {
          dispatch(walkthroughSuccess({showApp: true}));
          dispatch(authFailure({isAuthenticatedUser: false}));
        } else {
          dispatch(authSuccess({isAuthenticatedUser: true}));
        }
      })
      .catch(() => {
        dispatch(authFailure({isAuthenticatedUser: false}));
      });
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      UserContextService.updateDeviceOnlineStateIntoReduxStore(
        state.isConnected,
      );
    });
    // return to clean up on un mount
    return function cleanup() {
      console.log('>>>> cleanup fired: App');
      unsubscribeNetInfo();
    };
  }, []);

  return (
    <>
      <PrimaryContainer />
      <Toast config={toastConfig} />
    </>
  );
};

export default App;
