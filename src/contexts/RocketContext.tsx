import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDirectionsWalking} from '../services/directionsWalking';
import {startCompass} from '../screens/mapScreen/Compass';

interface RocketContextType {
  selectedRocket: any;
  setSelectedRocket: (rocket: any) => void;
  direction: any;
  directionCoordinates?: number[][];
  routeTime: number;
  routeDistance: number;
  compassDirection: number;
  lastKnownRocketPosition: {
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp?: number;
  } | null;
  userPosition: {
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp?: number;
  } | null;
  saveRocketPosition: (position: {
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp?: number;
  }) => void;
  loadLastKnownRocketPosition: () => void;
}

const RocketContext = createContext<RocketContextType>({
  selectedRocket: null,
  setSelectedRocket: () => {},
  direction: null,
  routeTime: 0,
  routeDistance: 0,
  compassDirection: 0,
  lastKnownRocketPosition: null,
  userPosition: null,
  saveRocketPosition: () => {},
  loadLastKnownRocketPosition: () => {},
});

export default function RocketProvider({children}: PropsWithChildren<{}>) {
  const [selectedRocket, setSelectedRocket] = useState<any>(null);
  const [direction, setDirection] = useState<any>(null);
  const [userPosition, setUserPosition] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    timestamp: 0,
  });
  const [compassDirection, setCompassDirection] = useState<number>(0);
  const [lastKnownRocketPosition, setLastKnownRocketPosition] = useState<{
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp?: number;
  } | null>(null);

  useEffect(() => {
    const fetchUserCurrentPosition = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude, altitude} = position.coords;
          const timestamp = position.timestamp;
          console.log('RocketContext.tsx: Current position:', {
            latitude,
            longitude,
            altitude,
            timestamp,
          });
          setUserPosition({latitude, longitude, altitude, timestamp});
        },
        error => {
          console.error('Error getting current location:', error);
        },
      );
    };

    const fetchLastKnownRocketPosition = async () => {
      try {
        const data = await AsyncStorage.getItem('lastKnownRocketPosition');
        if (data) {
          setLastKnownRocketPosition(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };

    fetchUserCurrentPosition();
    fetchLastKnownRocketPosition();
  }, []);

  const saveRocketPosition = async (position: {
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp?: number;
  }) => {
    try {
      await AsyncStorage.setItem(
        'lastKnownRocketPosition',
        JSON.stringify(position),
      );
      setLastKnownRocketPosition(position);
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  const loadLastKnownRocketPosition = async () => {
    try {
      const data = await AsyncStorage.getItem('lastKnownRocketPosition');
      if (data) {
        setLastKnownRocketPosition(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }
  };

  // Fetch walking directions whenever the selected rocket or user position changes
  useEffect(() => {
    const fetchDirectionsWalking = async () => {
      if (
        selectedRocket &&
        userPosition.latitude !== 0 &&
        userPosition.longitude !== 0
      ) {
        try {
          console.log('Fetching directions for:', selectedRocket);
          console.log('RocketContext.tsx Current user position:', userPosition);
          const {latitude: rocketLat, longitude: rocketLon} = selectedRocket;

          if (
            rocketLat < -90 ||
            rocketLat > 90 ||
            rocketLon < -180 ||
            rocketLon > 180
          ) {
            throw new Error('Invalid rocket coordinates');
          }

          const newDirection = await getDirectionsWalking(
            [userPosition.longitude, userPosition.latitude], // Starting point (current location)
            [rocketLon, rocketLat], // Destination point (selected rocket)
          );
          setDirection(newDirection);
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      }
    };

    fetchDirectionsWalking();
  }, [selectedRocket, userPosition]);

  // Start and stop compass updates
  useEffect(() => {
    const stopCompass = startCompass(setCompassDirection);
    return stopCompass;
  }, []);

  const contextValue: RocketContextType = {
    selectedRocket,
    setSelectedRocket,
    direction,
    directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates ?? [],
    routeTime: direction?.routes?.[0]?.duration ?? 0,
    routeDistance: direction?.routes?.[0]?.distance ?? 0,
    compassDirection,
    lastKnownRocketPosition,
    userPosition,
    saveRocketPosition,
    loadLastKnownRocketPosition,
  };

  console.log('DIRECTION: ', direction);
  console.log('Route Time:', contextValue.routeTime);
  console.log('Route Distance:', contextValue.routeDistance);
  console.log('Direction Coordinates:', contextValue.directionCoordinates);

  return (
    <RocketContext.Provider value={contextValue}>
      {children}
    </RocketContext.Provider>
  );
}

// Custom hook to use the RocketContext
export const useRocket = () => useContext(RocketContext);
