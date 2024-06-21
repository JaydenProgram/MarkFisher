// account.js
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { ThemeContext } from '../components/themeContext';
import { get } from '../scripts/themeStorage';
import { useTheme } from '@react-navigation/native';
import { light, dark } from '../styles/colors/colorList';

const Account = () => {
    const { theme, toggleTheme, colors } = useContext(ThemeContext);
    const [initialValue, setInitialValue] = useState(0);
    const data = [
        { label: 'Light Mode', value: 'light' },
        { label: 'Dark Mode', value: 'dark' },
        { label: 'System Default', value: 'default' },
    ];

    const themeOperations = (themeValue) => {
        switch (themeValue) {
            case 'dark':
                toggleTheme('dark', false);
                setInitialValue(2);
                return;
            case 'light':
                toggleTheme('light', false);
                setInitialValue(1);
                return;
            case 'default':
                toggleTheme('default', true);
                setInitialValue(3);
                return;
        }
    };

    const getAppTheme = useCallback(async () => {
        const theme = await get('Theme');
        const isDefault = await get('IsDefault');
        isDefault ? themeOperations('default') : themeOperations(theme);
    }, []);

    useEffect(() => {
        getAppTheme();
    }, [getAppTheme]);

    const styles = styling(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>
                This is a demo of default dark/light theme with switch/Buttons using async storage.
            </Text>
            <TouchableOpacity style={styles.touchableStyle}>
                <Text style={styles.buttonTextStyle}>Button</Text>
            </TouchableOpacity>
            <RadioButtonRN
                data={data}
                selectedBtn={(e) => themeOperations(e?.value)}
                initial={initialValue}
                activeColor={colors.icon}
                deactiveColor={colors.gray}
                boxActiveBgColor={colors.background}
                boxDeactiveBgColor={colors.themeColor}
                textColor={colors.text}
            />
        </View>
    );
};

export default Account;

const styling = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme === 'light' ? light.colors.background : dark.colors.background,
            paddingHorizontal: 20,
        },
        textStyle: {
            color: theme === 'light' ? light.colors.text : dark.colors.text,
        },
        touchableStyle: {
            backgroundColor: theme === 'light' ? light.colors.sky : dark.colors.sky,
            padding: 10,
            borderRadius: 6,
            width: '100%',
            height: 57,
            justifyContent: 'center',
            marginTop: 20,
        },
        buttonTextStyle: {
            textAlign: 'center',
            color: theme === 'light' ? light.colors.white : dark.colors.white,
            fontSize: 20,
            fontWeight: '500',
        },
    });
