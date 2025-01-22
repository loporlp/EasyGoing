// import {getIdToken} from './getFirebaseID'

// /**
//  * 
//  * @param {int} id of trip to be deleted 
//  * @param {import('firebase/auth').Auth} auth of signed in user
//  * @returns bool if deletion was successfull
//  * 
//  * METHOD STILL INCOMPLETE 
//  */
// export const updateTrip = async (auth, tripId) => {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
//     try {
//       const idToken = await getIdToken(auth);

//       const response = await fetch(`http://ezgoing.app/api/trips/${tripId}`, {
//         signal: controller.signal,
//         method: "PUT",
//         headers: {
//             Authorization: `Bearer ${idToken}`, // Include the ID token in the header
//           },
//       });

//       const data = await response.json();
//       console.log(data)
//       return true;
  
//     } catch (error) {
//       console.error('Error fetching users trips:', error);
//       return null;
//     } finally {
//       clearTimeout(timeout); // Clear the timeout once the request completes
//     }
//   };