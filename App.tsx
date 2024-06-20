// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import BluetoothClassicTerminal from './BluetoothManager';
import RawDataScreen from './screens/RawDataScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
            } else if (route.name === 'Raw data') {
              iconName = focused ? 'test-tube' : 'test-tube';
              IconComponent = Fontisto;
            }

            return <IconComponent name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Bluetooth" component={BluetoothClassicTerminal} />
        <Tab.Screen name="Raw data" component={RawDataScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
