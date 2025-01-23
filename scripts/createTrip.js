import {getIdToken} from './getFirebaseID'

/**
 * 
 * @param {import('firebase/auth').Auth} auth of signed in user
 * @returns bool if creation was successfull
 */
export const createTrip = async (auth) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
    try {
        const idToken = await getIdToken(auth);

        const response = await fetch(`http://ezgoing.app/api/trips`, {
            signal: controller.signal,
            method: "POST",
            headers: {
                "Content-Type": "application/json",   
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({                  
                trip_details: {
                  "tripName": "",
                  "tripStartDate": "",
                  "tripEndDate": "",
                  "budget": 0,
                  "origin": "",
                  "destinations": []
                }
              }),
      
        });

        const data = await response.json();
        console.log(data)
        return true;
  
    } catch (error) {
      console.error('Error fetching users trips:', error);
      return false;
    } finally {
      clearTimeout(timeout);
    }
  };