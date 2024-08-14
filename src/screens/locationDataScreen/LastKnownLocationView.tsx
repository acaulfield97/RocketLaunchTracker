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
      date: 0,
      time: 0,
    });

  useEffect(() => {
    setLastKnownRocketPosition({
      latitude: rocketData.latitude,
      longitude: rocketData.longitude,
      altitude: rocketData.altitude,
      date: rocketData.date,
      time: rocketData.time,
    });
  }, [rocketData]);

  useEffect(() => {
    requestWritePermission();
  }, []);

  const formatDate = (date: number) => {
    // Ensure the number is a string and pad with leading zeros if needed
    const dateStr = date.toString().padStart(6, '0');

    // Extract day, month, and year from the string
    const day = dateStr.slice(0, 2);
    const month = dateStr.slice(2, 4);
    const year = dateStr.slice(4, 6);

    // Format the date as dd/mm/yy
    return `${day}/${month}/${year}`;
  };

  const formatTimeToUK = (time: number) => {
    const timeStr = time.toString().padStart(6, '0');
    const hour = timeStr.slice(0, 2);
    const minute = timeStr.slice(2, 4);
    const second = timeStr.slice(4, 6);

    // Create a UTC date-time string
    const utcDateTimeStr = `1970-01-01T${hour}:${minute}:${second}Z`;
    const utcDateTime = new Date(utcDateTimeStr);

    // Format date and time for UK timezone
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(utcDateTime);
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
        <Text style={styles.subTitleText}>Date: </Text>
        <Text style={styles.bodyText}>
          {rocketData?.date && rocketData?.time
            ? formatDate(rocketData.date)
            : 'Not available'}
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Time: </Text>
        <Text style={styles.bodyText}>
          {rocketData?.time ? formatTimeToUK(rocketData.time) : 'Not available'}
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
