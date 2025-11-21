
import { Logo } from "@/components/icons";

export function AppHeader() {
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-headline">
            CalorieWise
          </h1>
        </div>
      </div>
    </header>
  );
}
