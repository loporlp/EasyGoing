import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { getRoutePolyline } from '../scripts/routePolyline';
import { getCoords } from '../scripts/nameToCoords.js';
import { useIsFocused } from '@react-navigation/native';

interface MultiRoutesMapProps {
  locations: string[][]; // An array of origin-destination pairs
  transportationModes: string[]; // Array of transportation modes
}

const stroke_width = 4;

const MultiRoutesMap: React.FC<MultiRoutesMapProps> = ({ locations, transportationModes }) => {
  const [polylines, setPolylines] = useState<any[]>([]); // State to store polylines
  const [transportDurations, setTransportDurations] = useState<any[]>([]) // State to store transport durations
  const [mapRegion, setMapRegion] = useState<any>(null); // State to store the map's region
  const [markers, setMarkers] = useState<any[]>([]); // State to store marker data
  const mapRef = useRef<MapView>(null);
  const isFocused = useIsFocused();
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    // Fetch polylines and markers asynchronously
    const fetchPolylinesAndMarkers = async () => {
      const allPolylines: any[] = [];
      const allTransportDurations: any[] = [];

      let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
      const allMarkers: any[] = [];

      for (let i = 0; i < locations.length; i++) {
        const [origin, destination] = locations[i];
        const mode = transportationModes[i];

        // Fetch coordinates for origin and destination
        const originCoords = await getCoords({ description: origin, place_id: '' });
        const destinationCoords = await getCoords({ description: destination, place_id: '' });

        // Get the polyline for the route
        const routePolyline = await getRoutePolyline(origin, originCoords, destination, destinationCoords, mode);

        if (routePolyline) {
          const polylinesArray = Array.isArray(routePolyline) ? routePolyline : [routePolyline];

          // Add polyline data to the list
          polylinesArray.forEach((polyline: any) => {
            allPolylines.push({
              id: `${origin}-${destination}-${mode}`,
              coordinates: polyline.path, // Use the path from the response
              strokeColor: polyline.strokeColor,
              strokeWidth: stroke_width, // TODO: Maybe use polyline.strokeWidth but this is optional
            });

            // Add duration to the list
            allTransportDurations.push({
              origin,
              destination,
              mode,
              duration: polyline.duration, // Store the duration
            });

            // Update the bounds for each polyline
            polyline.path.forEach((coord: { latitude: number, longitude: number }) => {
              minLat = Math.min(minLat, coord.latitude);
              maxLat = Math.max(maxLat, coord.latitude);
              minLon = Math.min(minLon, coord.longitude);
              maxLon = Math.max(maxLon, coord.longitude);
            });
          });
        }

        // Store markers
        allMarkers.push({
          origin: originCoords,
          destination: destinationCoords,
        });
      }

      // Update state with polylines, durations, and markers
      setPolylines(allPolylines);
      setTransportDurations(allTransportDurations)
      setMarkers(allMarkers);

      // Set the map region to focus on the route(s)
      if (minLat !== Infinity && maxLat !== -Infinity && minLon !== Infinity && maxLon !== -Infinity) {
        const padding = 0.05; // Adjust padding to give some space around the routes
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
        console.log("Screen is focused, fetching polylines, markers, and durations...");
        setMapKey(Date.now()); // Update key when screen is focused
        fetchPolylinesAndMarkers();
    } else {
        // Optionally reset polylines, markers and durations when screen is unfocused
        setPolylines([]);
        setMarkers([]);
        setTransportDurations([])
        setMapRegion(null);
    }

    console.log("Plotting polylines, fetching markers and storing durations are done");
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
        {markers.map((marker, index) => {
            return (
            <>
              <Marker
                key={`origin-${index}-${marker.origin.latitude}-${marker.origin.longitude}`}
                coordinate={{ latitude: marker.origin.latitude, longitude: marker.origin.longitude }}
                title={locations[index][0][0]}
                zIndex={10}
              />
              <Marker
                key={`destination-${index}-${marker.destination.latitude}-${marker.destination.longitude}`}
                coordinate={{ latitude: marker.destination.latitude, longitude: marker.destination.longitude }}
                title={locations[index][1][0]}
                zIndex={10}
              />
            </>
          );
        })}

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
  }
});

export default MultiRoutesMap;
