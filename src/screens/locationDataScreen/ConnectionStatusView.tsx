import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../styles/locationDataPageStyles';
import {useBluetoothContext} from '../../contexts/BluetoothContext';

export default function ConnectionStatusView() {
  const {rocketData, dataReceivingStatus} = useBluetoothContext();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>GPS QUALITY</Text>
      </View>
      <View style={styles.connectionStatusContainer}>
        {rocketData.fixQuality === 0 ? (
          <Text style={styles.connectionStatusText}>NO FIX</Text>
        ) : rocketData.fixQuality === 1 ? (
          <Text style={styles.connectionStatusText}>STANDARD</Text>
        ) : rocketData.fixQuality === 2 ? (
          <Text style={styles.connectionStatusText}>GOOD</Text>
        ) : rocketData.fixQuality === 3 ? (
          <Text style={styles.connectionStatusText}>GREAT</Text>
        ) : rocketData.fixQuality === 6 ? (
          <Text style={styles.connectionStatusText}>DEAD RECKONING MODE</Text>
        ) : null}
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Receiving data: </Text>
        <Text style={styles.bodyText}>
          {dataReceivingStatus ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Number of satellites in use: </Text>
        <Text style={styles.bodyText}>
          {rocketData.numberOfSatellitesBeingTracked}{' '}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Number of satellites in view: </Text>
        <Text style={styles.bodyText}>{rocketData.satellitesInView}</Text>
      </View>
    </View>
  );
}
