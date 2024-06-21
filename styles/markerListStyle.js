import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const useDynamicStyles = () => {
    const { colors } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            padding: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        iconButton: {
            padding: 5,
            color: colors.text,
        },
        markerContainer: {
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            borderBottomWidth: 1,
            borderBottomColor: colors.text,
        },
        markerHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        markerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 5,
        },
        markerDescription: {
            fontSize: 16,
            color: colors.text,
        },
    });
};

export default useDynamicStyles;
