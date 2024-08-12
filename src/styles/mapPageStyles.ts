import {StyleSheet, Dimensions} from 'react-native';
import colors from './colors';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  showCompassButtonContainer: {
    marginTop: 10,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  showCompassButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
  showCompassButtonText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 16,
    color: colors.white,
  },
  toggleButtonContainer: {
    position: 'absolute',
    width: 150,
    zIndex: 1,
  },
  toggleButton: {
    backgroundColor: colors.dark,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    position: 'absolute',
    zIndex: 1,
    top: 40,
    left: 10,
  },
});

export default styles;
