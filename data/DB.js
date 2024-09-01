import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores JSON data in AsyncStorage.
 * @param {string} key - The key under which the data will be stored.
 * @param {Object} value - The JSON object to store.
 * @returns {Promise<void>} - A promise that resolves when the data is stored.
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

/**
 * Reads JSON data from AsyncStorage.
 * @param {string} key - The key under which the data is stored.
 * @returns {Promise<Object|null>} - A promise that resolves with the JSON object or null if not found.
 */
export const readData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
};

/**
 * Example usage:
 * 
 * import { storeData, readData } from './path-to-this-file';
 * 
 * // Storing data
 * storeData('userProfile', { name: 'John Doe', age: 30 });
 * 
 * // Reading data
 * readData('userProfile').then(data => console.log(data));
 */

