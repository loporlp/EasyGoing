import axios from 'axios';
import {getIdToken} from '../scripts/getFirebaseID'
import { auth } from '@/firebaseConfig';

// Distance Matrix API
async function getDistanceMatrix(origin, destinations, mode) {
    const url = 'https://ezgoing.app/api/distancematrix';
    // Log the destinations array converted to a string
    const destinationsStr = destinations.map(d => d.address).join('|'); // Between each destination, add this symbol
    console.log("DestStr:", destinationsStr);

    const originFull = origin.name + ", " + origin.address;
    console.log("Origin OptimalRoute:", originFull);

    // Construct the full URL for the API call
    const fullUrl = `${url}?origins=${encodeURIComponent(originFull)}&destinations=${encodeURIComponent(destinationsStr)}&mode=${mode}`;
    console.log('Request URL:', fullUrl);

    let response;
    const idToken = await getIdToken(auth);
    try {
        // Call the API and log the response
        console.log("Sending request to API...");
        response = await axios.get(fullUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${idToken}`, // Include the ID token in the header
            },
        });
        console.log('API Response:', response.data);
    } catch (error) {
        console.error('Error in API call:', error);

        if (error.response) {
            console.error('Response Error:', error.response.data);
            console.error('Response Status:', error.response.status);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
    }

    // Check if the response has the expected structure
    if (!response || !response.data || !response.data.rows || !response.data.rows[0].elements) {
        console.error("Invalid response structure:", response);
        throw new Error("Invalid API response structure");
    }

    // Get the response data and log the rows and elements
    const data = response.data;
    console.log("Response Data:", data);

    // Map the distances and durations for each destination
    const distances = data.rows[0].elements.map((element, index) => {
        console.log(`Processing destination ${index + 1}: ${destinations[index].name}`);

        const distanceData = {
            destinationAddress: data.destination_addresses[index], // address
            originalLocationName: destinations[index].name, // location name
            duration: destinations[index].duration, // location duration
            priority: destinations[index].priority, // location priority
            distance: element.distance.value,  // in meters
            transportDuration: element.duration.value,  // in seconds (transport)
        };

        console.log("Distance Data:", distanceData);

        return distanceData;
    });

    // Return the distances array
    console.log("Distances List:", distances);
    return distances;
}

// Optimal Route Main Function
export async function calculateOptimalRoute(locations, origin, mode) {
    try {
        const optimalRoute = [];
        let currentOrigin = origin;
    
        const length = locations.length;
        console.log("Locations Length: " + length);
        for (let i = 0; i < length; i++) {
            console.log(locations);
            // Get the distance matrix for the current origin and remaining locations
            let distancesList;
            try {
                distancesList = await getDistanceMatrix(currentOrigin, locations, mode);
            } catch (error){
                console.log("Error occured in DistanceMatrix: ", error);
                throw new Error(error);
            }

    
            // Find the destination with the minimum distance
            // TODO: Based on user input, whether it's distance or duration
            const destination = distancesList.reduce((prev, current) => (prev.distance < current.distance ? prev : current));
    
            // Add the current origin and destination to the route
            optimalRoute.push([
                [currentOrigin.name, currentOrigin.address, currentOrigin.duration, currentOrigin.priority],
                [destination.originalLocationName, destination.destinationAddress, destination.duration, destination.priority]
            ]);         
    
            // Update the current origin to the chosen destination
            currentOrigin = { name: destination.originalLocationName, address: destination.destinationAddress };
    
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
    } catch (error) {
        console.log("Error occured in OptimalRoute.js: ", error);
        throw new Error(error);
    }
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
