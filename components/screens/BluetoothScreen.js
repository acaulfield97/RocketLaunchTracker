import React, {useCallback} from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import {useBluetooth} from '../bluetooth/useBluetooth';
import styles from '../../styles';

const BluetoothClassicTerminal = () => {
  const {
    pairedDevices,
    selectedDevice,
    isConnected,
    receivedData,
    startDeviceDiscovery,
    connectToDevice,
    disconnect,
  } = useBluetoothContext();

  const navigation = useNavigation();

  const navigateToRawData = useCallback(() => {
    navigation.navigate('RawData', {parsedData: receivedData});
  }, [navigation, receivedData]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Bluetooth Terminal</Text>
      <ScrollView>
        {!isConnected && (
          <>
            <TouchableOpacity
              onPress={startDeviceDiscovery}
              style={styles.deviceButton}>
              <Text style={styles.scanButtonText}>SCAN FOR PAIRED DEVICES</Text>
            </TouchableOpacity>
            <Text>Paired Devices:</Text>
            {pairedDevices.map((device, index) => (
              <View key={index} style={styles.deviceContainer}>
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceInfo}>{device.id}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => connectToDevice(device)}
                  style={styles.deviceButton}>
                  <Text style={styles.connectButtonText}>Connect</Text>
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
                style={styles.deviceButton}>
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

export default BluetoothClassicTerminal;
