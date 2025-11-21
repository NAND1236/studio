
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

type DailySummaryProps = {
  current: number;
  goal: number;
};

export function DailySummary({ current, goal }: DailySummaryProps) {
  const percentage = goal > 0 ? (current / goal) * 100 : 0;
  const isOver = current > goal;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium font-headline">
          Today's Summary
        </CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold tracking-tight">
            {current.toLocaleString()}
          </p>
          <p className="text-lg text-muted-foreground">/ {goal.toLocaleString()} kcal</p>
        </div>
        <Progress value={percentage} className="mt-4 h-3" indicatorClassName={isOver ? "bg-destructive" : "bg-primary"}/>
        <p className={`mt-2 text-sm ${isOver ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isOver
            ? `You've exceeded your goal by ${Math.round(current - goal)} calories.`
            : `You have ${Math.round(goal - current)} calories remaining.`}
        </p>
      </CardContent>
    </Card>
  );
}
