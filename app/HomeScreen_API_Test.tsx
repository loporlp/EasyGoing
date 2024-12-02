import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import MapMarker from '../components/MapMarker';
import RouteMap from '../components/RouteMap';
import { getCoords } from '../scripts/nameToCoords.js';

const HomeScreen = () => {
  // State to store the selected place's coordinates
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  // Handle sign out
  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  // Handle place selection from AutocompleteTextBox
  const handlePlaceSelect = async (place): Promise<void> => {
      try {
          const coordinates = await getCoords(place);
          console.log("Coordinates returned:", coordinates);
          setSelectedCoordinates(coordinates)
      } catch (error) {
          console.error("Error during place selection:", error);
      }
  };

  return (
    <View style={styles.container}>
      {/* Account Button in the Top Right */}
      <TouchableOpacity style={styles.accountButton} onPress={handleSignOut}>
        <Text style={styles.accountButtonText}>Account</Text>
      </TouchableOpacity>

      {/* Autocomplete Textbox for searching places */}
            <View style={styles.searchContainer}>
              <Text style={styles.header}>Search for a Place</Text>
              <AutocompleteTextBox onPlaceSelect={handlePlaceSelect} />
            </View>

      {/* Two Buttons in the Middle */}
      <View style={styles.buttonContainer}>
        <Button title="Button 1" onPress={() => {}} />
        <View style={{ height: 20 }} />
        <Button title="Button 2" onPress={() => {}} />
      </View>

      <RouteMap />

      {/* Google Map */}
     <MapMarker coordinates={selectedCoordinates} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // For status bar space
    backgroundColor: '#fff',
  },
  accountButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10, // Make sure the button stays on top of the map
  },
  accountButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  searchContainer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mapContainer: {
    width: '100%',
    height: 300, // Adjust the height of the map as needed
    marginTop: 20, // Space between the buttons and the map
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen;
