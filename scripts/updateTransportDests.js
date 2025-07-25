// Function to flatten the grouped objects into a 1D array
const flattenGroupedObjects = (groupedObjects) => {
    return groupedObjects.reduce((acc, group) => acc.concat(group), []);
};

// Function to update destinations with transport info
export const updateDestinationsWithTransport = (newDest, updatedGroupedDestinations, transportationModes) => {
    // Flatten the grouped destinations into a 1D array
    const flattenedDestinations = flattenGroupedObjects(updatedGroupedDestinations);
    //console.log("Flattened destinations:", flattenedDestinations);

    // TODO: If not in newDest, remove from updatedGroupedDestinations

    // Iterate through each destination in the newDest array
    for (let i = 0; i < newDest.length; i++) {
        const destination = newDest[i];
        //console.log(`Processing destination: ${destination.alias}`);

        // Look for the destination in the flattened list
        const destinationIndex = flattenedDestinations.findIndex(dest => {
            const firstPartOfId = dest.id.split(",")[0];
            return firstPartOfId === destination.alias;
        });

        if (destinationIndex !== -1) {
            //console.log(`Found matching destination: ${destination.alias} at index: ${destinationIndex}`);

            // Check if it's not the last destination in the list
            if (destinationIndex < flattenedDestinations.length - 1) {
                const nextRoute = flattenedDestinations[destinationIndex];
                //console.log(`Next route found: ${nextRoute.coordinates.length}, Duration: ${nextRoute.duration}`);

                // Update transportToNext with the coordinates of the next route
                destination.transportToNext = nextRoute.coordinates;

                // Update transportDuration with the duration for this route
                destination.transportDuration = nextRoute.duration;

            } else {
                // If it's the last destination, set transportToNext to null
                //console.log(`Last destination. Setting transportToNext to null and transportDuration to 'No travel duration'`);
                destination.transportToNext = null;
                destination.transportDuration = "No travel duration";
            }

            // Add the tranportation modes
            if (transportationModes[i]) {
                destination.mode = transportationModes[i];
            } else {
                console.log("Error: there should have been a default of DRIVING already.");
            }
        }
    }

    //console.log("Updated destinations:", newDest);
    return newDest;
};

// Function to update dayOrigin for each destination in updatedDestinations
export const updateDayOrigin = (updatedDests, grouped2DDestinations) => {
    console.log('Updated Destinations (UTD):', updatedDests);
    console.log('Grouped Destinations (UTD):', grouped2DDestinations);

    return updatedDests.map(destination => {
        console.log(`Processing destination: ${destination.alias}`);

        // Extract the alias
        const aliasBeforeComma = destination.alias.split(',')[0].trim();

        // Check if this destination is the first element in any group
        const isDayOrigin = grouped2DDestinations.some(group => {
            console.log(`Checking group: ${JSON.stringify(group)}`);
            // Compare alias with the first element's alias in the group
            const firstAliasInGroup = group[0]?.split(',')[0].trim();
            console.log(`Is ${aliasBeforeComma} the first in this group? ${firstAliasInGroup === aliasBeforeComma}`);
            return firstAliasInGroup === aliasBeforeComma;
        });

        console.log(`Is ${destination.alias} the day origin? ${isDayOrigin}`);

        return {
            ...destination,
            dayOrigin: isDayOrigin 
        };
    });
};

// Function to add tripDates to startDateTime for each destination (based on dayOrigin)
export const addTripDatesToStartDateTime = (updatedDest, tripDates) => {
    console.log("Updated Destinations (Before Trip Dates):", updatedDest);
    console.log("Trip Dates:", tripDates);

    let nextTripDateIndex = 0;

    // Current working date for dayOrigins=false
    let currentTripDate = new Date(tripDates[0]);

    try {
        return updatedDest.map((destination) => {
            const startDateTime = new Date(destination.startDateTime);

            // New day: update currentTripDate from tripDates
            if (destination.dayOrigin && tripDates[nextTripDateIndex]) {
                currentTripDate = new Date(tripDates[nextTripDateIndex]);

                // Update time based on original destination time
                currentTripDate.setHours(startDateTime.getHours());
                currentTripDate.setMinutes(startDateTime.getMinutes());
                currentTripDate.setSeconds(startDateTime.getSeconds());

                console.log(`Updating (new day) ${destination.alias} to: ${currentTripDate}`);
                nextTripDateIndex++;

                return {
                    ...destination,
                    startDateTime: currentTripDate.toISOString(),
                };
            } else {
                // Use currentTripDate with destination's time
                const reusedDate = new Date(currentTripDate);
                reusedDate.setHours(startDateTime.getHours());
                reusedDate.setMinutes(startDateTime.getMinutes());
                reusedDate.setSeconds(startDateTime.getSeconds());

                console.log(`Updating (same day) ${destination.alias} to: ${reusedDate}`);

                return {
                    ...destination,
                    startDateTime: reusedDate.toISOString(),
                };
            }
        });
    } catch (error) {
        console.log("Failed to set dates in updateTransportDests.js:", error);
    }
};
