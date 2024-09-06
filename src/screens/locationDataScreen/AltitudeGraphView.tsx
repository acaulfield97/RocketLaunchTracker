// displays a line chart of altitude data using the react-native-chart-kit library
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

// component receives rocketData as a prop
const AltitudeGraphView: FC<AltitudeGraphViewProps> = ({rocketData}) => {
  // altitudeData holds an array of altitude values extracted from the valid RocketData objects. This state is updated when the component receives new rocketData.
  const [altitudeData, setAltitudeData] = useState<AltitudeGraphData[]>([]);

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

  // hook listens for changes to the rocketData prop. When it changes, it filters out any invalid data using the isLastKnownDataValid function.
  // If there’s valid data, the altitudeData state is updated to include the new data points.
  useEffect(() => {
    if (rocketData && Array.isArray(rocketData)) {
      const validData = rocketData.filter(isLastKnownDataValid);

      if (validData.length > 0) {
        setAltitudeData(prevData => {
          const newData = validData.map(data => ({altitude: data.altitude}));
          return [...prevData, ...newData];
        });
      }
    }
  }, [rocketData, isLastKnownDataValid]);

  // Limit the data to the most recent 12 points to avoid lag
  const limitedAltitudeData = altitudeData.slice(-12);

  // useMemo hook is used to memoise the data object (chart data). This prevents unnecessary recalculations of the data object unless altitudeData changes.
  // chart only re-renders when the altitudeData changes
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
