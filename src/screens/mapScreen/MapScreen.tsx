// MapScreen.tsx

import React from 'react';
import {View, Image} from 'react-native';
import {MapView, LocationPuck, Camera} from '@rnmapbox/maps';
import {useRocket} from '../../contexts/RocketContext';
import LineRoute from './LineRoute';
import RocketMarkers from './RocketMarkers';
// @ts-ignore
import compassIcon from '../../assets/media/icons/arrow_icon.png';
import styles from '../../styles/styles';
import SelectedRocketBottomSheet from './SelectedRocketBottomDrawer';

export default function MapScreen() {
  const {directionCoordinates, compassDirection} = useRocket();

  return (
    <View style={{flex: 1}}>
      <MapView style={{flex: 1}}>
        <Camera followUserLocation followZoomLevel={12} />
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

      <View style={styles.compassContainer}>
        <Image
          source={compassIcon}
          style={[
            styles.compassArrow,
            {transform: [{rotate: `${compassDirection}deg`}]},
          ]}
        />
      </View>
    </View>
  );
}
