// Provides utility functions for managing bluetooth oerations

import {Alert, PermissionsAndroid, Platform} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

// check if bluetooth is enabled on the device
export const checkBluetoothEnabled = async () => {
  try {
    const enabled = await RNBluetoothClassic.isBluetoothEnabled();
    if (!enabled) {
      await RNBluetoothClassic.requestBluetoothEnabled();
    }
  } catch (error) {
    console.error('Bluetooth Classic is not available on this device.');
  }
};

// request permissions for bluetooth operations
export const requestBluetoothPermissions = async () => {
  try {
    const grantedScan = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    );
    const grantedConnect = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    );
    const grantedLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return (
      grantedScan === PermissionsAndroid.RESULTS.GRANTED &&
      grantedConnect === PermissionsAndroid.RESULTS.GRANTED &&
      grantedLocation === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (err) {
    console.warn(err);
    return false;
  }
};

// handle connection to specified bluetooth device
export const connectToDeviceUtil = async (device: BluetoothDevice) => {
  try {
    let connection = await device.isConnected();
    if (!connection) {
      await device.connect({
        connectorType: 'rfcomm',
        DELIMITER: '\n',
        DEVICE_CHARSET: Platform.OS === 'ios' ? 1536 : 'utf-8',
      });
    }
    return true;
  } catch (error) {
    Alert.alert('Could not connect to device.');
    return false;
  }
};

// handle disconnection from specified bluetooth device
export const disconnectFromDevice = async (
  device: BluetoothDevice,
  clearIntervalId: () => void,
) => {
  try {
    clearIntervalId();
    await device.clear();
    await device.disconnect();
  } catch (error) {
    console.error('Error disconnecting:', error);
  }
};
