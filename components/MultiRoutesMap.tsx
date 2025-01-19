import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { getRoutePolyline } from '../scripts/routePolyline';

interface MultiRoutesMapProps {
  locations: string[][]; // An array of origin-destination pairs
  transportationModes: string[]; // Array of transportation modes
}

const MultiRoutesMap: React.FC<MultiRoutesMapProps> = ({ locations, transportationModes }) => {
  const [polylines, setPolylines] = useState<any[]>([]); // State to store polylines
  const [mapRegion, setMapRegion] = useState<any>(null); // State to store the map's region
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // Remember that 'locations' are origin-destination pairs and NOT individual locations. Hence the length should be the same
    if (locations.length !== transportationModes.length) {
      console.log('Error: Locations and Transportation Modes are not the same length: ' + locations.length + ", " + transportationModes.length);
      console.log(locations);
      return;
    }

    // Loop through each origin-destination pair and transportation mode
    const fetchPolylines = async () => {
      const allPolylines: any[] = [];
      let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;

      for (let i = 0; i < locations.length; i++) {
          const [origin, destination] = locations[i];
          const mode = transportationModes[i];
          const routePolyline = await getRoutePolyline(origin, destination, mode); // Get route polyline data
          console.log("Hi: " + routePolyline);

          if (routePolyline) {
              // Handle the case where multiple polylines are returned (e.g., for transit)
              const polylinesArray = Array.isArray(routePolyline) ? routePolyline : [routePolyline];

              // Add polyline data to the list
              polylinesArray.forEach((polyline: any) => {
                  allPolylines.push({
                      id: `${origin[0]}-${destination[0]}-${mode}`,
                      coordinates: polyline.path, // Use the path from the response
                      strokeColor: polyline.strokeColor, // Use the color from the response
                      strokeWidth: 4, // Set a stroke width (optional)
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
      }

      setPolylines(allPolylines);

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

        // Smoothly transition to the new region using animateToRegion
        if (mapRef.current && newRegion) {
          mapRef.current.animateToRegion(newRegion, 1000); // 1000ms animation duration
        }
      }
    };

    fetchPolylines();
    console.log("Plotting polylines done");
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
                key={`${polyline.id}-${index}`} // Add index to make the key unique
                coordinates={polyline.coordinates}
                strokeColor={polyline.strokeColor}
                strokeWidth={polyline.strokeWidth}
            />
        ))}
      </MapView>

      <Text style={styles.subTitle}>Locations:</Text>
      {locations.map((location, index) => (
        <Text key={index} style={styles.text}>
          {`Origin: ${location[0][0]} - Destination: ${location[1][0]}`}
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
