'use client'

import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
import GoalManager, { Goal } from '@/lib/utils/GoalManager'
import { useColorScheme } from 'nativewind';

const metricOptions = [
    { label: 'Steps', value: 'steps', icon: 'footsteps', unit: 'steps' },
    { label: 'Active Time', value: 'activeTime', icon: 'time', unit: 'minutes' },
    { label: 'Active Energy', value: 'activeEnergy', icon: 'flame', unit: 'kcal' },
    { label: 'Total Distance', value: 'totalDistance', icon: 'map', unit: 'km' },
]

export default function CreateGoalModal({ visible, onClose, onSave, goalToEdit }) {
    const [title, setTitle] = useState('')
    const [metric, setMetric] = useState('steps')
    const [target, setTarget] = useState('')
    const [error, setError] = useState('')
    const { colorScheme } = useColorScheme();

    useEffect(() => {
        if (goalToEdit) {
            setTitle(goalToEdit.title)
            setMetric(goalToEdit.metric)
            setTarget(goalToEdit.target?.toString() || '')
        } else {
            resetFields()
        }
    }, [goalToEdit])

    const resetFields = () => {
        setTitle('')
        setMetric('steps')
        setTarget('')
        setError('')
    }

    const validateInputs = () => {
        if (!title) {
            setError('Please enter a goal title.')
            return false
        }
        if (!target || isNaN(parseFloat(target)) || parseFloat(target) <= 0) {
            setError('Please enter a valid target value.')
            return false
        }
        setError('')
        return true
    }

    const saveGoal = async () => {
        if (!validateInputs()) return

        const parsedTarget = parseFloat(target)
        const newGoal: Goal = {
            id: goalToEdit?.id || Date.now(),
            title,
            metric,
            target: parsedTarget,
        }

        const existingGoals = await GoalManager.getGoals()
        await GoalManager.saveGoal(newGoal, existingGoals)

        onSave(newGoal)
        onClose()
        resetFields()
    }

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-gray-800 p-6 rounded-t-3xl">
                    <ScrollView>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-800 dark:text-white">Set a Goal</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="#CA6464" />
                            </TouchableOpacity>
                        </View>

                        {error ? (
                            <Text className="text-red-500 mb-4">{error}</Text>
                        ) : null}

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Goal Title</Text>
                            <TextInput
                                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3"
                                placeholder="Enter goal title"
                                placeholderTextColor="gray"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Metric</Text>
                            <View className="bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <Picker
                                    selectedValue={metric}
                                    onValueChange={(itemValue) => setMetric(itemValue)}
                                >
                                    {metricOptions.map((option) => (
                                        <Picker.Item key={option.value} label={option.label} value={option.value} color={colorScheme === 'dark' ? "white" : 'black'} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Target Value</Text>
                            <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                <TextInput
                                    className="flex-1 text-gray-800 dark:text-white"
                                    placeholder={`Enter target ${metricOptions.find(o => o.value === metric)?.unit}`}
                                    keyboardType="numeric"
                                    placeholderTextColor="gray"
                                    value={target}
                                    onChangeText={setTarget}
                                />
                                <Ionicons
                                    name={(metricOptions.find(o => o.value === metric)?.icon as keyof typeof Ionicons.glyphMap)}
                                    size={24}
                                    color="#CA6464"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={saveGoal}
                            className="bg-[#CA6464] p-4 rounded-lg items-center"
                        >
                            <Text className="text-white font-bold text-lg">Save Goal</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}
