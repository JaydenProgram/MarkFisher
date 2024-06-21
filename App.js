// App.js
import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import StackScreen from './components/stackScreen';
import { ThemeProvider, ThemeContext } from './components/themeContext';

const App = () => {
    return (
        <ThemeProvider>
            <ThemeContext.Consumer>
                {({ theme, colors }) => (
                    <NavigationContainer theme={theme === 'light' ? { ...DefaultTheme, colors } : { ...DarkTheme, colors }}>
                        <StackScreen />
                    </NavigationContainer>
                )}
            </ThemeContext.Consumer>
        </ThemeProvider>
    );
};

export default App;
