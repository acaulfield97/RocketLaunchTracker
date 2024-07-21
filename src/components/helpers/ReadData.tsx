import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {parseDataStream} from '../bluetooth/DataParserNMEA';

export const readData = async (
  selectedDevice: BluetoothDevice,
  isConnected: boolean,
  setReceivedData: React.Dispatch<React.SetStateAction<any[]>>,
  setLatestLocation: React.Dispatch<
    React.SetStateAction<{latitude: number; longitude: number} | null>
  >,
) => {
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
            const {latitude, longitude} = gpggaData;
            const [lat, latDir] = latitude.split(' ');
            const [lon, lonDir] = longitude.split(' ');
            const latDecimal = convertToDecimal(lat, latDir);
            const lonDecimal = convertToDecimal(lon, lonDir);
            setLatestLocation({latitude: latDecimal, longitude: lonDecimal});
          }
        }
      }
    } catch (error) {
      console.error('Error reading message:', error);
    }
  }
};

// Convert NMEA coordinates to decimal
export const convertToDecimal = (coordinate: string, direction: string) => {
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
