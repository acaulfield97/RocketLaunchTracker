import React, {useEffect, FC, useState, useCallback, useMemo} from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import colours from '../../styles/colours';
import {RocketData} from '../../types/types';
import styles from '../../styles/locationDataPageStyles';

interface AltitudeGraphViewProps {
  rocketData: RocketData[];
}

interface AltitudeGraphData {
  altitude: number;
}

// for demo purposes
const generateSampleData = (): AltitudeGraphData[] => {
  // Generate a curve-like sample data for the simulation
  const sampleData: AltitudeGraphData[] = [];
  const baseAltitude = 1000; // starting altitude
  for (let i = 0; i < 50; i++) {
    const time = i * 5; // Simulating 5 seconds intervals
    const altitude = baseAltitude + 200 * Math.sin(time / 10); // Example curve
    sampleData.push({altitude});
  }
  return sampleData;
};

// Function to check if all rocket data points have zero values
const isAllZeroData = (data: RocketData[]): boolean => {
  return data.every(
    item =>
      item.latitude === 0 &&
      item.longitude === 0 &&
      item.altitude === 0 &&
      item.date === 0 &&
      item.fixQuality === 0 &&
      item.numberOfSatellitesBeingTracked === 0 &&
      item.satellitesInView === 0 &&
      item.speed === 0 &&
      item.time === 0,
  );
};

const AltitudeGraphView: FC<AltitudeGraphViewProps> = ({rocketData}) => {
  const [altitudeData, setAltitudeData] = useState<AltitudeGraphData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  // Type guard to ensure LatestRocketLocation is valid
  const isLastKnownDataValid = useCallback((data: any): data is RocketData => {
    return (
      data &&
      typeof data.latitude === 'number' &&
      typeof data.longitude === 'number' &&
      typeof data.altitude === 'number' &&
      typeof data.time === 'number'
    );
  }, []);

  useEffect(() => {
    if (rocketData && Array.isArray(rocketData)) {
      const validData = rocketData.filter(isLastKnownDataValid);

      if (validData.length > 0) {
        if (isAllZeroData(validData)) {
          // Use sample data if all altitudes are zero
          setAltitudeData(generateSampleData());
          setUsingSampleData(true);
        } else {
          setAltitudeData(prevData => {
            const newData = validData.map(data => ({altitude: data.altitude}));
            return [...prevData, ...newData];
          });
          setUsingSampleData(false);
        }
      } else {
        setAltitudeData(generateSampleData());
        setUsingSampleData(true);
      }
    }
  }, [rocketData, isLastKnownDataValid]);

  // DEMO
  // Set up interval for updating data display only if using sample data
  useEffect(() => {
    if (!usingSampleData) return;

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % altitudeData.length;
        return nextIndex;
      });
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [altitudeData, usingSampleData]);

  // Determine limited data based on whether we are using sample data or not
  const limitedAltitudeData = useMemo(() => {
    if (usingSampleData) {
      // Show a range of 12 points centered around the currentIndex for sample data
      return altitudeData.slice(
        Math.max(0, currentIndex - 11),
        currentIndex + 1,
      );
    } else {
      // Show the most recent 12 points for real data
      return altitudeData.slice(-12);
    }
  }, [altitudeData, currentIndex, usingSampleData]);

  // useMemo hook is used to memoize the data object. This prevents unnecessary recalculations of the data object unless altitudeData changes.
  const data = useMemo(() => {
    return {
      labels: limitedAltitudeData.map((_, index) => (index + 1).toString()), // Labels from 1 to 12
      datasets: [
        {
          data: limitedAltitudeData.map(dataPoint => dataPoint.altitude),
        },
      ],
    };
  }, [limitedAltitudeData]);

  return (
    <>
      {limitedAltitudeData.length === 0 ? (
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>Not available</Text>
        </View>
      ) : (
        <View style={[styles.chartContainer, {flex: 1}]}>
          <LineChart
            data={data}
            width={370}
            height={300}
            yAxisLabel=""
            yAxisSuffix="m"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: colours.accent,
              backgroundGradientFrom: colours.primary,
              backgroundGradientTo: colours.secondary,
              decimalPlaces: 2,
              color: (opacity = 1) => colours.accent,
              labelColor: (opacity = 1) => colours.white,
              style: {
                borderRadius: 5,
              },
              propsForDots: {
                r: '3',
                strokeWidth: '2',
                stroke: colours.white,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 5,
            }}
          />
        </View>
      )}
    </>
  );
};

export default AltitudeGraphView;
