// utils/calculations.ts
export const calculateActiveEnergy = (steps: number, weight: number): number => {
    // Assuming an average of 0.04 calories burned per step per kg of body weight
    return Number((steps * 0.04 * weight / 1000).toFixed(2));
};

export const calculateDistance = (steps: number, unitSystem: 'metric' | 'imperial'): string => {
    // Assuming an average stride length of 0.762 meters (30 inches)
    const distanceInKm = (steps * 0.762) / 1000;
    return unitSystem === 'imperial'
        ? `${(distanceInKm * 0.621371).toFixed(2)} mi`
        : `${distanceInKm.toFixed(2)} km`;
};

export const calculateSpeed = (distance: number, activeTime: number, unitSystem: 'metric' | 'imperial'): string => {
    const speed = distance / (activeTime); // km/h or mi/h
    return unitSystem === 'imperial'
        ? `${speed.toFixed(2)} mph`
        : `${speed.toFixed(2)} km/h`;
};