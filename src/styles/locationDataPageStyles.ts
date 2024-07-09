import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  sectionContainer: {
    margin: 20,
    padding: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.accent,
    position: 'relative',
    backgroundColor: 'rgba(0, 43, 76, 0.4)',
  },
  contentContainer: {
    position: 'relative',
    zIndex: 1,
    padding: 20,
  },
  titleContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'AstroSpace',
    fontSize: 18,
    color: colors.white,
  },
  bodyContainer: {
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  subTitleText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 14,
    color: colors.accent,
    marginRight: 5,
  },
  bodyText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 14,
    color: colors.white,
  },
  exportButtonContainer: {
    marginTop: 10,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  exportButton: {
    width: '50%',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
  exportButtonText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 10,
    color: colors.white,
  }
});

export default styles;
