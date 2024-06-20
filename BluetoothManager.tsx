import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

// Utility Functions
const checkBluetoothEnabled = async () => {
  try {
    const enabled = await RNBluetoothClassic.isBluetoothEnabled();
    if (!enabled) {
      await RNBluetoothClassic.requestBluetoothEnabled();
    }
  } catch (error) {
    console.error('Bluetooth Classic is not available on this device.');
  }
};

const requestBluetoothPermissions = async () => {
  try {
    const grantedScan = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Bluetooth Scan Permission',
        message:
          'This app needs Bluetooth Scan permission to discover devices.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    const grantedConnect = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Bluetooth Connect Permission',
        message:
          'This app needs Bluetooth Connect permission to connect to devices.',
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

const connectToDeviceUtil = async (device: BluetoothDevice) => {
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

const disconnectFromDevice = async (
  device: BluetoothDevice,
  clearIntervalId: () => void,
) => {
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

// Component
const BluetoothClassicTerminal = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice>();
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  const startDeviceDiscovery = async () => {
    console.log('searching for devices...');
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      console.log('Bonded peripherals: ' + paired.length);
      setPaired(paired);
    } catch (error) {
      console.error('Error bonded devices:', error);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    const connectionSuccess = await connectToDeviceUtil(device);
    if (connectionSuccess) {
      setSelectedDevice(device);
      setIsConnected(true);
    }
  };

  const parseDataStream = (data: string) => {
    const lines = data.split('\n');
    const parsedData = lines.map(line => {
      const fields = line.split(',');
      const sentenceType = fields[0];
      switch (sentenceType) {
        case '$GPRMC':
          return {
            type: 'GPRMC',
            time: fields[1],
            status: fields[2],
            latitude: fields[3] + ' ' + fields[4],
            longitude: fields[5] + ' ' + fields[6],
            speed: fields[7],
            date: fields[9],
          };
        case '$GPVTG':
          return {
            type: 'GPVTG',
            course: fields[1],
            speed: fields[7],
          };
        case '$GPGGA':
          return {
            type: 'GPGGA',
            time: fields[1],
            latitude: fields[2] + ' ' + fields[3],
            longitude: fields[4] + ' ' + fields[5],
            fixQuality: fields[6],
            altitude: fields[9] + ' ' + fields[10],
          };
        case '$GPGLL':
          return {
            type: 'GPGLL',
            latitude: fields[1] + ' ' + fields[2],
            longitude: fields[3] + ' ' + fields[4],
            time: fields[5],
          };
        case '$GPGSA':
          return {
            type: 'GPGSA',
            mode: fields[1],
            fixType: fields[2],
            satellitesUsed: fields.slice(3, 15).filter(sat => sat !== ''),
          };
        case '$GPGSV':
          return {
            type: 'GPGSV',
            numberOfMessages: fields[1],
            messageNumber: fields[2],
            satellitesInView: fields[3],
            satellitesInfo: fields.slice(4, fields.length - 1),
          };
        default:
          return;
      }
    });
    return parsedData;
  };

  const readData = async () => {
    if (selectedDevice && isConnected) {
      try {
        let message = await selectedDevice.read();
        if (message) {
          message = message.trim();
          if (message !== '' && message !== ' ') {
            const parsedData = parseDataStream(message.toString());
            console.log('Parsed Data:', parsedData);
          }
        }
      } catch (error) {
        console.log('isConnected', isConnected);
        console.log('selectedDevice', selectedDevice);
        console.error('Error reading message:', error);
      }
    }
  };

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timer | undefined;
    if (selectedDevice && isConnected) {
      intervalId = setInterval(() => readData(), 100);
      setIntervalId(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, selectedDevice]);

  const disconnect = () => {
    if (selectedDevice && isConnected) {
      disconnectFromDevice(selectedDevice, () => clearInterval(intervalId));
      setSelectedDevice(undefined);
      setIsConnected(false);
      setReceivedMessage('');
    }
  };

  useEffect(() => {
    async function requestBluetoothPermission() {
      const permissionsGranted = await requestBluetoothPermissions();
      if (permissionsGranted) {
        startDeviceDiscovery();
      }
    }
    checkBluetoothEnabled();
    requestBluetoothPermission();
  }, []);

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
            {paired.map((device, i) => (
              <View key={i} style={styles.deviceContainer}>
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
            <View style={styles.messageContainer}>
              <TextInput
                style={styles.messageInput}
                value={messageToSend}
                onChangeText={setMessageToSend}
                placeholder="Type a message"
              />
            </View>
            <View style={styles.receivedMessageContainer}>
              <Text style={styles.receivedMessageText}>{receivedMessage}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerText: {
    fontSize: 30,
    textAlign: 'center',
    borderBottomWidth: 1,
  },
  deviceButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    margin: 5,
  },
  scanButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  deviceItem: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
  },
  deviceInfo: {
    fontSize: 12,
    color: 'gray',
  },
  connectButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    padding: 5,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  receivedMessageContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  receivedMessageText: {
    fontSize: 14,
  },
});

export default BluetoothClassicTerminal;
