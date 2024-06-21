import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const LogoTitle = () => {
    const { colors } = useTheme();

    return (
        <Image
            style={styles.logo}
            source={
                colors.background === '#434d66' // Check if the background color matches the dark theme
                    ? require('../assets/darkMarkFisherLogo.png')
                    : require('../assets/MarkFisherLogo.png')
            }
        />
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 100, // Adjust the width to fit your needs
        height: 50, // Adjust the height to fit your needs
        resizeMode: 'contain', // Ensure the image scales properly
    },
});

export default LogoTitle;
