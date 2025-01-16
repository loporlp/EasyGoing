import fetch from 'node-fetch';


export async function getTransitRoute(originCoords, destinationCoords) {
  const apiKey = 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI';
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  const requestBody = {
    origin: { latLng: { latitude: originCoords.lat, longitude: originCoords.lng } },
    destination: { latLng: { latitude: destinationCoords.lat, longitude: destinationCoords.lng } },
    travelMode: 'TRANSIT',
    computeAlternativeRoutes: true,
    transitPreferences: {
      routingPreference: 'LESS_WALKING', // or 'FEWER_TRANSFERS'
      allowedTravelModes: ['TRAIN', 'SUBWAY', 'BUS']
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.legs.steps.transitDetails'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json(); // Waits for the response to resolve and converts it to JSON

  return data;
}

// Call the function and handle the response
async function displayRoute() {
  const origin = { lat: 35.659482, lng: 139.7005596 }; // Example origin coordinates
  const destination = { lat: 35.6984707, lng: 139.7727871 }; // Example destination coordinates

  try {
    const transitRoute = await getTransitRoute(origin, destination);
    console.log(transitRoute); // Process the transit route data
  } catch (error) {
    console.error('Error fetching transit route:', error);
  }
}

displayRoute(); // Execute the function
