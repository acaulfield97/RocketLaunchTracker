// compass.js
import {
  magnetometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map, filter} from 'rxjs/operators';

// Set the update interval for the sensors (100 ms is standard rate)
setUpdateIntervalForType(SensorTypes.magnetometer, 5000); // 5s update interval

const degreeToDirection = degree => {
  if (degree >= 337.5 || degree < 22.5) {
    return 'N';
  } else if (degree >= 22.5 && degree < 67.5) {
    return 'NE';
  } else if (degree >= 67.5 && degree < 112.5) {
    return 'E';
  } else if (degree >= 112.5 && degree < 157.5) {
    return 'SE';
  } else if (degree >= 157.5 && degree < 202.5) {
    return 'S';
  } else if (degree >= 202.5 && degree < 247.5) {
    return 'SW';
  } else if (degree >= 247.5 && degree < 292.5) {
    return 'W';
  } else {
    return 'NW';
  }
};

export const startCompass = callback => {
  const magnetometerObservable = magnetometer.pipe(
    map(({x, y, z}) => Math.atan2(y, x) * (180 / Math.PI)),
    map(degree => (degree < 0 ? 360 + degree : degree)),
    // map(degree => (degree + 180) % 360), // Reverse the angle - arrow was backwards
    filter(degree => !isNaN(degree)),
  );

  const subscription = magnetometerObservable.subscribe(degree => {
    callback(degree);
  });

  return () => {
    subscription.unsubscribe();
  };
};
