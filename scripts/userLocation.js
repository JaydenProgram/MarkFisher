import * as Location from 'expo-location';

export const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return false;
    }
    return true;
};

export const getCurrentLocation = async () => {
    try {
        return await Location.getCurrentPositionAsync({});
    } catch (error) {
        console.error('Error getting current location:', error);
        return null;
    }
};
