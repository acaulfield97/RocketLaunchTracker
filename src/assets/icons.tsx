// icons.tsx
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const getIcon = (route, focused, color, size) => {
  let iconName = 'help-circle-outline'; // Default value
  let IconComponent = Ionicons;

  switch (route.name) {
    case 'Account':
      iconName = focused ? 'person-sharp' : 'person-outline';
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
    case 'Stats':
      iconName = focused ? 'rocket' : 'rocket-outline';
      break;
    default:
      break;
  }

  return <IconComponent name={iconName} size={size} color={color} />;
};

export default getIcon;
