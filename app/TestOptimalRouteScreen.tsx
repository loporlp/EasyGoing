import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import MapMarker from '../components/MapMarker';
import RouteMap from '../components/RouteMap';
import { getCoords } from '../scripts/nameToCoords.js';


const TestOptimalRouteScreen = () => {
  // State to store the selected place's coordinates
  const setOrigin = { latitude: 35.7023, longitude: 139.7745 }; // Akihabara Example
  const setDestination = { latitude: 35.7100, longitude: 139.8107 };

  // Handle sign out
  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  const handleModeChange = (text : any) => {
  };


  function handlePlaceSelect(address: { description: string; place_id: string; }): string {
    throw new Error('Function not implemented.');
  }

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

      <RouteMap origin={setOrigin} destination={setDestination} style={styles.map} onModeChange={handleModeChange}/>

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
    height: 300,
  },
});

export default TestOptimalRouteScreen;
