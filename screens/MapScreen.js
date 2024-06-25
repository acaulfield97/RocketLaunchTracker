import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styles from '../styles';
import Mapbox, {
  MapView,
  LocationPuck,
  Camera,
  ShapeSource,
  SymbolLayer,
  Images,
} from '@rnmapbox/maps';
import {featureCollection, point} from '@turf/helpers';
import rocket from '../components/media/icons/rocket_icon.png';
import rockets from '../data/mockData.json';

export default function MapScreen() {
  const points = rockets.map(rocket =>
    point([rocket.longitude, rocket.latitude]),
  );
  const rocketsFeatures = featureCollection(points);
  return (
    <MapView style={{flex: 1}}>
      <Camera followUserLocation followZoomLevel={12} />
      <LocationPuck
        puckBearingEnabled
        puckBearing="heading"
        bearingImage="compass"
      />
      <ShapeSource id="rockets" shape={rocketsFeatures}>
        <SymbolLayer
          id="rockets-icons"
          style={{iconImage: 'rocket', iconSize: 0.05, iconAllowOverlap: true}}
        />
        <Images images={{rocket}} />
      </ShapeSource>
    </MapView>
  );
}
