import { getRoutePolyline } from './routePolyline';
import { getCoords } from './nameToCoords';
import { getIdToken } from '../scripts/getFirebaseID';
import { auth } from '../firebaseConfig';

export const fetchPolylinesAndDurations = async (locations, transportationModes) => {
  const allPolylines = [];
  const allTransportDurations = [];
  const allMarkers = [];

  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;

  for (let i = 0; i < locations.length; i++) {
    const [origin, destination] = locations[i];
    const mode = transportationModes[i];

    // Fetch coordinates for origin and destination
    const originCoords = await getCoords({ description: origin, place_id: '' });
    const destinationCoords = await getCoords({ description: destination, place_id: '' });

    // Store markers
    allMarkers.push({
      origin: originCoords,
      destination: destinationCoords,
    });

    // Get the polyline for the route
    const routePolyline = await getRoutePolyline(origin, originCoords, destination, destinationCoords, mode);

    if (routePolyline) {
      const polylinesArray = Array.isArray(routePolyline) ? routePolyline : [routePolyline];

      // Add polyline data to the list
      polylinesArray.forEach((polyline) => {
        allPolylines.push({
          id: `${origin}$${destination}$${mode}`,
          coordinates: polyline.path, // Use the path from the response
          strokeColor: polyline.strokeColor,
          strokeWidth: 4, // Default stroke width
          duration: polyline.duration,
        });

        // Add duration to the list
        allTransportDurations.push({
          origin,
          destination,
          mode,
          duration: polyline.duration, // Store the duration
        });

        // Update the bounds for each polyline
        polyline.path.forEach((coord) => {
          minLat = Math.min(minLat, coord.latitude);
          maxLat = Math.max(maxLat, coord.latitude);
          minLon = Math.min(minLon, coord.longitude);
          maxLon = Math.max(maxLon, coord.longitude);
        });
      });
    }
  }

  return {
    polylines: allPolylines,
    transportDurations: allTransportDurations,
    markers: allMarkers,
    bounds: { minLat, maxLat, minLon, maxLon },
  };
};

export async function getDirectionsBetweenLocations(origin, destination, mode) { 
  console.log("(Get Directions - Origin: ", origin);
  console.log("(Get Directions - Dest: ", destination);
  console.log("(Get Directions - Mode: ", mode);

  // Fetch coordinates for origin and destination
  const originCoords = await getCoords({ description: origin, place_id: '' });
  const destinationCoords = await getCoords({ description: destination, place_id: '' });

  // Retrieve the ID token from Firebase
  const idToken = await getIdToken(auth);

  // Construct the API URL
  let url = `https://ezgoing.app/api/directions?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=${mode.toLowerCase()}`;

  try {
    // Make the API call with authentication token
    const response = await fetch(url, {
      method: "GET",
      headers: {
          Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Fetch the route and extract directions and duration
    const data = await response.json();

    // Check if the response is valid
    if (data.status === 'OK') {
      // Extract directions (steps), duration, and modes of transit
        const routeSteps = [];
        const travelModes = [];
        const legs = data.routes[0].legs;

        // Loop through each leg of the route
        legs.forEach(leg => {
            // Loop through each step in the leg (exp: step is a part of the journey like "Turn right onto X street")
            leg.steps.forEach(step => {
              // This contains the textual instructions and the corresponding travel mode
              routeSteps.push(step.html_instructions);
              travelModes.push(step.travel_mode);
            });
        });

        // Extract the duration of the route
        const duration = legs[0].duration.text;

        return {
            directions: routeSteps,
            duration: duration,
            travel_modes: travelModes
        };
    } else {
        console.error('Error fetching route (data):', data.status);
        if (data.status === 'ZERO_RESULTS' && mode.toLowerCase() === 'transit') {
            console.log("Zero results for transit mode, trying driving mode...");
            // Try with 'driving' mode if 'transit' fails
            return getDirectionsBetweenLocations(origin, destination, 'driving');
        }
        return null;
    }
  } catch (error) {
    console.log("Directions Error: ", error);
    // If the error is a ZERO_RESULTS error for transit mode, handle it with default of driving
    if (error.message.includes("ZERO_RESULTS") && mode.toLowerCase() === 'transit') {
      console.log("Zero results for transit, retrying with driving mode.");
      return getDirectionsBetweenLocations(origin, destination, 'driving');
    } else {
      console.log("An unexpected error occurred: ", error.message);
    }
  }
}
