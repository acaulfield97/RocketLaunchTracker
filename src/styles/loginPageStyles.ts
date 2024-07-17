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
    alignItems: 'center'
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
  inputsContainer: {
    height: 325,
    width: "90%",
    marginTop: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(150, 202, 231, 0.4)',
    justifyContent: 'center',
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
loginButton: {
    marginRight: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.primary,
    width: '100%' as '100%',
    justifyContent: 'center' as 'center',
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
  loginButtonText: {
    fontFamily: 'ZenDots-Regular',
    fontSize: 15,
    color: colors.white,
  },
  inputContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  input: {
    height: 50,
width: '100%',
  },
  border:{
    width: '100%',
    height: 1,
    alignSelf: 'center',
  },
  textDontHave: {
    color: colors.white,
    fontFamily: 'ZenDots-Regular',
    fontSize: 12
  },
  noAccountButton: {
    alignSelf: 'flex-end',
    marginRight: 5,
  }
});

export default styles;