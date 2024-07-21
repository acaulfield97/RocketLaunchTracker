import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {LaunchData} from '../../../types/types';
import {useBluetoothContext} from '../../contexts/BluetoothContext';

const DashboardScreen = () => {
  const [launch, setLaunch] = useState<LaunchData | null>(null);

  const addLaunch = () => {
    firestore()
      .collection('launch_data')
      .add({
        location: new firestore.GeoPoint(54.5973, -5.9301),
        altitude: 78,
        time: '142345.123',
      })
      .then(() => {
        console.log('Launch added!');
      });
  };

  const getData = async () => {
    const launchDataCollection = await firestore()
      .collection('launch_data')
      .get();
    console.log(launchDataCollection.docs[0].data());
    setLaunch(launchDataCollection.docs[0].data() as LaunchData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View>
      <Text>Dashboard</Text>
      {launch ? (
        <>
          <Text>Latitude: {launch.location.latitude}</Text>
          <Text>Longitude: {launch.location.longitude}</Text>
          <Text>Altitude: {launch.altitude}m</Text>
          <Text>Time: {launch.time}</Text>
          <Button title="Add" onPress={addLaunch} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default DashboardScreen;
