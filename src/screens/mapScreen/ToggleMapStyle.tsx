import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../styles/mapPageStyles';

// Defines the type for the props that the MapStyleToggleButton component expects.
//requires a single prop: onPress: A function that gets called when the button is pressed.
interface MapStyleToggleButtonProps {
  onPress: () => void;
}

// Functional component defined with TypeScript's React.FC (Functional Component) type with the props defined by MapStyleToggleButtonProps
const MapStyleToggleButton: React.FC<MapStyleToggleButtonProps> = ({
  onPress, // Destructured from the props and used as the handler for the TouchableOpacity component's onPress event
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
