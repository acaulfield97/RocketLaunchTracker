import React from 'react';
import {View, Text} from 'react-native';
import {useRocket} from '../../contexts/RocketContext';
import styles from '../../styles/locationDataPageStyles';

export default function ConnectionStatusView() {
  const {lastKnownRocketPosition: lastKnownData} = useRocket();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Connection Status</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.subTitleText}> Amazing </Text>
        <Text style={styles.bodyText}> </Text>
      </View>
    </View>
  );
}
