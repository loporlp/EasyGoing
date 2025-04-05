import { getIdToken } from './getFirebaseID'
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
 * Creates a trip in the database and in local storage with specified information then 
 * sets the current trip to that trip
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

    // if this is a trip for saving destinations we don't modify tripIDs
    if (startDate === "saved") {
      storeData("savedDestinations", [data.trip_details, data.id]);
      return true;
    }

    storeData(data.id.toString(), data.trip_details);
    tripIDs.push(data.id.toString());
    storeData("currentTrip", data.id);
    storeData("tripIDs", tripIDs);
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
export const updateTrip = async (tripId, updatedTrip) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  await storeData(tripId.toString(), updatedTrip)
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
    console.log(response.statusText)
    return true;

  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  } finally {
    clearTimeout(timeout); // Clear the timeout once the request completes
  }
};


/**
 * 
 * @param {import('firebase/auth').Auth} auth of signed in user
 * @returns bool if creation was successfull
 * Creates a history in the database and in local storage with specified information then 
 * sets the current trip to that trip
 */
export const createHistory = async (tag, value, description, date, tripID) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds

  try {
    console.log("tag: " + tag + "; value:" + value + "; Description: " + description + "; TripID: " + tripID);
    const idToken = await getIdToken(auth);
    console.log(idToken)
    const response = await fetch(`https://ezgoing.app/api/history`, {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({

        "tag": tag,
        "value": value,
        "description": description,
        "date": date,
        "tripID": tripID,
      }
      ),

    });

    const data = await response.json();
    console.log(response);
    var histories = await getHistories();
    storeData("history", histories);
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
export const deleteHistory = async (historyId) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds

  try {
    const idToken = await getIdToken(auth);

    const response = await fetch(`https://ezgoing.app/api/history/${historyId}`, {
      signal: controller.signal,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`, // Include the ID token in the header
      },
    });

    //const data = await response.json();
    var histories = await getHistories();
    storeData("history", histories);
    return true;

  } catch (error) {
    console.error('Error fetching users trips:', error);
    return null;
  } finally {
    clearTimeout(timeout); // Clear the timeout once the request completes
  }
};

/**
 * Fetches a user's histories and returns them as a list of dictionaries.
 *
 * @param {import('firebase/auth').Auth} auth
 * @returns {Promise<Array<Object>>} A list of history objects.
 */
export const getHistories = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds

  try {
    const idToken = await getIdToken(auth);

    const response = await fetch('https://ezgoing.app/api/history', {
      signal: controller.signal,
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`, // Include the ID token in the header
      },
    });

    const data = await response.json();
    console.log("Called get histories")
    console.log(data);

    // Ensure API response contains `histories`
    if (!data.success || !Array.isArray(data.histories)) {
      throw new Error("Invalid response from server");
    }

    // Dictionary of each tripID and all of it's histories
    const dictionary = {};

    for (const history of data.histories) {
      const tripId = history.trip_id;
    
      if (!dictionary[tripId]) {
        dictionary[tripId] = [];
      }
    
      dictionary[tripId].push(history);
    }

    return dictionary; 

  } catch (error) {
    console.error('Error fetching user histories:', error);
    return {}; // Return an empty dict on failure instead of null
  } finally {
    clearTimeout(timeout); // Clear the timeout once the request completes
  }
};
