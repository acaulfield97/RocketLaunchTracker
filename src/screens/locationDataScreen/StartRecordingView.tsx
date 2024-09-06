import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from '../../styles/locationDataPageStyles';
import useFirebaseDataService from '../../services/useDatabase';
import colours from '../../styles/colours';

export default function StartRecordingView() {
  const {isRecording, setIsRecording, setFlightName, doesFlightNameExist} =
    useFirebaseDataService();
  const [modalVisible, setModalVisible] = useState(false);
  const [stopRecordingModalVisible, setStopRecordingModalVisible] =
    useState(false);
  const [inputFlightName, setInputFlightName] = useState('');

  const handleStartRecording = () => {
    if (isRecording) {
      setStopRecordingModalVisible(true); // Show the stop recording confirmation modal
    } else {
      setModalVisible(true); // Show the flight name modal
    }
  };

  // ensure a flight name is not used if it already exists in database as this would cause
  // appendeing data to the wrong flight
  const handleSetFlightName = async () => {
    // Check if the flight name already exists
    const flightNameExists = await doesFlightNameExist(inputFlightName);

    if (flightNameExists) {
      Alert.alert(
        'Flight Name Already Exists',
        'Please choose a different flight name, as this one already exists.',
      );
    } else {
      setFlightName(inputFlightName);
      setIsRecording(true);
      setModalVisible(false);
    }
  };

  // when stop recording is pressed
  const handleConfirmStopRecording = () => {
    setIsRecording(false);
    setStopRecordingModalVisible(false);
    console.log('Recording stopped');
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={handleStartRecording}>
        <Text style={styles.recordButtonText}>
          {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
        </Text>
      </TouchableOpacity>

      {/* Modal for entering flight name */}
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
              placeholderTextColor={colours.bright}
              value={inputFlightName}
              onChangeText={setInputFlightName}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSetFlightName}>
              <Text style={styles.recordButtonText}>
                Submit & Start Recording
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for confirming stop recording */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stopRecordingModalVisible}
        onRequestClose={() => {
          setStopRecordingModalVisible(false);
        }}>
        <View style={styles.setFlightNamePopupContainer}>
          <View style={styles.setFlightNamePopupView}>
            <Text style={styles.recordButtonText}>
              Are you sure you want to stop recording?
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleConfirmStopRecording}>
              <Text style={styles.recordButtonText}>Confirm Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setStopRecordingModalVisible(false)}>
              <Text style={styles.recordButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
