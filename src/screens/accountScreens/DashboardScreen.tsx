import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {LaunchData} from '../../../types/types';

const DashboardScreen = () => {
  const [launch, setLaunch] = useState<LaunchData | null>(null);

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
          <Text>Altitude: {launch.altitude}</Text>
          <Text>
            Time: {new Date(launch.time.seconds * 1000).toLocaleString()}
          </Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default DashboardScreen;
