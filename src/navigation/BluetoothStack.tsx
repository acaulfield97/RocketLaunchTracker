// BluetoothStack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BluetoothScreen from '../screens/bluetoothScreens/BluetoothScreen';
import RawDataScreen from '../screens/bluetoothScreens/RawDataScreen';

const Stack = createNativeStackNavigator();

const BluetoothStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="BluetoothTerminal" component={BluetoothScreen} />
    <Stack.Screen name="RawData" component={RawDataScreen} />
  </Stack.Navigator>
);

export default BluetoothStack;
