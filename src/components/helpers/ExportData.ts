import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {writeFile, DownloadDirectoryPath} from 'react-native-fs';
import Share from 'react-native-share';

export const requestWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Write Storage Permission',
          message: 'This app needs access to your storage to save files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Write storage permission granted');
      } else {
        console.log('Write storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

export const exportToText = async lastKnownData => {
  if (!lastKnownData) {
    Alert.alert('No data to export');
    return;
  }

  const textData = `Latitude: ${lastKnownData.latitude}\nLongitude: ${
    lastKnownData.longitude
  }\nAltitude: ${lastKnownData.altitude ?? 'N/A'}\nTimestamp: ${new Date(
    lastKnownData.timestamp,
  ).toLocaleString()}\n`;

  const path = `${DownloadDirectoryPath}/rocket_data.txt`;

  try {
    await writeFile(path, textData, 'utf8');
    console.log('Text file created at:', path);
    shareFile(path);
  } catch (error) {
    console.error('Error writing text file:', error);
  }
};

export const exportToCSV = async lastKnownData => {
  if (!lastKnownData) {
    Alert.alert('No data to export');
    return;
  }

  const csvData = `Latitude,Longitude,Altitude,Timestamp\n${
    lastKnownData.latitude
  },${lastKnownData.longitude},${lastKnownData.altitude ?? 'N/A'},${new Date(
    lastKnownData.timestamp,
  ).toLocaleString()}\n`;

  const path = `${DownloadDirectoryPath}/rocket_data.csv`;

  try {
    await writeFile(path, csvData, 'utf8');
    console.log('CSV file created at:', path);
    shareFile(path, 'rocket_data', 'text/csv');
  } catch (error) {
    console.error('Error writing CSV file:', error);
  }
};

const shareFile = (filePath, filename, type) => {
  const options = {
    url: `file://${filePath}`,
    type: type,
    filename: filename,
  };

  Share.open(options)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      err && console.error(err);
    });
};

export const exportAllDataToText = async allData => {
  if (!allData) {
    console.log('No data to export');
    return;
  }

  let textData = '';

  const addDataToText = (type, data, index) => {
    if (data) {
      const {latitude, longitude, altitude, time: timestamp} = data;
      textData += `Data ${index + 1} (${type}):\nLatitude: ${
        latitude ?? 'N/A'
      }\nLongitude: ${longitude ?? 'N/A'}\nAltitude: ${
        altitude ?? 'N/A'
      }\nTimestamp: ${new Date(timestamp).toLocaleString()}\n\n`;
    }
  };

  let index = 0;
  // Add data from each NMEA message type
  for (const [type, data] of Object.entries(allData)) {
    addDataToText(type, data, index++);
  }

  const path = `${DownloadDirectoryPath}/all_rocket_data.txt`;

  try {
    await writeFile(path, textData, 'utf8');
    console.log('Text file created at:', path);
    shareFile(path, 'rocket_data', 'text');
  } catch (error) {
    console.error('Error writing text file:', error);
  }
};

export const exportAllDataToCSV = async allData => {
  if (!allData) {
    console.log('No data to export');
    return;
  }

  const csvHeaders = 'Type,Latitude,Longitude,Altitude,Timestamp\n';
  let csvRows = [];

  const addDataToCsv = (type, data) => {
    if (data) {
      const {latitude, longitude, altitude, time: timestamp} = data;
      csvRows.push(
        `${type},${latitude ?? 'N/A'},${longitude ?? 'N/A'},${
          altitude ?? 'N/A'
        },${new Date(timestamp).toLocaleString()}`,
      );
    }
  };

  // Add data from each NMEA message type
  addDataToCsv('GPGGA', allData.GPGGA);
  addDataToCsv('GPRMC', allData.GPRMC);
  addDataToCsv('GPGLL', allData.GPGLL);
  addDataToCsv('GPVTG', allData.GPVTG);
  addDataToCsv('GPGSA', allData.GPGSA);
  addDataToCsv('GPGSV', allData.GPGSV);

  // Combine headers and rows
  const csvData = csvHeaders + csvRows.join('\n');

  const path = `${DownloadDirectoryPath}/all_rocket_data.csv`;

  try {
    await writeFile(path, csvData, 'utf8');
    console.log('CSV file created at:', path);
    shareFile(path, 'all_rocket_data', 'csv');
  } catch (error) {
    console.error('Error writing CSV file:', error);
  }
};
