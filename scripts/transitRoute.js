import axios from 'axios'
import {getIdToken} from '../scripts/getFirebaseID'
import { auth } from '@/firebaseConfig';

export async function getTransitRoute(originCoords, destinationCoords) {
  const idToken = await getIdToken(auth)
  try {
    // Construct the API URL
    const apiUrl = `https://ezgoing.app/api/directions?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=transit`;
    console.log("API Link " + apiUrl);

    // Make the request to the Directions API
    const response = await axios.get(apiUrl, {
      method: "GET",
      headers: {
          Authorization: `Bearer ${idToken}`, // Include the ID token in the header
      },
  });

    if (response.data.routes && response.data.routes.length > 0) {
      const routes = response.data.routes;

      // Extract the legs (individual steps) from each route
      const routeLegs = routes.map((route, index) => {
        return {
          routeIndex: index + 1,
          legs: route.legs, // This contains the 'legs' array for each route
        };
      });

      return routeLegs;  // Return the legs of all the routes
    } else {
      console.log('No routes found.');
      return [];  // Return an empty array if no routes are found
    }
  } catch (error) {
    console.error('Error fetching directions:', error);
    return [];  // Return an empty array in case of an error
  }
}