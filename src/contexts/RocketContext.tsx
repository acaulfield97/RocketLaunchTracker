import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {UserLocationType} from '../types/types';
import {calculateDistance} from '../components/helpers/distanceCalculator';

// define structure of context
interface RocketContextType {
  selectedRocket: any;
  setSelectedRocket: (rocket: any) => void;
  userPosition: UserLocationType;
  distanceToRocket: number | null;
}

// contect to manage and share rocket-related state and user position data
const RocketContext = createContext<RocketContextType>({
  selectedRocket: null,
  setSelectedRocket: () => {},
  userPosition: {
    latitude: 0,
    longitude: 0,
    timestamp: 0,
  },
  distanceToRocket: null,
});

// context provider component that wraps around child components to provide them with the rocket-related state and location updates
export default function RocketProvider({children}: PropsWithChildren<{}>) {
  const [selectedRocket, setSelectedRocket] = useState<any>(null);
  const [userPosition, setUserPosition] = useState<UserLocationType>({
    latitude: 0,
    longitude: 0,
    timestamp: 0,
  });
  const [distanceToRocket, setDistanceToRocket] = useState<number | null>(null);

  // monitor the user's position continuously.
  // When the position changes, it updates userPosition and recalculates the distance to the selected rocket
  useEffect(() => {
    // Start watching the user's position
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const timestamp = position.timestamp;
        console.log('RocketContext.tsx: Updated position:', {
          latitude,
          longitude,
          timestamp,
        });
        setUserPosition({latitude, longitude, timestamp});

        // Calculate distance if a rocket is selected
        if (selectedRocket) {
          const distance = calculateDistance(
            latitude,
            longitude,
            selectedRocket.latitude,
            selectedRocket.longitude,
          );
          setDistanceToRocket(distance);
        }
      },
      error => {
        console.error('Error watching location:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 3, // Update the location when the user moves by 3 meters
        interval: 5000, // Check for updates every 5 seconds
        fastestInterval: 2000,
      },
    );

    // Cleanup the watch on component unmount
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [selectedRocket]);

  // When a rocket is selected, the handleSetSelectedRocket function updates selectedRocket and
  // calculates the distance between the user's current location and the rocket
  const handleSetSelectedRocket = (rocket: any) => {
    setSelectedRocket(rocket);

    // Calculate distance immediately when a rocket is selected
    if (rocket) {
      const distance = calculateDistance(
        userPosition.latitude,
        userPosition.longitude,
        rocket.latitude,
        rocket.longitude,
      );
      setDistanceToRocket(distance);
    } else {
      setDistanceToRocket(null);
    }
  };

  const contextValue: RocketContextType = {
    selectedRocket,
    setSelectedRocket: handleSetSelectedRocket,
    userPosition,
    distanceToRocket,
  };

  // RocketContext.Provider wraps children components, passing down the contextValue
  // (which includes selectedRocket, setSelectedRocket, userPosition, and distanceToRocket)
  return (
    <RocketContext.Provider value={contextValue}>
      {children}
    </RocketContext.Provider>
  );
}

// Custom hook to use the RocketContext
export const useRocket = () => useContext(RocketContext);
