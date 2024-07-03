// MapScreen.tsx

import React from 'react';
import {View} from 'react-native';
import {MapView, LocationPuck, Camera} from '@rnmapbox/maps';
import {useRocket} from '../../contexts/RocketContext';
import LineRoute from '../LineRoute';
import RocketMarkers from '../RocketMarkers';
import SelectedRocketBottomSheet from '../SelectedRocketBottomDrawer';

export default function MapScreen() {
  const {direction} = useRocket();

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

        {direction && <LineRoute coordinates={direction} />}
      </MapView>

      <SelectedRocketBottomSheet />
    </View>
  );
}
