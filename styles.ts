// styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  deviceItem: {
    marginBottom: 2,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 8,
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    margin: 2,
    paddingHorizontal: 20,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 15,
    margin: 2,
    paddingHorizontal: 20,
  },
});

export default styles;
