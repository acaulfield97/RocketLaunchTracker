// SelectedRocketBottomDrawer.tsx

import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Image, Text, View} from 'react-native';
import {useRocket} from '../../contexts/RocketContext';
import {useEffect, useRef} from 'react';
// @ts-ignore
import rocketIcon from '../../assets/media/icons/rocket_icon_purple.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SelectedRocketBottomSheet() {
  const {selectedRocket, distanceToRocket} = useRocket();
  const bottomDrawerRef = useRef<BottomSheet>(null);

  // if rocket marker is selected, expand the bottom drawer
  // displays distance between user and rocket
  useEffect(() => {
    if (selectedRocket) {
      bottomDrawerRef.current?.expand();
    }
  }, [selectedRocket]);

  return (
    <BottomSheet
      ref={bottomDrawerRef}
      index={-1}
      snapPoints={[120]}
      enablePanDownToClose
      backgroundStyle={{backgroundColor: 'white'}}>
      {selectedRocket && (
        <BottomSheetView
          style={{
            flex: 1,
            padding: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
            <Image source={rocketIcon} style={{width: 40, height: 40}} />
            <View style={{flex: 1}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
                QUB3
              </Text>
            </View>
            <View style={{gap: 5}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={24}
                  color="black"
                />
                <Text style={{color: 'gray', fontWeight: 'bold', fontSize: 18}}>
                  {distanceToRocket} km
                </Text>
              </View>
            </View>
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
