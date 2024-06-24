// rawdatascreen.js
import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

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
        parsedData.map((data, index) => (
          <View key={index} style={styles.dataContainer}>
            <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dataContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dataText: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RawDataScreen;
