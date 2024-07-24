import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useRocket} from '../../contexts/RocketContext';
import {
  exportToText,
  exportToCSV,
  requestWritePermission,
} from '../../components/helpers/ExportData';
import styles from '../../styles/locationDataPageStyles';

export default function LastKnownLocationView() {
  const {lastKnownRocketPosition} = useRocket();

  useEffect(() => {
    requestWritePermission();
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Last Known Location</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Latitude: </Text>
        <Text style={styles.bodyText}>{lastKnownRocketPosition.latitude}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Longitude: </Text>
        <Text style={styles.bodyText}>{lastKnownRocketPosition.longitude}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Altitude: </Text>
        <Text style={styles.bodyText}>
          {lastKnownRocketPosition.altitude} m
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Time: </Text>
        <Text style={styles.bodyText}>
          {new Date(lastKnownRocketPosition.timestamp).toLocaleString('en-GB', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
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
