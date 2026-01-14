import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import logo from "@/assets/logo-gelatina-bariatrica.png";
import { useVIP } from "@/contexts/VIPContext";

interface VIPHeaderProps {
  userName: string;
}

export const VIPHeader = ({ userName }: VIPHeaderProps) => {
  const { isVip } = useVIP();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 pt-8 pb-6"
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Logo with glow effect */}
        <motion.div className="relative">
          <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl" />
          <motion.img
            src={logo}
            alt="Gelatina Bariátrica"
            className="relative w-16 h-16 object-contain"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>
        
        <div>
          <span className="text-sm font-body font-medium text-primary uppercase tracking-wider">
            Gelatina Bariátrica
          </span>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-bold">
              <span className="text-card-foreground">Olá, </span>
              <span className="text-gold-gradient text-glow">{userName}</span>
            </h1>
            {/* VIP Badge */}
            {isVip && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40"
                style={{
                  boxShadow: "0 0 12px rgba(218, 165, 32, 0.4)",
                }}
              >
                <Crown className="w-3 h-3 text-gold" style={{
                  filter: "drop-shadow(0 0 4px rgba(218, 165, 32, 0.8))",
                }} />
                <span className="text-[10px] font-heading font-bold text-gold">VIP</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <p className="font-body text-muted-foreground text-sm">
        Sua jornada de bem-estar continua 💪
      </p>
    </motion.header>
  );
};
