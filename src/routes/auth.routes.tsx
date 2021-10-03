import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import { SignIn } from '../screens/SignIn';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      SignIn: string;
    }
  }
}

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Screen name="SignIn" component={SignIn} />
    </Navigator>
  );
}