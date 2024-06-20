// import {View, Text, StyleSheet} from 'react-native';
// import MapboxGL from '@rnmapbox/maps';

// MapboxGL.setAccessToken(
//   'pk.eyJ1IjoiYWNhdWxmaWVsZDk3IiwiYSI6ImNseGxyeWNycjAwbHoyanNrYXl1MHp2cncifQ.TnmB8BQ4SfL5wDpTerOGcQ',
// ); // public key
// MapboxGL.setConnected(true);
// MapboxGL.setTelemetryEnabled(false);
// MapboxGL.setWellKnownTileServer('Mapbox');

// const MapBox = () => {
//   return (
//     <View style={styles.container}>
//       <MapboxGL.MapView
//         style={styles.map}
//         zoomEnabled={true}
//         styleURL="mapbox://styles/mapbox/streets-v12"
//         rotateEnabled={true}>
//         <MapboxGL.Camera
//           zoomLevel={15}
//           centerCoordinate={[-5.9301, 54.5973]}
//           pitch={60}
//           animationMode={'flyTo'}
//           animationDuration={6000}
//         />
//         <MapboxGL.PointAnnotation id="marker" coordinate={[-5.9301, 54.5973]}>
//           <View />
//         </MapboxGL.PointAnnotation>
//       </MapboxGL.MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default MapBox;
