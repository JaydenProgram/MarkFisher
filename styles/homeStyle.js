import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const useDynamicStyles = () => {
    const { colors } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background, // Use the background color from the theme
        },
        map: {
            flex: 1,
        },
        addButton: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: colors.background, // Use the primary color from the theme
            borderRadius: 30,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addButtonLabel: {
            color: colors.text, // Use the text color from the theme
            fontSize: 16,
            fontWeight: 'bold',
        },
        calloutContainer: {
            width: 200,
            backgroundColor: colors.card, // Use the card color from the theme
        },
        calloutTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
            color: colors.text, // Use the text color from the theme
        },
        calloutDescription: {
            fontSize: 14,
            color: colors.text, // Use the text color from the theme
        },
        descriptionInput: {
            height: 100,
            backgroundColor: colors.background, // Use the background color from the theme
            color: colors.text, // Use the text color from the theme
        },
        crosshair: {
            position: 'absolute',
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: colors.text, // Use the border color from the theme
            borderRadius: 10,
            top: '50%',
            left: '50%',
            marginLeft: -10,
            marginTop: -10,
            backgroundColor: 'transparent',
        },
    });
};

export default useDynamicStyles;