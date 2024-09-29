import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import BottomMenu from '@/components/BottomMenu';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import PhysicalDataModal from '@/components/PhysicalDataModal';
import useHealthStore from '@/store/ActivityStore';

const ProfileOption = ({ label, value, onPress, icon }) => (
    <TouchableOpacity
        className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 flex-row justify-between items-center shadow-md"
        onPress={onPress}
    >
        <View className="flex-row items-center">
            <Ionicons name={icon} size={24} color="#CA6464" className="mr-3" />
            <Text className="text-lg font-semibold text-[#666666] dark:text-white">{label}</Text>
        </View>
        <View className="flex-row items-center">
            <Text className="text-[#999999] dark:text-gray-300 mr-2">{value}</Text>
            <Ionicons name="chevron-forward" size={24} color="#CA6464" />
        </View>
    </TouchableOpacity>
);

export default function Profile() {
    const [activePage, setActivePage] = useState('profile');
    const [name, setName] = useState('');
    const [units, setUnits] = useState('Metric');
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [theme, setTheme] = useState('Light');
    const [notifications, setNotifications] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [physicalData, setPhysicalData] = useState({ weight: '', height: '' });
    const [speedUnit, setSpeedUnit] = useState('km/h'); // New state for speed unit
    const { setUnitSystem } = useHealthStore();

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };


    React.useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const storedName = await AsyncStorage.getItem('userName');
            const storedUnits = await AsyncStorage.getItem('units');
            const storedSpeedUnit = await AsyncStorage.getItem('speedUnit'); // Load speed unit
            const storedTheme = await AsyncStorage.getItem('theme');
            const storedNotifications = await AsyncStorage.getItem('notifications');

            if (storedName) setName(storedName);
            if (storedUnits) setUnits(storedUnits);
            if (storedSpeedUnit) setSpeedUnit(storedSpeedUnit); // Set speed unit
            if (storedTheme) setTheme(storedTheme);
            if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    };

    const savePhysicalData = async (weight: string, height: string) => {
        try {
            await AsyncStorage.setItem('weight', weight);
            await AsyncStorage.setItem('height', height);
        } catch (error) {
            throw new Error('An error has occured in the software.')
        }
    }

    const toggleUnits = async () => {
        const newUnits = units === 'Metric' ? 'Imperial' : 'Metric'; // Determine the new units
        setUnits(newUnits); // Update state with the new units
        setUnitSystem(newUnits === 'Metric' ? 'metric' : 'imperial'); // Update health store with the correct value
        await AsyncStorage.setItem('units', newUnits); // Store the new units in AsyncStorage
    };

    const toggleSpeedUnit = async () => {
        if (units === 'Imperial') {
            // In imperial units, default to mph, no need to toggle between km/h and m/s
            setSpeedUnit('mph');
            await AsyncStorage.setItem('speedUnit', 'mph');
        } else {
            // Metric units: toggle between km/h and m/s
            const newSpeedUnit = speedUnit === 'km/h' ? 'm/s' : 'km/h';
            setSpeedUnit(newSpeedUnit); // Update state
            await AsyncStorage.setItem('speedUnit', newSpeedUnit); // Store the updated speed unit in AsyncStorage
        }
    };


    return (
        <SafeAreaView className={`flex-1 bg-white`}>
            {colorScheme == 'light' ? <LinearGradient
                colors={['#FFA7A7', '#FCFCFC', '#EEEEEE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                }}
            /> :
                <>
                    <LinearGradient
                        colors={['#262626', '#171717']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: -1,
                        }}
                    />
                </>}
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView className="flex-1 px-4 pt-8">
                <Text className="text-3xl font-bold mb-6 text-black dark:text-white">Profile Settings</Text>

                <View className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 shadow-md">
                    <Text className="text-lg font-semibold text-[#666666] dark:text-white mb-2">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="border border-gray-300 dark:border-gray-600 rounded-xl p-3 dark:text-white"
                        placeholder="Enter your name"
                        placeholderTextColor="#999999"
                    />
                </View>

                <ProfileOption
                    label="Units"
                    value={units}
                    onPress={toggleUnits}
                    icon="scale-outline"
                />
                <ProfileOption
                    label="Speed Unit"
                    value={speedUnit}
                    onPress={toggleSpeedUnit}
                    icon="speedometer-outline"
                />
                <ProfileOption
                    label="Theme"
                    value={colorScheme}
                    onPress={toggleColorScheme}
                    icon="color-palette-outline"
                />

                <View className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 flex-row justify-between items-center shadow-md">
                    <View className="flex-row items-center">
                        <Ionicons name="notifications-outline" size={24} color="#CA6464" className="mr-3" />
                        <Text className="text-lg font-semibold text-[#666666] dark:text-white">Notifications</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: "#767577", true: "#CA6464" }}
                        thumbColor={notifications ? "#f4f3f4" : "#f4f3f4"}
                    />
                </View>
                <View>
                    <TouchableOpacity onPress={openModal} className="bg-[#CA6464] p-4 my-4 rounded-xl">
                        <Text className="text-white text-center font-bold">Enter Physical Data</Text>
                    </TouchableOpacity>

                    <PhysicalDataModal
                        visible={isModalVisible}
                        onClose={closeModal}
                        onSave={savePhysicalData}
                    />

                    {physicalData.weight && physicalData.height && (
                        <View className="p-4 mt-6">
                            <Text>Weight: {physicalData.weight} kg</Text>
                            <Text>Height: {physicalData.height} cm</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <BottomMenu activePage={activePage} setActivePage={setActivePage} />
        </SafeAreaView>
    );
}