import { getCoords } from '../scripts/nameToCoords.js';

let routePolylines = [];

const apiKey = "AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI";

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
  console.log("Origin in Poly: " + origin);
  console.log("Dest in Poly: " + destination);
  console.log("Mode in Poly: " + mode);

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const polyline = data.routes[0].overview_polyline.points;
      const decodedPolyline = decodePolyline(polyline);

      const modeColors = {
        DRIVING: '#FF0000', // Red for driving
        WALKING: '#0000FF', // Blue for walking
        BICYCLING: '#00FF00', // Green for bicycling
        TRANSIT: '#FFD700', // Gold for transit
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
      console.error('Error fetching route:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}


export function clearRoutePolylines() {
  routePolylines = [];
}
