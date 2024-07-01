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
  headerText: {
    fontSize: 30,
    textAlign: 'center',
    borderBottomWidth: 1,
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  connectButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  viewDataButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    margin: 5,
  },
  viewDataButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'limegreen',
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default styles;
