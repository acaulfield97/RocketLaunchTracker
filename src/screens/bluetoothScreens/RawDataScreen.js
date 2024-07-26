// rawdatascreen.js
import React, {useRef, useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import styles from '../../styles/commonStyles';

const RawDataScreen = ({route}) => {
  const {parsedData} = route.params || {};
  const scrollViewRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = event => {
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

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}>
      {parsedData ? (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>
            {JSON.stringify(parsedData, null, 2)}
          </Text>
        </View>
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </ScrollView>
  );
};

export default RawDataScreen;
