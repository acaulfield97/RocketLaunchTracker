import React, {createContext, useContext, ReactNode, FC} from 'react';
import {useBluetooth} from '../components/bluetooth/useBluetooth';
import {BluetoothContextType} from '../types/types';

// allows sharing of state across a component tree without prop drilling (passing props through every level of the tree).
const BluetoothContext = createContext<BluetoothContextType | undefined>(
  undefined,
);

// custom hook that wraps useContext to access the Bluetooth context safely.
export const useBluetoothContext = () => {
  const context = useContext(BluetoothContext); // hook that allows any component within the context provider to access the context value.
  if (context === undefined) {
    // if hook is used outside of the BluetoothProvider, throw an error
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

// component that provides the Bluetooth context value to its child components.
export const BluetoothProvider: FC<{children: ReactNode}> = ({children}) => {
  const bluetoothService = useBluetooth();
  return (
    <BluetoothContext.Provider value={bluetoothService}>
      {children}
    </BluetoothContext.Provider>
  );
};
