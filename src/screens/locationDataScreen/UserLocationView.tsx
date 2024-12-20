import React from 'react';
import {View, Text} from 'react-native';
import {useRocket} from '../../contexts/RocketContext';
import styles from '../../styles/locationDataPageStyles';

export default function UserLocationView() {
  const {userPosition} = useRocket();

  return (
    <View style={styles.bottomSectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>User Location</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Latitude: </Text>
        <Text style={styles.bodyText}>{userPosition.latitude}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Longitude: </Text>
        <Text style={styles.bodyText}>{userPosition.longitude}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}>Time: </Text>
        <Text style={styles.bodyText}>
          {userPosition.timestamp !== 0
            ? new Date(userPosition.timestamp).toLocaleString('en-GB', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : 'Fetching...'}
        </Text>
      </View>
    </View>
  );
}
