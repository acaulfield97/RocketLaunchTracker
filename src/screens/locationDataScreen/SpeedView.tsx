import React from 'react';
import {View, Text} from 'react-native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import styles from '../../styles/locationDataPageStyles';

const SpeedView = () => {
  const {rocketData, dataReceivingStatus} = useBluetoothContext();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Speed</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Speed: </Text>
        <Text style={styles.bodyText}>
          {dataReceivingStatus // Check if data is being received
            ? rocketData.speed !== undefined && rocketData.speed !== null
              ? `${rocketData.speed} kmph` // Display speed including 0
              : 'Not available' // If speed is undefined or null
            : 'Not available'}
        </Text>
      </View>
    </View>
  );
};

export default SpeedView;
