import { motion } from "framer-motion";
import { Home, Calculator, MessageCircle, Trophy, User, ChefHat } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = "home" | "calculator" | "coach" | "challenges" | "recipes" | "profile";

interface BottomNavVIPProps {
  active: NavItem;
  onNavigate: (item: NavItem) => void;
}

interface NavItemData {
  id: NavItem;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItemData[] = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "calculator", label: "Medidas", icon: Calculator },
  { id: "coach", label: "Coach", icon: MessageCircle },
  { id: "challenges", label: "Desafíos", icon: Trophy },
  { id: "recipes", label: "Recetas", icon: ChefHat },
  { id: "profile", label: "Perfil", icon: User },
];

export const BottomNavVIP = ({ active, onNavigate }: BottomNavVIPProps) => {
  const activeIndex = navItems.findIndex(item => item.id === active);

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 nav-glass px-2 pb-6 pt-3 z-50"
    >
      {/* Top spotlight glow line - Enhanced */}
      <motion.div 
        className="absolute top-0 h-[3px] nav-glow-indicator"
        animate={{
          left: `calc(${(activeIndex / navItems.length) * 100}% + ${100 / navItems.length / 2}% - 35px)`,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        style={{ width: '70px' }}
      />
      
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Moving spotlight background glow */}
        <motion.div 
          className="absolute h-full pointer-events-none"
          animate={{
            left: `calc(${(activeIndex / navItems.length) * 100}% + ${100 / navItems.length / 2}% - 45px)`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          style={{
            width: '90px',
            background: 'radial-gradient(ellipse at center top, rgba(218, 165, 32, 0.2) 0%, transparent 70%)',
          }}
        />

        {navItems.map((item, index) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          const distance = Math.abs(activeIndex - index);
          const proximityGlow = Math.max(0, 1 - distance * 0.4);
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center gap-1 px-3 py-2 min-w-[56px]"
            >
              {/* Spotlight background glow */}
              <div 
                className="absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none"
                style={{
                  background: isActive 
                    ? 'radial-gradient(ellipse at center, rgba(218, 165, 32, 0.3) 0%, rgba(218, 165, 32, 0.1) 50%, transparent 70%)'
                    : `radial-gradient(ellipse at center, rgba(218, 165, 32, ${0.08 * proximityGlow}) 0%, transparent 60%)`,
                }}
              />
              
              {/* Active border frame with enhanced glow */}
              {isActive && (
                <motion.div
                  layoutId="nav-spotlight-border"
                  className="absolute inset-1 rounded-xl border-2 border-yellow-500"
                  style={{
                    boxShadow: '0 0 24px rgba(218, 165, 32, 0.6), 0 0 48px rgba(218, 165, 32, 0.3), inset 0 0 24px rgba(218, 165, 32, 0.15)',
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              
              {/* Icon with glow effect */}
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                className="relative z-10"
              >
                <Icon 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? "text-yellow-400" 
                      : "text-zinc-500 hover:text-zinc-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={isActive ? {
                    filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.8)) drop-shadow(0 0 20px rgba(250, 204, 21, 0.4))',
                  } : undefined}
                />
              </motion.div>
              
              {/* Label with font-body */}
              <span 
                className={`text-[10px] font-body font-medium relative z-10 transition-all duration-300 ${
                  isActive 
                    ? 'text-yellow-400 font-semibold' 
                    : 'text-zinc-500'
                }`}
                style={isActive ? {
                  textShadow: '0 0 8px rgba(250, 204, 21, 0.5)',
                } : undefined}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};
