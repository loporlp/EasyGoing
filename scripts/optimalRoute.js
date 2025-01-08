const axios = require('axios');

// Distance Matrix API
async function getDistanceMatrix(origin, destinations, apiKey) {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    const destinationsStr = destinations.join('|'); // Beteween each destination, add this symbol

    // Call the API
    const response = await axios.get(url, {
        params: {
            origins: origin,
            destinations: destinationsStr,
            key: apiKey,
        },
    });

    // Get the response
    const data = response.data;

    // Process and return the distances and durations
    const distances = data.rows[0].elements.map((element, index) => ({
        destination: data.destination_addresses[index],
        distance: element.distance.value,  // in meters
        duration: element.duration.value,  // in seconds
    }));

    return distances;
}

// Optimal Route Main Function
async function calculateOptimalRoute(locations, origin, apiKey) {
    const optimalRoute = [];
    let currentOrigin = origin;

    while (locations.length > 0) {
        // Get the distance matrix for the current origin and remaining locations
        const distancesList = await getDistanceMatrix(currentOrigin, locations, apiKey);

        // Find the destination with the minimum distance
        const destination = distancesList.reduce((prev, current) => (prev.distance < current.distance ? prev : current));

        // Add the current origin and destination to the route
        optimalRoute.push([currentOrigin, destination.destination]);

        // Update the current origin to the chosen destination
        currentOrigin = destination.destination;

        // Remove the destination from the list of locations
        locations = locations.filter((loc) => loc !== destination.destination);
    }

    return optimalRoute;
}


// EXAMPLE USAGE (comment out when using this script)
const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
// For the two below, we will use the nameToCoords to convert
const origin = 'Tokyo International Airport (HND), Tokyo';
let locations = ['Tokyo Tower, Tokyo', 'Shibuya Crossing, Tokyo', 'Kyoto Station, Kyoto'];  // List of destinations

// Calculate the optimal route
calculateOptimalRoute(locations, origin, apiKey).then((optimalRoute) => {
    console.log('Optimal Route:');
    optimalRoute.forEach(([origin, destination]) => {
        // Use the data from optimalRoute as we wish. For example:
        console.log(`From ${origin} to ${destination}`);
    });
}).catch((error) => {
    console.error('Error calculating the optimal route:', error);
});
