import axios from 'axios'

export async function getTransitRoute(originCoords, destinationCoords) {
  try {
    // Construct the API URL
    const apiKey = 'AIzaSyAQgbWUgdfMozsamfhRi8HrHlRorkFNIEc';
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=transit&key=${apiKey}`;
    // TEST API FOR TRANSIT
    //const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=Draper+Station&destination=University+of+Utah&mode=transit&key=${apiKey}`;
    //const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=40.748817,-73.985428&destination=40.785091,-73.968285&mode=transit&key=${apiKey}`
    //const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=Union+Station,+Los+Angeles,+CA&destination=Santa+Monica+Pier,+Santa+Monica,+CA&mode=transit&departure_time=now&alternatives=true&key=${apiKey}`
    console.log("API Link " + apiUrl);

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