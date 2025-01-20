import axios from 'axios'

export async function getTransitRoute(originCoords, destinationCoords) {
  try {
    // Construct the API URL
    const apiKey = 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI';
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=transit&key=${apiKey}`;
    // TEST API FOR TRANSIT
    //const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=Draper+Station&destination=University+of+Utah&mode=transit&key=AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI`;

    console.log(apiUrl);

    // Make the request to the Directions API
    const response = await axios.get(apiUrl);

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