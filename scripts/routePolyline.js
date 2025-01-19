import { getCoords } from '../scripts/nameToCoords.js';
import { getIdToken } from '../scripts/getFirebaseID';
import { auth } from '../firebaseConfig';
import { getTransitRoute } from '../scripts/transitRoute.js';

let routePolylines = [];

function decodePolyline(encoded) {
    let path = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
        let shift = 0;
        let result = 0;
        let byte;
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += deltaLng;

        path.push({ latitude: lat / 1E5, longitude: lng / 1E5 });
    }
    return path;
}

const modeColors = {
    DRIVING: '#FF0000', // Red for driving
    WALKING: '#0000FF', // Blue for walking
    BICYCLING: '#00FF00', // Green for bicycling
    TRANSIT: '#FFD700', // Yellow for transit
};

export async function getRoutePolyline(origin, destination, mode) {
    let originCoords;
    let destinationCoords;
    try {
        // Combine name & address for origin and destination
        origin = origin[0] + ", " + origin[1];
        destination = destination[0] + ", " + destination[1];
        console.log("Origin in Poly: " + origin);
        console.log("Dest in Poly: " + destination);
        console.log("Mode in Poly: " + mode);

        // Get coordinates using getCoords
        originCoords = await getCoords({ description: origin, place_id: '' });
        destinationCoords = await getCoords({ description: destination, place_id: '' });

        // Retrieve the ID token from Firebase
        const idToken = await getIdToken(auth);

        // Construct the API URL
        const url = `http://ezgoing.app/api/directions?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=${mode.toLowerCase()}`;

        console.log("URL:", url);

        // Make the API call with authentication token
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'OK') {
            const polyline = data.routes[0].overview_polyline.points;
            const decodedPolyline = decodePolyline(polyline);

            //console.log("Decoded Other Polyline: ", decodedPolyline);

            // Set the stroke color based on the mode
            const strokeColor = modeColors[mode.toUpperCase()] || '#FF0000'; // Default to red

            const routePolyline = {
                path: decodedPolyline,
                strokeColor: strokeColor,
                strokeOpacity: 1.0,
                strokeWeight: 2,
            };

            routePolylines.push(routePolyline);
            return routePolyline; // Return both path and strokeColor
        } else {
            console.error('Error fetching route (data):', data.status);
            console.log("Switching to transit mode");

            // Handle Transit Mode
            try {
                const transitData = await getTransitRoute(originCoords, destinationCoords);

                if (transitData) {
                    console.log('Transit Route Data:', transitData);

                    const polylineSegments = [];  // This array will store all the polylines for the transit route.

                    if (Array.isArray(transitData) && transitData.length > 0) {
                        // Get the top (first) route from transitData
                        const topRoute = transitData[0];
                        console.log(`Top Route:`, topRoute);

                        // Check if the top route has a 'legs' property and it's an array
                        if (topRoute.legs && Array.isArray(topRoute.legs) && topRoute.legs.length > 0) {
                            console.log(`Top Route has ${topRoute.legs.length} legs.`);

                            // Loop through the steps of the first leg to extract polyline data
                            const firstLeg = topRoute.legs[0]; // Take the first leg from the top route
                            if (firstLeg.steps && Array.isArray(firstLeg.steps)) {
                                firstLeg.steps.forEach(step => {
                                    if (step.polyline && step.polyline.points) {
                                        const decodedPolyline = decodePolyline(step.polyline.points);

                                        //console.log("Decoded Transit Polyline: ", decodedPolyline);

                                        // Set the stroke color based on the mode
                                        const strokeColor = modeColors[mode.toUpperCase()] || '#FFD700'; // Default to yellow

                                        const routePolyline = {
                                            path: decodedPolyline,
                                            strokeColor: strokeColor,
                                            strokeOpacity: 1.0,
                                            strokeWeight: 2,
                                        };
                                        polylineSegments.push(routePolyline);  // Add each polyline segment to the array
                                    }
                                });
                            }
                        } else {
                            console.log(`Top Route does not have valid legs.`);
                        }
                    } else {
                        console.log("Transit data is not an array or is empty");
                    }

                    return polylineSegments;  // Return the array of polylines for the transit route
                } else {
                    console.error('No transit data returned.');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching transit route: (error)', error);
                return null;
            }
        }
    } catch (error) {
        console.error('Error fetching route: (error)', error);
        return null;
    }
}
