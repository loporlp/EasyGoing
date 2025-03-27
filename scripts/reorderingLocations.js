import { getData } from '../scripts/localStore.js';

// Recalculate paths based on the new order in newResultRoute
export const recalculatePaths = async (newResultRoute) => {
    try {
        // Fetch and format the original trip data
        const originalDestinations = await fetchAndFormatTripData();

        // Check if originalDestinations is an object and convert it to an array
        if (typeof originalDestinations === 'object' && !Array.isArray(originalDestinations)) {
            // Convert the object to an array of destination objects
            const destinationsArray = Object.values(originalDestinations);

            // Reorganize the destinations based on newResultRoute
            const reorganizedDestinations = reorganizeDestinations(newResultRoute, destinationsArray);

            // Call the method to set dayOrigin
            setDayOrigin(reorganizedDestinations, destinationsArray);

            console.log("Reorganized Destinations (Recalc):", reorganizedDestinations);

            return reorganizedDestinations;
        } else {
            throw new Error("Original destinations are not in the expected format.");
        }
    } catch (error) {
        console.error("Error recalculating paths:", error);
    }
};


// A method to fetch and format trip data based on the current trip ID
async function fetchAndFormatTripData() {
    let destinations = {}; // Initialize destinations object
    try {
        const tripID = await getData("currentTrip");
        if (!tripID) {
            throw new Error("No trip ID");
        }

        const trip = await getData(tripID.toString());

        if (trip) {
            console.log("Trip Data:", trip);

            // Iterate over destinations and format them
            trip.destinations.forEach((destination, index) => {
                const formattedDestination = {
                    alias: destination.alias,
                    address: destination.address,
                    priority: destination.priority,
                    mode: destination.mode || defaultMode,
                    transportToNext: destination.transportToNext ? JSON.stringify(destination.transportToNext) : "", // serialized route
                    transportDuration: destination.transportDuration,
                    startDateTime: destination.startDateTime,
                    duration: parseFloat(destination.duration),
                    notes: destination.notes,
                    dayOrigin: destination.dayOrigin || false,
                    cost: destination.cost,
                    picture: destination.picture,
                };

                destinations[index.toString()] = formattedDestination;
            });
        } else {
            console.log("No data found for this trip ID.");
        }
    } catch (error) {
        console.error("Error fetching trip data:", error);
    }

    return destinations; // Return formatted destinations
}

// Method to set dayOrigin for the first and second destinations
const setDayOrigin = (reorganizedDestinations, originalDestinations) => {
    if (reorganizedDestinations.length > 0) {
        // Ensure the first element has dayOrigin set to true
        reorganizedDestinations[0].dayOrigin = true;
        
        // If there is a second element, set its dayOrigin to the original first element's dayOrigin
        if (reorganizedDestinations.length > 1) {
            const originalFirstDestination = originalDestinations[0];
            reorganizedDestinations[1].dayOrigin = originalFirstDestination.dayOrigin;
        }
    }
};

// Method to reorder destinations based on newResultRoute
const reorganizeDestinations = (newResultRoute, originalDestinations) => {
    return newResultRoute.map(route => {
        // Find the corresponding destination in originalDestinations using the alias
        return originalDestinations.find(destination => destination.alias === route.alias);
    });
};