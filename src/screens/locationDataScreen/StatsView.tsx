import React from 'react';
import {View, Text} from 'react-native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import styles from '../../styles/locationDataPageStyles';

const StatsView = () => {
  const {rocketData} = useBluetoothContext();

  return (
    <View style={styles.bottomSectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Speed</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Speed (kmph): </Text>
        <Text style={styles.bodyText}>
          {rocketData && rocketData.speed ? rocketData.speed : 'Not available'}
        </Text>
      </View>
    </View>
  );
};

export default StatsView;
