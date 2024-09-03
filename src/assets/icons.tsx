// icons.tsx
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {ColorValue} from 'react-native';

const getIcon = (
  route: RouteProp<ParamListBase, string>,
  focused: boolean,
  color: number | ColorValue | undefined,
  size: number | undefined,
) => {
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
    case 'Stats':
      iconName = focused ? 'rocket' : 'rocket-outline';
      break;
    default:
      break;
  }

  return <IconComponent name={iconName} size={size} color={color} />;
};

export default getIcon;
