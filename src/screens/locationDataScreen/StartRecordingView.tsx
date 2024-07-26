import React, {useState} from 'react';
import {View, Text, Modal, TextInput, Button} from 'react-native';
import styles from '../../styles/locationDataPageStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useFirebaseDataService from '../../services/useDatabase';

export default function StartRecordingView() {
  const {isRecording, setIsRecording, flightName, setFlightName} =
    useFirebaseDataService();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputFlightName, setInputFlightName] = useState('');

  const handleStartRecording = () => {
    setModalVisible(true);
  };

  const handleSetFlightName = () => {
    setFlightName(inputFlightName);
    setIsRecording(true);
    setModalVisible(false);
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={handleStartRecording}>
        <Text style={styles.recordButtonText}>START RECORDING</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.setFlightNamePopupContainer}>
          <View style={styles.setFlightNamePopupView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Flight Name"
              value={inputFlightName}
              onChangeText={setInputFlightName}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSetFlightName}>
              <Text style={styles.recordButtonText}>
                {' '}
                Submit & Start Recording
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
