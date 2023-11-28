import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import WalkScreens from '../../views/Walkthrough';
import * as NAVIGATION from 'src/routes/Navigator';
import * as NAV_ROUTES from 'src/routes/Routes';
import {RootState, useAppSelector} from 'src/reducers/hooks';

const Stack = createStackNavigator();

const PrimaryContainer = () => {
  const isAuthenticatedUser = useAppSelector(
    (state: RootState) => state.auth.isAuthenticatedUser,
  );
  const showApp = useAppSelector(
    (state: RootState) => state.walkthrough.showApp,
  );

  if (showApp) {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false, headerBackAllowFontScaling: false}}>
        {isAuthenticatedUser ? (
          <Stack.Screen
            key={NAV_ROUTES.pageNamePrivateStack}
            name={NAV_ROUTES.pageNamePrivateStack}
            component={NAVIGATION.PrivateRoutes}
          />
        ) : (
          <Stack.Screen
            key={NAV_ROUTES.pageNameAuthStack}
            name={NAV_ROUTES.pageNameAuthStack}
            component={NAVIGATION.AuthRoutes}
          />
        )}
        <Stack.Screen
          key={NAV_ROUTES.pageNamePublicStack}
          name={NAV_ROUTES.pageNamePublicStack}
          component={NAVIGATION.PublicRoutes}
        />
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          key={'walk_screen'}
          name={'walk_screen'}
          component={WalkScreens}
        />
      </Stack.Navigator>
    );
  }
};

export default PrimaryContainer;
