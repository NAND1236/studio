"use client";
import React, { useReducer, useMemo, useState, useEffect } from 'react';
import type { FoodItem, MealType, Meals } from '@/lib/types';
import { AppHeader } from '@/components/calorie-wise/header';
import { DailySummary } from '@/components/calorie-wise/daily-summary';
import { MealCard } from '@/components/calorie-wise/meal-card';
import { MonthlyChart } from '@/components/calorie-wise/monthly-chart';
import { AddFoodDialog } from '@/components/calorie-wise/add-food-dialog';
import { AiMealPlannerDialog } from '@/components/calorie-wise/ai-meal-planner-dialog';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { AiSuggestionDialog } from '@/components/calorie-wise/ai-suggestion-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type AppState = {
  meals: Meals;
  dailyGoal: number;
};

type Action = 
  | { type: 'ADD_FOOD'; payload: { mealType: MealType; food: Omit<FoodItem, 'id'> } }
  | { type: 'REMOVE_FOOD'; payload: { mealType: MealType; foodId: string } };

const initialState: AppState = {
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
  dailyGoal: 2000,
};

function mealsReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_FOOD': {
      const { mealType, food } = action.payload;
      const newFood: FoodItem = { ...food, id: new Date().toISOString() };
      return {
        ...state,
        meals: {
          ...state.meals,
          [mealType]: [...state.meals[mealType], newFood],
        },
      };
    }
    case 'REMOVE_FOOD': {
      const { mealType, foodId } = action.payload;
      return {
        ...state,
        meals: {
          ...state.meals,
          [mealType]: state.meals[mealType].filter(item => item.id !== foodId),
        },
      };
    }
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(mealsReducer, initialState);
  const [dialogState, setDialogState] = useState<{ open: boolean; mealType: MealType | null }>({ open: false, mealType: null });
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  const totalCalories = useMemo(() => {
    return Object.values(state.meals).flat().reduce((sum, item) => sum + item.calories, 0);
  }, [state.meals]);
  
  useEffect(() => {
    if (totalCalories > state.dailyGoal && !suggestionOpen) {
      const timer = setTimeout(() => setSuggestionOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [totalCalories, state.dailyGoal, suggestionOpen]);

  const handleAddFood = (mealType: MealType, food: Omit<FoodItem, 'id'>) => {
    dispatch({ type: 'ADD_FOOD', payload: { mealType, food } });
  };

  const handleRemoveFood = (mealType: MealType, foodId: string) => {
    dispatch({ type: 'REMOVE_FOOD', payload: { mealType, foodId } });
  }

  const openAddFoodDialog = (mealType: MealType) => {
    setDialogState({ open: true, mealType });
  };
  
  const mealCards: { mealType: MealType; title: string, imageId: string }[] = [
    { mealType: 'breakfast', title: 'Breakfast', imageId: 'breakfast' },
    { mealType: 'lunch', title: 'Lunch', imageId: 'lunch' },
    { mealType: 'dinner', title: 'Dinner', imageId: 'dinner' },
    { mealType: 'snacks', title: 'Snacks', imageId: 'snacks' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          <DailySummary current={totalCalories} goal={state.dailyGoal} />

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mealCards.map(({ mealType, title, imageId }) => (
              <MealCard
                key={mealType}
                title={title}
                items={state.meals[mealType]}
                onAdd={() => openAddFoodDialog(mealType)}
                onRemove={(foodId) => handleRemoveFood(mealType, foodId)}
                image={PlaceHolderImages.find(img => img.id === imageId)}
              />
            ))}
          </section>

          <section className="bg-card rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-headline font-bold">AI Meal Planner</h2>
              <p className="text-muted-foreground mt-1">
                Let our AI craft a personalized meal plan for your next day!
              </p>
            </div>
            <Button onClick={() => setPlannerOpen(true)} size="lg">
              <Bot className="mr-2 h-5 w-5" />
              Generate Tomorrow's Plan
            </Button>
          </section>

          <section>
            <MonthlyChart />
          </section>
        </div>
      </main>
      
      <AddFoodDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
        mealType={dialogState.mealType}
        onAddFood={handleAddFood}
      />
      
      <AiMealPlannerDialog open={plannerOpen} onOpenChange={setPlannerOpen} />
      
      <AiSuggestionDialog 
        open={suggestionOpen} 
        onOpenChange={setSuggestionOpen}
        currentMeals={state.meals}
        dailyCalorieLimit={state.dailyGoal}
      />
    </div>
  );
}
