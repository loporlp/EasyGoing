//methods for storing data in async storage, will be stored in JSON format, keys are expected to be strings
import storage from '@react-native-async-storage/async-storage';

//storages data with given key and value
export const storeData = async (key, value) => {
    //ensure key is string for proper storage
    if(!(typeof key === 'string' || key instanceof String))
    {
        console.error("KEY ISN'T STRING");
        return;
    }   
    try {
        let jsonValue = value;
        //converts item into JSON string if it's not already a string
        if(!(typeof value === 'string' || value instanceof String)){
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
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(e);
    }
};