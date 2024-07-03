// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import HomeScreen from './components/screens/HomeScreen';
import MapScreen from './components/screens/MapScreen';
import BluetoothClassicTerminal from './components/screens/BluetoothScreen';
import RawDataScreen from './components/screens/RawDataScreen';
import {StatusBar} from 'react-native';
import RocketProvider from './contexts/RocketContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BluetoothProvider} from './contexts/BluetoothContext';

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

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BluetoothProvider>
        <RocketProvider>
          <NavigationContainer>
            <StatusBar barStyle={'default'} />
            <Tab.Navigator
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName: string = 'help-circle-outline'; // Default value
                  let IconComponent = Ionicons; // Default to Ionicons

                  if (route.name === 'Home') {
                    iconName = focused ? 'rocket-sharp' : 'rocket-outline';
                    IconComponent = Ionicons;
                  } else if (route.name === 'Map') {
                    iconName = focused ? 'location' : 'location-outline';
                    IconComponent = Ionicons;
                  } else if (route.name === 'Bluetooth') {
                    iconName = focused ? 'bluetooth' : 'bluetooth-outline';
                    IconComponent = Ionicons;
                  } else if (route.name === 'RawData') {
                    iconName = focused ? 'test-tube' : 'test-tube';
                    IconComponent = Fontisto;
                  }

                  return (
                    <IconComponent name={iconName} size={size} color={color} />
                  );
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
              })}>
              <Tab.Screen name="Home" component={HomeScreen} />

              <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{headerShown: false}}
              />

              <Tab.Screen
                name="Bluetooth"
                component={BluetoothStack}
                options={{headerShown: false}}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </RocketProvider>
      </BluetoothProvider>
    </GestureHandlerRootView>
  );
}
