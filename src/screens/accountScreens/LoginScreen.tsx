import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from '../../styles/loginPageStyles';
// @ts-ignore
import backgroundImage from '../../assets/media/images/background_space.jpg';
import MyTextInput from '../../components/fragments/MyTextInput';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({navigation}: {navigation: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // login fucntion managed by firebase
  const loginWithEmailAndPass = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        Alert.alert('Logged in');
        navigation.navigate('Dashboard');
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Login Error', err.message);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Login</Text>
        </View>
        <View style={styles.inputsContainer}>
          <MyTextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email or username"
          />
          <MyTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={loginWithEmailAndPass}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.noAccountButton}
            onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={styles.textDontHave}>
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
