import axios from 'axios';

const apiKey = 'AIzaSyAQgbWUgdfMozsamfhRi8HrHlRorkFNIEc'; //MASONS KEY, 
// AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI SOLIS KEY;

/**
 * Checks if the image URL is valid by trying to fetch it.
 * @param {string} imageUrl - The URL of the image to check.
 * @returns {Promise<boolean>} - Resolves with true if the image loads successfully, false otherwise.
 */
const checkImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer' 
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
  try {
    // Construct the place search query string using the name and address of the destination
    let searchQuery = `${placeAlias} ${address}`;
    const placeSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

    const response = await axios.get(placeSearchUrl);
    const place = response.data.results[0];

    // If no place or no photo found, return none
    if (!place || !place.photos || !place.photos[0]) {
        console.warn('No photo found for the place, returning a generic image.');
        return 'None';
    }

    // Acutal photo URL
    const photoReference = place.photos[0].photo_reference;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;

    return photoUrl;
  } catch (err) {
    console.error('Error getting image URL:', err);
    return 'None';
  }
};

export { checkImage, getImageUrl };
