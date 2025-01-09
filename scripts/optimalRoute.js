import axios from 'axios';

// Distance Matrix API
async function getDistanceMatrix(origin, destinations) {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    const destinationsStr = destinations.map(d => d.address).join('|'); // Between each destination, add this symbol

    const apiKey = "AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI";
    const fullUrl = `${url}?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destinationsStr)}&key=${apiKey}`;
    //console.log('Request URL:', fullUrl);

    let response;

    try {
        // Call the API
        response = await axios.get(fullUrl, {
            method: "GET"
        });
        //console.log('API Response:', response.data);
    } catch (error) {
        console.error('Error in API call:', error);

        // Log more details if the error has a response
        if (error.response) {
            console.error('Response Error:', error.response.data);
            console.error('Response Status:', error.response.status);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
    }


    // Get the response
    const data = response.data;

    // Process and return the distances and durations
    const distances = data.rows[0].elements.map((element, index) => ({
        destination: data.destination_addresses[index],
        originalLocationName: destinations[index].name, // location name
        distance: element.distance.value,  // in meters
        duration: element.duration.value,  // in seconds
    }));

    return distances;
}

// Optimal Route Main Function
export async function calculateOptimalRoute(locations, origin) {
    const optimalRoute = [];
    let currentOrigin = origin;

    const length = locations.length;
    console.log(length);
    for (let i = 0; i < length; i++) {
        console.log(locations);
        // Get the distance matrix for the current origin and remaining locations
        const distancesList = await getDistanceMatrix(currentOrigin, locations);

        // Find the destination with the minimum distance
        const destination = distancesList.reduce((prev, current) => (prev.distance < current.distance ? prev : current));

        // Add the current origin and destination to the route
        optimalRoute.push([currentOrigin, destination.originalLocationName]);

        // Update the current origin to the chosen destination
        currentOrigin = destination.originalLocationName;

        //console.log("To remove: ", currentOrigin);

        // Remove the destination from the list of locations
        const destinationIndex = locations.findIndex(loc => loc.name === destination.originalLocationName);
        if (destinationIndex !== -1) {
            locations.splice(destinationIndex, 1); // Remove the matched destination
        } else {
            console.log("Destination not found in locations array");
        }
    }
    console.log("End");

    return optimalRoute;
}


// EXAMPLE USAGE (comment out when using this script)
// For the two below, we will use the nameToCoords to convert
/*
const origin = 'Tokyo International Airport, Tokyo';
let locations = ['Tokyo Tower, Tokyo', 'Shibuya Crossing, Tokyo', 'Kyoto Station, Kyoto'];  // List of destinations

// Calculate the optimal route
calculateOptimalRoute(locations, origin).then((optimalRoute) => {
    console.log('Optimal Route:');
    optimalRoute.forEach(([origin, destination]) => {
        // Use the data from optimalRoute as we wish. For example:
        console.log(`From ${origin} to ${destination}`);
    });
}).catch((error) => {
    console.error('Error calculating the optimal route:', error);
});
*/
