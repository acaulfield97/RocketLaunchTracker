// icons.js
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const getIcon = (route, focused, color, size) => {
  let iconName = 'help-circle-outline'; // Default value
  let IconComponent = Ionicons; // Default to Ionicons

  switch (route.name) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Map':
      iconName = focused ? 'location' : 'location-outline';
      break;
    case 'Bluetooth':
      iconName = focused ? 'bluetooth' : 'bluetooth-outline';
      break;
    case 'RawData':
      iconName = 'test-tube';
      IconComponent = Fontisto;
      break;
    case 'LocationData':
      iconName = focused ? 'rocket' : 'rocket-outline';
      break;
    default:
      break;
  }

  return <IconComponent name={iconName} size={size} color={color} />;
};

export default getIcon;
