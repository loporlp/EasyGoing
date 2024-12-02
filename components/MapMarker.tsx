import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import axios from 'axios';

const apiKey = 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI';

type Coordinates = {
    latitude: number;
    longitude: number;
};

type MapMarkerProps = {
    coordinates: Coordinates;
};

const MapMarker = ({ coordinates }: MapMarkerProps) => {
    const [currentCoordinates, setCoordinates] = useState<Coordinates | null>(coordinates);

    useEffect(() => {
        if (coordinates) {
            setCoordinates(coordinates);
        }
    }, [coordinates]);

    // No coordinates
    if (!currentCoordinates) {
        return <View style={styles.mapContainer}></View>;  // Optional: show a loading spinner here
    }

    return (
        <View style={styles.mapContainer}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    // Smaller value means more zoomed-in
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onRegionChangeComplete={(region) => {
                    // Optionally handle region change if needed (e.g., track user's movement)
                }}
            >
            {/* Marker based on selected coordinates */}
            <Marker coordinate={currentCoordinates} />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: "50%", // Adjust the height of the map as needed
  },
  map: {
    flex: 1,
  },
});

export default MapMarker;
