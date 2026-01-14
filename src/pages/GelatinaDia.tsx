import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ClipboardList, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";
import jellyImage from "@/assets/jelly-illustration.png";
import CookingMode from "@/components/cooking/CookingMode";
import WeeklyConsistencyCard from "@/components/cooking/WeeklyConsistencyCard";
import { useWeeklyConsistency } from "@/hooks/useWeeklyConsistency";

const GelatinaDia = () => {
  const navigate = useNavigate();
  const [isCookingMode, setIsCookingMode] = useState(false);
  const { days, streak, markTodayComplete, isTodayComplete } = useWeeklyConsistency();

  const handleNavigate = (item: "home" | "receitas" | "progresso" | "perfil") => {
    switch (item) {
      case "home":
        navigate("/gelatina");
        break;
      case "receitas":
        navigate("/recetas");
        break;
      case "progresso":
        navigate("/progreso");
        break;
      case "perfil":
        navigate("/perfil");
        break;
    }
  };

  const handleStartCooking = () => {
    setIsCookingMode(true);
  };

  const handleCookingComplete = () => {
    markTodayComplete();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3E8] pb-24">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 px-5 pt-12">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 font-heading">
            Hola, María <span className="text-[#4A9F4A]">🌱</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-body">
            Hoy es un gran día para cuidar tu metabolismo
          </p>
        </motion.div>

        {/* Main Card - Gelatina del Día */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Green decorative corners */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-20 h-20 bg-[#E8F5E8] rounded-br-[80px]" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#E8F5E8] rounded-bl-[80px]" />
            
            {/* Jelly Image */}
            <div className="flex justify-center pt-8 pb-4 relative z-10">
              <motion.img 
                src={jellyImage} 
                alt="Gelatina verde con limón" 
                className="w-48 h-48 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
          </div>

          {/* Card Content */}
          <div className="px-6 pb-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2 font-heading">
              Gelatina del Día
            </h2>
            <p className="text-gray-500 text-sm mb-5 font-body">
              Una receta refrescante y llena de nutrientes para activar tu cuerpo.
            </p>
            
            {/* CTA Button */}
            <motion.button 
              onClick={handleStartCooking}
              className="w-full bg-[#4A9F4A] hover:bg-[#3d8a3d] text-white font-semibold py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-colors font-heading"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isTodayComplete()}
            >
              {isTodayComplete() ? (
                <>
                  ¡Ya preparaste tu gelatina hoy!
                  <span className="text-lg">✅</span>
                </>
              ) : (
                <>
                  Preparar mi gelatina ahora
                  <span className="text-lg">🥣</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Weekly Consistency Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WeeklyConsistencyCard days={days} streak={streak} />
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { id: "home" as const, label: "Inicio", icon: Home, active: true },
            { id: "receitas" as const, label: "Recetas", icon: ClipboardList, active: false },
            { id: "progresso" as const, label: "Progreso", icon: BarChart3, active: false },
            { id: "perfil" as const, label: "Perfil", icon: User, active: false },
          ].map(({ id, label, icon: Icon, active }) => (
            <button
              key={id}
              onClick={() => handleNavigate(id)}
              className={`relative flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 ${
                active ? "text-[#4A9F4A]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {active && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#4A9F4A] rounded-full" />
              )}
              <Icon className={`w-6 h-6 ${active ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs font-medium font-body ${active ? "font-semibold" : ""}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Cooking Mode Drawer */}
      <CookingMode
        isOpen={isCookingMode}
        onClose={() => setIsCookingMode(false)}
        onComplete={handleCookingComplete}
      />
    </div>
  );
};

export default GelatinaDia;
