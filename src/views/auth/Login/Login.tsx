import React, { useState, FC } from 'react';
import { ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import TextError from 'src/components/TextError';
import View from 'src/components/View';
import LoginService from 'src/services/LoginService';
import { useForceUpdate } from 'src/services/Util';
import { tw } from 'src/tw';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import { authFailure, authSuccess } from 'src/reducers/AuthSlice';
import { images } from 'src/assets/Images';
import Image from 'src/components/Image';
import { STRINGS } from 'src/utils/Strings';
import { updateSyncStatus } from 'src/reducers/SyncStatusSlice';

const LoginScreen: FC = () => {
  const forceUpdate = useForceUpdate();

  const dispatch = useAppDispatch();

  const employeeInfo = useAppSelector(
    (state: RootState) => state.userContext.employee,
  );

  const [isLoading, setIsLoading] = useState(false);
  let [apiErrorMessage, setApiErrorMessage] = useState('');

  // MS login function ....
  const handleSignIn = async () => {
    setIsLoading(true);
    setApiErrorMessage('');
    return LoginService.signIn()
      .then(res => {
        console.log('Auth success res :>> ', res);
        // Checking the mail address of the user with the mail address of the previous logged in user
        if (employeeInfo.length > 0) {
          if (employeeInfo[0].mailAddress !== res?.emailId) {
            // If the mail address is different then we need to reset the sync status
            console.log("Setting the initial sync status to false")
            dispatch(updateSyncStatus({ isInitialSyncDone: false }));
          } else {
            console.log("Setting the initial sync status to true")
            dispatch(updateSyncStatus({ isInitialSyncDone: true }));
          }
        }
        setIsLoading(false);
        dispatch(authSuccess({ isAuthenticatedUser: true }));
      })
      .catch(err => {
        setIsLoading(false);
        dispatch(authFailure({ isAuthenticatedUser: false }));
        console.log('Auth error', err.message);
        const errorCode = err.message.match(/AADSTS\d+/);

        let apiErrorMessage =
          err && err.message ? err.message : STRINGS.UNKNOWN_ERROR;
        if (
          (errorCode && errorCode[0] === STRINGS.AUTH_ERROR_CODE) ||
          errorCode[0] === STRINGS.DENIED_CODE
        ) {
          apiErrorMessage = STRINGS.DENIED_ERROR;
        }
        if (
          err.message === STRINGS.IOS_AUTH_ERROR ||
          err.message === STRINGS.ANDRIOD_AUTH_ERROR ||
          err.message === STRINGS.IOS_DENIED
        ) {
          apiErrorMessage = '';
        }
        setApiErrorMessage(apiErrorMessage);
        forceUpdate();
      });
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <View flex bg-white>
        <View centerH paddingT-v10 flex>
          <images.FroneriLogo />
        </View>
        <View
          flex
          style={tw(
            'absolute inset-x-0 inset-y-0 justify-center items-center z-10',
          )}>
          {isLoading ? (
            <ActivityIndicator size={'large'} color={'black'} />
          ) : (
            <View
              flex
              style={tw(
                'absolute inset-x-0 inset-y-0 justify-center items-center z-10',
              )}>
              <TouchableOpacity onPress={handleSignIn}>
                <Image source={images.msLogo} style={tw('w-170px h-41px')} />
              </TouchableOpacity>

              <TextError errorMsg={apiErrorMessage} />
            </View>
          )}
        </View>
        <View>
          <images.LoginIIIustration />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
