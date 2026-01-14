import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, X, Sparkles } from "lucide-react";
import { useVIP } from "@/contexts/VIPContext";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

export const VIPUpsellModal = () => {
  const { showUpsellModal, setShowUpsellModal, setIsVip } = useVIP();

  const handlePurchase = (plan: "monthly" | "lifetime") => {
    // Simulate purchase
    setIsVip(true);
    setShowUpsellModal(false);
    
    // Celebration confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#FFD700", "#FFA500", "#FF8C00", "#FFDF00"],
    });

    toast({
      title: "¡Bienvenido al Club VIP! 👑",
      description: plan === "lifetime" 
        ? "Has desbloqueado acceso vitalicio a todo el contenido premium."
        : "Tu suscripción mensual está activa. ¡Disfruta!",
    });
  };

  const benefits = [
    "Acceso Ilimitado al Cofre de Recetas Funcionales (+50 exclusivas)",
    "Rastreador Avanzado de Medidas Corporais (Gráficos PRO)",
    "Experiencia Premium sin Anuncios",
    "Coach IA con respuestas personalizadas ilimitadas",
    "Desafíos exclusivos con recompensas especiales",
  ];

  return (
    <AnimatePresence>
      {showUpsellModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0D0D0D]/95 backdrop-blur-xl"
            onClick={() => setShowUpsellModal(false)}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-gold/30 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] p-6 shadow-2xl"
            style={{
              boxShadow: "0 0 60px rgba(218, 165, 32, 0.15), 0 0 100px rgba(218, 165, 32, 0.1)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowUpsellModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Crown Icon with Glow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl scale-150" />
                <div className="relative p-5 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/50">
                  <Crown className="w-12 h-12 text-gold" style={{
                    filter: "drop-shadow(0 0 20px rgba(218, 165, 32, 0.8))",
                  }} />
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl font-heading font-bold text-card-foreground mb-2">
                Desbloquea tu Potencial Máximo
              </h2>
              <p className="text-sm text-muted-foreground font-body">
                Accede a contenido exclusivo y funciones premium
              </p>
            </motion.div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 mb-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-gold" />
                  </div>
                  <p className="text-sm text-card-foreground font-body">{benefit}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Monthly Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="relative p-4 rounded-2xl border border-gold/30 bg-secondary/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-sm font-heading font-semibold text-card-foreground mb-1">
                  Mensual
                </h3>
                <p className="text-2xl font-heading font-bold text-gold mb-1">
                  $7<span className="text-sm font-normal text-muted-foreground"> USD/mes</span>
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Cancela cuando quieras
                </p>
              </motion.div>

              {/* Lifetime Card - Highlighted */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative p-4 rounded-2xl border-2 border-gold bg-gradient-to-br from-gold/20 to-gold/5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: "0 0 30px rgba(218, 165, 32, 0.2)",
                }}
              >
                {/* Best Value Tag */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-primary-foreground text-[10px] font-heading font-bold whitespace-nowrap">
                  MEJOR VALOR
                </div>
                <h3 className="text-sm font-heading font-semibold text-card-foreground mb-1 mt-2">
                  Acceso Vitalicio
                </h3>
                <p className="text-2xl font-heading font-bold text-gold mb-1">
                  $20<span className="text-sm font-normal text-muted-foreground"> USD</span>
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Paga una sola vez
                </p>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePurchase("lifetime")}
              className="relative w-full py-4 rounded-xl font-heading font-bold text-primary-foreground overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #DAA520 0%, #FFD700 50%, #DAA520 100%)",
                boxShadow: "0 4px 20px rgba(218, 165, 32, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="relative flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Activar mi Acceso VIP Ahora</span>
              </div>
            </motion.button>

            {/* Security Note */}
            <p className="text-center text-xs text-muted-foreground mt-4 font-body">
              🔒 Pago seguro · Garantía de 7 días
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
