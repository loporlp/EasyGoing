import {getIdToken} from './getFirebaseID'
import { auth } from '../firebaseConfig';
import { deleteData, getData, storeData } from './localStore';

/**
 * 
 * @param {import('firebase/auth').Auth} auth 
 * @returns a dict containing all of a users trips
 */
export const getTrips = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
    try {
      const idToken = await getIdToken(auth);

      const response = await fetch('https://ezgoing.app/api/trips', {
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

/**
 * 
 * @param {import('firebase/auth').Auth} auth of signed in user
 * @returns bool if creation was successfull
 */
export const createTrip = async (startDate, endDate, budget, origin) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
    try {
        const idToken = await getIdToken(auth);

        const response = await fetch(`https://ezgoing.app/api/trips`, {
            signal: controller.signal,
            method: "POST",
            headers: {
                "Content-Type": "application/json",   
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({                  
                trip_details: {
                  "tripName": "",
                  "tripStartDate": startDate,
                  "tripEndDate": endDate,
                  "budget": budget,
                  "origin": origin,
                  "destinations": []
                }
              }),
      
        });

        const data = await response.json();
        console.log(data);
        tripIDs = await getData("tripIDs");
        storeData(data.id.toString(), data.trip_details);
        tripIDs.push(data.id.toString());
        storeData("currentTrip", data.id)
        return true;
  
    } catch (error) {
      console.error('Error creating trip:', error);
      return false;
    } finally {
      clearTimeout(timeout);
    }
  };


  /**
 * 
 * @param {int} id of trip to be deleted 
 * @param {import('firebase/auth').Auth} auth of signed in user
 * @returns bool if deletion was successfull
 */
export const deleteTrip = async (tripId) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
    try {
      const idToken = await getIdToken(auth);

      const response = await fetch(`https://ezgoing.app/api/trips/${tripId}`, {
        signal: controller.signal,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${idToken}`, // Include the ID token in the header
          },
      });

      const data = await response.json();
      console.log(data)
      deleteData(tripId.toString());
      return true;
  
    } catch (error) {
      console.error('Error fetching users trips:', error);
      return null;
    } finally {
      clearTimeout(timeout); // Clear the timeout once the request completes
    }
  };

  /**
 * 
 * @param {int} id of trip to be deleted 
 * @param {import('firebase/auth').Auth} auth of signed in user
 * @returns bool if deletion was successfull
 * 
 */
export const updateTrip = async (tripId) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
    await storeData(tripId.toString(), updateTrip)
    tripDetails = await getData(tripId.toString());

  
    try {
      const idToken = await getIdToken(auth);
      const response = await fetch(`https://ezgoing.app/api/trips/${tripId}`, {
        signal: controller.signal,
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`, // Include the ID token in the header
          },
        body: JSON.stringify({                  
            trip_details: tripDetails
        }),
      });

      const data = await response.json();
      console.log(data)
      return true;
  
    } catch (error) {
      console.error('Error fetching users trips:', error);
      return null;
    } finally {
      clearTimeout(timeout); // Clear the timeout once the request completes
    }
  };

export const registerUser = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds

  try {
    const idToken = await getIdToken(auth);
    const response = await fetch(`https://ezgoing.app/api/register`, {
      signal: controller.signal,
      method: "POST",
      headers: {
          Authorization: `Bearer ${idToken}`, // Include the ID token in the header
        },
    });

    const data = await response.json();
    console.log(data)
    return true;

  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  } finally {
    clearTimeout(timeout); // Clear the timeout once the request completes
  }
};