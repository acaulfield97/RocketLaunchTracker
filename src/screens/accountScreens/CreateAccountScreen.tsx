import React from 'react';
import {View, Text, ImageBackground} from 'react-native';
import styles from '../../styles/loginPageStyles';
// @ts-ignore
import backgroundImage from '../../assets/media/images/background_space.jpg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MyTextInput from '../../components/MyTextInput';

export default function CreateAccountScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Create Account</Text>
        </View>
        <View style={styles.inputsContainer}>
          <MyTextInput placeholder="Enter email or username" />
          <MyTextInput placeholder="Enter password" secureTextEntry />
          <MyTextInput placeholder="Confirm password" secureTextEntry />
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
