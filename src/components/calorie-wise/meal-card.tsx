
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import type { FoodItem } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

type MealCardProps = {
  title: string;
  items: FoodItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  image?: ImagePlaceholder;
};

export function MealCard({ title, items, onAdd, onRemove, image }: MealCardProps) {
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Card className="flex flex-col shadow-sm overflow-hidden h-full">
      {image && (
        <div className="relative h-40 w-full">
            <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-2xl font-bold text-white font-headline">{title}</h3>
            </div>
        </div>
      )}
      <CardContent className="p-4 flex-grow">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-8">
            <p>No {title.toLowerCase()} items added yet.</p>
          </div>
        ) : (
          <ScrollArea className="h-40">
            <ul className="space-y-2 pr-4">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm group">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-muted-foreground">{item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{item.calories} kcal</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col items-stretch gap-2">
        <div className="flex justify-between items-center text-sm font-bold">
            <span>Total:</span>
            <span>{totalCalories} kcal</span>
        </div>
        <Button onClick={onAdd} variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Food
        </Button>
      </CardFooter>
    </Card>
  );
}
