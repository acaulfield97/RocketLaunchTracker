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
  const {parsedData = [], onRefresh} = route.params;
  const [data, setData] = useState(parsedData);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isAtBottomNow =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setIsAtBottom(isAtBottomNow);
  };

  useEffect(() => {
    if (scrollViewRef.current && isAtBottom) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [parsedData]);

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
