import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AutocompleteTextBox = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={(data, details = null) => {
          setSelectedPlace(details);
          console.log(data, details);
        }}
        query={{
          key: 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI',
          language: 'en',
        }}
        fetchDetails={true}
        debounce={200} // Add a small delay for better performance
        styles={{
          textInputContainer: {
            width: '100%',
          },
          textInput: {
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            paddingLeft: 10,
            fontSize: 16,
            borderRadius: 5,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />

      {/* Display the selected place's details */}
      {selectedPlace && (
        <View style={styles.detailsContainer}>
          <Text style={styles.details}>Place Name: {selectedPlace.name}</Text>
          <Text style={styles.details}>Address: {selectedPlace.formatted_address}</Text>
          <Text style={styles.details}>Coordinates: {selectedPlace.geometry.location.lat}, {selectedPlace.geometry.location.lng}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default AutocompleteTextBox;
