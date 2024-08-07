import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useBluetoothContext} from '../../contexts/BluetoothContext';
import {
  exportToText,
  exportToCSV,
  requestWritePermission,
} from '../../components/helpers/ExportData';
import styles from '../../styles/locationDataPageStyles';
import {RocketPosition} from '../../types/types';

export default function LastKnownLocationView() {
  const {rocketData} = useBluetoothContext();

  const [lastKnownRocketPosition, setLastKnownRocketPosition] =
    useState<RocketPosition>({
      latitude: 0,
      longitude: 0,
      altitude: 0,
      time: 0,
    });

  useEffect(() => {
    setLastKnownRocketPosition({
      latitude: rocketData.latitude,
      longitude: rocketData.longitude,
      altitude: rocketData.altitude,
      time: rocketData.time,
    });
  }, [rocketData]);

  useEffect(() => {
    requestWritePermission();
  }, []);

  const formatDateToUKTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(timestamp));
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Last Known Location</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Latitude: </Text>
        <Text style={styles.bodyText}>
          {rocketData && rocketData.latitude
            ? rocketData.latitude
            : 'Not available'}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Longitude: </Text>
        <Text style={styles.bodyText}>
          {rocketData && rocketData.longitude
            ? rocketData.longitude
            : 'Not available'}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Altitude: </Text>
        <Text style={styles.bodyText}>
          {rocketData && rocketData.altitude
            ? rocketData.altitude + 'm'
            : 'Not available'}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Time: </Text>
        <Text style={styles.bodyText}>
          {rocketData && rocketData.time
            ? formatDateToUKTime(rocketData.time)
            : 'Not available'}
        </Text>
      </View>
      <View style={styles.exportButtonContainer}>
        <TouchableOpacity
          onPress={() => exportToText(lastKnownRocketPosition)}
          style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export to Plain Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => exportToCSV(lastKnownRocketPosition)}
          style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export to CSV</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
