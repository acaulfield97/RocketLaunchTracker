
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const bluetoothPageStyles = StyleSheet.create({
scanButtonText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'AstroSpace',
    fontWeight: 'normal'
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color: colors.white
  },
  deviceItem: {
    margin: 2,
    justifyContent: 'center'
  },
  deviceName: {
    fontSize: 14,
    color: colors.white,
    fontFamily: 'AstroSpace'
  },
  deviceInfo: {
    fontSize: 8,
    color: colors.white
  },
  connectToDeviceButton: {
    marginBottom: 8,
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.white,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
    alignItems: 'center',
  },
 connectToDeviceButtonText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 12,
    color: colors.dark,
    
  },
  titleContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  scanButton: {
    marginBottom: 20,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.white,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
    alignItems: 'center',
  }
});

export default bluetoothPageStyles;
