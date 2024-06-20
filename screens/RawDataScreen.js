import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import BluetoothClassicTerminal from '../BluetoothManager';

const RawData = ({route}) => {
  const {parsedData} = route.params || {};

  return (
    <ScrollView style={styles.container}>
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
    padding: 10,
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

export default RawData;
