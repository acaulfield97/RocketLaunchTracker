import {useEffect, useState, useCallback} from 'react';
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
import {RocketLocation, BluetoothContextType} from '../../types/types';

export const useBluetooth = (): BluetoothContextType => {
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<
    BluetoothDevice | undefined
  >(undefined);
  const [rocketDataStream, setRocketDataStream] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [latestRocketData, setLatestRocketData] = useState<RocketLocation>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    time: 0,
    numberOfSatellitesBeingTracked: 0,
    satellitesInView: 0,
    fixQuality: 0,
  });
  // const [latestSpeed, setLatestSpeed] = useState<SpeedData | null>(null);

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
      intervalId = setInterval(() => readData(), 300);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId as any);
      }
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

  const disconnect = () => {
    if (selectedDevice && isConnected) {
      try {
        selectedDevice.clear().then(() => {});

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
    if (selectedDevice && isConnected) {
      try {
        let message = await selectedDevice.read();
        if (message) {
          message = message.trim();
          if (message !== '' && message !== ' ') {
            const parsedData = parseDataStream(message.toString());
            console.log('Parsed Data:', parsedData);

            if (!parsedData) {
              return;
            }

            switch (parsedData.type) {
              case 'GPGGA':
                setRocketDataStream(prevData => ({
                  ...prevData,
                  GPGGA: parsedData,
                }));
                setLatestRocketData(prevData => ({
                  ...prevData,
                  latitude: convertToDecimal(
                    parsedData.latitude.split(' ')[0],
                    parsedData.latitude.split(' ')[1],
                  ),
                  longitude: convertToDecimal(
                    parsedData.longitude.split(' ')[0],
                    parsedData.longitude.split(' ')[1],
                  ),
                  altitude: parseFloat(parsedData.altitude),
                  time: parseFloat(parsedData.time),
                  numberOfSatellitesBeingTracked: parseFloat(
                    parsedData.numberOfSatellitesBeingTracked,
                  ),
                  fixQuality: parseFloat(parsedData.fixQuality),
                }));
                break;
              case 'GPGSV':
                setRocketDataStream(prevData => ({
                  ...prevData,
                  GPGSV: [parsedData],
                }));
                setLatestRocketData(prevData => ({
                  ...prevData,
                  satellitesInView: parseFloat(parsedData.satellitesInView),
                }));
                break;
              case 'GPRMC':
                setRocketDataStream(prevData => ({
                  ...prevData,
                  GPRMC: parsedData,
                }));
                break;
              case 'GPVTG':
                setRocketDataStream(prevData => ({
                  ...prevData,
                  GPVTG: parsedData,
                }));
                setLatestRocketData(prevData => ({
                  ...prevData,
                  speed: parseFloat(parsedData.speed),
                }));
                break;
              case 'GPGLL':
                setRocketDataStream(prevData => ({
                  ...prevData,
                  GPGLL: parsedData,
                }));
                break;
              case 'GPGSA':
                setRocketDataStream(prevData => ({
                  ...prevData,
                  GPGSA: parsedData,
                }));

                break;
              default:
                break;
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
    if (!coordinate || !direction) {
      return 0;
    }
    let degrees: number;
    let minutes: number;

    if (direction === 'N' || direction === 'S') {
      // Latitude has 2 degrees digits
      degrees = parseFloat(coordinate.slice(0, 2));
      minutes = parseFloat(coordinate.slice(2));
    } else if (direction === 'E' || direction === 'W') {
      // Longitude has 3 degrees digits
      degrees = parseFloat(coordinate.slice(0, 3));
      minutes = parseFloat(coordinate.slice(3));
    } else {
      return 0;
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
    latestRocketData,
    startDeviceDiscovery,
    connectToDevice,
    disconnect,
  };
};
