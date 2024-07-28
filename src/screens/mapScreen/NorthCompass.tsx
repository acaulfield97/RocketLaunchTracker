import React, {useState, useEffect} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {
  magnetometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map, filter} from 'rxjs/operators';

const NorthCompass = () => {
  const [heading, setHeading] = useState(0);
  const rotateAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 500); // Update interval in ms

    const subscription = magnetometer
      .pipe(
        map(({x, y, z}) => {
          // Calculate the heading
          let angle = Math.atan2(y, x) * (180 / Math.PI);
          if (angle < 0) {
            angle += 360;
          }
          return angle;
        }),
        filter(value => !isNaN(value)),
      )
      .subscribe(angle => setHeading(angle));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: heading,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[styles.image, {transform: [{rotate: rotation}]}]}
        source={require('../../assets/media/icons/north_compass.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default NorthCompass;
