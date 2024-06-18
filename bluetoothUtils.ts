// bluetoothUtils.ts
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { PermissionsAndroid, Platform } from 'react-native';

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

export const requestBluetoothPermissions = async () => {
  try {
    const grantedScan = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Bluetooth Scan Permission',
        message: 'This app needs Bluetooth Scan permission to discover devices.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    const grantedConnect = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Bluetooth Connect Permission',
        message: 'This app needs Bluetooth Connect permission to connect to devices.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    const grantedLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Fine Location Permission',
        message: 'This app needs to know location of device.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    return grantedScan === PermissionsAndroid.RESULTS.GRANTED &&
      grantedConnect === PermissionsAndroid.RESULTS.GRANTED &&
      grantedLocation === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const connectToDevice = async (device: BluetoothDevice) => {
  try {
    console.log('Connecting to device');
    let connection = await device.isConnected();
    if (!connection) {
      console.log('Connecting to device');
      await device.connect({
        connectorType: 'rfcomm',
        DELIMITER: '\n',
        DEVICE_CHARSET: Platform.OS === 'ios' ? 1536 : 'utf-8',
      });
    }
    return true;
  } catch (error) {
    console.error('Error connecting to device:', error);
    return false;
  }
};

export const disconnectFromDevice = async (device: BluetoothDevice, clearIntervalId: () => void) => {
  try {
    clearIntervalId();
    await device.clear();
    console.log('BT buffer cleared');
    await device.disconnect();
    console.log('Disconnected from device');
  } catch (error) {
    console.error('Error disconnecting:', error);
  }
};
