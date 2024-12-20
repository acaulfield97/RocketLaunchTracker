import {StyleSheet, Dimensions} from 'react-native';
import colours from './colours';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.dark,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  sectionContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colours.accent,
    position: 'relative',
    backgroundColor: 'rgba(150, 202, 231, 0.3)',
  },
  bottomSectionContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colours.accent,
    position: 'relative',
    backgroundColor: 'rgba(150, 202, 231, 0.3)',
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
    color: colours.white,
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
    color: colours.accent,
    marginRight: 5,
  },
  bodyText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 14,
    color: colours.white,
  },
  exportButtonContainer: {
    marginTop: 10,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  exportButton: {
    width: '75%',
    backgroundColor: colours.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colours.white,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
  exportButtonText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 12,
    color: colours.white,
  },
  connectionStatusContainer: {
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  connectionStatusText: {
    fontFamily: 'AstroSpace',
    fontSize: 16,
    color: colours.light,
  },
  recordButton: {
    width: '100%',
    backgroundColor: colours.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colours.white,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
  recordButtonText: {
    fontFamily: 'AstroSpace',
    fontSize: 16,
    color: colours.light,
    textAlign: 'center',
  },
  setFlightNamePopupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  setFlightNamePopupView: {
    width: '80%',
    backgroundColor: colours.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 20,
    color: colours.darkPurple,
  },
  submitButton: {
    width: '100%',
    backgroundColor: colours.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colours.white,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
