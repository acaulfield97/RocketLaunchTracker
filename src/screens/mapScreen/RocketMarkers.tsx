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

  const rocketsFeatures = featureCollection(points);

  // Handle rocket press event
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
