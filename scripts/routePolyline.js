import { getCoords } from '../scripts/nameToCoords.js';
import { getIdToken } from '../scripts/getFirebaseID';
import { auth } from '../firebaseConfig';

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

export async function getRoutePolyline(origin, destination, mode) {
    try {
        // Combine name & address for origin and destination
        origin = origin[0] + ", " + origin[1];
        destination = destination[0] + ", " + destination[1];
        console.log("Origin in Poly: " + origin);
        console.log("Dest in Poly: " + destination);
        console.log("Mode in Poly: " + mode);

        // Get coordinates using getCoords
        const originCoords = await getCoords({ description: origin, place_id: '' });
        const destinationCoords = await getCoords({ description: destination, place_id: '' });

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

            const modeColors = {
                DRIVING: '#FF0000', // Red for driving
                WALKING: '#0000FF', // Blue for walking
                BICYCLING: '#00FF00', // Green for bicycling
                TRANSIT: '#FFD700', // Yellow for transit
            };

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

            // TODO: Sometimes transit works. In the cases it doesn't due to multiple stops required, we handle it here.
            return null;
        }
    } catch (error) {
        console.error('Error fetching route: (error)', error);
        return null;
    }
}

export function clearRoutePolylines() {
    routePolylines = [];
}
