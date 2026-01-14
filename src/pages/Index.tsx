import { useNavigate } from "react-router-dom";
import { Header } from "@/components/home/Header";
import { StreakCard } from "@/components/home/StreakCard";
import { HeroCTA } from "@/components/home/HeroCTA";
import { StatusCard } from "@/components/home/StatusCard";
import { BottomNav } from "@/components/home/BottomNav";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();

  const handlePrepareDose = () => {
    toast({
      title: "Preparando sua dose! 💧",
      description: "Vamos começar o preparo do seu suplemento.",
    });
  };

  const handleNavigate = (item: "home" | "receitas" | "progresso" | "perfil") => {
    switch (item) {
      case "home":
        navigate("/");
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

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Mobile container for iOS-like sizing */}
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        {/* Header */}
        <Header userName="Maria" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-5 px-5 py-4">
          {/* Streak Card */}
          <StreakCard days={3} message="Você está indo muito bem!" />

          {/* Hero CTA Button */}
          <HeroCTA onClick={handlePrepareDose} />

          {/* Status Card */}
          <StatusCard nextTime="11:30" />
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="home" onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
