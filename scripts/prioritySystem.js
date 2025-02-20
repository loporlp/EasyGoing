export async function launchPrioritySystem(locationAndDurations, days) {
    const availableHours = 16.0; // TODO: Change later based on input times

    const totalHoursAvailable = availableHours * days;

    let { locationDuration, transportDurations, priorities } = processDurations(locationAndDurations);
    console.log("PrioSys - Location Durations:", locationDuration);
    console.log("PrioSys - Transport Durations:", transportDurations);
    console.log("PrioSys - Priorities:", priorities);

    let totalLocationDuration;
    let totalTravelTime;


    try {
        totalLocationDuration = locationDuration.filter(duration => duration !== null).reduce((acc, cur) => acc + cur, 0); // Ideally no nulls but just in case
        transportDurations = transportDurations.filter(duration => duration !== null);
        let totalTransportDuration = transportDurations.reduce((acc, cur) => acc + cur, 0);
        
        totalTravelTime = totalLocationDuration + totalTransportDuration;

        console.log("Total Location Duration:", totalLocationDuration);
        console.log("Total Transport Duration:", totalTransportDuration);
        console.log("Total Travel Time:", totalTravelTime);
        console.log("Total Available Time:", totalHoursAvailable);
    } catch (error) {
        console.log("PrioSys Error:", error);
    }

    const newTotalTransportDuration = transportDurations;
    console.log("newTotalTransportDuration:", newTotalTransportDuration);

    try {
        if (totalTravelTime > totalHoursAvailable) {
            console.log("Time exceeded. Proceeding to removing locations");
    
            // Replace '-1' with largest number for location removal
            const temp_max = Math.max(...priorities.filter(value => value !== -1));
            const non_negative_priorities = priorities.map(value => value === -1 ? temp_max + 1 : value);
    
            // [Alias, Address, LocationDuration, TransportDuration, Priority] 2D array
            /*
            EXP:
            [
                ["Loveland Aquarium", "12033 Lone Peak Pkwy, Draper, UT 84020, USA", 60, 0, 4],
                ["Samurai Noodle", "11483 State St, Draper, UT 84020, USA", 50, 0.25, 8],
                ["UofU", "Presidents' Cir, Salt Lake City, UT, USA", 90, 0.1, 8],
                ["cali", "California, USA", 80, 0.483, -1], <-- -1 would be 9 in this example
                ["chicago", "Chicago, IL, USA", 89, 11.96, 8],
                ["New Yori", "New York, NY, USA", 90, 7, -1],
                ["Snow Blossom", "Snow Blossom Way, Draper, Utah, USA", 90, 12.23, 0]
            ]
            */
            let locations = locationAndDurations.map((item, index) => {
                if (item.destination !== null) {
                    return [item.destination[0], item.destination[1], item.destination[2], newTotalTransportDuration[index], non_negative_priorities[index]];
                } else if (index === locationAndDurations.length - 1) {
                    // For the last element where destination is null (so we need to grab the Origin)
                    const firstOrigin = locationAndDurations[0].origin;
                    return [firstOrigin[0], firstOrigin[1], 0, 0, 0];  // Use "0" from the origin of the first element (since it's Origin)
                }
                return [];
                });
    
            console.log("PrioSys - Locations:", locations);
    
            //Remove the location with the lowest priority. If there's multiple, remove the one with the most time (transport then location duration)
            let sortedLocationsByPriority = locations.sort((a, b) => {
                // First, sort by priority (descending order)
                if (a[4] !== b[4]) {
                  return b[4] - a[4];
                }
                // If priorities are equal, sort by transport time (descending order)
                if (a[3] !== b[3]) {
                  return b[3] - a[3];
                }
                // If transport times are equal, sort by location duration (descending order)
                return b[2] - a[2];
            });
            
            while (totalTravelTime > totalHoursAvailable) {
                // Remove the element with the lowest priority
                const lowestPriority = sortedLocationsByPriority.shift();
                console.log("Removing lowestPriority:", lowestPriority);
    
                // Subtract the time
                const lpLocationDuration = lowestPriority[2] / 60; // Minutes to hours
                const lpTransportDuration = lowestPriority[3];
                totalTravelTime = totalTravelTime - (lpLocationDuration + lpTransportDuration)
                console.log("New totalTravelTime:", totalTravelTime);
            }
    
            // sortedLocationsByPriority now has all the new locations that should be in the new dest so return that
            console.log("PrioSys - sortedLocationsByPriority:", sortedLocationsByPriority);
            return [true, sortedLocationsByPriority];
        }
        else
        {
            console.log("No PrioSys needed.");
            return [false, []];
        }
    } catch (error) {
        console.log("PrioSys Error Second Half:", error);
    }
    return [false, []];
}

// Returns locationDurations, transportDurations, and priority
export function processDurations(locationAndDurations) {
    // Extract location durations and convert minutes to hours
    let locationDuration = locationAndDurations.map(route => route.locationDuration);
    locationDuration = locationDuration.map(duration => duration / 60);

    // Process transport durations and handle different formats
    let transportDurations = locationAndDurations.map(route => {
        const duration = route.duration;
        console.log(`Processing transport duration for route: ${duration}`);

        // Skip the last transport duration (should be null)
        // NOTE: The LAST TIME SHOULD ALWAYS BE NULL
        if (duration == null) {
            return null;  // No need to process the last transport duration
        }

        // Check if duration includes "hour", "hrs", or "hours"
        if (duration.includes('hour') || duration.includes('hrs') || duration.includes('hours')) {
            let totalHours = 0;

            // Match hours and minutes from the duration string
            const hoursMatch = duration.match(/(\d+)\s*(hrs?|hour|hours)/);
            const minutesMatch = duration.match(/(\d+)\s*mins/);

            // Parse hours if present
            if (hoursMatch) {
                totalHours += parseInt(hoursMatch[1]);
                console.log(`Parsed ${hoursMatch[1]} hours`);
            }

            // Parse minutes if present
            if (minutesMatch) {
                totalHours += parseInt(minutesMatch[1]) / 60;
                console.log(`Parsed ${minutesMatch[1]} minutes`);
            }

            console.log(`Total duration: ${totalHours} hours`);
            return totalHours;  // Return total duration in hours
        }

        // Check if duration includes minutes (mins)
        if (duration.includes('mins')) {
            const minutes = parseInt(duration.replace(' mins', ''));
            const hours = minutes / 60;
            console.log(`Converted ${minutes} minutes to ${hours} hours`);
            return hours;  // Convert minutes to hours
        }

        // Check if duration includes a single minute (min)
        if (duration.includes('min')) {
            const minute = parseInt(duration.replace(' min', ''));
            const hours = minute / 60;
            console.log(`Converted ${minute} minute to ${hours} hours`);
            return hours;  // Convert minute to hours
        }

        throw new Error("Invalid duration format: " + duration);
    });

    // Extract priorities from destinations
    let priorities = locationAndDurations.map(item => {
        return item.destination ? item.destination[item.destination.length - 1] : -1;
    });

    console.log("Origin durations:", locationDuration);
    console.log("Transport durations:", transportDurations);
    console.log("Priorities:", priorities);

    // Return the processed data
    return { locationDuration, transportDurations, priorities };
}