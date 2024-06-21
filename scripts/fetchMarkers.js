import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchMarkersFromAPI = async () => {
    try {
        const response = await fetch('https://stud.hosted.hr.nl/1051761/markerLocations.json');
        const data = await response.json();
        return data.map((marker, index) => ({ ...marker, key: `api-${index}` }));
    } catch (error) {
        console.error('Error fetching marker data from API:', error);
        return [];
    }
};

export const loadMarkersFromStorage = async () => {
    try {
        const jsonMarkers = await AsyncStorage.getItem('markers');
        return jsonMarkers != null ? JSON.parse(jsonMarkers) : [];
    } catch (error) {
        console.error('Error loading markers from AsyncStorage:', error);
        return [];
    }
};

export const saveMarkersToStorage = async (markers) => {
    try {
        const jsonMarkers = JSON.stringify(markers);
        await AsyncStorage.setItem('markers', jsonMarkers);
    } catch (error) {
        console.error('Error saving markers to AsyncStorage:', error);
    }
};
