import React from 'react';
import {View, Dimensions, Text, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import colors from '../../styles/colors';
import {AltitudeData} from './useAltitudeData';

interface AltitudeGraphViewProps {
  altitudeData: AltitudeData[];
}

const AltitudeGraphView: React.FC<AltitudeGraphViewProps> = ({
  altitudeData = [],
}) => {
  if (altitudeData.length === 0) {
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

export default AltitudeGraphView;
