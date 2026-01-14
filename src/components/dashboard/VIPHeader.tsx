import { motion } from "framer-motion";
import logo from "@/assets/logo-gelatina-bariatrica.png";

interface VIPHeaderProps {
  userName: string;
}

export const VIPHeader = ({ userName }: VIPHeaderProps) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 pt-8 pb-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.img
          src={logo}
          alt="Gelatina Bariátrica"
          className="w-16 h-16 object-contain"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
        <div>
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Gelatina Bariátrica
          </span>
          <h1 className="text-2xl font-bold">
            <span className="text-card-foreground">Olá, </span>
            <span className="text-gold-gradient text-glow">{userName}</span>
          </h1>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm">
        Sua jornada de bem-estar continua 💪
      </p>
    </motion.header>
  );
};
