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
import {startCompass} from '../components/compass';

interface RocketContextType {
  selectedRocket: any;
  setSelectedRocket: (rocket: any) => void;
  direction: any;
  directionCoordinates?: number[][];
  routeTime: number;
  routeDistance: number;
  compassDirection: number;
  lastKnownData: {
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp?: number;
  } | null;
}

const RocketContext = createContext<RocketContextType>({
  selectedRocket: null,
  setSelectedRocket: () => {},
  direction: null,
  routeTime: 0,
  routeDistance: 0,
  compassDirection: 0,
  lastKnownData: null,
});

export default function RocketProvider({children}: PropsWithChildren<{}>) {
  const [selectedRocket, setSelectedRocket] = useState<any>(null);
  const [direction, setDirection] = useState<any>(null);
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [compassDirection, setCompassDirection] = useState<number>(0);
  const [lastKnownData, setLastKnownData] = useState<{
    latitude: number;
    longitude: number;
    altitude?: number;
    timestamp?: number;
  } | null>(null);

  useEffect(() => {
    const fetchCurrentPosition = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude, altitude} = position.coords;
          const timestamp = position.timestamp;
          console.log('Current position:', {
            latitude,
            longitude,
            altitude,
            timestamp,
          });
          setPosition({latitude, longitude});
          const data = {latitude, longitude, altitude, timestamp};
          setLastKnownData(data);
          saveDataToStorage(data);
        },
        error => {
          console.error('Error getting current location:', error);
        },
      );
    };

    const loadDataFromStorage = async () => {
      try {
        const data = await AsyncStorage.getItem('lastKnownData');
        if (data) {
          setLastKnownData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };

    const saveDataToStorage = async (data: any) => {
      try {
        await AsyncStorage.setItem('lastKnownData', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving data to storage:', error);
      }
    };

    fetchCurrentPosition();
    loadDataFromStorage();
  }, []);

  // WALKING
  useEffect(() => {
    const fetchDirectionsWalking = async () => {
      if (
        selectedRocket &&
        position.latitude !== 0 &&
        position.longitude !== 0
      ) {
        try {
          console.log('Fetching directions for:', selectedRocket);
          console.log('Current position:', position);
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
            [position.longitude, position.latitude], // Starting point (current location)
            [rocketLon, rocketLat], // Destination point (selected rocket)
          );
          setDirection(newDirection);
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      }
    };

    fetchDirectionsWalking();
  }, [selectedRocket, position]);

  // compass
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
    lastKnownData,
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

export const useRocket = () => useContext(RocketContext);
