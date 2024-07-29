// MapScreen.tsx

import React, {useState} from 'react';
import {View, Image, Dimensions} from 'react-native';
import Mapbox, {
  MapView,
  LocationPuck,
  Camera,
  StyleURL,
  offlineManager,
} from '@rnmapbox/maps';
import {useRocket} from '../../contexts/RocketContext';
import LineRoute from './LineRoute';
import RocketMarkers from './RocketMarkers';
// @ts-ignore
import compassIcon from '../../assets/media/icons/arrow_icon.png';
import styles from '../../styles/commonStyles';
import SelectedRocketBottomSheet from './SelectedRocketBottomDrawer';
import NorthCompass from './NorthCompass';
// @ts-ignore
import geoViewport from '@mapbox/geo-viewport';
import DropdownMenu from '../../components/fragments/DropdownMenu';

export default function MapScreen() {
  const {directionCoordinates, compassDirection} = useRocket();
  const [touchCoordinates, setTouchCoordinates] = useState<
    [number, number] | null
  >(null);

  const CENTER_COORD: [number, number] = [-73.970895, 40.723279];
  const MAPBOX_VECTOR_TILE_SIZE = 512;

  const STYLE_URL = Mapbox.StyleURL.Satellite;

  const [packName, setPackName] = useState('pack-1');
  const [showEditTitle, setShowEditTitle] = useState(false);

  const handleMapPress = (event: any) => {
    const {geometry} = event;
    const coords: [number, number] = geometry.coordinates;
    setTouchCoordinates(coords);
    console.log('User touched coordinates:', coords);
  };

  const menuOptions = [
    {
      title: `Pack name: ${packName}`,
      onPress: () => setShowEditTitle(!showEditTitle),
    },
    {
      title: 'Get all packs',
      onPress: async () => {
        const packs = await offlineManager.getPacks();
        console.log('=> packs:', packs);
        packs.forEach(pack => {
          console.log(
            'pack:',
            pack,
            'name:',
            pack.name,
            'bounds:',
            pack?.bounds,
            'metadata',
            pack?.metadata,
          );
        });
      },
    },
    {
      title: 'Get pack',
      onPress: async () => {
        const pack = await offlineManager.getPack(packName);
        if (pack) {
          console.log(
            'pack:',
            pack,
            'name:',
            pack.name,
            'bounds:',
            pack?.bounds,
            'metadata',
            pack?.metadata,
          );

          console.log('=> status', await pack?.status());
        }
      },
    },
    {
      title: 'Resume pack',
      onPress: async () => {
        const pack = await offlineManager.getPack(packName);
        if (pack) {
          await pack.resume();
        }
      },
    },
    {
      title: 'Remove packs',
      onPress: async () => {
        const result = await offlineManager.resetDatabase();
        console.log('Reset DB done:', result);
      },
    },
    {
      title: 'Create Pack',
      onPress: () => {
        const {width, height} = Dimensions.get('window');
        const bounds: [number, number, number, number] = geoViewport.bounds(
          CENTER_COORD,
          12,
          [width, height],
          MAPBOX_VECTOR_TILE_SIZE,
        );

        const options = {
          name: packName,
          styleURL: STYLE_URL,
          bounds: [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ] as [[number, number], [number, number]],
          minZoom: 10,
          maxZoom: 20,
          metadata: {
            whatIsThat: 'foo',
          },
        };
        offlineManager.createPack(options, (region, status) =>
          console.log('=> progress callback region:', 'status: ', status),
        );
      },
    },
  ];

  return (
    <View style={{flex: 1}}>
      <DropdownMenu options={menuOptions} />
      <MapView style={{flex: 1}} onPress={handleMapPress}>
        <Camera followUserLocation followZoomLevel={12} heading={100} />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          bearingImage="compass"
        />
        <RocketMarkers />

        {directionCoordinates && (
          <LineRoute coordinates={directionCoordinates} />
        )}
      </MapView>

      <SelectedRocketBottomSheet />

      <NorthCompass />

      {/* <View style={styles.compassContainer}>
        <Image
          source={compassIcon}
          style={[
            styles.compassArrow,
            {transform: [{rotate: `${compassDirection}deg`}]},
          ]}
        />
      </View> */}
    </View>
  );
}
