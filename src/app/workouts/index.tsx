import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import BottomMenu from '@/components/BottomMenu';
import CreateWorkoutModal from '@/components/CreateWorkoutModal';

interface Workout {
    id: string;
    title: string;
    description: string;
    duration: string;
    icon: string;
}

const WorkoutCard = ({ workout, onEdit, onDelete }: { workout: Workout; onEdit: (workout: Workout) => void; onDelete: (id: string) => void }) => (
    <TouchableOpacity className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 flex-row justify-between items-center shadow-sm">
        <View className="flex-1 pr-4">
            <View className="flex-row items-center mb-2">
                <Ionicons name={workout.icon as keyof typeof Ionicons.glyphMap} size={24} color="#CA6464" />
                <Text className="text-lg font-bold text-gray-800 dark:text-white ml-2">{workout.title}</Text>
            </View>
            <Text className="text-sm text-gray-600 dark:text-gray-300 mb-1">{workout.description}</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">{workout.duration} Minutes</Text>
        </View>
        <View className="flex-row space-x-4">
            <TouchableOpacity onPress={() => onEdit(workout)}>
                <Ionicons name="pencil" size={24} color="#CA6464" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(workout.id)}>
                <Ionicons name="trash-outline" size={24} color="#CA6464" />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
);

export default function Workouts() {
    const [activePage, setActivePage] = useState('workouts');
    const { colorScheme } = useColorScheme();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        try {
            const savedWorkouts = await AsyncStorage.getItem('workouts');
            if (savedWorkouts) {
                setWorkouts(JSON.parse(savedWorkouts));
            }
        } catch (error) {
            console.error('Error loading workouts:', error);
        }
    };

    const saveWorkouts = async (updatedWorkouts: Workout[]) => {
        try {
            await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
            setWorkouts(updatedWorkouts);
        } catch (error) {
            console.error('Error saving workouts:', error);
        }
    };

    const handleAddWorkout = (newWorkout: Omit<Workout, 'id'>) => {
        const updatedWorkouts = [...workouts, { ...newWorkout, id: Date.now().toString() }];
        saveWorkouts(updatedWorkouts);
    };

    const handleEditWorkout = (editedWorkout: Workout) => {
        const updatedWorkouts = workouts.map(w => (w.id === editedWorkout.id ? editedWorkout : w));
        saveWorkouts(updatedWorkouts);
        setEditingWorkout(null);
    };

    const handleDeleteWorkout = (id: string) => {
        Alert.alert(
            "Delete Workout",
            "Are you sure you want to delete this workout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedWorkouts = workouts.filter(w => w.id !== id);
                        saveWorkouts(updatedWorkouts);
                    }
                }
            ]
        );
    };

    const renderWorkoutCard = ({ item }: { item: Workout }) => (
        <WorkoutCard
            workout={item}
            onEdit={(workout) => {
                setEditingWorkout(workout);
                setModalVisible(true);
            }}
            onDelete={handleDeleteWorkout}
        />
    );

    const renderNoWorkoutsMessage = () => (
        <View className="flex items-center justify-center flex-1">
            <Ionicons name="fitness-outline" size={80} color={colorScheme === 'light' ? '#CA6464' : '#CCCCCC'} />
            <Text className="text-2xl font-bold text-neutral-700 dark:text-neutral-300 mt-4">No workouts found</Text>
            <Text className="text-base text-neutral-600 dark:text-neutral-400 mt-2 mb-4">Start creating your custom workouts!</Text>
            <TouchableOpacity
                className="bg-[#CA6464] p-4 rounded-lg items-center"
                onPress={() => {
                    setEditingWorkout(null);
                    setModalVisible(true);
                }}
            >
                <Text className="text-white font-bold text-lg">Add Custom Workout</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 dark:bg-neutral-900">
            <LinearGradient
                colors={colorScheme === 'light' ? ['#FFA7A7', '#FCFCFC', '#EEEEEE'] : ['#262626', '#171717']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0"
            />
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 pt-8 px-4">
                <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Workouts</Text>

                <View className="flex-1">
                    {workouts.length === 0 ? (
                        renderNoWorkoutsMessage()
                    ) : (
                        <FlatList
                            data={workouts}
                            renderItem={renderWorkoutCard}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 80 }} // Ensure there's some padding
                        />
                    )}
                </View>
                {/* Move the button inside the main view */}
                <TouchableOpacity
                    className="bg-[#CA6464] p-4 rounded-lg items-center mb-4"
                    style={{ marginBottom: 80 }}
                    onPress={() => {
                        setEditingWorkout(null);
                        setModalVisible(true);
                    }}
                >
                    <Text className="text-white font-bold text-lg">Add Custom Workout</Text>
                </TouchableOpacity>
            </View>

            <CreateWorkoutModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingWorkout(null);
                }}
                onSave={(workout) => {
                    if (editingWorkout) {
                        handleEditWorkout({ ...editingWorkout, ...workout });
                    } else {
                        handleAddWorkout(workout);
                    }
                    setModalVisible(false);
                }}
                workout={editingWorkout}
            />
            <BottomMenu activePage={activePage} setActivePage={setActivePage} />
        </SafeAreaView>
    );
}
