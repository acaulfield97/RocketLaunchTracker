import React, {useCallback, useEffect} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import styles from '../../styles/commonStyles';
import bluetoothPageStyles from '../../styles/bluetoothPageStyles';
import {
  checkBluetoothEnabled,
  requestBluetoothPermissions,
} from '../../components/bluetooth/BluetoothUtils';
import {BluetoothDevice} from 'react-native-bluetooth-classic';

type BluetoothScreenNavigationProp = NavigationProp<any>;

const BluetoothScreen: React.FC = () => {
  const {
    pairedDevices,
    selectedDevice,
    isConnected,
    receivedData,
    startDeviceDiscovery,
    connectToDevice,
    connectingDeviceId,
    disconnect,
  } = useBluetoothContext();

  const navigation = useNavigation<BluetoothScreenNavigationProp>();

  const navigateToRawData = useCallback(() => {
    navigation.navigate('RawData', {parsedData: receivedData});
  }, [navigation, receivedData]);

  // Request Bluetooth permissions when the screen is opened
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await checkBluetoothEnabled();
        const permissionsGranted = await requestBluetoothPermissions();

        if (!permissionsGranted) {
          Alert.alert(
            'Permissions required',
            'Bluetooth permissions are required to proceed.',
            [{text: 'OK'}],
          );
        } else {
          // If permissions are granted
          startDeviceDiscovery();
        }
      } catch (error) {
        console.error('Error requesting Bluetooth permissions:', error);
      }
    };

    requestPermissions();
  }, []); // Empty dependency array means this effect runs once when the screen is opened

  return (
    <View style={styles.container}>
      <ScrollView>
        {!isConnected && (
          <>
            <View style={bluetoothPageStyles.titleContainer}>
              <Text style={styles.titleText}>Paired devices</Text>
            </View>
            <TouchableOpacity
              onPress={startDeviceDiscovery}
              style={bluetoothPageStyles.scanButton}>
              <Text style={bluetoothPageStyles.scanButtonText}>
                SCAN FOR PAIRED DEVICES
              </Text>
            </TouchableOpacity>
            {pairedDevices.map((device: BluetoothDevice, index: number) => (
              <View key={index} style={styles.deviceContainer}>
                <View style={bluetoothPageStyles.deviceItem}>
                  <Text style={bluetoothPageStyles.deviceName}>
                    {device.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => connectToDevice(device)}
                  style={bluetoothPageStyles.connectToDeviceButton}>
                  <Text style={bluetoothPageStyles.connectToDeviceButtonText}>
                    {connectingDeviceId === device.id
                      ? 'Connecting...'
                      : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        {selectedDevice && isConnected && (
          <>
            <View style={bluetoothPageStyles.titleContainer}>
              <Text style={styles.titleText}>Connected device</Text>
            </View>
            <View style={styles.deviceContainer}>
              <View style={bluetoothPageStyles.deviceItem}>
                <Text style={bluetoothPageStyles.deviceName}>
                  {selectedDevice.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={disconnect}
                style={bluetoothPageStyles.connectToDeviceButton}>
                <Text style={bluetoothPageStyles.connectToDeviceButtonText}>
                  Disconnect
                </Text>
              </TouchableOpacity>
            </View>
            <View style={bluetoothPageStyles.viewRawButtonContainer}>
              <TouchableOpacity
                style={bluetoothPageStyles.viewRawButton}
                onPress={navigateToRawData}>
                <Text style={bluetoothPageStyles.viewRawButtonText}>
                  View Raw Data
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default BluetoothScreen;
