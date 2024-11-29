//E:\SFU\IAT 359\ClosetShare\src\utils\storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving data', error);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data', error);
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data', error);
  }
};

export const saveOutfitID = async (outfitID) => {
  try {
    await AsyncStorage.setItem('currentOutfitID', outfitID);
  } catch (error) {
    console.error('Error saving outfitID:', error);
  }
};

export const getOutfitID = async () => {
  try {
    const outfitID = await AsyncStorage.getItem('currentOutfitID');
    return outfitID;
  } catch (error) {
    console.error('Error retrieving outfitID:', error);
    return null;
  }
};
