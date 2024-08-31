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
import {parseDataStream} from './DataParserNMEA';
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
  const readIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  useEffect(() => {
    let readInterval: ReturnType<typeof setInterval> | undefined;
    if (selectedDevice && isConnected) {
      readIntervalRef.current = setInterval(() => readData(), 100);
    }
    return () => {
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

  const startDeviceDiscovery = useCallback(async () => {
    try {
      const pairedDevices = await RNBluetoothClassic.getBondedDevices();
      setPaired(pairedDevices);
    } catch (error) {
      console.error('Error fetching bonded devices:', error);
    }
  }, []);

  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    setConnectingDeviceId(device.id);
    const connectionSuccess = await connectToDeviceUtil(device);
    if (connectionSuccess) {
      setSelectedDevice(device);
      setIsConnected(true);
    }
    setConnectingDeviceId(null);
  }, []);

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
    console.log('readData called');
    if (stillReadingRef.current || !selectedDevice || !isConnected) {
      return;
    }

    stillReadingRef.current = true;
    try {
      let message = await selectedDevice.read();
      if (message) {
        message = message.trim();
        if (message !== '' && message !== ' ') {
          const parsedData = parseDataStream(message.toString());
          if (parsedData) {
            console.log('Raw Parsed Data:', parsedData);
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

  const processBuffer = () => {
    if (bufferRef.current.length === 0) return;

    const latestData = bufferRef.current[bufferRef.current.length - 1];
    console.log('Processing Buffer Data:', latestData);
    updateRocketData(latestData);

    bufferRef.current = []; // Clear the buffer after processing
  };

  const updateRocketData = (parsedData: any) => {
    rocketDataRef.current = {
      ...rocketDataRef.current,
      ...getUpdatedRocketData(parsedData),
    };
  };

  const getUpdatedRocketData = (parsedData: any) => {
    console.log('Parsed Data:', parsedData); // Log the parsed data
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

        // Log converted values
        console.log('Converted Latitude:', latitude);
        console.log('Converted Longitude:', longitude);

        // Check if latitude or longitude is 0 or undefined, break/return if true
        if (
          latitude === 0 ||
          longitude === 0 ||
          latitude === undefined ||
          longitude === undefined
        ) {
          console.warn('Latitude or Longitude is invalid:', {
            latitude,
            longitude,
          });
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
