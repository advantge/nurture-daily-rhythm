import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Droplet, 
  Brain, 
  GlassWater, 
  Dumbbell, 
  Check, 
  Sparkles, 
  Moon, 
  Utensils,
  Trophy,
  Flame,
  Target,
  Calendar
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/PageTransition";
import { BottomNavVIP } from "@/components/dashboard/BottomNavVIP";
import logo from "@/assets/logo-gelatina-bariatrica.png";

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  icon: string;
}

interface UserChallenge {
  id: string;
  challenge_id: string;
  days_completed: number;
  last_completed_at: string | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  droplet: Droplet,
  brain: Brain,
  "glass-water": GlassWater,
  dumbbell: Dumbbell,
  moon: Moon,
  utensils: Utensils,
};

const Desafios = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<Record<string, UserChallenge>>({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: challengesData } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at");

      if (challengesData) {
        setChallenges(challengesData);
      }

      const { data: userProgress } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", session.user.id);

      if (userProgress) {
        const progressMap: Record<string, UserChallenge> = {};
        userProgress.forEach((up) => {
          progressMap[up.challenge_id] = up;
        });
        setUserChallenges(progressMap);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const colors = ["#FFD700", "#FFA500", "#FF8C00"];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);
  };

  const handleComplete = async (challengeId: string) => {
    setCompleting(challengeId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const existing = userChallenges[challengeId];
      const now = new Date();

      if (existing?.last_completed_at) {
        const lastCompleted = new Date(existing.last_completed_at);
        if (
          lastCompleted.getDate() === now.getDate() &&
          lastCompleted.getMonth() === now.getMonth() &&
          lastCompleted.getFullYear() === now.getFullYear()
        ) {
          toast({
            title: "Já completou hoje! ✨",
            description: "Volte amanhã para continuar sua sequência.",
          });
          setCompleting(null);
          return;
        }
      }

      if (existing) {
        const { error } = await supabase
          .from("user_challenges")
          .update({
            days_completed: existing.days_completed + 1,
            last_completed_at: now.toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;

        setUserChallenges((prev) => ({
          ...prev,
          [challengeId]: {
            ...existing,
            days_completed: existing.days_completed + 1,
            last_completed_at: now.toISOString(),
          },
        }));
      } else {
        const { data, error } = await supabase
          .from("user_challenges")
          .insert({
            user_id: session.user.id,
            challenge_id: challengeId,
            days_completed: 1,
            last_completed_at: now.toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        setUserChallenges((prev) => ({
          ...prev,
          [challengeId]: data,
        }));
      }

      triggerConfetti();
      toast({
        title: "Parabéns! 🎉",
        description: "Você completou seu desafio do dia!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível registrar o progresso.",
      });
    } finally {
      setCompleting(null);
    }
  };

  const isCompletedToday = (challengeId: string) => {
    const uc = userChallenges[challengeId];
    if (!uc?.last_completed_at) return false;

    const lastCompleted = new Date(uc.last_completed_at);
    const now = new Date();

    return (
      lastCompleted.getDate() === now.getDate() &&
      lastCompleted.getMonth() === now.getMonth() &&
      lastCompleted.getFullYear() === now.getFullYear()
    );
  };

  const isChallengeCompleted = (challenge: Challenge) => {
    const uc = userChallenges[challenge.id];
    return uc && uc.days_completed >= challenge.duration_days;
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (filter === "all") return true;
    if (filter === "completed") return isChallengeCompleted(challenge);
    if (filter === "active") return !isChallengeCompleted(challenge);
    return true;
  });

  const totalProgress = challenges.length > 0 
    ? challenges.reduce((acc, c) => {
        const uc = userChallenges[c.id];
        return acc + (uc?.days_completed || 0);
      }, 0)
    : 0;

  const totalDays = challenges.reduce((acc, c) => acc + c.duration_days, 0);
  const overallPercent = totalDays > 0 ? Math.round((totalProgress / totalDays) * 100) : 0;

  const activeStreaks = Object.values(userChallenges).filter((uc) => {
    if (!uc.last_completed_at) return false;
    const lastCompleted = new Date(uc.last_completed_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  }).length;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-28">
        {/* Background gradient enhancement */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-md mx-auto flex flex-col flex-1 px-5 pt-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <motion.div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/20 blur-lg" />
              <img src={logo} alt="Logo" className="relative w-10 h-10 object-contain" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-card-foreground">Desafios Mensais</h1>
              <p className="font-body text-muted-foreground text-sm">Complete desafios e ganhe recompensas</p>
            </div>
          </div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-card p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative p-3 rounded-xl bg-primary/15">
                  <div className="absolute inset-0 rounded-xl bg-gold/10 blur-md" />
                  <Trophy className="relative w-6 h-6 text-primary icon-glow" />
                </div>
                <div>
                  <p className="text-sm font-body text-muted-foreground">Progresso Total</p>
                  <p className="text-2xl font-heading font-bold text-card-foreground">{overallPercent}%</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-primary">
                  <Flame className="w-5 h-5 icon-glow" />
                  <span className="font-heading font-bold">{activeStreaks}</span>
                </div>
                <p className="text-xs font-body text-muted-foreground">Sequências ativas</p>
              </div>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full progress-gold rounded-full"
              />
            </div>
            <p className="text-xs font-body text-muted-foreground mt-2 text-center">
              {totalProgress} de {totalDays} dias completados
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "all", label: "Todos", icon: Target },
              { key: "active", label: "Ativos", icon: Flame },
              { key: "completed", label: "Concluídos", icon: Check },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                  filter === key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-gold/20"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Challenges List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
              />
            </div>
          ) : filteredChallenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="font-body text-muted-foreground">Nenhum desafio encontrado</p>
              <p className="text-sm font-body text-muted-foreground/70">Tente mudar o filtro</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredChallenges.map((challenge, index) => {
                  const Icon = iconMap[challenge.icon] || Sparkles;
                  const progress = userChallenges[challenge.id]?.days_completed || 0;
                  const progressPercent = Math.min((progress / challenge.duration_days) * 100, 100);
                  const completedToday = isCompletedToday(challenge.id);
                  const isFullyCompleted = isChallengeCompleted(challenge);

                  return (
                    <motion.div
                      key={challenge.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={`glass-card rounded-card p-5 ${
                        isFullyCompleted ? "border-2 border-green-500/40" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className={`relative p-3 rounded-xl ${
                            isFullyCompleted 
                              ? "bg-green-500/20" 
                              : "bg-primary/15"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isFullyCompleted && (
                            <div className="absolute inset-0 rounded-xl bg-green-500/20 blur-md" />
                          )}
                          {!isFullyCompleted && (
                            <div className="absolute inset-0 rounded-xl bg-gold/10 blur-md" />
                          )}
                          {isFullyCompleted ? (
                            <Trophy className="relative w-6 h-6 text-green-400" />
                          ) : (
                            <Icon className={`relative w-6 h-6 ${completedToday ? "text-green-400" : "text-primary icon-glow"}`} />
                          )}
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading font-semibold text-card-foreground">{challenge.title}</h3>
                            {isFullyCompleted && (
                              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-body font-medium">
                                Concluído
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-body text-muted-foreground mb-3">{challenge.description}</p>

                          {/* Enhanced Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="font-body text-card-foreground font-medium">
                                {progress}/{challenge.duration_days} dias
                              </span>
                              <span className={`font-heading font-bold ${
                                isFullyCompleted ? "text-green-400" : "text-primary"
                              }`}>
                                {Math.round(progressPercent)}%
                              </span>
                            </div>
                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                                className={`h-full rounded-full ${
                                  isFullyCompleted 
                                    ? "progress-success" 
                                    : "progress-gold"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Complete Button with state changes */}
                          {!isFullyCompleted && (
                            <Button
                              onClick={() => handleComplete(challenge.id)}
                              disabled={completedToday || completing === challenge.id}
                              className={`w-full h-12 font-heading font-semibold text-sm transition-all ${
                                completedToday
                                  ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/25"
                                  : "btn-gold text-primary-foreground"
                              }`}
                            >
                              {completing === challenge.id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                                />
                              ) : completedToday ? (
                                <motion.div 
                                  className="flex items-center gap-2"
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                >
                                  <Check className="w-5 h-5" />
                                  <span>Feito hoje!</span>
                                  <motion.span
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                  >
                                    ✨
                                  </motion.span>
                                </motion.div>
                              ) : (
                                <>
                                  <Target className="w-5 h-5 mr-2" />
                                  Marcar como feito
                                </>
                              )}
                            </Button>
                          )}

                          {isFullyCompleted && (
                            <motion.div 
                              className="flex items-center justify-center gap-2 py-3 text-green-400"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Trophy className="w-5 h-5" />
                              <span className="font-heading font-semibold">Desafio Concluído!</span>
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                🎉
                              </motion.span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <BottomNavVIP
          active="challenges"
          onNavigate={(item) => {
            if (item === "home") navigate("/dashboard");
            else if (item === "calculator") navigate("/calculadora");
            else if (item === "coach") navigate("/coach");
            else if (item === "recipes") navigate("/recetas");
          }}
        />
      </div>
    </PageTransition>
  );
};

export default Desafios;
