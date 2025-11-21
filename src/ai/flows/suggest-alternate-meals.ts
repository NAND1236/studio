'use server';

/**
 * @fileOverview Suggests alternate, lower-calorie meal options using AI when a user exceeds their daily calorie limit.
 *
 * - suggestAlternateMeals - A function that suggests alternate meals.
 * - SuggestAlternateMealsInput - The input type for the suggestAlternateMeals function.
 * - SuggestAlternateMealsOutput - The return type for the suggestAlternateMeals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternateMealsInputSchema = z.object({
  currentMeals: z.string().describe('The meals the user has already consumed today, including the food name, quantity, and estimated calorie count for each meal.'),
  dailyCalorieLimit: z.number().describe('The user\'s daily calorie limit.'),
  preferredFoods: z.string().optional().describe('The user\'s preferred foods.'),
  foodRestrictions: z.string().optional().describe('Any food restrictions the user has (e.g., vegetarian, allergies).'),
});
export type SuggestAlternateMealsInput = z.infer<typeof SuggestAlternateMealsInputSchema>;

const SuggestAlternateMealsOutputSchema = z.object({
  suggestedMeals: z.string().describe('A list of suggested alternate, lower-calorie meal options for the rest of the day. Include detailed food options and calorie estimations.'),
});
export type SuggestAlternateMealsOutput = z.infer<typeof SuggestAlternateMealsOutputSchema>;

export async function suggestAlternateMeals(input: SuggestAlternateMealsInput): Promise<SuggestAlternateMealsOutput> {
  return suggestAlternateMealsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternateMealsPrompt',
  input: {schema: SuggestAlternateMealsInputSchema},
  output: {schema: SuggestAlternateMealsOutputSchema},
  prompt: `You are a nutritional expert. A user has exceeded their daily calorie limit and is looking for suggestions for alternative meals for the rest of the day.

  The user has already consumed the following meals: {{{currentMeals}}}

  The user's daily calorie limit is: {{{dailyCalorieLimit}}}

  {% if preferredFoods %}The user prefers the following foods: {{{preferredFoods}}}{% endif %}

  {% if foodRestrictions %}The user has the following food restrictions: {{{foodRestrictions}}}{% endif %}

  Suggest alternative meal options that are lower in calories and align with the user's preferences and restrictions. The suggestions should fit within the remaining calorie budget.
  Be accurate and precise with the calorie estimations.

  Return the suggested meals with the food name, quantity, and the calories it would have.
  `,
});

const suggestAlternateMealsFlow = ai.defineFlow(
  {
    name: 'suggestAlternateMealsFlow',
    inputSchema: SuggestAlternateMealsInputSchema,
    outputSchema: SuggestAlternateMealsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
