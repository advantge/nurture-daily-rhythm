import { Flame } from "lucide-react";

interface StreakCardProps {
  days?: number;
  message?: string;
}

export const StreakCard = ({ 
  days = 3, 
  message = "Você está indo muito bem!" 
}: StreakCardProps) => {
  return (
    <div className="card-wellness px-6 py-5 text-center">
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <Flame className="w-5 h-5 text-primary" />
        </div>
      </div>
      <h2 className="text-lg font-bold text-foreground tracking-tight">
        SEQUÊNCIA: DIA {days} 🔥
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {message}
      </p>
    </div>
  );
};
