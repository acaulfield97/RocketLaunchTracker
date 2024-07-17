// RocketMarkers.tsx

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
  const latestLocation = [-5.9353561, 54.5847267];
  // const {latestLocation} = useBluetoothContext();

  const points = latestLocation
    ? [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-5.9353561, 54.5847267],
            // coordinates: [latestLocation.longitude, latestLocation.latitude],
          },
          properties: {
            id: 1,
            rocket: {id: 1, latitude: 54.5847267, longitude: -5.9353561},
          },
          // properties: {id: 1},
        },
      ]
    : [];

  const rocketsFeatures = featureCollection(points);

  const onRocketPress = async (event: OnPressEvent) => {
    if (event.features[0]?.properties?.rocket) {
      setSelectedRocket(event.features[0].properties.rocket);
    }
  };

  console.log('Latest Location:', latestLocation);

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
