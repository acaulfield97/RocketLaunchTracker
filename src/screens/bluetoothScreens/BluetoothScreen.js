import React, {useCallback} from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import styles from '../../styles/commonStyles';
import bluetoothPageStyles from '../../styles/bluetoothPageStyles';

const BluetoothScreen = () => {
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

  const navigation = useNavigation();

  const navigateToRawData = useCallback(() => {
    navigation.navigate('RawData', {parsedData: receivedData});
  }, [navigation, receivedData]);

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
            {pairedDevices.map((device, index) => (
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
