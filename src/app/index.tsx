import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import StepCounter from '@/components/Pedometer';
import BottomMenu from '@/components/BottomMenu';
import { RefreshControl } from 'react-native';
import { useColorScheme } from 'nativewind';
import useHealthStore from '@/store/ActivityStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';



const ActivityBox = ({ icon, title, value, subtitle }) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="bg-white dark:bg-neutral-800 rounded-xl p-4 flex-1 mr-2 mb-2" style={styles.ActivityBox}>
      <View className='flex flex-1 flex-row items-center gap-2'>
        <View className="w-8 h-8 rounded-full bg-[#FF8181]/50 dark:bg-neutral-500/50 items-center justify-center mb-2">
          <Ionicons name={icon} size={20} color={colorScheme === 'light' ? "#CA6464" : "white"} />
        </View>
        <Text className="text-[#666666] dark:text-[#BDBDBD] text-xl mb-1">{title}</Text>
      </View>
      <Text className="text-[#CA6464] text-lg font-bold mb-1">{value}</Text>
      <Text className="text-[#BDBDBD] text-xs">{subtitle}</Text>
    </View>
  );
};

export default function Home() {
  const [activePage, setActivePage] = useState('home');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useColorScheme();
  const { dailyData, resetDailyData } = useHealthStore();
  const [speedUnit, setSpeedUnit] = useState('km/h'); // Default to 'km/h'
  const units = useHealthStore().unitSystem;

  const [userName, setUserName] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [greetingIcon, setGreetingIcon] = useState('');


  useEffect(() => {
    // Fetch speedUnit asynchronously
    const fetchSpeedUnit = async () => {
      const storedSpeedUnit = await AsyncStorage.getItem('speedUnit');
      if (storedSpeedUnit) {
        setSpeedUnit(storedSpeedUnit);
      }
    };

    fetchSpeedUnit();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || 'User');
    };

    fetchUserName();
  }, []);

  const formatActiveTime = (activeTime) => {
    const hours = Math.floor(activeTime);
    const minutes = Math.floor((activeTime % 1) * 60);
    let formattedTime = '';
    if (hours > 0) {
      formattedTime += `${hours}h`;
    }
    if (minutes > 0) {
      formattedTime += ` ${minutes}m`;
    }
    return formattedTime.trim() || 'No Activity';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreetingMessage(`Good Morning, ${userName}.`);
      setGreetingIcon('sunny-outline'); // Use an appropriate icon for morning
    } else if (hour < 18) {
      setGreetingMessage(`Good Afternoon, ${userName}.`);
      setGreetingIcon('partly-sunny-outline'); // Use an appropriate icon for afternoon
    } else {
      setGreetingMessage(`Good Evening, ${userName}.`);
      setGreetingIcon('moon-outline'); // Use an appropriate icon for evening
    }
  };

  useEffect(() => {
    getGreeting(); // Set greeting message on component mount
  }, [userName]);

  const activityData = {
    time: formatActiveTime(dailyData.activeTime),
    distance: units === 'metric' ? `${dailyData.distance} km` : `${(dailyData.distance * 0.621371).toFixed(2)} miles`,

    // Handle different speed units: m/s, km/h, or mph
    speed: speedUnit === 'm/s' && units === 'metric'
      ? `${(dailyData.speed / 3.6).toFixed(2)} m/s`  // Display m/s directly
      : units === 'metric'
        ? `${(dailyData.speed * 3.6).toFixed(2)} km/h`  // Convert m/s to km/h
        : `${(dailyData.speed * 2.23694).toFixed(2)} mph`,  // Convert m/s to mph

    calories: `${dailyData.activeEnergy} kcal`,
  };


  const fetchActivityData = () => {
    setLoading(false);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    try {
      fetchActivityData();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActivityData();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {colorScheme === 'light' ? (
        <LinearGradient
          colors={['#FFA7A7', '#FCFCFC', '#EEEEEE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
      ) : (
        <LinearGradient
          colors={['#262626', '#171717']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
      )}
      <ScrollView className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"#CA6464"} />
        }>
        <Text className="text-2xl font-bold mt-8 mb-6 mx-auto dark:text-white">
          <Ionicons name={greetingIcon as keyof typeof Ionicons.glyphMap} size={24} color={colorScheme === "dark" ? "white" : "black"} />
          {` ${greetingMessage}`}
        </Text>
        <StepCounter />
        <Text className='text-[32px] font-bold mx-auto flex flex-row flex-1 dark:text-white'>
          <FontAwesome5 name="running" size={32} color={colorScheme === "dark" ? "white" : "black"} /> Today's Activity
        </Text>
        <View className='flex flex-col justify-between'>
          <View className="flex flex-row flex-wrap">
            {loading ? (
              <View className="flex flex-col items-center justify-center h-[30vh] w-full">
                <ActivityIndicator size="large" color="#CA6464" />
              </View>
            ) : (
              <>
                <View className="w-1/2 p-2">
                  <ActivityBox
                    icon="time-outline"
                    title="Time"
                    value={activityData.time}
                    subtitle="Time Remaining: 1h"
                  />
                </View>
                <View className="w-1/2 p-2">
                  <ActivityBox
                    icon="walk-outline"
                    title="Distance"
                    value={activityData.distance}
                    subtitle="Goal: 10km (2.2km Left)"
                  />
                </View>
                <View className="w-1/2 p-2">
                  <ActivityBox
                    icon="speedometer-outline"
                    title="Speed"
                    value={activityData.speed}
                    subtitle="Top Speed: 4.5 km/h"
                  />
                </View>
                <View className="w-1/2 p-2">
                  <ActivityBox
                    icon="flame-outline"
                    title="Calories"
                    value={activityData.calories}
                    subtitle="Avg: 243 kcal/hr"
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <BottomMenu activePage={activePage} setActivePage={setActivePage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ActivityBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.2,
    elevation: 2,
  },
});


