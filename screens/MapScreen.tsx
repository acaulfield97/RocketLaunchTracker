import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styles from '../styles';
import {
  MapView,
  LocationPuck,
  Camera,
  ShapeSource,
  SymbolLayer,
  Images,
  LineLayer,
} from '@rnmapbox/maps';
import {featureCollection, point} from '@turf/helpers';
import rocket from '../components/media/icons/rocket_icon.png';
import rockets from '../data/mockData.json';
import routeResponse from '../data/routeData.json';
import {getDirections} from '../services/directions';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import Geolocation from '@react-native-community/geolocation';

export default function MapScreen() {
  const [direction, setDirection] = useState<number[][] | undefined>();
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    // Fetch current position when the component mounts
    Geolocation.getCurrentPosition(
      position => {
        const coordinates = position.coords;
        setPosition({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
      },
      error => {
        console.error('Error getting current location:', error);
      },
    );
  }, []);

  const points = rockets.map(rocket =>
    point([rocket.longitude, rocket.latitude]),
  );

  const onRocketPress = async (event: OnPressEvent) => {
    try {
      const newDirection = await getDirections(
        [position.longitude, position.latitude], // Pass current position as starting point
        [event.coordinates.longitude, event.coordinates.latitude], // Destination point from rocket press event
      );
      setDirection(newDirection);
    } catch (error) {
      console.error('Error fetching directions:', error);
      // Handle error if needed
    }
  };

  const rocketsFeatures = featureCollection(points);
  return (
    <MapView style={{flex: 1}}>
      <Camera followUserLocation followZoomLevel={12} />
      <LocationPuck
        puckBearingEnabled
        puckBearing="heading"
        bearingImage="compass"
      />
      <ShapeSource
        id="rockets"
        cluster
        shape={rocketsFeatures}
        onPress={onRocketPress}>
        <SymbolLayer
          id="rockets-icons"
          style={{
            iconImage: 'rocket',
            iconSize: 0.06,
            iconAllowOverlap: true,
            iconAnchor: 'center',
          }}
        />
        <Images images={{rocket}} />
      </ShapeSource>

      {direction && (
        <ShapeSource
          id="routeSource"
          lineMetrics
          shape={{
            properties: {},
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: direction,
            },
          }}>
          <LineLayer
            id="exampleLineLayer"
            style={{
              lineColor: '#42A2D9',
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 4,
            }}
          />
        </ShapeSource>
      )}
    </MapView>
  );
}
