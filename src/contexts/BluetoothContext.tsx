//  BluetoothContext.tsx

import React, {createContext, useContext, ReactNode, FC} from 'react';
import {useBluetooth} from '../components/bluetooth/useBluetooth';
import {BluetoothContextType} from '../types/types';

const BluetoothContext = createContext<BluetoothContextType | undefined>(
  undefined,
);

export const useBluetoothContext = () => {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export const BluetoothProvider: FC<{children: ReactNode}> = ({children}) => {
  const bluetoothService = useBluetooth();
  return (
    <BluetoothContext.Provider value={bluetoothService}>
      {children}
    </BluetoothContext.Provider>
  );
};
