import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/modalStyle';

const MarkerModal = ({ visible, marker, onSave, onClose, onFavorite }) => {
    if (!visible || !marker) {
        return null;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Marker Info</Text>
                    <View style={styles.markerInfoContainer}>
                        <Text style={styles.markerText}>Title: {marker.title}</Text>
                        <TouchableOpacity onPress={onFavorite} style={styles.favoriteButton}>
                            <Icon
                                name={marker.favorite ? 'heart' : 'heart-o'}
                                size={24}
                                color={marker.favorite ? 'red' : 'grey'}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.descriptionContainer}>
                        <Text style={styles.markerText}>Description: {marker.description}</Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MarkerModal;
