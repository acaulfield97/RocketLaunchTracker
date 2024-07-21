import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';
import {useRocket} from '../../contexts/RocketContext';
import {
  exportToText,
  exportToCSV,
  requestWritePermission,
} from '../../components/helpers/ExportData';
import styles from '../../styles/locationDataPageStyles';
// @ts-ignore
import backgroundImage from '../../assets/media/images/background_space.jpg';
import AltitudeGraph from './AltitudeGraph';

export default function LocationDataScreen() {
  const {lastKnownData} = useRocket();

  useEffect(() => {
    requestWritePermission();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        {lastKnownData ? (
          <View>
            <View style={styles.sectionContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Last Known Location</Text>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.subTitleText}>Latitude: </Text>
                <Text style={styles.bodyText}>{lastKnownData.latitude}</Text>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.subTitleText}>Longitude: </Text>
                <Text style={styles.bodyText}>{lastKnownData.longitude}</Text>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.subTitleText}>Altitude: </Text>
                <Text style={styles.bodyText}>{lastKnownData.altitude}</Text>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.subTitleText}>Timestamp: </Text>
                <Text style={styles.bodyText}>
                  {new Date(lastKnownData.timestamp).toLocaleString('en-GB', {
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
                  onPress={() => exportToText(lastKnownData)}
                  style={styles.exportButton}>
                  <Text style={styles.exportButtonText}>
                    Export to Plain Text
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => exportToCSV(lastKnownData)}
                  style={styles.exportButton}>
                  <Text style={styles.exportButtonText}>Export to CSV</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Altitude</Text>
              </View>
              <AltitudeGraph />
            </View>
          </View>
        ) : (
          <Text style={styles.bodyText}>No data available</Text>
        )}
      </ImageBackground>
    </View>
  );
}
