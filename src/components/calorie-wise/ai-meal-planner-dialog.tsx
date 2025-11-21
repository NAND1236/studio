
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { getMealPlan } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './markdown-renderer';

const formSchema = z.object({
  preferredFoods: z.string().min(3, 'Please list at least one food.'),
  restrictions: z.string().optional(),
  calorieGoal: z.coerce.number().min(500, 'Calorie goal must be at least 500.').positive(),
});

type AiMealPlannerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AiMealPlannerDialog({ open, onOpenChange }: AiMealPlannerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredFoods: '',
      restrictions: '',
      calorieGoal: 2000,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setResult(null);
      setLoading(false);
    }
    onOpenChange(isOpen);
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setResult(null);
    const response = await getMealPlan(values);
    if (response.success && response.data) {
      setResult(response.data.mealPlan);
    } else {
      setResult("Sorry, I couldn't generate a meal plan right now. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Meal Planner</DialogTitle>
          <DialogDescription>
            Tell us your preferences and we'll create a plan for tomorrow.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your personalized plan...</p>
          </div>
        ) : result ? (
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <MarkdownRenderer content={result} />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="preferredFoods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Foods</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., chicken, broccoli, quinoa, berries" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="restrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Restrictions (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., gluten-free, vegetarian" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calorieGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Calorie Goal</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  Generate Plan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
