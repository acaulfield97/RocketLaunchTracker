//  BluetoothContext.tsx

import React, {createContext, useContext} from 'react';
import {useBluetooth} from '../components/bluetooth/useBluetooth';

const BluetoothContext = createContext(undefined);

export const useBluetoothContext = () => {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export const BluetoothProvider = ({children}) => {
  const bluetoothService = useBluetooth();
  return (
    <BluetoothContext.Provider value={bluetoothService}>
      {children}
    </BluetoothContext.Provider>
  );
};
