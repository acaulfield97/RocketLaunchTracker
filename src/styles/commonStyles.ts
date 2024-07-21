// styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 15,
    margin: 2,
    paddingHorizontal: 20,
  },
  compassContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
  },
  compassArrow: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.dark
  },
  dataContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.dark,
    borderRadius: 5,
  },
  dataText: {
    fontSize: 14,
    color: colors.white
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  headerText: {
    fontFamily: 'AstroSpace',
    fontSize: 30,
    textAlign: 'center',
    borderBottomWidth: 1,
    color: colors.white
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
   
  },
  connectButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.dark
  },
  exportButtonText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 12,
    color: colors.dark,
    
  },
  viewDataButton: {
    padding: 10,
    backgroundColor: colors.accent,
    borderRadius: 5,
    margin: 5,
  },
  viewDataButtonText: {
    color: colors.dark,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.dark,
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
    color: colors.white,
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'center',
    fontFamily: 'ZenDots-Regular',
  },
  retroButton: {
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
    marginTop: 20,
    alignItems: 'center',
  },
  retroButtonText: {
    fontWeight: 'normal',
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'AstroSpace', 
  },
  titleContainer: {
    marginTop: 90,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'AstroSpace',
    fontSize: 30,
    color: colors.white,
  },

});

export default styles;
