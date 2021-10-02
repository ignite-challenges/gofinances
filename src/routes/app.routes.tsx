import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from "styled-components/native";
import { Platform } from 'react-native';

const { Navigator, Screen } = createBottomTabNavigator();

import { Dashboard } from '../screens/Dashboard'
import { Register } from '../screens/Register'

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Listagem: string;
      Cadastrar: string;
      Result: string;
    }
  }
}

export function AppRoutes() {
  const theme = useTheme();
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: Platform.OS === 'ios' ? 88 : 48
        }
      }}
    >
      <Screen 
        name="Listagem" 
        component={Dashboard}
        options={{
          tabBarIcon: (({ color, size }) => (
            <MaterialIcons 
              size={size} 
              color={color} 
              name="format-list-bulleted" 
            />
          ))
        }}
      />
      <Screen 
        name="Cadastrar" 
        component={Register}
        options={{
          tabBarIcon: (({ color, size }) => (
            <MaterialIcons 
              size={size} 
              color={color} 
              name="attach-money" 
            />
          ))
        }}
      />
      <Screen 
        name="Resumo" 
        component={Register}
        options={{
          tabBarIcon: (({ color, size }) => (
            <MaterialIcons 
              size={size} 
              color={color} 
              name="pie-chart" 
            />
          ))
        }}
      />
    </Navigator>
  );
}