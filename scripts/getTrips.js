import {getIdToken} from './getFirebaseID'

/**
 * 
 * @param {import('firebase/auth').Auth} auth 
 * @returns a dict containing all of a users trips
 */
export const getTrips = async (auth) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
    try {
      const idToken = await getIdToken(auth);

      const response = await fetch('http://ezgoing.app/api/trips', {
        signal: controller.signal,
        method: "GET",
        headers: {
            Authorization: `Bearer ${idToken}`, // Include the ID token in the header
          },
      });

      const data = await response.json();
      console.log(idToken);
      //console.log(data);

      const dictionary = Object.fromEntries(
        data.trips.map((trip) => [trip.id, trip.trip_details])
      );
      
      //console.log(dictionary[6].destinations[0].alias);

      return dictionary;
  
    } catch (error) {
      console.error('Error fetching users trips:', error);
      return null;
    } finally {
      clearTimeout(timeout); // Clear the timeout once the request completes
    }
  };