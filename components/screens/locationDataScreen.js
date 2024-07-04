import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useRocket} from '../../contexts/RocketContext';
import {
  exportToText,
  requestWritePermission,
} from '../helpers/locationDataHelpers';
import styles from '../../styles';

export default function LocationDataScreen() {
  const {lastKnownData} = useRocket();

  useEffect(() => {
    requestWritePermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Last Known Rocket Data</Text>
      {lastKnownData ? (
        <>
          <Text>Latitude: {lastKnownData.latitude}</Text>
          <Text>Longitude: {lastKnownData.longitude}</Text>
          <Text>Altitude: {lastKnownData.altitude}</Text>
          <Text>
            Timestamp: {new Date(lastKnownData.timestamp).toLocaleString()}
          </Text>
          <Button
            title="Export to Text"
            onPress={() => exportToText(lastKnownData)}
          />
        </>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}
