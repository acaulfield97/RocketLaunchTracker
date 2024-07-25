import {useEffect, useState, useMemo} from 'react';
// import { useBluetoothContext } from '../../contexts/BluetoothContext';

interface LatestRocketLocation {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
}

interface AltitudeGraphData {
  time: number;
  altitude: number;
}

const useAltitudeData = () => {
  // const { latestRocketLocation } = useBluetoothContext();
  const initialLocation: LatestRocketLocation = useMemo(
    () => ({
      latitude: -5.93,
      longitude: 54.58,
      altitude: 101,
      timestamp: Date.now(),
    }),
    [],
  );

  const [altitudeData, setAltitudeData] = useState<AltitudeGraphData[]>([]);
  const [latestRocketLocation, setLatestRocketLocation] =
    useState<LatestRocketLocation>(initialLocation);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLatestRocketLocation(prevLocation => {
        const newAltitude = prevLocation.altitude + (Math.random() * 10 - 5); // Simulate altitude changes
        const newTimestamp = Date.now();
        return {
          ...prevLocation,
          altitude: newAltitude,
          timestamp: newTimestamp,
        };
      });
    }, 10000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (isLastKnownDataValid(latestRocketLocation)) {
      setAltitudeData(prevData => [
        ...prevData,
        {
          time: latestRocketLocation.timestamp,
          altitude: latestRocketLocation.altitude,
        },
      ]);
    }
  }, [latestRocketLocation]);

  // Type guard to ensure LatestRocketLocation is valid
  const isLastKnownDataValid = (data: any): data is LatestRocketLocation => {
    return (
      data &&
      typeof data.latitude === 'number' &&
      typeof data.longitude === 'number' &&
      typeof data.altitude === 'number' &&
      typeof data.timestamp === 'number'
    );
  };

  return altitudeData;
};

export default useAltitudeData;
export type {AltitudeGraphData as AltitudeData};
