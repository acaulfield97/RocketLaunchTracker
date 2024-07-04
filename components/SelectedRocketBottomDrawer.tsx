// SelectedRocketBottomDrawer.tsx

import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Image, Text, View} from 'react-native';
import {useRocket} from '../contexts/RocketContext';
import {useEffect, useRef} from 'react';
// @ts-ignore
import rocketIcon from '../assets/media/icons/rocket_icon.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from './Button';

export default function SelectedRocketBottomSheet() {
  const {selectedRocket, routeDistance, routeTime} = useRocket();
  const bottomDrawerRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (selectedRocket) {
      console.log('Selected rocket:', selectedRocket);
      bottomDrawerRef.current?.expand();
    }
  }, [selectedRocket]);

  return (
    <BottomSheet
      ref={bottomDrawerRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      backgroundStyle={{backgroundColor: 'white'}}>
      {selectedRocket && (
        <BottomSheetView
          style={{
            flex: 1,
            padding: 16,
            gap: 20,
          }}>
          {/* Top View */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
            <Image source={rocketIcon} style={{width: 40, height: 40}} />
            <View style={{flex: 1, gap: 5}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
                {/* dynamic names of rocket */}
                {/* ID-{selectedRocket.id} */}
                QUB3
              </Text>
              <Text style={{color: 'gray', fontSize: 18}}>Street name</Text>
            </View>
            <View style={{gap: 5}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Ionicons name="footsteps-sharp" size={24} color="black" />
                <Text style={{color: 'gray', fontWeight: 'bold', fontSize: 18}}>
                  {(routeDistance / 1000).toFixed(1)} km
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Ionicons name="timer" size={24} color="black" />
                <Text style={{color: 'gray', fontWeight: 'bold', fontSize: 18}}>
                  {(routeTime / 60).toFixed(1)} mins
                </Text>
              </View>
            </View>
          </View>
          {/* Bottom View */}
          <View>
            <Button title="Find Rocket" />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
