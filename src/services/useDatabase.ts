import firestore from '@react-native-firebase/firestore';
import {RocketData} from '../types/types';
import {useEffect, useRef, useState} from 'react';
import {useBluetoothContext} from '../contexts/BluetoothContext';

export interface FirebaseDataServiceProps {
  isRecording: boolean;
  flightName: string;
  setFlightName: (flightName: string) => void;
  setIsRecording: (isRecording: boolean) => void;
}

const useFirebaseDataService = (): FirebaseDataServiceProps => {
  const [flightName, setFlightName] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const {rocketData} = useBluetoothContext();

  const addFlightEntry = async (flightName: string, rocketData: RocketData) => {
    try {
      const flight = firestore().collection('launch_data').doc(flightName);

      // Add an empty field to "launch_data" document (necessary otherwise the document 'does not exist')
      // { merge: true } option ensures that this new field is added without overwriting any existing data in the document
      await flight.set({initialised: true}, {merge: true});

      // Get the current number of data points
      const snapshot = await flight.collection('launch_data_points').get();
      const count = snapshot.size;

      const dataPointID = `data_point_${count + 1}`;

      const sanitisedRocketData = Object.fromEntries(
        Object.entries(rocketData).map(([key, value]) => [
          key,
          value === undefined ? null : value,
        ]),
      );

      await flight
        .collection('launch_data_points')
        .doc(dataPointID)
        .set(sanitisedRocketData);
    } catch (error) {
      console.error('Error adding flight data: ', error);
    }
  };

  const prevRocketDataRef = useRef(rocketData);
  useEffect(() => {
    if (isRecording) {
      if (prevRocketDataRef.current !== rocketData) {
        addFlightEntry(flightName, rocketData);
      } else {
        console.log('rocketData changed but no new data to record');
      }
    }

    // Update the ref with the current rocketData after the logic has run
    prevRocketDataRef.current = rocketData;
  }, [rocketData, isRecording]);

  return {
    isRecording,
    flightName,
    setFlightName,
    setIsRecording,
  };
};

export default useFirebaseDataService;
