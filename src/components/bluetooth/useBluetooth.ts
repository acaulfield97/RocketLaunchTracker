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
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
    null,
  );
  const [rocketData, setRocketData] = useState<RocketLocation>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    time: 0,
    numberOfSatellitesBeingTracked: 0,
    satellitesInView: 0,
    fixQuality: 0,
  });

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
    setConnectingDeviceId(device.id);
    const connectionSuccess = await connectToDeviceUtil(device);
    if (connectionSuccess) {
      setSelectedDevice(device);
      setIsConnected(true);
    }
    setConnectingDeviceId(null);
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
          console.log('message here jasojasdoas : ', message);
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
                setRocketData(prevData => ({
                  ...prevData,
                  latitude: convertToDecimal(
                    parsedData.latitude.split(' ')[0],
                    parsedData.latitude.split(' ')[1],
                  ),
                  longitude: convertToDecimal(
                    parsedData.longitude.split(' ')[0],
                    parsedData.longitude.split(' ')[1],
                  ),
                  altitude: isNaN(parseFloat(parsedData.altitude)) // if altitude is NaN return 0
                    ? 0
                    : parseFloat(parsedData.altitude),
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
                setRocketData(prevData => ({
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
                setRocketData(prevData => ({
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

  console.log('useBluetooth.ts LONGITUDE: ', rocketData.longitude);
  console.log('useBluetooth.ts LATITUDE: ', rocketData.latitude);
  console.log('useBluetooth.ts ALTITUDE: ', rocketData.altitude);

  console.log('useBluetooth.ts SPEED: ', rocketData.speed);
  console.log('useBluetooth.ts FIX: ', rocketData.fixQuality);
  console.log('useBluetooth.ts SAT IN VIEW: ', rocketData.satellitesInView);
  console.log(
    'useBluetooth.ts SAT IN USE: ',
    rocketData.numberOfSatellitesBeingTracked,
  );

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
    rocketData,
    startDeviceDiscovery,
    connectToDevice,
    connectingDeviceId,
    disconnect,
  };
};
