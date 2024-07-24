import React, {useEffect} from 'react';
import {View, Text, ImageBackground, ScrollView} from 'react-native';
import {useRocket} from '../../contexts/RocketContext';
import {requestWritePermission} from '../../components/helpers/ExportData';
import styles from '../../styles/locationDataPageStyles';
// @ts-ignore
import backgroundImage from '../../assets/media/images/background_space.jpg';
import AltitudeGraph from './AltitudeGraph';
import LastKnownLocationView from './LastKnownLocationView';
import StatsView from './StatsView';
import ConnectionStatusView from './ConnectionStatusView';
import UserLocationView from './UserLocationView';

export default function LocationDataScreen() {
  const {lastKnownRocketPosition} = useRocket();

  useEffect(() => {
    requestWritePermission();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <UserLocationView />
        <View style={styles.sectionContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Altitude</Text>
          </View>
          <AltitudeGraph />
        </View>
        {lastKnownRocketPosition ? (
          <ScrollView>
            <ConnectionStatusView />
            <LastKnownLocationView />

            <StatsView />
          </ScrollView>
        ) : (
          <Text style={styles.bodyText}>No data available</Text>
        )}
      </ImageBackground>
    </View>
  );
}
