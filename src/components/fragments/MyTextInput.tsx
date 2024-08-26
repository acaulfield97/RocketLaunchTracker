import {View, TextInput} from 'react-native';
import React from 'react';
import styles from '../../styles/loginPageStyles';

const MyTextInput = ({...props}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput style={styles.input} {...props} />
      <View style={styles.border}></View>
    </View>
  );
};

export default MyTextInput;
