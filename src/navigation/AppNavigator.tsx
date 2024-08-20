// AppNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/mapScreen/MapScreen';
import LocationDataScreen from '../screens/locationDataScreen/locationDataScreen';
import BluetoothStack from './BluetoothStack';
import AccountStack from './AccountStack';
import getIcon from '../assets/icons';
import colours from '../styles/colours';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) =>
            getIcon(route, focused, color, size),
          tabBarActiveTintColor: colours.primary,
          tabBarInactiveTintColor: colours.dark,
          tabBarStyle: {
            backgroundColor: colours.accent,
          },
        })}>
        <Tab.Screen
          name="Account"
          component={AccountStack}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Stats"
          component={LocationDataScreen}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Bluetooth"
          component={BluetoothStack}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
