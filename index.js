/* eslint-disable no-unused-vars */
<script src="http://localhost:8097"></script>;
/**
 * @format
 */
// MUST BE TOP
import {NavigationContainer} from '@react-navigation/native';
//
import React, {Suspense} from 'react';
import {ActivityIndicator, AppRegistry, View} from 'react-native';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import {OFFLINE_STORAGE} from './src/storage/Storage';
import {store} from './src/store';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import StylesLoader from 'src/styles/StylesLoader'; // DO NOT REMOVE THIS LINE
import i18n from './i18n'; //must import i18n here..
import {AppProvider} from 'src/provider/AppProvider';
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';
import {navigationRef} from 'src/utils/NavigationUtil';
let persistor = persistStore(store);

AppRegistry.registerComponent(appName, () => {
  const offlineDb = OFFLINE_STORAGE.init(); // DO NOT REMOVE THIS LINE
  return () => (
    <NavigationContainer ref={navigationRef}>
      <Provider store={store}>
        <AppProvider>
          <TailwindProvider utilities={utilities}>
            <Suspense
              fallback={
                <View
                  style={{flex: 1, justifyContent: 'center'}}
                  className="justify-items-center">
                  <ActivityIndicator
                    size="large"
                    color={ColourPalette.light.primary}
                  />
                </View>
              }>
              <App />
            </Suspense>
          </TailwindProvider>
        </AppProvider>
      </Provider>
    </NavigationContainer>
  );
});
