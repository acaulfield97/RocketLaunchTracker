// App.tsx
import React from 'react';
import {View} from 'react-native';
import BluetoothClassicTerminal from './BluetoothManager';

const App = () => {
  return (
    <View>
      <BluetoothClassicTerminal />
    </View>
  );
};

export default App;
