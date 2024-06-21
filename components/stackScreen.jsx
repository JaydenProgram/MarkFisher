import React from "react";

import Home from "../app/index";
import MarkerList from "../app/markerList";
import Account from "../app/account";
import AccountIcon from "./accountIcons";
import LogoTitle from "./logoTitle";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {TouchableOpacity} from "react-native";
import { useNavigation, useTheme } from '@react-navigation/native'; // Import useNavigation hook
import { StyleSheet } from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import * as LocalAuthentication from 'expo-local-authentication';
import {dark, light} from "../styles/colors/colorList";


const MainTabs = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                        size = 24;
                    } else if (route.name === 'Mijn markers') {
                        iconName = 'map-marker';
                        size = 24;
                    }

                    return <FontAwesome name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarStyle: { backgroundColor: colors.background, borderTopWidth: 0 },
                tabBarActiveTintColor: colors.icon,
                tabBarInactiveTintColor: colors.gray,
                tabBarLabel: () => null,
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Mijn markers" component={MarkerList} />
        </Tab.Navigator>
    );
};


const StackScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const handleAccountPress = async () => {
        try {
            const { success } = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to access your account',
            });
            if (success) {
                navigation.navigate("Account");
            } else {
                console.log('Authentication failed');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    return (
        <Stack.Navigator
            screenOptions={() => ({
                headerTitle: (props) => <LogoTitle {...props} />,
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerRight: () => (
                    <TouchableOpacity onPress={handleAccountPress}>
                        <AccountIcon />
                    </TouchableOpacity>
                ),
            })}
        >
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Account" component={Account} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#2eb887', // Background color of the tab bar
        borderTopWidth: 0, // Remove top border
    },
});
export default StackScreen;
