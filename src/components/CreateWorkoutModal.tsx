'use client'

import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import RNPickerSelect from 'react-native-picker-select'
import { useColorScheme } from 'nativewind'

interface Workout {
    id?: string
    title: string
    description: string
    duration: string
    icon: string
}

interface CreateWorkoutModalProps {
    visible: boolean
    onClose: () => void
    onSave: (workout: Workout) => void
    workout?: Workout | null
}

const iconOptions = [
    { label: 'Fitness Center', value: 'fitness' },
    { label: 'Running', value: 'speedometer' },
    { label: 'Yoga', value: 'rose' },
    { label: 'Cycling', value: 'bicycle' },
    { label: 'Swimming', value: 'pool' },
    { label: 'Weightlifting', value: 'fitness' },
]

export default function CreateWorkoutModal({ visible, onClose, onSave, workout }: CreateWorkoutModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [duration, setDuration] = useState('')
    const [icon, setIcon] = useState('fitness-center')
    const { colorScheme } = useColorScheme()

    useEffect(() => {
        if (workout) {
            setTitle(workout.title)
            setDescription(workout.description)
            setDuration(workout.duration)
            setIcon(workout.icon)
        } else {
            resetForm()
        }
    }, [workout])

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setDuration('')
        setIcon('fitness-center')
    }

    const handleSave = () => {
        const newWorkout: Workout = {
            id: workout?.id,
            title,
            description,
            duration,
            icon,
        }
        onSave(newWorkout)
        resetForm()
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-center items-center bg-black/50"
            >
                <View className="bg-white dark:bg-gray-800 rounded-xl w-11/12 max-h-[80%] p-6 shadow-lg">
                    <ScrollView>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-dark dark:text-white">
                                {workout ? 'Edit Workout' : 'Create Workout'}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#CA6464'} />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Workout Title</Text>
                            <TextInput
                                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3"
                                placeholder="E.g., Morning Run"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</Text>
                            <TextInput
                                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3 h-24"
                                placeholder="Describe your workout"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Duration</Text>
                            <TextInput
                                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3"
                                placeholder="E.g., 30 mins"
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Workout Type</Text>
                            <View className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <RNPickerSelect
                                    onValueChange={(value) => setIcon(value)}
                                    items={iconOptions}
                                    value={icon}
                                    useNativeAndroidPickerStyle={false}
                                    style={{
                                        inputIOS: {
                                            fontSize: 16,
                                            paddingVertical: 12,
                                            paddingHorizontal: 10,
                                            color: colorScheme === 'dark' ? '#fff' : '#000',
                                        },
                                        inputAndroid: {
                                            fontSize: 16,
                                            paddingHorizontal: 10,
                                            paddingVertical: 8,
                                            color: colorScheme === 'dark' ? '#fff' : '#000',
                                        },
                                    }}
                                    Icon={() => <Ionicons name="chevron-down" size={24} color={colorScheme === 'dark' ? '#fff' : '#CA6464'} className="mr-2 py-2 mt-1" />}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-primary dark:bg-primary-foreground p-4 rounded-lg items-center mt-4"
                            onPress={handleSave}
                        >
                            <Text className="text-white dark:text-primary font-bold text-lg">Save Workout</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}