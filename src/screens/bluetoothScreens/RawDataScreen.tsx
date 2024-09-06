// RawDataScreen.tsx
import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import styles from '../../styles/commonStyles';
import bluetoothPageStyles from '../../styles/bluetoothPageStyles';
import {RootStackParamList} from '../../types/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RawDataScreenProps = NativeStackScreenProps<RootStackParamList, 'RawData'>;

const RawDataScreen: React.FC<RawDataScreenProps> = ({route}) => {
  // route object passed into the component includes parameters (parsedData and onRefresh)
  const {parsedData = [], onRefresh} = route.params;
  const [data, setData] = useState(parsedData); // holds parsed data that is displayed
  const scrollViewRef = useRef<ScrollView>(null); // reference to the ScrollView component, allowing programmatic scrolling to the end when new data is addeds
  const [isAtBottom, setIsAtBottom] = useState(true); //boolean flag to determine if the user is scrolled to the bottom of the list.
  const [isRefreshing, setIsRefreshing] = useState(false); //tracks whether the data is currently being refreshed.

  // Tracks whether the user is scrolled to the bottom by comparing the scroll position (contentOffset.y) and the total height of the scrollable content.
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isAtBottomNow =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setIsAtBottom(isAtBottomNow);
  };

  // scroll to bottom when new data is added
  useEffect(() => {
    if (scrollViewRef.current && isAtBottom) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [parsedData]);

  // async function that calls the onRefresh method passed via the route.params.
  // updates the data and turns off the refreshing state once new data is received.
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      const newData = await onRefresh();
      setData(newData);
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={bluetoothPageStyles.refreshButton}
        onPress={handleRefresh}
        disabled={isRefreshing}>
        <Text style={bluetoothPageStyles.refreshButtonText}>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Text>
      </TouchableOpacity>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {data.length > 0 ? (
          <View style={styles.dataContainer}>
            {data.map((item, index) => (
              <Text key={index} style={styles.dataText}>
                {JSON.stringify(item, null, 2)}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default RawDataScreen;
