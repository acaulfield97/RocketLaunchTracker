import React, {useEffect, useRef, FC, useState, useCallback} from 'react';
import {View, Dimensions, Text, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import colors from '../../styles/colors';
import {RocketData} from '../../types/types';

interface AltitudeGraphViewProps {
  rocketData: RocketData[];
}

interface AltitudeGraphData {
  time: number;
  altitude: number;
}

const AltitudeGraphView: FC<AltitudeGraphViewProps> = ({rocketData}) => {
  const [altitudeData, setAltitudeData] = useState<AltitudeGraphData[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Type guard to ensure LatestRocketLocation is valid
  const isLastKnownDataValid = useCallback((data: any): data is RocketData => {
    // console.log('DATA GO HERE', data);
    return (
      data &&
      typeof data.latitude === 'number' &&
      typeof data.longitude === 'number' &&
      typeof data.altitude === 'number' &&
      typeof data.time === 'number'
    );
  }, []);

  // Updating altitude data from rocketData if valid
  useEffect(() => {
    if (isLastKnownDataValid(rocketData)) {
      setAltitudeData(prevData => [
        ...prevData,
        {
          time: rocketData.time,
          altitude: rocketData.altitude,
        },
      ]);
    }
  }, [rocketData, isLastKnownDataValid]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [altitudeData]);

  if (altitudeData.length === 0) {
    console.error('altitudeData is empty');
    return <Text>No altitude data available</Text>;
  }

  const data = {
    labels: altitudeData.map(dataPoint =>
      new Date(dataPoint.time).toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
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
    <>
      {!rocketData || rocketData.length === 0 ? (
        <Text>No altitude data available</Text>
      ) : (
        <ScrollView horizontal ref={scrollViewRef}>
          <View style={{paddingLeft: 5}}>
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
      )}
    </>
  );
};

export default AltitudeGraphView;
