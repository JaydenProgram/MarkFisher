// ThemeContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { get, save } from '../scripts/themeStorage';
import { light, dark } from '../styles/colors/colorList';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(systemTheme);

    const loadAppTheme = useCallback(async () => {
        const savedTheme = await get('Theme');
        const isDefault = await get('IsDefault');
        if (isDefault) {
            setTheme(systemTheme);
        } else {
            setTheme(savedTheme || systemTheme);
        }
    }, [systemTheme]);

    useEffect(() => {
        const setInitialTheme = async () => {
            const IS_FIRST = await get('IS_FIRST');
            if (IS_FIRST === null) {
                await save('Theme', systemTheme);
                await save('IsDefault', true);
                await save('IS_FIRST', true);
            }
            await loadAppTheme();
        };
        setInitialTheme();
    }, [loadAppTheme, systemTheme]);

    const toggleTheme = async (newTheme, isDefault) => {
        await save('Theme', newTheme);
        await save('IsDefault', isDefault);
        setTheme(newTheme);
    };

    const themeData = {
        theme,
        toggleTheme,
        colors: theme === 'light' ? light.colors : dark.colors,
    };

    return (
        <ThemeContext.Provider value={themeData}>
            {children}
        </ThemeContext.Provider>
    );
};
