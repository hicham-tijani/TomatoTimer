import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomDropdown = ({ value, options, onSelect }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (item) => {
    onSelect(item.value);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.selectedText}>{options.find(option => option.value === value)?.label || 'Select'}</Text>
        <Ionicons name={dropdownVisible ? "caret-up-outline" : "caret-down-outline"} size={20} color="black" />
      </TouchableOpacity>

      {dropdownVisible && (
        <FlatList
          data={options}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelect(item)}
            >
              <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                <Text style={styles.optionText1}>{item.label}</Text>
                <Text style={styles.optionText}>{item.text}</Text>
              </View>
              
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  selectedText: {
    fontSize: 16,
    flex: 1,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  optionText1: {
    fontSize: 16,
    textAlign:'right'
  },
});

export default CustomDropdown;
