import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDynamicStyles from "../styles/homeStyle";
import { useRoute, useTheme, useIsFocused, useNavigation } from '@react-navigation/native';
import FormModal from "../components/modals/formModal";
import MarkerModal from "../components/modals/markerModal";

import { fetchMarkersFromAPI, loadMarkersFromStorage } from '../scripts/fetchMarkers';

const Home = () => {
    // states
    const [markers, setMarkers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [markerModal, setMarkerModalVisible] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [markerTitle, setMarkerTitle] = useState('');
    const [markerDescription, setMarkerDescription] = useState('');
    const [crosshairVisible, setCrosshairVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [crosshairOpacity] = useState(new Animated.Value(0));
    const [currentLocation, setCurrentLocation] = useState(null);

    // refs
    const mapRef = useRef(null);
    const styles = useDynamicStyles();

    // navigation
    const route = useRoute();
    const isFocused = useIsFocused();

    const { colors } = useTheme();

    const markerIcon = colors.background === '#434d66' // Assuming dark theme background color
        ? require('../assets/darkMapMarker.png')
        : require('../assets/smallMapMarker.png');

    const fetchMarkersFromAPI = async () => {
        try {
            const response = await fetch('https://stud.hosted.hr.nl/1051761/markerLocations.json');
            const data = await response.json();
            return data.map((marker, index) => ({ ...marker, key: `api-${index}` })); // Ensure unique keys
        } catch (error) {
            console.error('Error fetching marker data from API:', error);
            return [];
        }
    };

    const loadMarkersFromStorage = async () => {
        try {
            const jsonMarkers = await AsyncStorage.getItem('markers');
            return jsonMarkers != null ? JSON.parse(jsonMarkers) : [];
        } catch (error) {
            console.error('Error loading markers from AsyncStorage:', error);
            return [];
        }
    };

    const saveMarkersToStorage = async (markers) => {
        try {
            const jsonMarkers = JSON.stringify(markers);
            await AsyncStorage.setItem('markers', jsonMarkers);
        } catch (error) {
            console.error('Error saving markers to AsyncStorage:', error);
        }
    };

    const addMarkerAtCenter = async () => {
        if (mapRef.current) {
            mapRef.current.getCamera()
                .then(camera => {
                    const centerCoordinate = camera.center;
                    const newMarker = {
                        coordinate: centerCoordinate,
                        key: `local-${Date.now()}`, // Generate unique key
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

    const saveMarkerInfo = async () => {
        const updatedMarkers = markers.map((marker) =>
            marker.key === selectedMarker.key ? { ...marker, title: markerTitle, description: markerDescription } : marker
        );
        setMarkers(updatedMarkers);
        saveMarkersToStorage(updatedMarkers);
        setModalVisible(false);
        setMarkerTitle('');
        setMarkerDescription('');
    };

    const toggleFavorite = async () => {
        const updatedMarkers = markers.map((marker) =>
            marker.key === selectedMarker.key ? { ...marker, favorite: !marker.favorite } : marker
        );
        setMarkers(updatedMarkers);
        saveMarkersToStorage(updatedMarkers);
        setMarkerModalVisible(false);
    };

    const onPanDrag = () => {
        setCrosshairVisible(true);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            setCrosshairVisible(false);
        }, 500);
        setTimeoutId(id);
    };

    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        setMarkerModalVisible(true);
    };

    useEffect(() => {
        Animated.timing(crosshairOpacity, {
            toValue: crosshairVisible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [crosshairVisible]);

    useEffect(() => {
        if (route.params && route.params.coordinate) {
            const { coordinate } = route.params;
            if (mapRef.current && coordinate) {
                mapRef.current.animateToRegion({
                    ...coordinate,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        }
    }, [route.params]);

    useEffect(() => {
        const loadInitialMarkers = async () => {
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
        loadInitialMarkers();
    }, []);

    useEffect(() => {
        if (isFocused) {
            const reloadMarkers = async () => {
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
            reloadMarkers();
        }
    }, [isFocused]);

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setCurrentLocation({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        };

        requestLocationPermission();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                ref={mapRef}
                onPanDrag={onPanDrag}
                mapType="mutedStandard"
                showsUserLocation={true}
                followsUserLocation={true}
                initialRegion={{
                    latitude: 52.1326,
                    longitude: 5.2913,
                    latitudeDelta: 1.5,
                    longitudeDelta: 1.5,
                }}
            >
                {markers.map((marker) => (
                    <Marker key={marker.key}
                            coordinate={marker.coordinate}
                            onPress={() => handleMarkerPress(marker)}
                            icon={markerIcon} // Adding this makes it possible to use tracksviewchanges
                            tracksViewChanges={false} // Before I was using icon and this my whole app had a lot of lag. For me, this fixed it
                    >
                    </Marker>
                ))}
            </MapView>
            <Animated.View style={[styles.crosshair, { opacity: crosshairOpacity }]} />
            <TouchableOpacity style={styles.addButton} onPress={addMarkerAtCenter}>
                <Text style={styles.addButtonLabel}>+</Text>
            </TouchableOpacity>
            <FormModal
                visible={modalVisible}
                markerTitle={markerTitle}
                markerDescription={markerDescription}
                setMarkerTitle={setMarkerTitle}
                setMarkerDescription={setMarkerDescription}
                onSave={saveMarkerInfo}
                onClose={() => setModalVisible(false)}
            />
            <MarkerModal
                visible={markerModal}
                marker={selectedMarker}
                onFavorite={toggleFavorite}
                onClose={() => setMarkerModalVisible(false)}
            />
        </View>
    );
};

export default Home;
