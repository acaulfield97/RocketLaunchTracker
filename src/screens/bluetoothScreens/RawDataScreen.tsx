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

// Define props for the screen using navigation stack params
type RawDataScreenProps = NativeStackScreenProps<RootStackParamList, 'RawData'>;

const RawDataScreen: React.FC<RawDataScreenProps> = ({route}) => {
  const {parsedData = [], onRefresh} = route.params;
  const [data, setData] = useState(parsedData);
  const scrollViewRef = useRef<ScrollView>(null); //Ref for the ScrollView component to control scrolling
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // State to manage the refreshing status (to disable button when refreshing)

  // handles scrolling and checks if the user has scrolled to the bottom
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    // Determine if the scroll position is near the bottom of the content
    const isAtBottomNow =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    // Update the state to reflect if it's at the bottom
    setIsAtBottom(isAtBottomNow);
  };

  // Scroll to the bottom of the list when new data is added, if already at the bottom
  useEffect(() => {
    if (scrollViewRef.current && isAtBottom) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [parsedData]);

  // handle the refresh action, calling the passed onRefresh function
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      // Await new data from onRefresh, then update the data and reset refreshing state
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
