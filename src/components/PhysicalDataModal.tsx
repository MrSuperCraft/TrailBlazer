import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, SafeAreaView } from 'react-native';

const PhysicalDataModal = ({ visible, onClose, onSave }) => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    const handleSave = () => {
        // You can validate the input before saving if needed
        if (weight && height) {
            onSave(weight, height); // Pass data back to parent component
            onClose(); // Close the modal after saving
        } else {
            alert('Please enter both weight and height');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 justify-center items-center bg-black/80">
                <View className="bg-white rounded-lg p-6 w-11/12 dark:bg-neutral-800">
                    <Text className="text-xl font-semibold mb-4 text-black dark:text-white">
                        Enter Physical Data
                    </Text>

                    <Text className="text-lg font-semibold text-black dark:text-white">Weight (kg)</Text>
                    <TextInput
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="Enter your weight"
                        keyboardType="numeric"
                        className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mt-2 mb-4 dark:text-white"
                    />

                    <Text className="text-lg font-semibold text-black dark:text-white">Height (cm)</Text>
                    <TextInput
                        value={height}
                        onChangeText={setHeight}
                        placeholder="Enter your height"
                        keyboardType="numeric"
                        className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mt-2 mb-4 dark:text-white"
                    />

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity
                            className="bg-[#CA6464] rounded-lg p-3 flex-1 mr-2"
                            onPress={handleSave}
                        >
                            <Text className="text-white text-center">Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-gray-300 dark:bg-neutral-700 rounded-lg p-3 flex-1"
                            onPress={onClose}
                        >
                            <Text className="text-center text-black dark:text-white">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};



export default PhysicalDataModal;