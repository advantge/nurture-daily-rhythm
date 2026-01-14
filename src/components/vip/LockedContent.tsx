import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useVIP } from "@/contexts/VIPContext";

interface LockedContentProps {
  children: React.ReactNode;
  locked?: boolean;
}

export const LockedContent = ({ children, locked = true }: LockedContentProps) => {
  const { isVip, setShowUpsellModal } = useVIP();

  // If user is VIP or content is not locked, show content normally
  if (isVip || !locked) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className="relative cursor-pointer"
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowUpsellModal(true)}
    >
      {/* Blurred Content */}
      <div className="opacity-50 blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div 
            className="p-3 rounded-full bg-gold/20 border border-gold/40"
            style={{
              boxShadow: "0 0 20px rgba(218, 165, 32, 0.3)",
            }}
          >
            <Lock className="w-6 h-6 text-gold" style={{
              filter: "drop-shadow(0 0 8px rgba(218, 165, 32, 0.6))",
            }} />
          </div>
          <span className="text-xs font-heading font-semibold text-gold">
            VIP
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};
