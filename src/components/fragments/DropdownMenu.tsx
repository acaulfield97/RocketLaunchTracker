// DropdownMenu.tsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface DropdownMenuProps {
  options: {title: string; onPress: () => void}[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({options}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(!visible)}>
        <Text style={styles.buttonText}>Menu</Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={option.onPress}>
              <Text style={styles.optionText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: 150,
    zIndex: 1,
  },
  option: {
    padding: 10,
  },
  optionText: {
    color: '#333',
  },
});

export default DropdownMenu;
