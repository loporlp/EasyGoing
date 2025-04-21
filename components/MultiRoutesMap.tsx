import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import ErrorBoundary from './ErrorBoundary';

const stroke_width = 4;

interface MultiRoutesMapProps {
  locations: string[][];  // An array of origin-destination pairs
  transportationModes: string[]; // Array of transportation modes
  polylines: any[]; 
  transportDurations: any[];
  markers: any[];
  bounds: any; // Bounds for the map region
  onPolylinesReady?: (polylines: any[]) => void; // Optional callback when polylines are ready
}

const MultiRoutesMap: React.FC<MultiRoutesMapProps> = ({
  locations,
  transportationModes,
  polylines,
  transportDurations,
  markers,
  bounds,
  onPolylinesReady,
}) => {
  const [mapRegion, setMapRegion] = useState<any>(null); // State to store the map's region
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const mapRef = useRef<MapView>(null);
  const isFocused = useIsFocused();
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    const updateRegion = () => {
      if (polylines.length > 0) {
        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLon = Infinity;
        let maxLon = -Infinity;
  
        // Loop through each polyline and calculate the min and max latitudes and longitudes
        polylines.forEach(polyline => {
          polyline.coordinates.forEach((coord: { latitude: number; longitude: number; }) => {
            minLat = Math.min(minLat, coord.latitude);
            maxLat = Math.max(maxLat, coord.latitude);
            minLon = Math.min(minLon, coord.longitude);
            maxLon = Math.max(maxLon, coord.longitude);
          });
        });
  
        // Add some padding around the bounds
        const padding = 0.05;
  
        const newRegion = {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLon + maxLon) / 2,
          latitudeDelta: maxLat - minLat + padding,
          longitudeDelta: maxLon - minLon + padding,
        };
  
        setMapRegion(newRegion);
  
        // Smoothly transition to the new region
        if (mapRef.current && newRegion) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    };
  
    if (isFocused) {
      setMapKey(Date.now()); // Update key when screen is focused
  
      // Call the onPolylinesReady if provided
      if (onPolylinesReady) {
        onPolylinesReady(polylines);
      }
  
      updateRegion();
    }
  
    // When all data has loaded, stop loading
    if (polylines.length > 0 && markers.length > 0 && transportDurations.length > 0 && bounds) {
      setIsLoading(false);
    }
  }, [polylines, transportDurations, markers, bounds, isFocused, onPolylinesReady]);

  return (
    <ErrorBoundary>
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      ) : (
        <MapView
          key={mapKey}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          ref={mapRef}
          region={mapRegion}
          showsUserLocation={true} // Optional: Show user's location
        >
          {/* Render polylines on the map */}
          {polylines.map((polyline, index) => (
            <Polyline
              key={polyline.id}
              coordinates={polyline.coordinates}
              strokeColor={polyline.strokeColor}
              strokeWidth={polyline.strokeWidth}
            />
          ))}

          {/* Render markers for each origin and destination */}
          {markers.map((marker, index) => (
            <React.Fragment key={index}>
              <Marker
                coordinate={{ latitude: marker.origin.latitude, longitude: marker.origin.longitude }}
                title={locations[index][0][0]} // Origin title
                pinColor={
                  transportationModes[index] === 'driving' ? 'red' :
                  transportationModes[index] === 'walking' ? 'blue' :
                  transportationModes[index] === 'transit' ? 'purple' :
                  transportationModes[index] === 'bicycling' ? 'green' :
                  'gray'
                }
                zIndex={10}
              />
              <Marker
                coordinate={{ latitude: marker.destination.latitude, longitude: marker.destination.longitude }}
                title={locations[index][1][0]} // Destination title
                pinColor={
                  transportationModes[index] === 'driving' ? 'red' :
                  transportationModes[index] === 'walking' ? 'blue' :
                  transportationModes[index] === 'transit' ? 'purple' :
                  transportationModes[index] === 'bicycling' ? 'green' :
                  'gray'
                }
                zIndex={10}
              />
            </React.Fragment>
          ))}

          {/* Render route durations above the routes */}
          {transportDurations.map((route, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: markers[index]?.origin?.latitude && markers[index]?.destination?.latitude
                  ? (markers[index].origin.latitude + markers[index].destination.latitude) / 2
                  : 0, // Default to 0 if undefined
                longitude: markers[index]?.origin?.longitude && markers[index]?.destination?.longitude
                  ? (markers[index].origin.longitude + markers[index].destination.longitude) / 2
                  : 0, // Default to 0 if undefined
              }}
            >
              <View style={styles.routeInfoContainer}>
                <Text style={styles.routeText}>
                  {`${route.mode.charAt(0).toUpperCase() + route.mode.slice(1)}: ${route.duration}`}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
        
      )}

      {/*<Text style={styles.subTitle}>Locations:</Text>
      {locations.map((location, index) => (
        <Text key={index} style={styles.text}>
          {`Origin: ${location[0]} - Destination: ${location[1]}`}
        </Text>
      ))}

      <Text style={styles.subTitle}>Transportation Modes:</Text>
      {transportationModes.map((mode, index) => (
        <Text key={index} style={styles.text}>{mode}</Text>
      ))}*/}
    </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#0000ff',
  },
  routeInfoContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent background for text
    padding: 5,
    borderRadius: 10,
  },
  routeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MultiRoutesMap;
