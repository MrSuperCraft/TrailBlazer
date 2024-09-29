import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import useHealthStore from '@/store/ActivityStore';
import { calculateActiveEnergy, calculateDistance, calculateSpeed } from '@/lib/utils/calculations';
import { HealthData } from '@/store/ActivityStore';
import AsyncStorage from '@react-native-async-storage/async-storage'


const MAX_STEPS_THRESHOLD = 5; // Prevent excessive step increments

export default function usePedometer() {
    const updateDailyData = useHealthStore((state) => state.updateDailyData);
    const unitSystem = useHealthStore((state) => state.unitSystem);
    const totalSteps = useRef(0);
    const totalActiveTime = useRef(0);
    const isMoving = useRef(false);
    const movingStartTime = useRef<number | null>(null);

    // Refs to track last values
    const lastValue = useRef<number | null>(null);
    const secondLastValue = useRef<number | null>(null);

    useEffect(() => {
        let subscription: Pedometer.Subscription | null = null;

        const initializePedometer = async () => {
            const isAvailable = await Pedometer.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Error', 'Pedometer is not available on this device.');
                return;
            }

            // Get initial step count from midnight
            const { steps: initialSteps } = await Pedometer.getStepCountAsync(new Date(0), new Date());
            totalSteps.current = initialSteps; // Set initial total steps

            // Set lastValue and secondLastValue
            lastValue.current = initialSteps;
            secondLastValue.current = null;

            // Subscribe to step count updates
            subscription = Pedometer.watchStepCount(async (result) => {
                // This will hold the new step count
                let newStepCount: number;

                if (lastValue.current === null) {
                    // Case 1: No lastValue, set new steps to the current result
                    newStepCount = result.steps;
                } else {
                    // Case 2: Set new steps to the difference from lastValue
                    newStepCount = Math.max(0, result.steps - lastValue.current);
                }

                // Update previous values before mutating
                secondLastValue.current = lastValue.current;
                lastValue.current = result.steps;

                // Used for debugging
                // console.log(newStepCount, secondLastValue.current, lastValue.current)

                // Ensure step difference is within limits
                if (newStepCount > 0) {
                    // Mutate result.steps directly to add only the difference

                    newStepCount > MAX_STEPS_THRESHOLD ? result.steps = MAX_STEPS_THRESHOLD : result.steps = newStepCount; // Update total steps directly

                    totalSteps.current = result.steps; // Update the total steps reference

                    // Update active time and check movement
                    if (!isMoving.current) {
                        movingStartTime.current = Date.now();
                        isMoving.current = true;
                    } else {
                        totalActiveTime.current += (Date.now() - movingStartTime.current) / 1000; // Convert to hours
                        movingStartTime.current = Date.now();
                    }

                    // Calculate and update health data
                    const weightString = await AsyncStorage.getItem('weight')
                    const weight = parseInt(weightString);
                    const startDate = new Date();
                    startDate.setHours(0, 0, 0, 0); // Set to midnight

                    const { steps: newSteps } = await Pedometer.getStepCountAsync(startDate, new Date());

                    const updatedData: HealthData = {
                        steps: newSteps + newStepCount,
                        activeEnergy: calculateActiveEnergy(newSteps, weight),
                        distance: parseFloat(calculateDistance(newSteps, unitSystem)),
                        speed: totalActiveTime.current > 0 ? parseFloat(calculateSpeed(newSteps, totalActiveTime.current, unitSystem)) : 0,
                        activeTime: totalActiveTime.current,
                    };

                    updateDailyData(updatedData);
                } else if (isMoving.current) {
                    totalActiveTime.current += (Date.now() - movingStartTime.current) / 1000; // Update total active time
                    movingStartTime.current = null;
                    isMoving.current = false;
                }
            });
        };

        initializePedometer();

        return () => {
            subscription?.remove();
        };
    }, [updateDailyData, unitSystem]);

    return { isMoving: isMoving.current };
}
