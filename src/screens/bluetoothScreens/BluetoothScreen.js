import React, {useCallback} from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import {useBluetooth} from '../../components/bluetooth/useBluetooth';
import styles from '../../styles/commonStyles';
import bluetoothPageStyles from '../../styles/bluetoothPageStyles';
import {
  exportAllDataToCSV,
  exportAllDataToText,
} from '../../components/helpers/ExportData';
import {blue} from 'react-native-reanimated/lib/typescript/Colors';

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
                    Connect
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
                style={styles.deviceButton}>
                <Text style={styles.connectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.viewDataButton}
              onPress={navigateToRawData}>
              <Text style={styles.viewDataButtonText}>View Raw Data</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => exportAllDataToText(receivedData)}>
              <Text style={styles.exportButtonText}>
                Export All Data as Text
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => exportAllDataToCSV(receivedData)}>
              <Text style={styles.exportButtonText}>
                Export All Data as CSV
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default BluetoothClassicTerminal;
