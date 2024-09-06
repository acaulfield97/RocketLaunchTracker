import firestore from '@react-native-firebase/firestore';
import {RocketData} from '../types/types';
import {useEffect, useRef, useState} from 'react';
import {useBluetoothContext} from '../contexts/BluetoothContext';

export interface FirebaseDataServiceProps {
  isRecording: boolean;
  flightName: string;
  setFlightName: (flightName: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  doesFlightNameExist: (flightName: string) => Promise<boolean>;
}

const useFirebaseDataService = (): FirebaseDataServiceProps => {
  const [flightName, setFlightName] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const {rocketData} = useBluetoothContext();

  const addFlightEntry = async (flightName: string, rocketData: RocketData) => {
    try {
      // if document *flightName* doesn't exist, firestore will create it when data is added
      // if it exists, firestore will access it
      const flight = firestore().collection('launch_data').doc(flightName);

      // Add an empty placeholder field to "launch_data" document (necessary otherwise the document
      // 'does not exist')
      // { merge: true } option ensures that this new field is added without overwriting any existing
      // data in the document
      await flight.set({initialised: true}, {merge: true});

      // Get the current number of data points
      const snapshot = await flight.collection('launch_data_points').get();
      const count = snapshot.size;
      const dataPointID = `data_point_${count + 1}`;

      const sanitisedRocketData = Object.fromEntries(
        // convert undefined values in the rocketData object to null since Firestore does not accept
        // undefined as a valid value
        Object.entries(rocketData).map(([key, value]) => [
          key,
          value === undefined ? null : value,
        ]),
      );

      // store data
      await flight
        .collection('launch_data_points')
        .doc(dataPointID)
        .set(sanitisedRocketData);
    } catch (error) {
      console.error('Error adding flight data: ', error);
    }
  };

  // check if flight name already exists to avoid adding data to previous flights
  const doesFlightNameExist = async (flightName: string): Promise<boolean> => {
    try {
      const doc = await firestore()
        .collection('launch_data')
        .doc(flightName)
        .get();
      return doc.exists;
    } catch (error) {
      console.error('Error checking if flight name exists: ', error);
      return false;
    }
  };

  // useRef hook is being used here to keep a reference to the previous value of rocketData across re-renders.
  // This allows the useEffect hook to compare the previous value of rocketData with its current value, which helps determine if a change has occurred
  const prevRocketDataRef = useRef(rocketData);
  useEffect(() => {
    if (isRecording) {
      // if rocketData has changed, record new flight data to db
      if (prevRocketDataRef.current !== rocketData) {
        addFlightEntry(flightName, rocketData);
      } else {
        console.log('No change in data');
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
    doesFlightNameExist,
  };
};

export default useFirebaseDataService;
