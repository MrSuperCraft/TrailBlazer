import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import DetailedStatsView from '@/components/DetailedStatsView';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useHealthStore from '@/store/ActivityStore';

export default function DetailedStats() {
    const { type } = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const [data, setData] = useState<{ date: Date; value: number }[]>([]); // State to hold fetched data
    const [isLoading, setIsLoading] = useState(true); // State for loading status
    const [error, setError] = useState(''); // State for error messages

    // Ensure type is a string
    const parsedType = Array.isArray(type) ? type[0] : type;
    const weeklyData = useHealthStore(state => state.weeklyData); // Get weekly data from Zustand store


    const getTitle = () => {
        switch (parsedType) {
            case 'steps':
                return 'Steps';
            case 'activeEnergy':
                return 'Active Energy';
            case 'distance':
                return 'Total Distance';
            case 'speed':
                return 'Average Walking Speed';
            default:
                return '';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let storedData = null;

            // Fetch weekly data based on the type
            switch (parsedType) {
                case 'steps':
                    storedData = weeklyData.steps;
                    break;
                case 'activeEnergy':
                    storedData = weeklyData.activeEnergy;
                    break;
                case 'distance':
                    storedData = weeklyData.distance;
                    break;
                case 'speed':
                    storedData = weeklyData.speed;
                    break;
                default:
                    setIsLoading(false);
                    return;
            }

            if (storedData) {
                const formattedData = storedData.map((item: { date: string; value: number }) => ({
                    date: new Date(item.date),
                    value: item.value,
                }));
                setData(formattedData);
            } else {
                setError('No data available for this metric.');
            }
            setIsLoading(false);
        };

        fetchData();
    }, [parsedType, weeklyData]); // Depend on weeklyData as well

    return (
        <SafeAreaView style={styles.container}>
            {colorScheme === 'light' ? (
                <LinearGradient
                    colors={['#FFA7A7', '#FCFCFC', '#EEEEEE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradient}
                />
            ) : (
                <LinearGradient
                    colors={['#262626', '#171717']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradient}
                />
            )}
            <Stack.Screen options={{ headerShown: false }} />
            {isLoading ? (
                <Text className="text-center text-white">Loading...</Text>
            ) : (
                <>
                    <DetailedStatsView title={getTitle()} data={data} view="W" />
                    {error ? <View><Text className="text-center text-red-500">{error}</Text></View> : ''}
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
});
