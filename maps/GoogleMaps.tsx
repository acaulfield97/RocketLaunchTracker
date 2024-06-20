import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default () => (
  <View style={styles.container}>
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: 54.5973,
        longitude: -5.9301,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}></MapView>
  </View>
);
