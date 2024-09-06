// AppNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/mapScreen/MapScreen';
import LocationDataScreen from '../screens/locationDataScreen/locationDataScreen';
import BluetoothStack from './BluetoothStack';
import getIcon from '../assets/icons';
import colours from '../styles/colours';

// bottom tabs at bottom of each screen
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    // component wraps the entire navigation structure. It manages the navigation tree and the app's navigation state
    <NavigationContainer>
      <Tab.Navigator
        // set up look and behaviour of each tab
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
