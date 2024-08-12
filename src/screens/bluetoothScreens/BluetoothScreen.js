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
      <View style={bluetoothPageStyles.titleContainer}>
        <Text style={styles.titleText}>Paired devices</Text>
      </View>
      <ScrollView>
        {!isConnected && (
          <>
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
            <View style={styles.deviceContainer}>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceName}>{selectedDevice.name}</Text>
                <Text style={styles.deviceInfo}>{selectedDevice.id}</Text>
              </View>
              <TouchableOpacity
                onPress={disconnect}
                style={styles.viewDataButton}>
                <Text style={styles.connectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.viewDataButton}
              onPress={navigateToRawData}>
              <Text style={styles.viewDataButtonText}>View Raw Data</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default BluetoothScreen;
