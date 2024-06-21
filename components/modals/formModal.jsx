import React from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text } from 'react-native';
import styles from '../../styles/modalStyle';

const FormModal = ({ visible, markerTitle, markerDescription, setMarkerTitle, setMarkerDescription, onSave, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter title"
                        onChangeText={setMarkerTitle}
                        value={markerTitle}
                    />
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Enter description"
                        onChangeText={setMarkerDescription}
                        value={markerDescription}
                        multiline={true}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default FormModal;
