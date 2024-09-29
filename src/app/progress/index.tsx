import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import StatCard from '@/components/StatCard';
import BottomMenu from '@/components/BottomMenu';
import useHealthStore from '@/store/ActivityStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressScreen() {
    const { colorScheme } = useColorScheme();
    const [activePage, setActivePage] = useState('progress');
    const { dailyData, weeklyData } = useHealthStore(); // Using Zustand for state management
    const unitSystem = useHealthStore(state => state.unitSystem);
    const [speedUnit, setSpeedUnit] = useState('km/h'); // Default to 'km/h'

    useEffect(() => {
        // Fetch speedUnit asynchronously
        const fetchSpeedUnit = async () => {
            const storedSpeedUnit = await AsyncStorage.getItem('speedUnit');
            if (storedSpeedUnit) {
                setSpeedUnit(storedSpeedUnit);
            }
        };

        fetchSpeedUnit();
    }, []);

    // Conversion function for distance
    const convertDistance = (value) => {
        if (typeof value !== 'number') return 0; // Return 0 or another default value if the input is not a number
        return unitSystem === 'imperial' ? value * 0.621371 : value; // km to miles
    };

    // Conversion function for speed
    const convertSpeed = (value) => {
        if (typeof value !== 'number') return 0; // Return a default value if the input is not a number

        if (unitSystem === 'imperial') {
            return value * 0.621371; // km/h to mph for imperial system
        }

        // Handle metric units (toggle between km/h and m/s)
        if (speedUnit === 'm/s') {
            return value / 3.6; // Convert km/h to m/s
        }

        return value; // Default to km/h
    };

    return (
        <SafeAreaView className="flex-1 dark:bg-neutral-900">
            <LinearGradient
                colors={colorScheme === 'light' ? ['#FFA7A7', '#FCFCFC', '#EEEEEE'] : ['#262626', '#171717']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <ScrollView className="flex-1 px-4 pt-8">
                <Text className="text-3xl font-bold mb-6 text-center dark:text-white">Your Progress</Text>
                <View className="space-y-4">
                    <StatCard
                        icon="footsteps"
                        title="Steps"
                        value={Math.round(dailyData.steps).toString()} // Display current step count
                        unit="steps"
                        weekData={weeklyData.steps}
                        metric="steps"
                    />
                    <StatCard
                        icon="flame"
                        title="Active Energy"
                        value={Math.round(dailyData.activeEnergy).toString()}
                        unit="kcal"
                        weekData={weeklyData.activeEnergy}
                        metric="activeEnergy"
                    />
                    <StatCard
                        icon="map"
                        title="Total Distance"
                        value={convertDistance(dailyData.distance).toFixed(2)}
                        unit={unitSystem === 'metric' ? 'km' : 'mi'}
                        weekData={
                            Array.isArray(weeklyData.distance)
                                ? weeklyData.distance.map(({ date, value }) => {
                                    const convertedDistance = convertDistance(value);
                                    return {
                                        date: date,
                                        value: typeof convertedDistance === 'number' ? parseFloat(convertedDistance.toFixed(2)) : 0 // Default to 0 if not a number
                                    };
                                })
                                : [{ date: '', value: 0 }] // Fallback if not an array
                        }
                        metric="distance"
                    />
                    <StatCard
                        icon="speedometer"
                        title="Average Speed"
                        value={convertSpeed(dailyData.speed).toFixed(2)}
                        unit={unitSystem === 'metric' ? (speedUnit === 'm/s' ? 'm/s' : 'km/h') : 'mph'} // Display unit based on speedUnit and unitSystem
                        weekData={
                            Array.isArray(weeklyData.speed)
                                ? weeklyData.speed.map((speed) => {
                                    const convertedSpeed = convertSpeed(speed);
                                    return {
                                        date: '', // You may want to adjust this to provide actual dates if available
                                        value: typeof convertedSpeed === 'number' ? parseFloat(convertedSpeed.toFixed(2)) : 0 // Default to 0 if not a number
                                    };
                                })
                                : [{ date: '', value: 0 }] // Fallback if not an array
                        }
                        metric="speed"
                    />
                </View>
            </ScrollView>
            <BottomMenu activePage={activePage} setActivePage={setActivePage} />
        </SafeAreaView>
    );
}
