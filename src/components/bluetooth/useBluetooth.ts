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
import {RocketData, BluetoothContextType} from '../../types/types';
import {debounce} from 'lodash';
import {Alert} from 'react-native';

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
  const [rocketData, setRocketData] = useState<RocketData>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    time: 0,
    date: '',
    numberOfSatellitesBeingTracked: 0,
    satellitesInView: 0,
    fixQuality: 0,
  });

  const debouncedSetRocketData = useCallback(
    debounce(newRocketData => {
      setRocketData(newRocketData);
    }, 1000),
    [],
  );

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
      intervalId = setInterval(() => readData(), 100);
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

  let stillReading = false;

  const readData = useCallback(async () => {
    if (stillReading || !selectedDevice || !isConnected) {
      return;
    }

    stillReading = true;
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

          setRocketDataStream(prevData => [...prevData, parsedData]);

          debouncedSetRocketData((prevData: RocketData) => {
            switch (parsedData.type) {
              case 'GPGGA':
                return {
                  ...prevData,
                  latitude: convertToDecimal(
                    parsedData.latitude.split(' ')[0],
                    parsedData.latitude.split(' ')[1],
                  ),
                  longitude: convertToDecimal(
                    parsedData.longitude.split(' ')[0],
                    parsedData.longitude.split(' ')[1],
                  ),
                  altitude: isNaN(parseFloat(parsedData.altitude))
                    ? 0
                    : parseFloat(parsedData.altitude),
                  time: getDateFromFields(
                    prevData.date,
                    parsedData.time,
                  ).getTime(),
                  numberOfSatellitesBeingTracked: parseFloat(
                    parsedData.numberOfSatellitesBeingTracked,
                  ),
                  fixQuality: parseFloat(parsedData.fixQuality),
                };
              case 'GPGSV':
                return {
                  ...prevData,
                  satellitesInView: parseFloat(parsedData.satellitesInView),
                };
              case 'GPRMC':
                return {
                  ...prevData,
                  date: parsedData.date,
                };
              case 'GPVTG':
                return {
                  ...prevData,
                  speed: parseFloat(parsedData.speed),
                };
              default:
                return prevData;
            }
          });
        }
      }
    } catch (error) {
      Alert.alert('Bluetooth disrupted. Please reconnect.');
      setIsConnected(false);
      disconnect();
    } finally {
      stillReading = false;
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

  const getDateFromFields = (dateField: string, timeField: string) => {
    const day = parseInt(dateField.slice(0, 2));
    const month = parseInt(dateField.slice(2, 4)) - 1; // Month is 0-based in JS Date
    const year = 2000 + parseInt(dateField.slice(4, 6));
    const hours = parseInt(timeField.slice(0, 2));
    const minutes = parseInt(timeField.slice(2, 4));
    const seconds = parseInt(timeField.slice(4, 6));

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
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
