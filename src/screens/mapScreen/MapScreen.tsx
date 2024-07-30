// MapScreen.tsx

import React, {useState} from 'react';
import {
  View,
  Dimensions,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import Mapbox, {
  MapView,
  LocationPuck,
  Camera,
  offlineManager,
  Images,
} from '@rnmapbox/maps';
import {useRocket} from '../../contexts/RocketContext';
import LineRoute from './LineRoute';
import RocketMarkers from './RocketMarkers';
// @ts-ignore
import compassIcon from '../../assets/media/icons/arrow_icon.png';
// import styles from '../../styles/commonStyles';
import SelectedRocketBottomSheet from './SelectedRocketBottomDrawer';
// @ts-ignore
import geoViewport from '@mapbox/geo-viewport';
import DropdownMenu from '../../components/fragments/DropdownMenu';
// @ts-ignore
import puckArrow from '../../assets/media/icons/puck_arrow.webp';
import commonStyles from '../../styles/commonStyles';

export default function MapScreen() {
  const {directionCoordinates, compassDirection} = useRocket();
  const [touchCoordinates, setTouchCoordinates] = useState<
    [number, number] | null
  >(null);

  const CENTER_COORD: [number, number] = [-73.970895, 40.723279];
  const MAPBOX_VECTOR_TILE_SIZE = 512;

  const STYLE_URL = Mapbox.StyleURL.Outdoors;

  const [packName, setPackName] = useState('pack-1');
  const [showEditTitle, setShowEditTitle] = useState(false);

  const handleMapPress = (event: any) => {
    const {geometry} = event;
    const coords: [number, number] = geometry.coordinates;
    setTouchCoordinates(coords);
    console.log('User touched coordinates:', coords);
  };

  const submitCreatePack = () => {
    setPackName(packName);
    setShowEditTitle(false);

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

    console.log('Pack name submitted:', packName);
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

          // console.log('=> status', await pack?.status());
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
        // console.log('Reset DB done:', result);
      },
    },
  ];

  return (
    <View style={{flex: 1}}>
      <DropdownMenu options={menuOptions} />
      <Modal
        visible={showEditTitle}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditTitle(false)}>
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalView}>
            <TextInput
              value={packName}
              autoFocus={true}
              onChangeText={text => setPackName(text)}
              style={commonStyles.modalInput}
            />
            <TouchableOpacity
              style={commonStyles.modalSubmitButton}
              onPress={submitCreatePack}>
              <Text style={commonStyles.buttonText}> Create Pack</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapView style={{flex: 1}} onPress={handleMapPress} compassEnabled={true}>
        <Camera followUserLocation followZoomLevel={12} heading={90} />
        <Images images={{puckArrow: puckArrow}} />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          bearingImage="puckArrow"
          scale={0.2}
        />
        <RocketMarkers />

        {directionCoordinates && (
          <LineRoute coordinates={directionCoordinates} />
        )}
      </MapView>

      <SelectedRocketBottomSheet />

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
