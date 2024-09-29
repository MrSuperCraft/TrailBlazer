import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bar, CartesianChart } from 'victory-native'; // Using Victory for the chart
import { LinearGradient, vec } from '@shopify/react-native-skia';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DetailedStatsViewProps {
    data: { date: Date; value: number }[];
    title: string;
    view: 'D' | 'W' | 'M' | '6M';
}

const DetailedStatsView: React.FC<DetailedStatsViewProps> = ({ data, title = 'No Data Type' }) => {
    const { colorScheme } = useColorScheme(); // Get the current color scheme
    const router = useRouter();

    // Get today's date to compare
    const today = new Date().toLocaleDateString();

    // Format data for display
    const formattedData = data.map((item) => ({
        date: item.date.toLocaleDateString(),
        value: item.value,
    }));

    return (
        <View className="flex-1 p-4">
            {/* Back button and Title */}
            <View className="flex-row justify-center items-center mb-4">
                <TouchableOpacity
                    onPress={() => router.push('/progress')}
                    className="absolute top-0 left-4 flex-row items-center"
                >
                    <Ionicons
                        color={colorScheme === 'dark' ? 'white' : 'black'}
                        name={'chevron-back'}
                        size={24}
                    />
                </TouchableOpacity>
                <Text className={`text-xl font-bold text-black dark:text-white`}>
                    {title}
                </Text>
            </View>

            {/* Bar Chart */}
            <CartesianChart
                data={formattedData}
                xKey="date"
                yKeys={['value']}
                domainPadding={{ left: 50, right: 50, top: 30, bottom: 400 }}
            >
                {({ points, chartBounds }) => (
                    <Bar
                        chartBounds={chartBounds}
                        points={points.value}
                        roundedCorners={{ topLeft: 5, topRight: 5 }}
                    >
                        {points.value.map((point, index) => {
                            const isToday = formattedData[index].date === today;

                            return (
                                <LinearGradient
                                    key={index}
                                    start={vec(0, 0)}
                                    end={vec(0, 300)}
                                    colors={isToday
                                        ? ['#FFC107', '#b84637'] // Brand colors for today's bar
                                        : colorScheme === 'dark'
                                            ? ['#99433d', '#807d7d'] // Default gradient for dark mode
                                            : ['#CA4646', '#8A3029']} // Default gradient for light mode
                                />
                            );
                        })}
                    </Bar>
                )}
            </CartesianChart>
        </View>
    );
};

export default DetailedStatsView;
