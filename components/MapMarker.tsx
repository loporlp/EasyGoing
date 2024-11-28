import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const MapMarker = ({ coordinates, style }) => {
  return (
    <View style={[styles.mapContainer, style]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marker based on selected coordinates */}
        <Marker coordinate={coordinates} />
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
