import React from 'react';
import {Images, ShapeSource, SymbolLayer} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
// @ts-ignore
import {featureCollection} from '@turf/helpers';
import {useRocket} from '../../contexts/RocketContext';
// @ts-ignore
import rocketIcon from '../../assets/media/icons/rocket_icon_purple.png';
import {useBluetoothContext} from '../../contexts/BluetoothContext';

export default function RocketMarkers() {
  const {setSelectedRocket} = useRocket();
  const {rocketData} = useBluetoothContext();

  //  Creates a GeoJSON Feature for the rocket if rocketData is available.
  // defines the type as 'Point' with coordinates based on rocketData.longitude and rocketData.latitude.
  const points = rocketData
    ? [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [rocketData.longitude, rocketData.latitude],
          },
          properties: {id: 1},
        },
      ]
    : [];

  // Creates a GeoJSON FeatureCollection from the points array. This is the data structure required by the Mapbox ShapeSource.
  const rocketsFeatures = featureCollection(points);

  // Event handler for when a rocket marker is pressed on the map.
  // calls setSelectedRocket with the coordinates of the pressed marker to update the context with the selected rocket’s position.
  const onRocketPress = async (event: OnPressEvent) => {
    if (event.coordinates) {
      setSelectedRocket(event.coordinates);
    }
  };

  return (
    <ShapeSource id="rockets" shape={rocketsFeatures} onPress={onRocketPress}>
      <SymbolLayer
        id="rockets-icons"
        style={{
          iconImage: 'rocketIcon',
          iconSize: 0.2,
          iconAllowOverlap: true,
          iconAnchor: 'center',
        }}
      />
      <Images images={{rocketIcon}} />
    </ShapeSource>
  );
}
