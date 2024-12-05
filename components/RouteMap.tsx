import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import polyline from 'polyline';
import { auth } from '../firebaseConfig';
import {getIdToken} from '../scripts/getFirebaseID'


const RouteMap = ({ origin, destination, style, onModeChange }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [mode, setMode] = useState('driving'); // Can use 'walking', 'driving', 'bicycling', and 'transit'
    const [loading, setLoading] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        if (origin && destination) {
            getRoute(origin, destination, mode);
        }
    }, [origin, destination, mode]);

    useEffect(() => {
      console.log('Coordinates Updated:', coordinates); // Log after coordinates update
    }, [coordinates]);

const getRoute = async (origin, destination, mode) => {
    setLoading(true);
    try {
        // Retrieve the ID token
        const idToken = await getIdToken(auth);

        // Define the API endpoint
        const apiUrl = `http://ezgoing.app/api/route?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}`;

        // Make the request
        const response = await fetch(apiUrl, {
          method: "GET", // Or "POST", "PUT", etc.
          headers: {
            Authorization: `Bearer ${idToken}`, // Include the ID token in the header
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Is it a valid route?
        if (data.routes.length > 0) {
            const points = decodePolyline(data.routes[0].overview_polyline.points);
            setCoordinates(points);

            if (mapRef.current) {
                const region = {
                    latitude: (origin.latitude + destination.latitude) / 2,
                    longitude: (origin.longitude + destination.longitude) / 2,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                };
                mapRef.current.animateToRegion(region, 1000);
            }

            // TODO: Center and scale map to fit the route

        } else {
            // TODO: Need a way to show no route
            Alert.alert('Error', 'No route found');
        }
    } catch (error) {
        // TODO: Need something to handle errors
        console.error(error);
        Alert.alert('Error', 'Failed to fetch route');
    } finally {
        setLoading(false);
    }
};

    const decodePolyline = (encoded) => {
        // Figure out location
        return polyline.decode(encoded).map(point => ({
            latitude: point[0],
            longitude: point[1]
        }));
    };

    // To have different modes of transport
    const handleModeChange = (newMode) => {
        setMode(newMode);
        onModeChange(newMode);
    };

    useEffect(() => {
        if (coordinates.length > 0 && mapRef.current) {
            const region = {
                latitude: (origin.latitude + destination.latitude) / 2,
                longitude: (origin.longitude + destination.longitude) / 2,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            };
            mapRef.current.animateToRegion(region, 1000);
        }
    }, [coordinates, origin, destination])

return (
    <View style={styles.container}>

    {console.log('Rendering MapView with:', { origin, destination, coordinates })}
    {/* Display the map */}
    <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }}
    >

        {/* Markers for Origin and Destination */}
        {console.log('Marker coords:', { origin, destination })}
        <Marker coordinate={origin} title="Origin" />
        <Marker coordinate={destination} title="Destination" />

        {/* Route Line */}
        {coordinates.length > 0 ? (
            <Polyline
                coordinates={coordinates}
                strokeColor="#FF5733"
                strokeWidth={6}
            />
        ) : null}
    </MapView>

    {/* Transportation Mode Buttons */}
    <View style={styles.buttonContainer}>
        <Button title="Driving" onPress={() => handleModeChange('driving')} />
        <Button title="Walking" onPress={() => handleModeChange('walking')} />
        <Button title="Transit" onPress={() => handleModeChange('transit')} />
        <Button title="Bicycling" onPress={() => handleModeChange('bicycling')} />
        { /*TODO: transit_mode: 'bus|subway|train'*/}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: '#fff',
    },

    map: {
        flex: 1,
    },

    buttonContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: 300,
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default RouteMap;
