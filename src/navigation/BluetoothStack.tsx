import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BluetoothScreen from '../screens/bluetoothScreens/BluetoothScreen';
import RawDataScreen from '../screens/bluetoothScreens/RawDataScreen';
import {RootStackParamList} from '../types/types';

// stack of screens realte to bluetooth
// main bluetooth screen an raw data screen
const Stack = createNativeStackNavigator<RootStackParamList>();

const BluetoothStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="BluetoothTerminal" component={BluetoothScreen} />
    <Stack.Screen name="RawData" component={RawDataScreen} />
  </Stack.Navigator>
);

export default BluetoothStack;
