import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import RouteMap from '../components/RouteMap';
import { getCoords } from '../scripts/nameToCoords.js';
import { calculateOptimalRoute } from '../scripts/optimalRoute.js';


const TestOptimalRouteScreen = () => {

  const [optimalRoute, setOptimalRoute] = useState<any[][]>([]);

  const origin = 'Tokyo International Airport, Tokyo';
  let locations = ['Tokyo Tower, Tokyo', 'Shibuya Crossing, Tokyo', 'Kyoto Station, Kyoto'];
  
  useEffect(() => {
    const fetchOptimalRoute = async () => {
      try {
        const result = await calculateOptimalRoute(locations, origin); // Your function for optimal route
        setOptimalRoute(result); // Set optimal route to state
      } catch (error) {
        console.error("Failed to get optimal route:", error);
      }
    };

    fetchOptimalRoute();
  }, []);

  return (
    <View style={styles.container}>
      {optimalRoute.length > 0 ? (
        optimalRoute.map(([origin, destination], index) => (
          <Text key={index} style={styles.routeText}>
            From {origin} to {destination}
          </Text>
        ))
      ) : (
        <Text>Loading optimal route...</Text>
      )}
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
  routeText: {

  }
});

export default TestOptimalRouteScreen;
