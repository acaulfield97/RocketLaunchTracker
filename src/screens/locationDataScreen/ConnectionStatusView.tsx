import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../styles/locationDataPageStyles';
import {useBluetoothContext} from '../../contexts/BluetoothContext';

export default function ConnectionStatusView() {
  const {latestRocketData} = useBluetoothContext();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Connection Status</Text>
      </View>
      <View style={styles.connectionStatusContainer}>
        {latestRocketData.numberOfSatellitesBeingTracked === 3 ||
        latestRocketData.numberOfSatellitesBeingTracked === 4 ? (
          <Text style={styles.connectionStatusText}>BASIC</Text>
        ) : latestRocketData.numberOfSatellitesBeingTracked > 4 &&
          latestRocketData.numberOfSatellitesBeingTracked <= 8 ? (
          <Text style={styles.connectionStatusText}>GOOD</Text>
        ) : latestRocketData.numberOfSatellitesBeingTracked > 8 ? (
          <Text style={styles.connectionStatusText}>OPTIMAL</Text>
        ) : latestRocketData.fixQuality === 0 ||
          latestRocketData.numberOfSatellitesBeingTracked < 3 ? (
          <Text style={styles.connectionStatusText}>NO FIX</Text>
        ) : null}
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Number of satellites in use: </Text>
        <Text style={styles.bodyText}>
          {latestRocketData.numberOfSatellitesBeingTracked}{' '}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Number of satellites in view: </Text>
        <Text style={styles.bodyText}>{latestRocketData.satellitesInView}</Text>
      </View>
    </View>
  );
}
