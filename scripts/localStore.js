//methods for storing data in async storage, will be stored in JSON format, keys are expected to be strings
import storage from '@react-native-async-storage/async-storage';
import {getTrips} from "./databaseInteraction";

//storages data with given key and value
export const storeData = async (key, value) => {
    //ensure key is string for proper storage
    if(!(typeof key === 'string' || key instanceof String))
    {
        console.error("KEY ISN'T STRING");
        return;
    }   
    try {
        let jsonValue;
        //converts item into JSON string if it's not already a string
        if(typeof value === 'string' || value instanceof String){
            jsonValue = value; //store directly if it's a string
        } else {
            jsonValue = JSON.stringify(value);
        }
        await storage.setItem(key, jsonValue);
        console.log(`${key} stored as ${jsonValue}`);
    } catch (e) {
        console.error(e);
    }

};

//gets data attatched to key
export const getData = async (key) => {
    //ensure key is string for proper storage
    if(!(typeof key === 'string' || key instanceof String))
    {
        console.error("KEY ISN'T STRING");
        return;
    }   
    try {
        const jsonValue = await storage.getItem(key);
        console.log(`${key} retrieved ${jsonValue}`);
        return jsonValue != null ? (isJsonString(jsonValue) ? JSON.parse(jsonValue) : jsonValue) : null;
    } catch (e) {
        console.error(e);
    }
};

//storages data with given key and value
export const deleteData = async (key) => {
    //ensure key is string for proper storage
    if(!(typeof key === 'string' || key instanceof String))
    {
        console.error("KEY ISN'T STRING");
        return;
    }   
    try {
        await storage.removeItem(key);
        console.log(`${key} deleted`);
    } catch (e) {
        console.error(e);
    }

};

export const fillLocal = async () => {
    console.log("called fill localStorage")
    hasTrips = await storage.getItem("tripIDs"); 
    console.log(`HasTrips: ${hasTrips}`)
    if(!hasTrips || JSON.parse(hasTrips).length === 0){
        trips = await getTrips();
        tripIDs = Object.keys(trips);
        await storeData("tripIDs", tripIDs);
        tripIDs.forEach(ID => {
            storeData(ID, trips[ID]);
        });
        console.log(`Storing new: ${hasTrips}`)
    }
    else {
        console.log(`Already has trips: ${hasTrips}`)
    }
}

// Helper function to check if a string is valid JSON
const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};