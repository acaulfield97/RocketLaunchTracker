// BluetoothStack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BluetoothClassicTerminal from '../screens/BluetoothScreen';
import RawDataScreen from '../screens/RawDataScreen';

const Stack = createNativeStackNavigator();

const BluetoothStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BluetoothTerminal"
      component={BluetoothClassicTerminal}
    />
    <Stack.Screen name="RawData" component={RawDataScreen} />
  </Stack.Navigator>
);

export default BluetoothStack;
