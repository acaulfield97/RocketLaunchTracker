import {Images, ShapeSource, SymbolLayer} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
// @ts-ignore
import {featureCollection} from '@turf/helpers';
import {useRocket} from '../contexts/RocketContext';
// @ts-ignore
import rocket from '../assets/media/icons/rocket_icon.png';
import rockets from '../data/mockData.json';

export default function RocketMarkers() {
  const {setSelectedRocket} = useRocket();

  const points = rockets.map(rocket => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [rocket.longitude, rocket.latitude],
    },
    properties: {rocket},
  }));

  const rocketsFeatures = featureCollection(points);

  const onRocketPress = async (event: OnPressEvent) => {
    if (event.features[0]?.properties?.rocket) {
      setSelectedRocket(event.features[0].properties.rocket);
    }
  };

  return (
    <ShapeSource id="rockets" shape={rocketsFeatures} onPress={onRocketPress}>
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
  );
}
