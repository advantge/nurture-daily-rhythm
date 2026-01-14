import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Flame } from "lucide-react";
import { BottomNavVIP } from "@/components/dashboard/BottomNavVIP";

// Recipe images
import matchaGelatin from "@/assets/recipes/matcha-gelatin.jpg";
import proteinGelatin from "@/assets/recipes/protein-gelatin.jpg";
import detoxGelatin from "@/assets/recipes/detox-gelatin.jpg";
import sleepGelatin from "@/assets/recipes/sleep-gelatin.jpg";
import energyGelatin from "@/assets/recipes/energy-gelatin.jpg";
import turmericGelatin from "@/assets/recipes/turmeric-gelatin.jpg";

interface RecipeCardProps {
  title: string;
  image: string;
  time: string;
  calories: string;
  description: string;
  index: number;
}

const RecipeCard = ({ title, image, time, calories, description, index }: RecipeCardProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col"
      onClick={() => navigate("/gelatina")}
    >
      {/* Image Container - 45% of card height */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        
        {/* Status Pills */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
          {/* Time pill */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] font-semibold text-gray-700 font-body">{time}</span>
          </div>
          {/* Calories pill */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Flame className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] font-semibold text-gray-700 font-body">{calories}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title - Poppins Bold */}
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 font-heading leading-tight">
          {title}
        </h3>
        
        {/* Description - Inter, 2 lines max */}
        <p className="text-sm text-[#666666] mb-4 line-clamp-2 font-body flex-1">
          {description}
        </p>
        
        {/* Button - Fixed at bottom */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-semibold text-sm text-[#1A1A1A] font-heading
                     bg-[#FFB800] hover:brightness-95 transition-all duration-200"
        >
          Ver Receta
        </motion.button>
      </div>
    </motion.div>
  );
};

const Recetas = () => {
  const navigate = useNavigate();

  const handleNavigate = (item: "home" | "calculator" | "coach" | "challenges" | "recipes" | "profile") => {
    switch (item) {
      case "home":
        navigate("/dashboard");
        break;
      case "calculator":
        navigate("/calculadora");
        break;
      case "coach":
        navigate("/coach");
        break;
      case "challenges":
        navigate("/desafios");
        break;
      case "recipes":
        break;
      case "profile":
        navigate("/perfil");
        break;
    }
  };

  const recipes = [
    {
      title: "Quema-Grasa Matutino",
      image: matchaGelatin,
      time: "10 min",
      calories: "85 kcal",
      description: "Gelatina verde con té matcha y jengibre para activar el metabolismo"
    },
    {
      title: "Saciante Pro",
      image: proteinGelatin,
      time: "15 min",
      calories: "120 kcal",
      description: "Gelatina proteica con colágeno y semillas de chía para controlar el hambre"
    },
    {
      title: "Detox Verde",
      image: detoxGelatin,
      time: "12 min",
      calories: "65 kcal",
      description: "Gelatina de espinaca y manzana verde para desintoxicar naturalmente"
    },
    {
      title: "Sueño Profundo",
      image: sleepGelatin,
      time: "8 min",
      calories: "75 kcal",
      description: "Gelatina de lavanda y manzanilla para un descanso reparador"
    },
    {
      title: "Energía Total",
      image: energyGelatin,
      time: "10 min",
      calories: "95 kcal",
      description: "Gelatina de frutas rojas con guaraná para máxima vitalidad"
    },
    {
      title: "Antiinflamatorio",
      image: turmericGelatin,
      time: "12 min",
      calories: "70 kcal",
      description: "Gelatina de cúrcuma y piña para reducir la inflamación"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col pb-28 bg-[#F8F8F8]">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-5 pt-12 pb-4"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] font-heading">
                Mis Recetas
              </h1>
              <p className="text-sm text-[#666666] mt-0.5 font-body">
                Gelatinas bariátricas premium
              </p>
            </div>
          </div>
        </motion.header>

        {/* Recipe Grid - 2 columns, 16px gap */}
        <main className="flex-1 px-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} {...recipe} index={index} />
            ))}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNavVIP active="recipes" onNavigate={handleNavigate} />
    </div>
  );
};

export default Recetas;
