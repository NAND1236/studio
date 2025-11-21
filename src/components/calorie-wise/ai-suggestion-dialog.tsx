
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, Bot, Loader2 } from "lucide-react";
import type { Meals } from '@/lib/types';
import { getAlternateMeals } from '@/app/actions';
import { MarkdownRenderer } from './markdown-renderer';

type AiSuggestionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMeals: Meals;
  dailyCalorieLimit: number;
};

export function AiSuggestionDialog({
  open,
  onOpenChange,
  currentMeals,
  dailyCalorieLimit,
}: AiSuggestionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setResult(null);
      setLoading(false);
    }
    onOpenChange(isOpen);
  };

  const handleGetSuggestions = async () => {
    setLoading(true);
    setResult(null);

    const mealsString = Object.entries(currentMeals)
      .flatMap(([mealType, foods]) => 
        foods.map(food => `${mealType}: ${food.name} (${food.quantity}) - ${food.calories} kcal`)
      )
      .join('\n');

    const response = await getAlternateMeals({
      currentMeals: mealsString,
      dailyCalorieLimit,
    });

    if (response.success && response.data) {
      setResult(response.data.suggestedMeals);
    } else {
      setResult("Sorry, I couldn't get suggestions right now. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="text-destructive h-6 w-6" />
            Calorie Goal Exceeded
          </DialogTitle>
          <DialogDescription className="pt-2">
            You've gone over your daily calorie goal. Would you like some AI-powered suggestions for lighter meal options for the rest of the day?
          </DialogDescription>
        </DialogHeader>

        {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Finding some lighter options...</p>
            </div>
        ) : result ? (
          <div className="py-4 max-h-[50vh] overflow-y-auto">
            <h3 className="font-bold mb-2 font-headline">Here are some suggestions:</h3>
            <MarkdownRenderer content={result} />
          </div>
        ) : null}

        {!result && !loading && (
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              No, thanks
            </Button>
            <Button onClick={handleGetSuggestions}>
              <Bot className="mr-2 h-4 w-4" />
              Get Suggestions
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
