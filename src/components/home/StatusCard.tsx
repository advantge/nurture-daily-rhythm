import { Clock } from "lucide-react";

interface StatusCardProps {
  nextTime?: string;
}

export const StatusCard = ({ nextTime = "11:30" }: StatusCardProps) => {
  return (
    <div className="card-status flex items-center gap-4 px-5 py-4">
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <Clock className="w-5 h-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Próximo Horário Sugerido:</span>
        <span className="text-xl font-bold text-foreground">{nextTime}</span>
      </div>
    </div>
  );
};
