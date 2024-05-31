import React, { useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import debounce from 'lodash.debounce'; 

const SearchBar = ({ onSearch, searchTerm, setSearchTerm, setUsers }) => {
  const handleSearchDebounced = useCallback(debounce(onSearch, 500), []);

  useEffect(() => {
    if (searchTerm) {
      handleSearchDebounced(searchTerm);
    }else{
      setUsers([])
    }

    return () => {
      handleSearchDebounced.cancel();
    };
  }, [searchTerm, handleSearchDebounced]);

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={() => onSearch(searchTerm)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    position: 'relative'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#192126',
    paddingLeft: 15,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 16,
    borderRadius: 10,
  },
  button: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 23,
    top: 10
  },
});

export default SearchBar;
