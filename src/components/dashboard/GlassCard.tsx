import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GlassCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  delay?: number;
}

export const GlassCard = ({ icon: Icon, title, subtitle, onClick, delay = 0 }: GlassCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full glass-card rounded-card p-6 text-left group cursor-pointer ripple"
    >
      <div className="flex items-start gap-4">
        {/* Icon container with enhanced glow */}
        <motion.div 
          className="relative p-3 rounded-xl bg-gold/15"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-xl bg-gold/10 blur-md" />
          
          {/* Icon with animated glow */}
          <Icon className="relative w-7 h-7 text-gold icon-glow" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-heading font-bold text-white text-luminescent mb-1 group-hover:text-gold transition-colors">
            {title}
          </h3>
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Arrow indicator */}
        <motion.div 
          className="text-gold/40 group-hover:text-gold transition-colors"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
};
