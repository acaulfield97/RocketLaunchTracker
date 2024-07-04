// RocketContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {getDirections} from '../services/directions';

interface RocketContextType {
  selectedRocket: any;
  setSelectedRocket: (rocket: any) => void;
  direction: any;
  directionCoordinates?: number[][];
  routeTime: number;
  routeDistance: number;
}

const RocketContext = createContext<RocketContextType>({
  selectedRocket: null,
  setSelectedRocket: () => {},
  direction: null,
  routeTime: 0,
  routeDistance: 0,
});

export default function RocketProvider({children}: PropsWithChildren<{}>) {
  const [selectedRocket, setSelectedRocket] = useState<any>(null);
  const [direction, setDirection] = useState<any>(null);
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const fetchCurrentPosition = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log('Current position:', {latitude, longitude});
          setPosition({latitude, longitude});
        },
        error => {
          console.error('Error getting current location:', error);
        },
      );
    };

    fetchCurrentPosition();
  }, []);

  useEffect(() => {
    const fetchDirections = async () => {
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

          const newDirection = await getDirections(
            [position.longitude, position.latitude], // Starting point (current location)
            [rocketLon, rocketLat], // Destination point (selected rocket)
          );
          setDirection(newDirection);
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      }
    };

    fetchDirections();
  }, [selectedRocket, position]);

  const contextValue: RocketContextType = {
    selectedRocket,
    setSelectedRocket,
    direction,
    directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates ?? [],
    routeTime: direction?.routes?.[0]?.duration ?? 0,
    routeDistance: direction?.routes?.[0]?.distance ?? 0,
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
