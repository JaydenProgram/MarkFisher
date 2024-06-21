import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import useDynamicStyles from '../styles/markerListStyle';
import { fetchMarkersFromAPI, loadMarkersFromStorage } from '../scripts/fetchMarkers';

const MarkerList = () => {
    const [markers, setMarkers] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const styles = useDynamicStyles();
    const loadMarkers = async () => {
        const apiMarkers = await fetchMarkersFromAPI();
        const storedMarkers = await loadMarkersFromStorage();
        const combinedMarkers = apiMarkers.map(apiMarker => {
            const storedMarker = storedMarkers.find(marker => marker.key === apiMarker.key);
            return storedMarker ? { ...apiMarker, favorite: storedMarker.favorite } : apiMarker;
        });
        const uniqueMarkers = combinedMarkers.reduce((acc, marker) => {
            if (!acc.find(m => m.key === marker.key)) {
                acc.push(marker);
            }
            return acc;
        }, []);
        setMarkers(uniqueMarkers);
    };

    useEffect(() => {
        if (isFocused) {
            loadMarkers();
        }
    }, [isFocused]);

    const navigateToMarker = (coordinate) => {
        navigation.navigate('Home', { coordinate });
    };

    const toggleShowFavorites = () => {
        setShowFavorites(!showFavorites);
    };

    const filteredMarkers = showFavorites ? markers.filter(marker => marker.favorite) : markers;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List of Markers</Text>
                <TouchableOpacity onPress={toggleShowFavorites} style={styles.iconButton}>
                    <Icon name={showFavorites ? "heart" : "heart-outline"} size={30} color={styles.iconButton.color} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredMarkers}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigateToMarker(item.coordinate)}>
                        <View style={styles.markerContainer}>
                            <View style={styles.markerHeader}>
                                <Text style={styles.markerTitle}>{item.title}</Text>
                                {item.favorite && <Icon name="heart" size={20} color="#e74c3c" />}
                            </View>
                            <Text style={styles.markerDescription}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.key.toString()}
            />
        </View>
    );
};

export default MarkerList;
