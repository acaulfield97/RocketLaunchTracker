import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../styles/mapPageStyles';

interface MapStyleToggleButtonProps {
  onPress: () => void;
}

const MapStyleToggleButton: React.FC<MapStyleToggleButtonProps> = ({
  onPress,
}) => {
  return (
    <View style={styles.toggleButtonContainer}>
      <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
        <Icon name="map-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MapStyleToggleButton;
