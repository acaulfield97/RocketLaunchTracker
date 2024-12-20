import React, {useState} from 'react';
import {View, Text, ImageBackground, Alert} from 'react-native';
import styles from '../../styles/loginPageStyles';
// @ts-ignore
import backgroundImage from '../../assets/media/images/background_space.jpg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MyTextInput from '../../components/fragments/MyTextInput';
import auth from '@react-native-firebase/auth';

export default function CreateAccountScreen({navigation}: {navigation: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // sign up managed by firebase
  const signUpFn = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('User created. Please login');
        navigation.navigate('Login');
      })
      .catch(err => {
        Alert.alert(err.nativeErrorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Create Account</Text>
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
          <MyTextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={signUpFn}>
            <Text style={styles.loginButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
