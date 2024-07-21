import {PermissionsAndroid, Platform} from 'react-native';
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
    console.log('No data to export');
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
    console.log('No data to export');
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

