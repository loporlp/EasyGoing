import { getData } from '../scripts/localStore.js';
const defaultMode = "DRIVING";

// Function to fetch destinations
export const loadDestinations = async (setDestinations, setStartDate, setEndDate, setTransportationModes, setOrigin, setOptimizeCheck) => {
    const formattedDestinations = {};
    const groupedDestinationsTemp = [];
    let currentGroup = [];
    let originSet = false;

    try {
        const tripID = await getData("currentTrip");
        if (!tripID) {
            throw new Error("No trip ID");
        }
        const trip = await getData(tripID.toString());

        if (trip) {
            console.log("Trip Data:", trip);

            setStartDate(trip.tripStartDate);
            setEndDate(trip.tripEndDate);
            console.log("End Date set to:", trip.tripEndDate);

            // Set the initial transportation modes
            const destinationsCount = trip.destinations.length;
            const initialTransportationModes = new Array(destinationsCount).fill("Driving");
            setTransportationModes(initialTransportationModes);

            // Get the optimalCheck
            setOptimizeCheck(trip.optimize);

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

                formattedDestinations[index.toString()] = formattedDestination;

                // If dayOrigin is true, it means a new group starts
                if (destination.dayOrigin) {
                    // Set the FIRST origin
                    if (!originSet) {
                        setOrigin({
                            name: formattedDestination.alias,
                            address: formattedDestination.address,
                            duration: formattedDestination.duration,
                            priority: formattedDestination.priority,
                        });
                        originSet = true;
                    }

                    // Push the current group into the temporary array if it's not empty
                    if (currentGroup.length > 0) {
                        groupedDestinationsTemp.push(currentGroup);
                    }

                    // Start a new group with the current destination
                    currentGroup = [formattedDestination];
                } else {
                    // Otherwise, add this destination to the current group
                    currentGroup.push(formattedDestination);
                }
                console.log("Current Group: ", currentGroup);
            });

            // Push the last group if there are any destinations left
            if (currentGroup.length > 0) {
                groupedDestinationsTemp.push(currentGroup);
            }

            setDestinations(formattedDestinations);
        } else {
            console.log("No data found for this trip ID.");
        }
    } catch (error) {
        console.error("Error fetching trip data:", error);
    }

    return formattedDestinations;
};
