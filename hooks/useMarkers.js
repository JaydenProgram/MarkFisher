import { useState, useEffect } from 'react';
import { fetchMarkersFromAPI, loadMarkersFromStorage, saveMarkersToStorage } from '../scripts/fetchMarkers';

const useMarkers = (mapRef, setModalVisible, setMarkerModalVisible, setSelectedMarker) => {
    const [markers, setMarkers] = useState([]);

    const loadMarkers = async () => {
        const storedMarkers = await loadMarkersFromStorage();
        const apiMarkers = await fetchMarkersFromAPI();
        const combinedMarkers = [...storedMarkers, ...apiMarkers];
        const uniqueMarkers = combinedMarkers.reduce((acc, marker) => {
            if (!acc.find(m => m.key === marker.key)) {
                acc.push(marker);
            }
            return acc;
        }, []);
        setMarkers(uniqueMarkers);
    };

    const addMarkerAtCenter = async () => {
        if (mapRef.current) {
            mapRef.current.getCamera()
                .then(camera => {
                    const centerCoordinate = camera.center;
                    const newMarker = {
                        coordinate: centerCoordinate,
                        key: `local-${Date.now()}`,
                        title: '',
                        description: '',
                        favorite: false
                    };
                    const updatedMarkers = [...markers, newMarker];
                    setMarkers(updatedMarkers);
                    saveMarkersToStorage(updatedMarkers);
                    setSelectedMarker(newMarker);
                    setModalVisible(true);
                })
                .catch(error => console.error('Error getting camera center:', error));
        }
    };

    const saveMarkerInfo = async (markerTitle, markerDescription, selectedMarker) => {
        const updatedMarkers = markers.map((marker) =>
            marker.key === selectedMarker.key ? { ...marker, title: markerTitle, description: markerDescription } : marker
        );
        setMarkers(updatedMarkers);
        saveMarkersToStorage(updatedMarkers);
        setModalVisible(false);
    };

    const toggleFavorite = async (selectedMarker) => {
        const updatedMarkers = markers.map((marker) =>
            marker.key === selectedMarker.key ? { ...marker, favorite: !marker.favorite } : marker
        );
        setMarkers(updatedMarkers);
        saveMarkersToStorage(updatedMarkers);
        setMarkerModalVisible(false);
    };

    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        setMarkerModalVisible(true);
    };

    useEffect(() => {
        loadMarkers();
    }, []);

    return {
        markers,
        addMarkerAtCenter,
        saveMarkerInfo,
        toggleFavorite,
        handleMarkerPress
    };
};

export default useMarkers;
