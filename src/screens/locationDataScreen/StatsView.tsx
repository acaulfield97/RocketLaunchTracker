import React from 'react';
import {View, Text} from 'react-native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import styles from '../../styles/locationDataPageStyles';

export default function StatsView() {
  const {latestSpeed} = useBluetoothContext();

  return (
    <View style={styles.bottomSectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Speed</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Speed: </Text>
        <Text style={styles.bodyText}>
          {latestSpeed ? `${latestSpeed.speedKmph} km/h` : 'N/A'}
        </Text>
      </View>
    </View>
  );
}
