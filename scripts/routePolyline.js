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
const bus_color = '#006400'; // Dark Green
const train_color = '#800000'; // Maroon
const subway_color = '#000080'; // Navy
const tram_color = '#808080'; // Gray
const ferry_color = '#40E0D0'; // Turquoise

const stroke_opacity = 0.8;
const stroke_weight = 2;

const modeColors = {
    DRIVING: driving_color,
    WALKING: walking_color,
    BICYCLING: bike_color,
    TRANSIT: transit_color,
    BUS: bus_color,
    TRAIN: train_color,
    SUBWAY: subway_color,
    TRAM: tram_color,
    FERRY: ferry_color,
};

// Transit Polylines
async function getTransitRoutePolylines(originAddress, originCoords, destinationAddress, destinationCoords, mode) {
    try {
        const transitData = await getTransitRoute(originCoords, destinationCoords);

        if (transitData) {
            console.log('Transit Route Data:', transitData);

            const polylineSegments = [];  // This array will store all the polylines for the transit route.

            if (Array.isArray(transitData) && transitData.length > 0) {
                const topRoute = transitData[0];
                console.log(`Top Route:`, topRoute);

                if (topRoute.legs && Array.isArray(topRoute.legs) && topRoute.legs.length > 0) {
                    topRoute.legs.forEach(leg => {
                        if (Array.isArray(leg.steps)) {
                            leg.steps.forEach(step => {
                                if (step.polyline && step.polyline.points) {
                                    const decodedPolyline = decodePolyline(step.polyline.points);

                                    let strokeColor = transit_color;  // Default to purple for TRANSIT

                                    // Check if the step is a walking step
                                    if (step.travel_mode === 'WALKING') {
                                        strokeColor = modeColors.WALKING;
                                    }
                                    // Check the mode for each step (bus, train, subway, etc.)
                                    else if (step.transit_details && step.transit_details.line && step.transit_details.line.vehicle) {
                                        const vehicleType = step.transit_details.line.vehicle.type.toUpperCase();

                                        // Assign specific colors for each vehicle type
                                        if (vehicleType === 'BUS') {
                                            strokeColor = modeColors.BUS;
                                        } else if (vehicleType === 'TRAIN') {
                                            strokeColor = modeColors.TRAIN;
                                        } else if (vehicleType === 'SUBWAY') {
                                            strokeColor = modeColors.SUBWAY;
                                        } else if (vehicleType === 'TRAM') {
                                            strokeColor = modeColors.TRAM;
                                        } else if (vehicleType === 'FERRY') {
                                            strokeColor = modeColors.FERRY;
                                        } else {
                                            // Use generic color for other transit vehicle types
                                            strokeColor = modeColors[vehicleType] || transit_color;
                                        }
                                    }

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
                    });
                } else {
                    console.log(`Top Route does not have valid legs.`);
                }
            } else {
                console.log("Transit data is not an array or is empty");
                console.log("Switching to driving mode due to error.");
                return await getRoutePolyline(originAddress, originCoords, destinationAddress, destinationCoords, "DRIVING", false);
            }

            return polylineSegments;  // Return the array of polylines for the transit route
        } else {
            console.error('No transit data returned.');
            console.log("Switching to driving mode due to error.");
            return await getRoutePolyline(originAddress, originCoords, destinationAddress, destinationCoords, "DRIVING", false);
        }
    } catch (error) {
        console.error('Error fetching transit route: (error)', error);
        console.log("Switching to driving mode due to error.");
        return await getRoutePolyline(originAddress, originCoords, destinationAddress, destinationCoords, "DRIVING", false);
    }
}

export async function getRoutePolyline(origin, originCoords, destination, destinationCoords, mode, retry = false) {
    console.log("in getRoutePolyline function");

    const originAddress = origin;
    const destinationAddress = destination;

    try {
        // Combine name & address for origin and destination
        origin = originAddress[0] + ", " + originAddress[1];
        destination = destinationAddress[0] + ", " + destinationAddress[1];
        console.log("Origin in Poly: " + origin);
        console.log("Dest in Poly: " + destination);
        console.log("Mode in Poly: " + mode);

        if (mode.toUpperCase() == "TRANSIT") {
            // Transit Polyline
            const transitPolylines = await getTransitRoutePolylines(originAddress, originCoords, destinationAddress, destinationCoords, mode);
            return transitPolylines;
        }

        // Retrieve the ID token from Firebase
        const idToken = await getIdToken(auth);

        // Construct the API URL
        const url = `https://ezgoing.app/api/directions?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=${mode.toLowerCase()}`;

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
            const duration = data.routes[0].legs[0].duration.text;

            const strokeColor = modeColors[mode.toUpperCase()] || driving_color; // Default to driving_color

            const routePolyline = {
                path: decodedPolyline,
                strokeColor: strokeColor,
                strokeOpacity: stroke_opacity,
                strokeWeight: stroke_weight,
                duration: duration,
            };

            routePolylines.push(routePolyline);
            return routePolyline; // Return path strokeColor, opacity weight, and duration
        } else {
            console.error('Error fetching route (data):', data.status);
            console.log("Switching to transit mode");

            // Transit Polyline
            const transitPolylines = await getTransitRoutePolylines(originAddress, originCoords, destinationAddress, destinationCoords, mode);
            return transitPolylines;  // Return the polyline segments for the transit route
        }
    } catch (error) {
        console.error('Error fetching route: (error)', error);

        console.log("Retry: " + retry)

        if (retry == true) {
        // Default to driving in case of error
            console.log("Switching to driving mode due to error.");
            return await getRoutePolyline(originAddress, originCoords, destinationAddress, destinationCoords, "DRIVING", false);  // Retry with driving as fallback
        }

        return null;
    }
}
