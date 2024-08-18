import React from 'react';
import {View, Text, ImageBackground, ScrollView} from 'react-native';
import styles from '../../styles/locationDataPageStyles';
// @ts-ignore
import backgroundImage from '../../assets/media/images/background_space.jpg';
import AltitudeGraphView from './AltitudeGraphView';
import LastKnownLocationView from './LastKnownLocationView';
import SpeedView from './SpeedView';
import ConnectionStatusView from './ConnectionStatusView';
import UserLocationView from './UserLocationView';
import StartRecordingView from './StartRecordingView';
import {useBluetoothContext} from '../../contexts/BluetoothContext';

export default function LocationDataScreen() {
  const {rocketData} = useBluetoothContext();

  // Ensure rocketData is an array
  const rocketDataArray = Array.isArray(rocketData) ? rocketData : [rocketData];

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView>
          <StartRecordingView />
          <ConnectionStatusView />
          <LastKnownLocationView />
          <SpeedView />
          <View style={styles.sectionContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Altitude</Text>
            </View>
            <AltitudeGraphView rocketData={rocketDataArray} />
          </View>
          <UserLocationView />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
