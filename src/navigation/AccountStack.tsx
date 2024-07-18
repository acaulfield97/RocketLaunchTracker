// AccountStack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/accountScreens/LoginScreen';
import CreateAccountScreen from '../screens/accountScreens/CreateAccountScreen';
import DashboardScreen from '../screens/accountScreens/DashboardScreen';

const Stack = createNativeStackNavigator();

const AccountStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

export default AccountStack;
