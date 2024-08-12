// DropdownMenu.tsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../../styles/commonStyles';

interface DropdownMenuProps {
  options: {title: string; onPress: () => void}[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({options}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={commonStyles.burgerMenuIconButton}
        onPress={() => setVisible(!visible)}>
        <Icon
          name={visible ? 'times' : 'bars'}
          size={20}
          color={colors.white}
        />
      </TouchableOpacity>
      {visible && (
        <View style={commonStyles.dropownMenuContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={commonStyles.dropdownMenuOption}
              onPress={option.onPress}>
              <Text style={commonStyles.dropdownOptionText}>
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;
