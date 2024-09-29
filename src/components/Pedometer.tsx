import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Pedometer } from 'expo-sensors';

const CircularProgress = ({ size, strokeWidth, progress }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Svg width={size} height={size} className="z-20">
            <Defs>
                <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="40%" y2="0%">
                    <Stop offset="0%" stopColor="#7C1E1E" />
                    <Stop offset="100%" stopColor="#CA6464" />
                </LinearGradient>
            </Defs>

            <Circle
                stroke="#FFF1F1"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth / 1.5}
            />

            <Circle
                stroke="url(#progressGradient)"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
        </Svg>
    );
};

const PedometerComponent = ({ stepCount, goal = 10000 }) => {
    const progress = Math.min((stepCount / goal) * 100, 100);

    return (
        <View className="flex items-center justify-center my-12">
            <View className="absolute z-20">
                <CircularProgress size={144} strokeWidth={8} progress={progress} />
            </View>

            <View
                className="rounded-full border-1 border-white bg-transparent"
                style={{ width: 136, height: 136 }}
            />

            <View className="absolute items-center justify-center" style={{ width: 136, height: 136 }}>
                <Image
                    source={require('@/assets/Running-Shoes-Icon.png')}
                    className="mb-1"
                    style={{ width: 35, height: 35 }}
                />
                <Text className="text-[#CA6464] text-xl font-bold">{stepCount}</Text>
                <Text className="text-[#7A4040] dark:text-[#CA6464] text-sm">steps</Text>
            </View>
        </View>
    );
};

const StepCounter = () => {
    const [stepCount, setStepCount] = useState(0);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const startPedometer = async () => {
            try {
                const endDate = new Date();
                const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

                const { steps } = await Pedometer.getStepCountAsync(startDate, endDate);
                setStepCount(steps);

                const subscription = Pedometer.watchStepCount(({ steps }) => {
                    setStepCount((prevSteps) => prevSteps + steps);
                });

                setSubscription(subscription);
            } catch (error) {
                Alert.alert('Error', 'Could not access the pedometer.');
            }
        };

        startPedometer();

        return () => {
            if (subscription) {
                subscription.remove();
                setSubscription(null);
            }
        };
    }, []);

    return (
        <View>
            <PedometerComponent stepCount={stepCount} goal={10000} />
        </View>
    );
};

export default StepCounter;
