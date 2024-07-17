// AccountStack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/accountScreens/LoginScreen';
import CreateAccountScreen from '../screens/accountScreens/CreateAccountScreen';

const Stack = createNativeStackNavigator();

const AccountStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
  </Stack.Navigator>
);

export default AccountStack;
