import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the goal interface
export interface Goal {
    id: number;
    title: string;
    metric: string;
    target: number;
}

// Goal Manager with CRUD operations
const GoalManager = {
    // Fetch all saved goals
    async getGoals(): Promise<Goal[]> {
        try {
            const savedGoals = await AsyncStorage.getItem('goals');
            return savedGoals ? JSON.parse(savedGoals) : [];
        } catch (error) {
            console.error('Error fetching goals:', error);
            return [];
        }
    },

    // Save new goal or update existing one
    async saveGoal(goal: Goal, existingGoals: Goal[]): Promise<void> {
        try {
            // Check if a goal with the same metric already exists
            const existingGoal = existingGoals.find(g => g.metric === goal.metric);
            if (existingGoal) {
                console.warn(`A goal with the metric "${goal.metric}" already exists. Ignoring creation.`);
                return; // Ignore the creation if the goal already exists
            }

            const updatedGoals = goal.id
                ? existingGoals.map(g => (g.id === goal.id ? goal : g)) // Update if exists
                : [...existingGoals, { ...goal, id: Date.now() }]; // Add new goal with a unique id

            await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    },

    // Delete a specific goal
    async deleteGoal(goalId: number): Promise<void> {
        try {
            const savedGoals = await this.getGoals();
            const filteredGoals = savedGoals.filter(g => g.id !== goalId);
            await AsyncStorage.setItem('goals', JSON.stringify(filteredGoals));
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    },

    // Clear all goals from AsyncStorage
    async clearAllGoals(): Promise<void> {
        try {
            await AsyncStorage.removeItem('goals');
        } catch (error) {
            console.error('Error clearing all goals:', error);
        }
    },
};

export default GoalManager;
