import React from 'react';
import {View, Text} from 'react-native';
import styles from '../styles/styles';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.buttonText}>This is a test of the custom font</Text>
      <Text style={styles.retroButtonText}>
        This is a test of the retro button font
      </Text>
    </View>
  );
}
