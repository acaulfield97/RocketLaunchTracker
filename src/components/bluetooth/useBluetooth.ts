// useBluetooth.ts
// Defines a custom hook called useBluetooth which manages bluetooth connections and data processing

import { useEffect, useState, useCallback } from 'react';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { checkBluetoothEnabled, requestBluetoothPermissions, connectToDeviceUtil, disconnectFromDevice } from './BluetoothUtils';
import { parseDataStream } from './DataParserNMEA';

export const useBluetooth = () => {
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice>();
  const [rocketDataStream, setRocketDataStream] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [latestRocketLocation, setLatestRocketLocation] = useState<{latitude: number, longitude: number, altitude: number, time: number} | null>(null);
  const [latestSpeed, setLatestSpeed] = useState<{ speedKmph: number } | null>(null);

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
      setRocketDataStream([]);
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
            setRocketDataStream(prevData => [...prevData, ...parsedData]);
            
            // Extract and set the latest location from the GPGGA data
            const gpggaData = parsedData.find(data => data.type === 'GPGGA');
            if (gpggaData) {
              const { latitude, longitude, altitude, time } = gpggaData;
              const [lat, latDir] = latitude.split(' ');
              const [lon, lonDir] = longitude.split(' ');
              const latDecimal = convertToDecimal(lat, latDir);
              const lonDecimal = convertToDecimal(lon, lonDir);
              // parse altitude from string to number
              const altitudeNum = parseFloat(altitude);
              const timeNum = parseFloat(time);

              setLatestRocketLocation({ latitude: latDecimal, longitude: lonDecimal, altitude: altitudeNum, time: timeNum});

              console.log("useBluetooth.ts: LATITUDE:", latestRocketLocation?.latitude);
              console.log("useBluetooth.ts: LONGITUDE:", latestRocketLocation?.longitude);
              console.log("useBluetooth.ts: ALTITUDE:", latestRocketLocation?.altitude);
              console.log("useBluetooth.ts: TIME:", latestRocketLocation?.time);
            }

             // Extract and set the latest speed from the GPVTG data
             const gpvtgData = parsedData.find(data => data.type === 'GPVTG');
             if (gpvtgData) {
               const speedKmph = parseFloat(gpvtgData.speed);
               setLatestSpeed({ speedKmph });
          }

          console.log("useBluetooth.ts: SPEED:", latestSpeed);
  
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
    receivedData: rocketDataStream,
    latestRocketLocation,
    latestSpeed,
    startDeviceDiscovery,
    connectToDevice,
    disconnect,
  };
};