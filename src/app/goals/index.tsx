import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomMenu from '@/components/BottomMenu';
import CreateGoalModal from '@/components/CreateGoalModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import useHealthStore from '@/store/ActivityStore'; // Import useHealthStore

const GoalItem = ({ icon, title, progress, onEdit, onDelete }) => (
    <View className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 flex-row justify-between items-center" style={styles.goalItem}>
        <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#FF8181]/50 dark:bg-[#FF8181]/30 items-center justify-center mr-3">
                <Ionicons name={icon} size={24} color="#CA6464" />
            </View>
            <View>
                <Text className="text-[#666666] dark:text-neutral-300 text-lg font-semibold">{title}</Text>
                <Text className="text-[#CA6464] text-xl font-bold">
                    {progress}% <Text className="text-lg font-normal">completed</Text>
                </Text>
            </View>
        </View>
        <View className="flex-row">
            <TouchableOpacity onPress={onEdit} className="mr-4">
                <Ionicons name="chevron-forward" size={24} color="#CA6464" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash" size={24} color="#CA6464" />
            </TouchableOpacity>
        </View>
    </View>
);

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState(null);
    const [activePage, setActivePage] = useState("goals");
    const { colorScheme } = useColorScheme();
    const { dailyData } = useHealthStore(); // Get dailyData from the health store

    const loadGoals = async () => {
        try {
            const savedGoals = await AsyncStorage.getItem('goals');
            if (savedGoals) {
                const parsedGoals = JSON.parse(savedGoals);
                // Calculate progress for each goal
                const updatedGoals = parsedGoals.map(goal => {
                    const currentProgress = calculateProgress(goal, dailyData);
                    return { ...goal, progress: currentProgress };
                });
                setGoals(updatedGoals);
            }
        } catch (error) {
            console.error('Failed to load goals', error);
        }
    };

    const calculateProgress = (goal, dailyData) => {
        const goalValue = goal.target; // Adjust according to your goal structure
        let achievedValue = 0;

        // Determine achieved value based on goal type
        switch (goal.metric) {
            case 'activeEnergy':
                achievedValue = dailyData.activeEnergy || 0; // Default to 0 if undefined
                break;
            case 'activeTime':
                achievedValue = dailyData.activeTime || 0; // Default to 0 if undefined
                break;
            case 'totalDistance':
                achievedValue = dailyData.distance || 0; // Default to 0 if undefined
                break;
            case 'speed':
                achievedValue = dailyData.speed || 0; // Default to 0 if undefined
                break;
            case 'steps':
                achievedValue = dailyData.steps || 0; // Default to 0 if undefined
                break;
            default:
                achievedValue = 0; // In case of an unknown goal type
        }

        // Prevent division by zero
        if (goalValue > 0) {
            const progress = (achievedValue / goalValue) * 100; // Calculate progress percentage
            return Math.min(progress, 100); // Ensure progress does not exceed 100%
        }

        return 0; // Return 0 if the goal value is 0 to prevent NaN
    };


    const handleSaveGoal = async (newGoal) => {
        const updatedGoals = goalToEdit
            ? goals.map(g => (g.id === goalToEdit.id ? newGoal : g))
            : [...goals, newGoal];

        setGoals(updatedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals)); // Save after updating
    };

    const handleDeleteGoal = async (goalId) => {
        const updatedGoals = goals.filter(goal => goal.id !== goalId);
        setGoals(updatedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals)); // Save after deleting
    };

    useEffect(() => {
        loadGoals();
    }, [dailyData]); // Reload goals whenever dailyData changes

    return (
        <SafeAreaView className="flex-1">
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
            <ScrollView className="flex-1 px-4 pt-8">
                <Text className="text-3xl font-bold mb-6 dark:text-white">Your Goals</Text>

                {goals.length === 0 ? (
                    <View className="flex-1 items-center justify-center mt-20">
                        <Ionicons name="medal-outline" size={64} color="#CA6464" />
                        <Text className="text-xl font-semibold dark:text-white mt-4">No Goals Set</Text>
                        <Text className="text-neutral-600 dark:text-neutral-400 text-center mt-2 px-10">
                            Set some goals to track your progress and stay motivated!
                        </Text>
                    </View>
                ) : (
                    goals.map(goal => (
                        <GoalItem
                            key={goal.id}
                            icon={goal.icon}
                            title={goal.title}
                            progress={goal.progress}
                            onEdit={() => setGoalToEdit(goal)} // Open modal for editing
                            onDelete={() => handleDeleteGoal(goal.id)} // Delete goal
                        />
                    ))
                )}

                <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-[#FF8181] dark:bg-[#CA6464] rounded-full p-4 mt-4 flex-row items-center justify-center">
                    <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" className="mr-2" />
                    <Text className="text-white text-lg font-semibold">Add New Goal</Text>
                </TouchableOpacity>
            </ScrollView>

            <CreateGoalModal
                visible={isModalVisible}
                onClose={() => { setModalVisible(false); setGoalToEdit(null); }}
                onSave={handleSaveGoal}
                goalToEdit={goalToEdit}
            />

            <BottomMenu activePage={activePage} setActivePage={setActivePage} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    goalItem: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default Goals;
