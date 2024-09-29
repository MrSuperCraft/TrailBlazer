import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HealthData {
    steps: number;
    activeEnergy: number;
    distance: number;
    speed: number;
    activeTime: number;
}

interface WeeklyData {
    [key: string]: { date: string; value: number }[];
}

interface HealthStore {
    dailyData: HealthData;
    weeklyData: WeeklyData;
    unitSystem: 'metric' | 'imperial';
    updateDailyData: (data: Partial<HealthData> | ((prevData: HealthData) => HealthData)) => void;
    addWeeklyData: (date: string, data: HealthData) => void;
    setUnitSystem: (system: 'metric' | 'imperial') => void;
    resetDailyData: () => void;
    serializeDailyToWeekly: () => void; // Add function to serialize daily data to weekly
}

const useHealthStore = create<HealthStore>()(
    persist(
        (set, get) => ({
            dailyData: {
                steps: 0,
                activeEnergy: 0,
                distance: 0,
                speed: 0,
                activeTime: 0,
            },
            weeklyData: {
                steps: [],
                activeEnergy: [],
                distance: [],
                speed: [],
                activeTime: [],
            },
            unitSystem: 'metric',

            // Update daily data without immediate serialization
            updateDailyData: (data) => {
                set((state) => {
                    const updatedData = typeof data === 'function' ? data(state.dailyData) : { ...state.dailyData, ...data };
                    return { dailyData: updatedData };
                });
            },

            // Serialize and update weekly data on a separate call
            serializeDailyToWeekly: () => {
                const { dailyData } = get();
                const currentDate = new Date().toISOString().split('T')[0]; // Get today's date as a string (YYYY-MM-DD)
                get().addWeeklyData(currentDate, dailyData); // Add daily data to weekly with the current date
            },

            addWeeklyData: (date, data) => {
                set((state) => {
                    const newWeeklyData = { ...state.weeklyData };
                    Object.keys(data).forEach((key) => {
                        if (!newWeeklyData[key]) {
                            newWeeklyData[key] = []; // Initialize if empty
                        }
                        const existingEntryIndex = newWeeklyData[key].findIndex((entry) => entry.date === date);
                        if (existingEntryIndex !== -1) {
                            newWeeklyData[key][existingEntryIndex].value = data[key as keyof HealthData];
                        } else {
                            newWeeklyData[key].push({ date, value: data[key as keyof HealthData] });
                        }
                        // Keep only the last 7 days of data
                        if (newWeeklyData[key].length > 7) {
                            newWeeklyData[key].shift();
                        }
                    });
                    return { weeklyData: newWeeklyData };
                });
            },

            setUnitSystem: (system) => set({ unitSystem: system }),
            resetDailyData: () => set({ dailyData: { steps: 0, activeEnergy: 0, distance: 0, speed: 0, activeTime: 0 } }),
        }),
        {
            name: 'health-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);


export default useHealthStore;
