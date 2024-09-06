// useBluetooth.ts
import {useEffect, useState, useCallback, useRef} from 'react';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import {
  checkBluetoothEnabled,
  requestBluetoothPermissions,
  connectToDeviceUtil,
  disconnectFromDevice,
} from './BluetoothUtils';
import {parseDataStream} from '../helpers/dataParserNMEA';
import {RocketData, BluetoothContextType} from '../../types/types';
import {Alert} from 'react-native';

export const useBluetooth = (): BluetoothContextType => {
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<
    BluetoothDevice | undefined
  >(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
    null,
  );
  const [dataReceivingStatus, setDataReceivingStatus] = useState(false);

  const rocketDataRef = useRef<RocketData>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    time: 0,
    date: 0,
    numberOfSatellitesBeingTracked: 0,
    satellitesInView: 0,
    fixQuality: 0,
  });

  const rocketDataStreamRef = useRef<any[]>([]); // Store entire stream as ref
  const bufferRef = useRef<any[]>([]);
  const stillReadingRef = useRef(false);
  const lastReceivedDataTimestamp = useRef<number | null>(null); // Track last received data time
  const readIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // useRef allows to persist interval across renders
  const [, forceUpdate] = useState(false);

  useEffect(() => {
    async function setupBluetooth() {
      checkBluetoothEnabled();
      const permissionsGranted = await requestBluetoothPermissions();
      if (permissionsGranted) {
        startDeviceDiscovery();
      }
    }
    setupBluetooth();
  }, []);

  // if selectedDevice is truthy and isConnected is true, the interval is
  // set up to call the readData() function every 100 milliseconds
  useEffect(() => {
    let readInterval: ReturnType<typeof setInterval> | undefined;
    if (selectedDevice && isConnected) {
      // call the readData function every 100 milliseconds
      readIntervalRef.current = setInterval(() => readData(), 100);
    }
    // return cleanup function that clears interval when effect is cleaned up
    // occurs when selectedDevice or isConnected changes
    return () => {
      // if readIntervalRef.current is not null, clear the interval to avoid memory leaks or multiple intervals being set
      if (readIntervalRef.current) {
        clearInterval(readIntervalRef.current);
        readIntervalRef.current = null;
      }
    };
  }, [selectedDevice, isConnected]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (bufferRef.current.length > 0) {
        processBuffer();
        forceUpdate(prev => !prev); // Trigger re-render to update the UI with the latest data
      }

      // Check if data has stopped being received (timeout after 5 seconds)
      if (
        lastReceivedDataTimestamp.current &&
        Date.now() - lastReceivedDataTimestamp.current > 5000
      ) {
        setDataReceivingStatus(false);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  // search for paired devices
  const startDeviceDiscovery = useCallback(async () => {
    try {
      const pairedDevices = await RNBluetoothClassic.getBondedDevices();
      setPaired(pairedDevices);
    } catch (error) {
      console.error('Error fetching bonded devices:', error);
    }
  }, []);

  // connect to device
  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    setConnectingDeviceId(device.id);
    const connectionSuccess = await connectToDeviceUtil(device);
    if (connectionSuccess) {
      setSelectedDevice(device);
      setIsConnected(true);
    }
    setConnectingDeviceId(null);
  }, []);

  // disconnect from device
  const disconnect = async () => {
    if (selectedDevice) {
      try {
        await disconnectFromDevice(selectedDevice, () => {
          if (readIntervalRef.current) {
            clearInterval(readIntervalRef.current);
            readIntervalRef.current = null;
          }
        });

        // Clear only the raw data and buffer, but keep processed data intact
        rocketDataStreamRef.current = []; // Clear the data stream for raw data
        bufferRef.current = []; // Clear the buffer

        setSelectedDevice(undefined);
        setIsConnected(false);
        console.log('Disconnected from device');
      } catch (error) {
        console.error('Error disconnecting:', error);
        Alert.alert('Error disconnecting');
      }
    }
  };

  const readData = useCallback(async () => {
    if (stillReadingRef.current || !selectedDevice || !isConnected) {
      return;
    }

    stillReadingRef.current = true;
    try {
      // take in the message via Bluetooth
      let message = await selectedDevice.read();
      if (message) {
        message = message.trim();
        if (message !== '' && message !== ' ') {
          // parse message
          const parsedData = parseDataStream(message.toString());
          if (parsedData) {
            bufferRef.current.push(parsedData); // Add to buffer
            rocketDataStreamRef.current.push(parsedData); // Save entire stream to ref

            // Update the timestamp of the last received data
            lastReceivedDataTimestamp.current = Date.now();
            setDataReceivingStatus(true);
          }
        }
      }
    } catch (error) {
      Alert.alert('Bluetooth disrupted. Please reconnect.');
      setIsConnected(false);
      disconnect();
    } finally {
      stillReadingRef.current = false;
    }
  }, [selectedDevice, isConnected]);

  // process buffered data and update rocket's state
  const processBuffer = () => {
    if (bufferRef.current.length === 0) return;

    const latestData = bufferRef.current[bufferRef.current.length - 1];
    console.log('Processing Buffer Data:', latestData);
    updateRocketData(latestData);

    bufferRef.current = []; // Clear the buffer after processing
  };

  // update the rocket data by taking existing data and merging it with the new parsed data
  const updateRocketData = (parsedData: any) => {
    rocketDataRef.current = {
      ...rocketDataRef.current,
      ...getUpdatedRocketData(parsedData),
    };
  };

  // extract relevant data from parsed sentence
  const getUpdatedRocketData = (parsedData: any) => {
    switch (parsedData.type) {
      case 'GPGGA': {
        const latitude = convertToDecimal(
          parsedData.latitude.split(' ')[0],
          parsedData.latitude.split(' ')[1],
        );
        const longitude = convertToDecimal(
          parsedData.longitude.split(' ')[0],
          parsedData.longitude.split(' ')[1],
        );

        // Check if latitude or longitude is 0 or undefined, break/return if true
        if (
          latitude === 0 ||
          longitude === 0 ||
          latitude === undefined ||
          longitude === undefined
        ) {
          return {};
        }

        return {
          latitude,
          longitude,
          altitude: parseFloat(parsedData.altitude) || 0,
          numberOfSatellitesBeingTracked: parseFloat(
            parsedData.numberOfSatellitesBeingTracked,
          ),
          fixQuality: parseFloat(parsedData.fixQuality),
        };
      }
      case 'GPGSV':
        return {satellitesInView: parseFloat(parsedData.satellitesInView)};
      case 'GPRMC':
        return {
          time: parseFloat(parsedData.time),
          date: parseFloat(parsedData.date),
        };
      case 'GPVTG':
        return {speed: parseFloat(parsedData.speed)};
      default:
        return {};
    }
  };

  // convert long and lat from hours/minutes to decimal format
  const convertToDecimal = (coordinate: string, direction: string): number => {
    if (!coordinate || !direction) return 0;
    let degrees = 0,
      minutes = 0;

    if (direction === 'N' || direction === 'S') {
      degrees = parseFloat(coordinate.slice(0, 2));
      minutes = parseFloat(coordinate.slice(2));
    } else if (direction === 'E' || direction === 'W') {
      degrees = parseFloat(coordinate.slice(0, 3));
      minutes = parseFloat(coordinate.slice(3));
    }

    let decimal = degrees + minutes / 60;
    if (direction === 'S' || direction === 'W') decimal = -decimal;
    return decimal;
  };

  return {
    pairedDevices: paired,
    selectedDevice,
    isConnected,
    rocketData: rocketDataRef.current, // Accessing latest data
    receivedData: rocketDataStreamRef.current, // Full stream of received data
    startDeviceDiscovery,
    connectToDevice,
    connectingDeviceId,
    disconnect,
    dataReceivingStatus,
    setDataReceivingStatus,
    readData,
  };
};
