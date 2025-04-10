import { getCoordinates } from '../components/geocoding';

export const getCoords = async (place) => {
    const description = place.description
        try {
            // Await coordinates from getCoordinates
            const coordinates = await getCoordinates(description);

            console.log("Selected place:", description);
            console.log("Selected place coords:", coordinates);

            // Extract latitude and longitude from the selected place details
            if (coordinates) {
                console.log("Setting coordinates");
                return coordinates;
            } else {
                console.log("No coordinates found for the selected place.");
                throw new Error("No coordinates found for the selected place.");
            }
        } catch (error) {
            console.error("Error while fetching coordinate (nTC)s:", error);
            throw new Error("Error while fetching coordinate (nTC)s:", error);
        }
}