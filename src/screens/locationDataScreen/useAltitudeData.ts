import { useEffect, useState } from 'react';
import { useRocket } from '../../contexts/RocketContext';

interface LastKnownData {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
}

interface AltitudeData {
  time: number;
  altitude: number;
}

const useAltitudeData = () => {
  const { lastKnownData } = useRocket();
  const [altitudeData, setAltitudeData] = useState<AltitudeData[]>([]);

  useEffect(() => {
    if (isLastKnownDataValid(lastKnownData)) {
      setAltitudeData(prevData => [
        ...prevData,
        { time: lastKnownData.timestamp, altitude: lastKnownData.altitude },
      ]);
    }
  }, [lastKnownData]);

  // Type guard to ensure lastKnownData is valid
  const isLastKnownDataValid = (data: any): data is LastKnownData => {
    return (
      data &&
      typeof data.altitude === 'number' &&
      typeof data.timestamp === 'number'
    );
  };

  return altitudeData;
};

export default useAltitudeData;
export type { AltitudeData };
