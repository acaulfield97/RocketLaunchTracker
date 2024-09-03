import React, {useState} from 'react';
import {
  View,
  Dimensions,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import Mapbox, {
  MapView,
  LocationPuck,
  Camera,
  offlineManager,
  Images,
} from '@rnmapbox/maps';
import RocketMarkers from './RocketMarkers';
import SelectedRocketBottomSheet from './SelectedRocketBottomDrawer';
import geoViewport from '@mapbox/geo-viewport';
import DropdownMenu from '../../components/fragments/DropdownMenu';
// @ts-ignore
import puckArrow from '../../assets/media/icons/puck_arrow_outline.png';
import commonStyles from '../../styles/commonStyles';
import ToggleMapStyle from './ToggleMapStyle';

export default function MapScreen() {
  // const [touchCoordinates, setTouchCoordinates] = useState<
  //   [number, number] | null
  // >(null);
  const CENTER_COORD: [number, number] = [-73.970895, 40.723279];
  const MAPBOX_VECTOR_TILE_SIZE = 512;
  const ZOOM_LEVEL = 12;
  const [packName, setPackName] = useState('');
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [mapStyle, setMapStyle] = useState(Mapbox.StyleURL.Outdoors);

  const toggleMapStyle = () => {
    setMapStyle(prevStyle =>
      prevStyle === Mapbox.StyleURL.Outdoors
        ? Mapbox.StyleURL.Satellite
        : Mapbox.StyleURL.Outdoors,
    );
  };

  // // Leaving this in in case I want to change how the offline map location is set (e.g. by user tapping on map where they want to set boundaries)
  // const handleMapPress = (event: any) => {
  //   const {geometry} = event;
  //   const coords: [number, number] = geometry.coordinates;
  //   setTouchCoordinates(coords);
  //   console.log('User touched coordinates:', coords);
  // };

  const submitCreatePack = () => {
    try {
      setPackName(packName);
      setShowEditTitle(false);

      const {width, height} = Dimensions.get('window');

      const bounds: [number, number, number, number] = geoViewport.bounds(
        CENTER_COORD,
        ZOOM_LEVEL,
        [width, height],
        MAPBOX_VECTOR_TILE_SIZE,
      );

      const packBounds: [[number, number], [number, number]] = [
        [bounds[0], bounds[1]], // Southwest coordinate [longitude, latitude]
        [bounds[2], bounds[3]], // Northeast coordinate [longitude, latitude]
      ];

      const options = {
        name: packName,
        styleURL: mapStyle,
        bounds: packBounds,
        minZoom: 10,
        maxZoom: 20,
        metadata: {
          creationDate: new Date().toISOString(),
        },
      };

      offlineManager.createPack(
        options,
        (region, status) => {
          // Check if the download is complete
          if (status && status.percentage === 100) {
            Alert.alert(
              'Offline Map Downloaded',
              `The offline map "${packName}" has been successfully downloaded.`,
              [{text: 'OK'}],
            );
          }
        },
        error => {
          // Error Handling: Handle any errors that occur during pack creation
          console.error('Error creating offline map pack:', error);
          Alert.alert(
            'Creation Error',
            `An error occurred while creating the offline map pack "${packName}". Please check your network connection and try again.`,
            [{text: 'OK'}],
          );
        },
      );
    } catch (error) {
      // Error Handling: Handle any other unexpected errors
      console.error('Unexpected error during offline map creation:', error);
      Alert.alert(
        'Unexpected Error',
        'An unexpected error occurred while processing your request. Please try again.',
        [{text: 'OK'}],
      );
    }
  };

  const menuOptions = [
    {
      title: `Create offline map`,
      onPress: () => {
        Alert.alert(
          'Set Offline Map Area',
          '1) Navigate to the area on the map that you would like to download for offline use.\n\n2) Choose the style of map to download using the toggle button on the top left of the screen.\n\n3) Create the offline map.',
          [{text: 'OK', onPress: () => setShowEditTitle(!showEditTitle)}],
        );
      },
    },
    {
      title: 'Get offline maps',
      onPress: async () => {
        try {
          await offlineManager.getPacks();
        } catch (error) {
          console.error('Error fetching offline maps:', error);
          Alert.alert(
            'Fetch Error',
            'There was an error fetching the offline maps. Please try again.',
            [{text: 'OK'}],
          );
        }
      },
    },
  ];

  return (
    <View style={{flex: 1}}>
      <DropdownMenu options={menuOptions} />
      <ToggleMapStyle onPress={toggleMapStyle} />
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
              <Text style={commonStyles.buttonText}>Create Offline Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapView
        style={{flex: 1}}
        styleURL={mapStyle}
        // onPress={handleMapPress}
        compassEnabled={true}>
        <Camera followUserLocation followZoomLevel={14} heading={90} />
        <Images images={{puckArrow: puckArrow}} />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          bearingImage="puckArrow"
          scale={0.2}
        />
        <RocketMarkers />
      </MapView>

      <SelectedRocketBottomSheet />
    </View>
  );
}
