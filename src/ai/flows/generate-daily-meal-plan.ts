'use server';

/**
 * @fileOverview Generates a daily meal plan based on user preferences, restrictions, and calorie goals.
 *
 * - generateDailyMealPlan - A function that generates the meal plan.
 * - GenerateDailyMealPlanInput - The input type for the generateDailyMealPlan function.
 * - GenerateDailyMealPlanOutput - The return type for the generateDailyMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyMealPlanInputSchema = z.object({
  preferredFoods: z
    .string()
    .describe('A comma-separated list of foods the user prefers.'),
  restrictions: z
    .string()
    .describe(
      'A comma-separated list of dietary restrictions (e.g., gluten-free, vegetarian).'
    ),
  calorieGoal: z
    .number()
    .describe('The desired daily calorie intake for the user.'),
});
export type GenerateDailyMealPlanInput = z.infer<typeof GenerateDailyMealPlanInputSchema>;

const GenerateDailyMealPlanOutputSchema = z.object({
  mealPlan: z
    .string()
    .describe(
      'A detailed meal plan for the next day, including specific meal suggestions and calorie counts for each item.'
    ),
});
export type GenerateDailyMealPlanOutput = z.infer<typeof GenerateDailyMealPlanOutputSchema>;

export async function generateDailyMealPlan(
  input: GenerateDailyMealPlanInput
): Promise<GenerateDailyMealPlanOutput> {
  return generateDailyMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyMealPlanPrompt',
  input: {schema: GenerateDailyMealPlanInputSchema},
  output: {schema: GenerateDailyMealPlanOutputSchema},
  prompt: `You are a personal AI dietitian. Your task is to create a detailed meal plan for the user for the next day, considering their dietary preferences, restrictions, and calorie goals. The meal plan should be realistic and easy to follow, with specific suggestions for breakfast, lunch, dinner, and snacks. Include calorie counts for each item. The plan should have enough details that the user has precise options to follow.

Dietary Preferences: {{{preferredFoods}}}
Dietary Restrictions: {{{restrictions}}}
Calorie Goal: {{{calorieGoal}}} calories

Provide a detailed meal plan for the next day, including specific meal suggestions and calorie counts for each item. Be very precise. Format as markdown.`,
});

const generateDailyMealPlanFlow = ai.defineFlow(
  {
    name: 'generateDailyMealPlanFlow',
    inputSchema: GenerateDailyMealPlanInputSchema,
    outputSchema: GenerateDailyMealPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
