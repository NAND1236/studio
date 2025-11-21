
'use server';

import { generateDailyMealPlan, GenerateDailyMealPlanInput } from '@/ai/flows/generate-daily-meal-plan';
import { suggestAlternateMeals, SuggestAlternateMealsInput } from '@/ai/flows/suggest-alternate-meals';

export async function getMealPlan(input: GenerateDailyMealPlanInput) {
  try {
    const result = await generateDailyMealPlan(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate meal plan.' };
  }
}

export async function getAlternateMeals(input: SuggestAlternateMealsInput) {
  try {
    const result = await suggestAlternateMeals(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to suggest alternate meals.' };
  }
}
