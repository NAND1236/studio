
import { format, subDays } from 'date-fns';

export function getMockMonthlyData() {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    // Simulate daily calorie intake between 1500 and 2800
    const calories = Math.floor(Math.random() * (2800 - 1500 + 1)) + 1500;
    data.push({
      date: format(date, 'MMM d'),
      calories: calories,
    });
  }
  return data;
}

export const monthlyCalorieData = getMockMonthlyData();

export const averageCalories = Math.round(
  monthlyCalorieData.reduce((acc, day) => acc + day.calories, 0) / monthlyCalorieData.length
);
