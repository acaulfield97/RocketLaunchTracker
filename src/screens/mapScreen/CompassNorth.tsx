import {
  magnetometer,
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map, filter, combineLatest} from 'rxjs/operators';
import {DeviceEventEmitter} from 'react-native';

// Set the update interval for the sensors
setUpdateIntervalForType(SensorTypes.magnetometer, 5000); // 5s update interval
setUpdateIntervalForType(SensorTypes.accelerometer, 5000); // 5s update interval

const calculateHeading = (mag, acc) => {
  const {x: mx, y: my, z: mz} = mag;
  const {x: ax, y: ay, z: az} = acc;

  // Calculate the azimuth (heading) in radians
  const azimuth = Math.atan2(my, mx);
  const heading = (azimuth * 180) / Math.PI;

  // Normalize the heading
  return heading < 0 ? 360 + heading : heading;
};

export const startCompass = callback => {
  const magnetometerObservable = magnetometer.pipe(
    map(({x, y, z}) => ({x, y, z})),
    filter(mag => !isNaN(mag.x) && !isNaN(mag.y) && !isNaN(mag.z)),
  );

  const accelerometerObservable = accelerometer.pipe(
    map(({x, y, z}) => ({x, y, z})),
    filter(acc => !isNaN(acc.x) && !isNaN(acc.y) && !isNaN(acc.z)),
  );

  const combined = combineLatest([
    magnetometerObservable,
    accelerometerObservable,
  ]).pipe(map(([mag, acc]) => calculateHeading(mag, acc)));

  const subscription = combined.subscribe(heading => {
    callback(heading);
  });

  return () => {
    subscription.unsubscribe();
  };
};
