import React from 'react';
import {View, Text} from 'react-native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import styles from '../../styles/locationDataPageStyles';

const SpeedView = () => {
  const {rocketData} = useBluetoothContext();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Speed</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Speed: </Text>
        <Text style={styles.bodyText}>
          {rocketData && rocketData.speed
            ? rocketData.speed + ' kmph'
            : 'Not available'}
        </Text>
      </View>
    </View>
  );
};

export default SpeedView;
