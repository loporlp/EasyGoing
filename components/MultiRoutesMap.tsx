import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { fetchPolylinesAndDurations } from '../scripts/routeHelpers';
import { useIsFocused } from '@react-navigation/native';

const stroke_width = 4;

interface MultiRoutesMapProps {
  locations: string[][];  // An array of origin-destination pairs
  transportationModes: string[]; // Array of transportation modes
  onPolylinesReady?: (polylines: any[]) => void; // The list of routes
}

const MultiRoutesMap: React.FC<MultiRoutesMapProps> = ({ locations, transportationModes, onPolylinesReady }) => {
  const [polylines, setPolylines] = useState<any[]>([]); // State to store polylines
  const [transportDurations, setTransportDurations] = useState<any[]>([]) // State to store transport durations
  const [mapRegion, setMapRegion] = useState<any>(null); // State to store the map's region
  const [markers, setMarkers] = useState<any[]>([]); // State to store marker data
  const mapRef = useRef<MapView>(null);
  const isFocused = useIsFocused();
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    const loadPolylines = async () => {
      if (isFocused) {
        console.log("Screen is focused, fetching polylines, markers, and durations...");
        setMapKey(Date.now()); // Update key when screen is focused

        // Use the helper function to fetch polylines, markers, and durations
        const { polylines: fetchedPolylines, transportDurations: fetchedDurations, markers: fetchedMarkers, bounds } = await fetchPolylinesAndDurations(locations, transportationModes);

        // Update state with the fetched data
        setPolylines(fetchedPolylines);
        setTransportDurations(fetchedDurations);
        setMarkers(fetchedMarkers);

        // If the parent provided a callback, call it with the polylines
        if (onPolylinesReady) {
          onPolylinesReady(fetchedPolylines);
        }

        // Set the map region to focus on the route(s)
        if (bounds.minLat !== Infinity && bounds.maxLat !== -Infinity && bounds.minLon !== Infinity && bounds.maxLon !== -Infinity) {
          const padding = 0.05; // Adjust padding to give some space around the routes
          const newRegion = {
            latitude: (bounds.minLat + bounds.maxLat) / 2,
            longitude: (bounds.minLon + bounds.maxLon) / 2,
            latitudeDelta: bounds.maxLat - bounds.minLat + padding,
            longitudeDelta: bounds.maxLon - bounds.minLon + padding,
          };

          setMapRegion(newRegion);

          // Smoothly transition to the new region
          if (mapRef.current && newRegion) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      } else {
        // Optionally reset polylines, markers, and durations when screen is unfocused
        setPolylines([]);
        setMarkers([]);
        setTransportDurations([]);
        setMapRegion(null);
      }
    };

    loadPolylines();
  }, [locations, transportationModes, isFocused]);

  return (
    <View style={styles.container}>
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
              zIndex={10}
            />
            <Marker
              coordinate={{ latitude: marker.destination.latitude, longitude: marker.destination.longitude }}
              title={locations[index][1][0]} // Destination title
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
                {`${route.mode}: ${route.duration}`}
              </Text>
            </View>
          </Marker>
        ))}

      </MapView>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
  map: {
    width: '100%',
    height: '50%',
    marginTop: 20,
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
