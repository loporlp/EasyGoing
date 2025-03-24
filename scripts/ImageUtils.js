import axios from 'axios';
import {getIdToken} from '../scripts/getFirebaseID'
import { auth } from '@/firebaseConfig';
import { getId } from 'firebase/installations';


/**
 * Checks if the image URL is valid by trying to fetch it.
 * @param {string} imageUrl - The URL of the image to check.
 * @returns {Promise<boolean>} - Resolves with true if the image loads successfully, false otherwise.
 */
const checkImage = async (imageUrl) => {
  const idToken = await getIdToken(auth);
  try {
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${idToken}`, // Include the ID token in the header
    },
    });
    // Check if the response status is 200 (OK) and content type is an image
    return response.status === 200 && response.headers['content-type'].includes('image'); // Returns True
  } catch (err) {
    console.error('Error checking image:', err);
    return false;
  }
};

/**
 * Fetches the image URL for a place based on its alias and optionally its address.
 * @param {string} placeAlias - The alias or name of the place.
 * @param {string} [address] - The address of the place (optional).
 * @returns {Promise<string|null>} - The URL of the place's image or null if not found.
 */
const getImageUrl = async (placeAlias, address = '') => {
  const idToken = await getIdToken(auth);
  try {
    // Construct the place search query string using the name and address of the destination
    let searchQuery = `${placeAlias} ${address}`;
    const placeSearchUrl = `https://ezgoing.app/api/place/textsearch?query=${encodeURIComponent(searchQuery)}`;

    const response = await axios.get(placeSearchUrl, {
      method: "GET",
      headers: {
          Authorization: `Bearer ${idToken}`, // Include the ID token in the header
      },
  });
    const place = response.data.results[0];

    // If no place or no photo found, return none
    if (!place || !place.photos || !place.photos[0]) {
        console.warn('No photo found for the place, returning a generic image.');
        return 'None';
    }

    // Acutal photo URL
    const photoReference = place.photos[0].photo_reference;
    const photoUrl = `https://ezgoing.app/api/place/photo?maxwidth=400&photo_reference=${photoReference}`;

    return photoUrl;
  } catch (err) {
    console.error('Error getting image URL:', err);
    return 'None';
  }
};

export { checkImage, getImageUrl };
