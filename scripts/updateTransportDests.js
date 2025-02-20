// Function to flatten the grouped objects into a 1D array
const flattenGroupedObjects = (groupedObjects) => {
    return groupedObjects.reduce((acc, group) => acc.concat(group), []);
};

// Function to update destinations with transport info
export const updateDestinationsWithTransport = (newDest, updatedGroupedDestinations) => {
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
