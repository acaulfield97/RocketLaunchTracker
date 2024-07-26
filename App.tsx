// App.tsx
import React from 'react';
import {StatusBar} from 'react-native';
import RocketProvider from './src/contexts/RocketContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BluetoothProvider} from './src/contexts/BluetoothContext';
import AppNavigator from './src/navigation/AppNavigator';
import {DatabaseProvider} from './src/contexts/DatabaseContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BluetoothProvider>
        <RocketProvider>
          <DatabaseProvider>
            <StatusBar barStyle={'default'} />
            <AppNavigator />
          </DatabaseProvider>
        </RocketProvider>
      </BluetoothProvider>
    </GestureHandlerRootView>
  );
}
