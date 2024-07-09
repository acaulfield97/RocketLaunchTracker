import React, {useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useRocket} from '../contexts/RocketContext';
import {
  exportToText,
  exportToCSV,
  requestWritePermission,
} from '../components/helpers/locationDataHelpers';
import styles from '../styles/locationDataPageStyles';
import backgroundImage from '../assets/media/images/background_space.jpg';

export default function LocationDataScreen() {
  const {lastKnownData} = useRocket();

  useEffect(() => {
    requestWritePermission();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.sectionContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Last Known Rocket Data</Text>
          </View>
          {lastKnownData ? (
            <>
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
                  {new Date(lastKnownData.timestamp).toLocaleString()}
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
            </>
          ) : (
            <Text style={styles.bodyText}>No data available</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}
