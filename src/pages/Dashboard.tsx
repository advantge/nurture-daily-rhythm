import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calculator, MessageCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PageTransition } from "@/components/layout/PageTransition";
import { VIPHeader } from "@/components/dashboard/VIPHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { BottomNavVIP } from "@/components/dashboard/BottomNavVIP";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuario");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile?.first_name) {
        setUserName(profile.first_name);
      }
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleNavigate = (item: "home" | "calculator" | "coach" | "challenges" | "recipes" | "profile") => {
    switch (item) {
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
        navigate("/recetas");
        break;
      case "profile":
        navigate("/perfil");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-28">
        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <VIPHeader userName={userName} />

          <main className="flex-1 flex flex-col gap-4 px-5">
            <GlassCard
              icon={Calculator}
              title="Calculadora de Medidas"
              subtitle="Calcula tu porcentaje de grasa corporal con la fórmula Navy Seal"
              onClick={() => navigate("/calculadora")}
              delay={0.1}
            />

            <GlassCard
              icon={MessageCircle}
              title="El Coach IA"
              subtitle="Tu asistente personal de bienestar disponible 24/7"
              onClick={() => navigate("/coach")}
              delay={0.2}
            />

            <GlassCard
              icon={Trophy}
              title="Desafíos Mensuales"
              subtitle="Completa retos y gana recompensas exclusivas"
              onClick={() => navigate("/desafios")}
              delay={0.3}
            />
          </main>
        </div>

        <BottomNavVIP active="home" onNavigate={handleNavigate} />
      </div>
    </PageTransition>
  );
};

export default Dashboard;