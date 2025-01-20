import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { getRoutePolyline } from '../scripts/routePolyline';
import { getCoords } from '../scripts/nameToCoords.js';

interface MultiRoutesMapProps {
  locations: string[][]; // An array of origin-destination pairs
  transportationModes: string[]; // Array of transportation modes
}

const stroke_width = 4;

const MultiRoutesMap: React.FC<MultiRoutesMapProps> = ({ locations, transportationModes }) => {
  const [polylines, setPolylines] = useState<any[]>([]); // State to store polylines
  const [mapRegion, setMapRegion] = useState<any>(null); // State to store the map's region
  const [markers, setMarkers] = useState<any[]>([]); // State to store marker data
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // Fetch polylines and markers asynchronously
    const fetchPolylinesAndMarkers = async () => {
      const allPolylines: any[] = [];
      let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
      const allMarkers: any[] = [];

      for (let i = 0; i < locations.length; i++) {
        const [origin, destination] = locations[i];
        const mode = transportationModes[i];

        // Get the polyline for the route
        const routePolyline = await getRoutePolyline(origin, destination, mode);

        // Fetch coordinates for origin and destination
        const originCoords = await getCoords({ description: origin, place_id: '' });
        const destinationCoords = await getCoords({ description: destination, place_id: '' });

        if (routePolyline) {
          const polylinesArray = Array.isArray(routePolyline) ? routePolyline : [routePolyline];

          // Add polyline data to the list
          polylinesArray.forEach((polyline: any) => {
            allPolylines.push({
              id: `${origin}-${destination}-${mode}`,
              coordinates: polyline.path, // Use the path from the response
              strokeColor: polyline.strokeColor,
              strokeWidth: stroke_width,
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

      // Update state with polylines and markers
      setPolylines(allPolylines);
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

    fetchPolylinesAndMarkers();
    console.log("Plotting polylines and fetching markers done");
  }, [locations, transportationModes]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        region={mapRegion}
        showsUserLocation={true} // Optional: Show user's location
      >
        {/* Render polylines on the map */}
        {polylines.map((polyline, index) => (
          <Polyline
            key={`${polyline.id}-${index}`}
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
                key={`origin-${index}`}
                coordinate={{ latitude: marker.origin.latitude, longitude: marker.origin.longitude }}
                title={locations[index][0][0]}
                zIndex={10}
              />
              <Marker
                key={`destination-${index}`}
                coordinate={{ latitude: marker.destination.latitude, longitude: marker.destination.longitude }}
                title={locations[index][1][0]}
                zIndex={10}
              />
            </>
          );
        })}
      </MapView>

      <Text style={styles.subTitle}>Locations:</Text>
      {locations.map((location, index) => (
        <Text key={index} style={styles.text}>
          {`Origin: ${location[0]} - Destination: ${location[1]}`}
        </Text>
      ))}

      <Text style={styles.subTitle}>Transportation Modes:</Text>
      {transportationModes.map((mode, index) => (
        <Text key={index} style={styles.text}>{mode}</Text>
      ))}
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
});

export default MultiRoutesMap;
