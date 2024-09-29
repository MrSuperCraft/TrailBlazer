import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface StatCardProps {
    icon: string;
    title: string;
    value: string;
    unit?: string;
    weekData: { date: string; value: number }[]; // Adjusting to use 'string' for date
    metric: string
}

export default function StatCard({ icon, title, value, unit, weekData, metric }: StatCardProps) {
    const maxHeight = 30; // Maximum height of the pillars

    // Calculate the maximum value for scaling the pillars
    const maxValue = Math.max(...weekData.map(dataPoint => dataPoint.value));

    return (
        <TouchableOpacity
            onPress={() => router.push(`/detailed-stats?type=${metric}`)}
            style={styles.statCard}
            className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 flex-row justify-between items-center"
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#FF8181]/50 dark:bg-[#FF8181]/30 items-center justify-center mr-3">
                    <Ionicons name={(icon as keyof typeof Ionicons.glyphMap)} size={24} color="#CA6464" />
                </View>
                <View>
                    <Text className="text-[#666666] dark:text-neutral-300 text-lg font-semibold">{title}</Text>
                    <Text className="text-[#CA6464] text-2xl font-bold">
                        {value} <Text className="text-lg font-normal">{unit}</Text>
                    </Text>
                </View>
            </View>
            <View className="flex-row items-end">
                <View style={styles.graphContainer}>
                    {weekData.map((dataPoint, index) => (
                        <View
                            key={index}
                            style={[
                                styles.pillar,
                                {
                                    height: maxValue ? (dataPoint.value / maxValue) * maxHeight : 0, // Handle division by zero
                                    backgroundColor: index === weekData.length - 1 ? '#CA6464' : '#E8E8E8',
                                }
                            ]}
                        />
                    ))}
                </View>
                <Ionicons name="chevron-forward" size={24} color="#CA6464" className="ml-2" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    statCard: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    graphContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 30,
        width: 60,
    },
    pillar: {
        width: 6,
        marginHorizontal: 1,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
});

