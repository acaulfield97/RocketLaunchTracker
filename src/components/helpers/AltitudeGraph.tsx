import React, {useEffect, useState} from 'react';
import {View, Dimensions, Text, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useRocket} from '../../contexts/RocketContext';
import colors from '../../styles/colors';

interface LastKnownData {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
}

const AltitudeGraph: React.FC = () => {
  const {lastKnownData} = useRocket();
  const [altitudeData, setAltitudeData] = useState<
    {time: number; altitude: number}[]
  >([]);

  useEffect(() => {
    if (isLastKnownDataValid(lastKnownData)) {
      setAltitudeData(prevData => [
        ...prevData,
        {time: lastKnownData.timestamp, altitude: lastKnownData.altitude},
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

  if (altitudeData.length === 0) {
    return <Text>No altitude data available</Text>;
  }

  const data = {
    labels: altitudeData.map(dataPoint =>
      new Date(dataPoint.time).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }),
    ),
    datasets: [
      {
        data: altitudeData.map(dataPoint => dataPoint.altitude),
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width;
  const intervalWidth = 75; // Width of each interval in pixels
  const chartWidth = Math.max(screenWidth, altitudeData.length * intervalWidth);

  return (
    <ScrollView horizontal>
      <View>
        <LineChart
          data={data}
          width={chartWidth}
          height={250}
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
    </ScrollView>
  );
};

export default AltitudeGraph;
