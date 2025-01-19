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

const driving_color = '#FF0000'; // Red
const walking_color = '#0000FF'; // Blue
const bike_color = '#00FF00'; // Green
const transit_color = '#800080'; // Purple

const stroke_opacity = 0.8;
const stroke_weight = 2;

const modeColors = {
    DRIVING: driving_color,
    WALKING: walking_color,
    BICYCLING: bike_color,
    TRANSIT: transit_color,
};

// Transit Polylines
async function getTransitRoutePolylines(originCoords, destinationCoords, mode) {
    try {
        const transitData = await getTransitRoute(originCoords, destinationCoords);

        if (transitData) {
            console.log('Transit Route Data:', transitData);

            const polylineSegments = [];  // This array will store all the polylines for the transit route.

            if (Array.isArray(transitData) && transitData.length > 0) {
                const topRoute = transitData[0];
                console.log(`Top Route:`, topRoute);

                if (topRoute.legs && Array.isArray(topRoute.legs) && topRoute.legs.length > 0) {
                    const firstLeg = topRoute.legs[0]; // Take the first leg from the top route
                    if (firstLeg.steps && Array.isArray(firstLeg.steps)) {
                        firstLeg.steps.forEach(step => {
                            if (step.polyline && step.polyline.points) {
                                const decodedPolyline = decodePolyline(step.polyline.points);

                                const strokeColor = modeColors[mode.toUpperCase()] || transit_color;

                                const routePolyline = {
                                    path: decodedPolyline,
                                    strokeColor: strokeColor,
                                    strokeOpacity: stroke_opacity,
                                    strokeWeight: stroke_weight,
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

        if (mode == "TRANSIT") {
            // Transit Polyline
            const transitPolylines = await getTransitRoutePolylines(originCoords, destinationCoords, mode);
            return transitPolylines;
        }

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

            const strokeColor = modeColors[mode.toUpperCase()] || driving_color; // Default to driving_color

            const routePolyline = {
                path: decodedPolyline,
                strokeColor: strokeColor,
                strokeOpacity: stroke_opacity,
                strokeWeight: stroke_weight,
            };

            routePolylines.push(routePolyline);
            return routePolyline; // Return both path and strokeColor
        } else {
            console.error('Error fetching route (data):', data.status);
            console.log("Switching to transit mode");

            // Transit Polyline
            const transitPolylines = await getTransitRoutePolylines(originCoords, destinationCoords, mode);
            return transitPolylines;  // Return the polyline segments for the transit route
        }
    } catch (error) {
        console.error('Error fetching route: (error)', error);
        return null;
    }
}
