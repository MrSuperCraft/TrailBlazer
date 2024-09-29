import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, Href } from 'expo-router';
import { useColorScheme } from 'nativewind';


const BottomMenu = ({ activePage, setActivePage }) => {
    const { colorScheme } = useColorScheme();

    const menuItems = [
        { name: 'home', icon: 'home-outline', activeIcon: 'home', href: '/' },
        { name: 'progress', icon: 'bar-chart-outline', activeIcon: 'bar-chart', href: '/progress' },
        { name: 'goals', icon: 'flag-outline', activeIcon: 'flag', href: '/goals' },
        { name: 'workouts', icon: 'fitness-outline', activeIcon: 'fitness', href: '/workouts' },
        { name: 'profile', icon: 'person-outline', activeIcon: 'person', href: '/profile' },
    ];

    return (
        <View style={[styles.bottomMenu, colorScheme === 'dark' ? styles.darkMode : styles.lightMode]}>
            {menuItems.map((item, index) => (
                <Link href={item.href as Href} key={index} asChild>
                    <TouchableOpacity
                        onPress={() => setActivePage(item.name)}
                        className="mx-2"
                    >
                        <Ionicons
                            name={activePage === item.name ? (item.activeIcon as keyof typeof Ionicons.glyphMap) : (item.icon as keyof typeof Ionicons.glyphMap)}
                            size={28}
                            color={activePage === item.name ? '#CA6464' : '#666666'}
                        />
                    </TouchableOpacity>
                </Link>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomMenu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 0.1,
        zIndex: 1,
        borderTopColor: '#EEEEEE',
        borderTopWidth: 1,
    },
    lightMode: {
        backgroundColor: '#FDFDFD', // Light mode background
    },
    darkMode: {
        backgroundColor: '#333333', // Darker variant for dark mode
    },
});

export default BottomMenu;
