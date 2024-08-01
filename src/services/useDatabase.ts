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

  /**
   * Adds datapoint to flight, creates new flight if it doesn't exist
   * Creates custom document ID, and sanitises data to avoid undefined entries
   * @param flightName - name of the flight to be added to
   * @param rocketData - data to be added to the flight
   */
  const addFlightEntry = async (flightName: string, rocketData: RocketData) => {
    try {
      const flight = firestore().collection('launch_data').doc(flightName);
      const customDocumentID = 'data_point_' + generateRandomString(10); // 10 is the length of the random string
      const sanitisedRocketData = Object.fromEntries(
        Object.entries(rocketData).map(([key, value]) => [
          key,
          value === undefined ? null : value,
        ]),
      );
      await flight
        .collection('launch_data_points')
        .doc(customDocumentID)
        .set(sanitisedRocketData);
    } catch (error) {
      console.error('Error adding flight data: ', error);
    }
  };

  const generateRandomString = (length: number): string => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const prevRocketDataRef = useRef(rocketData);
  useEffect(() => {
    if (isRecording) {
      if (prevRocketDataRef.current !== rocketData) {
        addFlightEntry(flightName, rocketData);
      } else {
        let count = 0;
        console.log(
          'rocketData/isRecording changed but no new data to record',
          count++,
        );
      }
    }
  }, [rocketData, isRecording]);

  return {
    isRecording,
    flightName,
    setFlightName,
    setIsRecording,
  };
};

export default useFirebaseDataService;
