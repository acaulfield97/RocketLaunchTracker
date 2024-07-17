import React from 'react';
import {View, Text, ImageBackground} from 'react-native';
import styles from '../styles/loginPageStyles';
import backgroundImage from '../assets/media/images/background_space.jpg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MyTextInput from '../components/MyTextInput';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Login</Text>
        </View>
        <View style={styles.inputsContainer}>
          <MyTextInput placeholder="Enter email or username" />
          <MyTextInput placeholder="Enter password" secureTextEntry />
          <Text style={styles.textDontHave}>Don't have an account yet?</Text>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
