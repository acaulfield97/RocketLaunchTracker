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
    let readInterval: NodeJS.Timer | undefined;
    if (selectedDevice && isConnected) {
      readInterval = setInterval(() => readData(), 100); // Reduced the read interval to avoid delays
    }
    return () => {
      if (readInterval) clearInterval(readInterval);
    };
  }, [selectedDevice, isConnected]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (bufferRef.current.length > 0) {
        processBuffer();
        forceUpdate(prev => !prev); // Trigger re-render to update the UI with the latest data
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

  const disconnect = () => {
    if (selectedDevice) {
      try {
        selectedDevice.clear();
        selectedDevice.disconnect().then(() => {
          setSelectedDevice(undefined);
          setIsConnected(false);
          console.log('Disconnected from device');
        });
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  };

  const readData = useCallback(async () => {
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
            bufferRef.current.push(parsedData); // Add to buffer
            rocketDataStreamRef.current.push(parsedData); // Save entire stream to ref
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
    switch (parsedData.type) {
      case 'GPGGA':
        return {
          latitude: convertToDecimal(
            parsedData.latitude.split(' ')[0],
            parsedData.latitude.split(' ')[1],
          ),
          longitude: convertToDecimal(
            parsedData.longitude.split(' ')[0],
            parsedData.longitude.split(' ')[1],
          ),
          altitude: parseFloat(parsedData.altitude) || 0,
          numberOfSatellitesBeingTracked: parseFloat(
            parsedData.numberOfSatellitesBeingTracked,
          ),
          fixQuality: parseFloat(parsedData.fixQuality),
        };
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

  const convertToDecimal = (coordinate: string, direction: string) => {
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
  };
};
