import { useState, useEffect } from "react";

interface DayStatus {
  day: string;
  dayIndex: number;
  completed: boolean;
}

const DAY_NAMES = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

export const useWeeklyConsistency = () => {
  const [days, setDays] = useState<DayStatus[]>([]);
  const [streak, setStreak] = useState(0);

  // Get the start of the current week (Monday)
  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday = 1
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Get stored data from localStorage
  const getStoredData = () => {
    const stored = localStorage.getItem("gelatin_weekly_consistency");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  };

  // Save data to localStorage
  const saveStoredData = (data: Record<string, boolean>) => {
    localStorage.setItem("gelatin_weekly_consistency", JSON.stringify(data));
  };

  // Initialize days for the current week
  const initializeDays = () => {
    const weekStart = getWeekStart();
    const storedData = getStoredData();
    const weekKey = weekStart.toISOString().split("T")[0];
    
    // Clear old week data if necessary
    const currentWeekData = storedData[weekKey] || {};
    
    const weekDays: DayStatus[] = [];
    // Start from Monday (index 1) through Sunday (index 0)
    const orderedDays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
    const dayIndices = [1, 2, 3, 4, 5, 6, 0];
    
    orderedDays.forEach((dayName, idx) => {
      weekDays.push({
        day: dayName,
        dayIndex: dayIndices[idx],
        completed: currentWeekData[dayName] === true,
      });
    });

    setDays(weekDays);
    calculateStreak(weekDays);
  };

  // Calculate current streak
  const calculateStreak = (weekDays: DayStatus[]) => {
    let count = 0;
    const today = new Date().getDay();
    const todayOrderedIndex = today === 0 ? 6 : today - 1; // Convert to Monday-based index
    
    // Count consecutive completed days up to today
    for (let i = 0; i <= todayOrderedIndex; i++) {
      if (weekDays[i].completed) {
        count++;
      } else if (i < todayOrderedIndex) {
        // Reset if there's a gap before today
        count = 0;
      }
    }
    
    setStreak(count);
  };

  // Mark today as completed
  const markTodayComplete = () => {
    const weekStart = getWeekStart();
    const storedData = getStoredData();
    const weekKey = weekStart.toISOString().split("T")[0];
    
    const today = new Date().getDay();
    const todayName = DAY_NAMES[today];
    
    if (!storedData[weekKey]) {
      storedData[weekKey] = {};
    }
    storedData[weekKey][todayName] = true;
    
    saveStoredData(storedData);
    initializeDays();
  };

  // Check if today is already completed
  const isTodayComplete = () => {
    const today = new Date().getDay();
    const todayOrderedIndex = today === 0 ? 6 : today - 1;
    return days[todayOrderedIndex]?.completed || false;
  };

  useEffect(() => {
    initializeDays();
  }, []);

  return {
    days,
    streak,
    markTodayComplete,
    isTodayComplete,
  };
};
