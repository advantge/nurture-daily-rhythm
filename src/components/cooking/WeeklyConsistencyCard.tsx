import { motion } from "framer-motion";

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
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 text-center mb-4 font-heading">
        Tu consistencia semanal
      </h3>

      {/* Days tracker */}
      <div className="flex justify-between items-center mb-4 px-2">
        {days.map((item, index) => (
          <motion.div
            key={item.day}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center"
          >
            {/* Leaf icon with check */}
            <div className="relative mb-2">
              <motion.svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                className={item.completed ? "text-[#4A9F4A]" : "text-gray-300"}
                animate={item.completed ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {/* Leaf shape */}
                <path
                  d="M14 4C14 4 8 8 8 14C8 18 10 22 14 24C18 22 20 18 20 14C20 8 14 4 14 4Z"
                  fill="currentColor"
                />
                {/* Stem */}
                <path
                  d="M14 14V24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </motion.svg>
              {item.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -bottom-1 -right-1 bg-[#4A9F4A] rounded-full w-4 h-4 flex items-center justify-center"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5L4 7L8 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
            {/* Day label */}
            <span
              className={`text-xs font-medium font-body ${
                item.completed ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {item.day}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Streak message */}
      <motion.p
        key={streak}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-gray-700 font-medium font-body"
      >
        {getStreakMessage()} <span className="text-lg">💪</span>
      </motion.p>
    </div>
  );
};

export default WeeklyConsistencyCard;
