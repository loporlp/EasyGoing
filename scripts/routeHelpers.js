import { getRoutePolyline } from './routePolyline';
import { getCoords } from './nameToCoords';

export const fetchPolylinesAndDurations = async (locations, transportationModes) => {
  const allPolylines = [];
  const allTransportDurations = [];
  const allMarkers = [];

  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;

  for (let i = 0; i < locations.length; i++) {
    const [origin, destination] = locations[i];
    const mode = transportationModes[i];

    // Fetch coordinates for origin and destination
    const originCoords = await getCoords({ description: origin, place_id: '' });
    const destinationCoords = await getCoords({ description: destination, place_id: '' });

    // Store markers
    allMarkers.push({
      origin: originCoords,
      destination: destinationCoords,
    });

    // Get the polyline for the route
    const routePolyline = await getRoutePolyline(origin, originCoords, destination, destinationCoords, mode);

    if (routePolyline) {
      const polylinesArray = Array.isArray(routePolyline) ? routePolyline : [routePolyline];

      // Add polyline data to the list
      polylinesArray.forEach((polyline) => {
        allPolylines.push({
          id: `${origin}$${destination}$${mode}`,
          coordinates: polyline.path, // Use the path from the response
          strokeColor: polyline.strokeColor,
          strokeWidth: 4, // Default stroke width
          duration: polyline.duration,
        });

        // Add duration to the list
        allTransportDurations.push({
          origin,
          destination,
          mode,
          duration: polyline.duration, // Store the duration
        });

        // Update the bounds for each polyline
        polyline.path.forEach((coord) => {
          minLat = Math.min(minLat, coord.latitude);
          maxLat = Math.max(maxLat, coord.latitude);
          minLon = Math.min(minLon, coord.longitude);
          maxLon = Math.max(maxLon, coord.longitude);
        });
      });
    }
  }

  return {
    polylines: allPolylines,
    transportDurations: allTransportDurations,
    markers: allMarkers,
    bounds: { minLat, maxLat, minLon, maxLon },
  };
};
