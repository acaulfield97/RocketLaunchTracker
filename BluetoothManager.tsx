import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Text,
  Button,
  TextInput,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import styles from './styles';
import {
  checkBluetoothEnabled,
  requestBluetoothPermissions,
  connectToDevice,
  disconnectFromDevice,
} from './bluetoothUtils';

const BluetoothClassicTerminal = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice>();
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  /*const [state, setState] = useState({
    devices: [],
    paired: [],
    selectedDevice: null,
    messageToSend: "",
    receivedMessage: "",
    isConnected: false,
    intervalId: null,
  })*/

  const startDeviceDiscovery = async () => {
    console.log('searching for devices...');
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      console.log('Bonded peripherals: ' + paired.length);
      setPaired(paired);
    } catch (error) {
      console.error('Error bonded devices:', error);
    }

    /*try {
      const devices = await RNBluetoothClassic.startDiscovery();
      this.setState({ devices });
      console.log("Discovered peripherals: " + devices.length);
    } catch (error) {
      console.error('Error discovering devices:', error);
    }*/
  };

  const connectToDevice = async (device: BluetoothDevice) => {
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
      setSelectedDevice(device);
      setIsConnected(true);
      console.log('is connected : ', isConnected);
      //device.onDataReceived((data) => this.readData());
      //const intervalId = setInterval(() => {readData();}, 100);
      //setIntervalId(intervalId);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  /*async onReceivedData() {
  const { selectedDevice, receivedMessage } = this.state;
  //console.log("event : recived message", event);
  try{
    //const message = await selectedDevice.read();
    console.log("reieved msg from", selectedDevice.name);
    const messages = await selectedDevice.available();
  if (messages.length > 0) {
    console.log("msg waiting : ", messages.length);
  }
    //this.setState({ receivedMessage: message.data });
  } catch (error) {
    console.error('Error receiving data:', error);
  }
}*/

  const sendMessage = async () => {
    if (selectedDevice && isConnected) {
      console.log('isConnected in message', isConnected);
      try {
        await selectedDevice.write(messageToSend);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  /*const readData = async () => {  
  console.log("reading data connected", isConnected);
  if(selectedDevice && isConnected){
    try {
      console.log("reading data from", selectedDevice.name);
      //const available = await selectedDevice.available();
      //if (available>1){
        let message = await selectedDevice.read();
        if(message){
          message = message.trim();
          if (message !== "" && message !== " "){
            console.log("reading data from", selectedDevice.name);
            //console.log(" available : ",  available);
            //console.log("available", selectedDevice.available());
            //console.log("read", selectedDevice.read());
            setReceivedMessage(receivedMessage + message +"\n" );
            console.log('message', message);
            console.log('message', receivedMessage);
            
          }
        }
    //  }

    } catch (error) {
      //console.log("isConnected",isConnected);
      //console.log("selectedDevice",selectedDevice);
      console.error('Error reading message:', error);
    }
  }
}*/

  const readData = async () => {
    if (selectedDevice && isConnected) {
      try {
        let message = await selectedDevice.read();
        if (message) {
          message = message.trim();
          if (message !== '' && message !== ' ') {
            console.log('Received:', message);
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
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, selectedDevice]);

  const disconnect = () => {
    //need to reset esp32 at disconnect
    if (selectedDevice && isConnected) {
      try {
        clearInterval(intervalId);
        setIntervalId(undefined);

        selectedDevice.clear().then(() => {
          console.log('BT buffer cleared');
        });

        selectedDevice.disconnect().then(() => {
          setSelectedDevice(undefined);
          setIsConnected(false);
          setReceivedMessage('');
          console.log('Disconnected from device');
        });

        /*RNBluetoothClassic.unpairDevice(uuid).then( () => {
        console.log("Unpaired from device");
      });
      
      RNBluetoothClassic.pairDevice(uuid).then( () => {
        console.log("paired from device");
      });*/
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  };
  useEffect(() => {
    async function requestBluetoothPermission() {}

    checkBluetoothEnabled();

    requestBluetoothPermission().then(() => {
      startDeviceDiscovery();
    });
  }, []);

  return (
    <View>
      <Text
        style={{
          fontSize: 30,
          textAlign: 'center',
          borderBottomWidth: 1,
        }}>
        Bluetooth Terminal
      </Text>
      <ScrollView>
        {!isConnected && (
          <>
            <TouchableOpacity
              onPress={() => startDeviceDiscovery()}
              style={[styles.deviceButton]}>
              <Text style={[styles.scanButtonText]}>SCAN</Text>
            </TouchableOpacity>
            {/*
          <Text>Available Devices:</Text>
          {devices.map((device) => (
            <Button
              key={device.id}
              title={device.name || 'Unnamed Device'}
              onPress={() => this.connectToDevice(device)}
            />
          ))}
          */}
            <Text>Paired Devices:</Text>
            {paired.map((pair: BluetoothDevice, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 2,
                }}>
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceName}>{pair.name}</Text>
                  <Text style={styles.deviceInfo}>{pair.id}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    isConnected ? disconnect() : connectToDevice(pair)
                  }
                  style={styles.deviceButton}>
                  <Text
                    style={[
                      styles.scanButtonText,
                      {fontWeight: 'bold', fontSize: 12},
                    ]}>
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        {selectedDevice && isConnected && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 5,
              }}>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceName}>{selectedDevice.name}</Text>
                <Text style={styles.deviceInfo}>{selectedDevice.id}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  isConnected ? disconnect() : connectToDevice(selectedDevice)
                }
                style={styles.deviceButton}>
                <Text style={styles.scanButtonText}>
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}; //end of component

export default BluetoothClassicTerminal;
