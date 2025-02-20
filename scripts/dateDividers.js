const { processDurations } = require('./prioritySystem.js');

export async function divideLocationsIntoGroups(locationAndDurations, days) {
    console.log("Starting divideLocationsIntoGroups function");

    try {
        console.log("Locations & Durations:", locationAndDurations);

        const available_hours = 16.0; // TODO: Change later based on input times

        console.log(`Available hours per day: ${available_hours}`);
        console.log(`Total days available: ${days}`);

        const { origin_duration, transport_durations, priorities } = processDurations(locationAndDurations);

        // Check if the lengths of origin_duration and transport_durations are consistent
        if (origin_duration.length !== transport_durations.length) {
            console.log(`Transport durations should be the same as origin durations (because of the "null" in transport).\nLocations: ${origin_duration.length}\nTransport: ${transport_durations.length}`);
        }

        let days_dictionary = {};

        let remaining_hours = available_hours;
        let start_index = 0;
        let end_index = -1;
        
        console.log("Starting the day division process...");

        for (let index = 0; index < origin_duration.length; index++) {
            const location = origin_duration[index];
            
            console.log(`Checking location ${index + 1}: Duration = ${location} hours`);

            console.log(location);

            if (location > available_hours) {
                console.log("Not enough time in a day for this solo activity");
            }

            // Handle new day when remaining hours are not enough
            if (remaining_hours - location < 0) {
                console.log(`Not enough remaining hours for this location. Starting a new day...`);

                if (days > 0) {
                    days -= 1;
                    end_index = index;
                    days_dictionary[start_index] = end_index;
                    console.log(`Added day with locations from index ${start_index} to ${end_index}`);
                    console.log("Days Dictionary: ", days_dictionary);
                    start_index = index;
                    remaining_hours = available_hours;
                } else {
                    console.log("Not enough days available for all activities");
                }
            }

            // Deduct location time from remaining hours
            remaining_hours -= location;
            console.log(`Remaining hours after visiting location: ${remaining_hours}`);

            // If this is not the last location, consider transport time to next location
            if (index !== origin_duration.length - 1) {
                const travel_time = transport_durations[index];

                console.log(`Checking transport time to next location: ${travel_time} hours`);

                // Handle transport to the next location, if not enough time, move to next day
                if (remaining_hours - travel_time < 0) {
                    console.log("Not enough remaining hours for travel. Starting a new day...");
                    if (days > 0) {
                        days -= 1;
                        const end_index = index;
                        days_dictionary[start_index] = end_index;
                        console.log(`Added day with locations from index ${start_index} to ${end_index}`);
                        console.log("Days Dictionary: ", days_dictionary);
                        start_index = index;
                        remaining_hours = available_hours;
                    } else {
                        throw new Error("Not enough days available for all activities");
                    }
                }

                // Deduct travel time
                remaining_hours -= travel_time;
                console.log(`Remaining hours after travel: ${remaining_hours}`);
            }
        }

        // Case: Only one day was spent
        if (start_index == 0 && Object.entries(days_dictionary).length === 0) {
            console.log("No days spent");
            end_index = origin_duration.length - 1;
            days_dictionary[start_index] = end_index;
            console.log(`Added day with locations from index ${start_index} to ${end_index}`);
            console.log("Days Dictionary: ", days_dictionary);
        }

        console.log("Finished dividing locations into days");
        console.log("Final divisions:", days_dictionary);

        // Return the dictionary mapping days to locations
        return days_dictionary;

    } catch (error) {
        console.log("Error in divideLocationsIntoGroups:", error);
    }
}

export function calculateTotalTime(locationAndDurations) {
    console.log("Starting calculateTotalTime function");

    // Extract durations from locations and transport
    const origin_duration = locationAndDurations.map(route => route.locationDuration / 60); // Minutes -> Hours
    const transport_durations = locationAndDurations.map(route => {
        const duration = route.duration;

        console.log(`Processing transport duration for route: ${duration}`);

        // Skip the last transport duration (should be null)
        // No need to process the last transport duration
        if (duration == null) {
            return null;
        }

        if (duration.includes('hour') || duration.includes('hrs')) {
            let totalHours = 0;

            // Check for both hours and minutes in the duration
            const hoursMatch = duration.match(/(\d+)\s*(hrs?|hour)/);
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

            console.log(`Total transport duration: ${totalHours} hours`);
            return totalHours;  // Return total transport duration in hours
        }

        if (duration.includes('mins')) {
            const minutes = parseInt(duration.replace(' mins', ''));
            const hours = minutes / 60;
            console.log(`Converted ${minutes} minutes to ${hours} hours`);
            return hours;  // Convert minutes to hours
        }

        if (duration.includes('min')) {
            const minute = parseInt(duration.replace(' min', ''));
            const hours = minute / 60;
            console.log(`Converted ${minute} minute to ${hours} hours`);
            return hours;  // Convert minute to hours
        }

        throw new Error("Invalid duration format: " + duration);
    });

    console.log("Origin durations: ", origin_duration);
    console.log("Transport durations: ", transport_durations);

    // Calculate the total time for all activities
    let totalLocationTime = origin_duration.reduce((acc, cur) => acc + cur, 0);
    let totalTransportTime = transport_durations.reduce((acc, cur) => acc + (cur || 0), 0);

    console.log(`Total Location Time: ${totalLocationTime} hours`);
    console.log(`Total Transport Time: ${totalTransportTime} hours`);

    const totalTime = totalLocationTime + totalTransportTime;
    console.log(`Total Time (Location + Transport): ${totalTime} hours`);

    return totalTime;
}