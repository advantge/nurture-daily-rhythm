import { motion } from "framer-motion";
import { Leaf, Check } from "lucide-react";

interface DayStatus {
  day: string;
  dayIndex: number;
  completed: boolean;
}

interface WeeklyConsistencyCardProps {
  days: DayStatus[];
  streak: number;
}

const WeeklyConsistencyCard = ({ days, streak }: WeeklyConsistencyCardProps) => {
  const getStreakMessage = () => {
    if (streak === 0) {
      return "¡Empieza hoy tu racha!";
    } else if (streak === 1) {
      return "¡Primer día completado!";
    } else if (streak < 7) {
      return `¡${streak} días seguidos! Sigue así.`;
    } else {
      return "¡Semana perfecta! 🏆";
    }
  };

  return (
    <div className="glass-card rounded-card p-6">
      <h3 className="text-lg font-heading font-bold text-card-foreground text-center mb-5 text-luminescent">
        Tu consistencia semanal
      </h3>

      {/* Days tracker with leaf icons */}
      <div className="flex justify-between items-center mb-5 px-1">
        {days.map((item, index) => (
          <motion.div
            key={item.day}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center"
          >
            {/* Leaf icon container */}
            <div className="relative mb-2">
              <motion.div
                animate={item.completed ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                {/* Glow effect for completed days */}
                {item.completed && (
                  <div className="absolute inset-0 rounded-full blur-md bg-green-500/30" />
                )}
                
                {/* Leaf SVG */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  className={`relative ${item.completed ? "leaf-complete" : "leaf-pending"}`}
                >
                  {/* Leaf shape - organic form */}
                  <path
                    d="M16 4C16 4 9 9 9 16C9 21 11 25 16 28C21 25 23 21 23 16C23 9 16 4 16 4Z"
                    fill="currentColor"
                  />
                  {/* Center vein */}
                  <path
                    d="M16 12V24"
                    stroke={item.completed ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* Side veins */}
                  <path
                    d="M16 15L13 18M16 18L13 21M16 15L19 18M16 18L19 21"
                    stroke={item.completed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"}
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>

                {/* Checkmark badge for completed days */}
                {item.completed && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                    style={{ boxShadow: '0 0 8px rgba(74, 159, 74, 0.6)' }}
                  >
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Day label */}
            <span
              className={`text-xs font-body font-medium transition-colors ${
                item.completed ? "text-green-400" : "text-muted-foreground"
              }`}
            >
              {item.day}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Streak message */}
      <motion.div
        key={streak}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-body font-medium text-card-foreground">
          {getStreakMessage()}{" "}
          <motion.span 
            className="text-lg inline-block"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            💪
          </motion.span>
        </p>
        
        {/* Streak counter */}
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20"
          >
            <span className="text-gold text-sm font-heading font-bold">{streak}</span>
            <span className="text-gold/70 text-xs font-body">días de racha</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WeeklyConsistencyCard;
