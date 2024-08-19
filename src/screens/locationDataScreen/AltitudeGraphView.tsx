import React, {useEffect, FC, useState, useCallback, useMemo} from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import colors from '../../styles/colors';
import {RocketData} from '../../types/types';
import styles from '../../styles/locationDataPageStyles';

interface AltitudeGraphViewProps {
  rocketData: RocketData[];
}

interface AltitudeGraphData {
  altitude: number;
}

const AltitudeGraphView: FC<AltitudeGraphViewProps> = ({rocketData}) => {
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

  // Limit the data to the most recent 12 points
  const limitedAltitudeData = altitudeData.slice(-12);

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
              backgroundColor: colors.accent,
              backgroundGradientFrom: colors.primary,
              backgroundGradientTo: colors.secondary,
              decimalPlaces: 2,
              color: (opacity = 1) => colors.accent,
              labelColor: (opacity = 1) => colors.white,
              style: {
                borderRadius: 5,
              },
              propsForDots: {
                r: '3',
                strokeWidth: '2',
                stroke: colors.white,
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
