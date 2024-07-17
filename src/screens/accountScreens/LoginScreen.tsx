import React, {useCallback} from 'react';
import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import styles from '../../styles/loginPageStyles';
// @ts-ignore
import backgroundImage from '../../assets/media/images/background_space.jpg';
import MyTextInput from '../../components/MyTextInput';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/types';

// Define a type for the navigation prop
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const navigateToCreateAccount = useCallback(() => {
    navigation.navigate('CreateAccount');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Login</Text>
        </View>
        <View style={styles.inputsContainer}>
          <MyTextInput placeholder="Enter email or username" />
          <MyTextInput placeholder="Enter password" secureTextEntry />
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.noAccountButton}
            onPress={navigateToCreateAccount}>
            <Text style={styles.textDontHave}>Don't have an account?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
