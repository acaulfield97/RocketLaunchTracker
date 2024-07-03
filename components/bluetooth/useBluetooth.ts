// useBluetooth.ts
// Defines a custom hook called useBluetooth which manages bluetooth connections and data processing

import { useEffect, useState, useCallback } from 'react';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { checkBluetoothEnabled, requestBluetoothPermissions, connectToDeviceUtil, disconnectFromDevice } from './BluetoothUtils';
import { parseDataStream } from './DataParserNMEA';

export const useBluetooth = () => {
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice>();
  const [receivedData, setReceivedData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [latestLocation, setLatestLocation] = useState<{latitude: number, longitude: number} | null>(null);

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
    let intervalId: NodeJS.Timer | undefined;
    if (selectedDevice && isConnected) {
      intervalId = setInterval(readData, 100);
      setIntervalId(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, selectedDevice]);

  const startDeviceDiscovery = useCallback(async () => {
    console.log('Searching for devices...');
    try {
      const pairedDevices = await RNBluetoothClassic.getBondedDevices();
      console.log('Bonded peripherals: ' + pairedDevices.length);
      setPaired(pairedDevices);
    } catch (error) {
      console.error('Error fetching bonded devices:', error);
    }
  }, []);

  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    const connectionSuccess = await connectToDeviceUtil(device);
    if (connectionSuccess) {
      setSelectedDevice(device);
      setIsConnected(true);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (selectedDevice && isConnected) {
      disconnectFromDevice(selectedDevice, () => clearInterval(intervalId));
      setSelectedDevice(undefined);
      setIsConnected(false);
      setReceivedData([]);
    }
  }, [selectedDevice, isConnected, intervalId]);

  const readData = useCallback(async () => {
    if (selectedDevice && isConnected) {
      try {
        let message = await selectedDevice.read();
        if (message) {
          message = message.trim();
          if (message !== '' && message !== ' ') {
            const parsedData = parseDataStream(message.toString());
            console.log('Parsed Data:', parsedData);
            setReceivedData(prevData => [...prevData, ...parsedData]);
            
            // Extract and set the latest location from the GPGGA data
            const gpggaData = parsedData.find(data => data.type === 'GPGGA');
            if (gpggaData) {
              const { latitude, longitude } = gpggaData;
              const [lat, latDir] = latitude.split(' ');
              const [lon, lonDir] = longitude.split(' ');
              const latDecimal = convertToDecimal(lat, latDir);
              const lonDecimal = convertToDecimal(lon, lonDir);
              setLatestLocation({ latitude: latDecimal, longitude: lonDecimal });
            }
          }
        }
      } catch (error) {
        console.error('Error reading message:', error);
      }
    }
  }, [selectedDevice, isConnected]);
  
  // Convert NMEA coordinates to decimal
  const convertToDecimal = (coordinate: string, direction: string) => {
    let degrees, minutes;
    
    if (direction === 'N' || direction === 'S') {
      // Latitude has 2 degrees digits
      degrees = parseFloat(coordinate.slice(0, 2));
      minutes = parseFloat(coordinate.slice(2));
    } else if (direction === 'E' || direction === 'W') {
      // Longitude has 3 degrees digits
      degrees = parseFloat(coordinate.slice(0, 3));
      minutes = parseFloat(coordinate.slice(3));
    }
  
    let decimal = degrees + minutes / 60;
    if (direction === 'S' || direction === 'W') {
      decimal = -decimal;
    }
    return decimal;
  };

  return {
    pairedDevices: paired,
    selectedDevice,
    isConnected,
    receivedData,
    latestLocation,
    startDeviceDiscovery,
    connectToDevice,
    disconnect,
  };
};