import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Ruler, Scale, Circle, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/PageTransition";
import { BottomNavVIP } from "@/components/dashboard/BottomNavVIP";

type Gender = "female" | "male";

interface FormData {
  gender: Gender;
  height: string;
  weight: string;
  neck: string;
  waist: string;
  hip: string;
}

const steps = [
  { id: 1, title: "Género", icon: Circle },
  { id: 2, title: "Altura y Peso", icon: Ruler },
  { id: 3, title: "Medidas", icon: Scale },
  { id: 4, title: "Resultado", icon: Check },
];

const Calculadora = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    gender: "female",
    height: "",
    weight: "",
    neck: "",
    waist: "",
    hip: "",
  });

  // Navy Seal Body Fat Formula
  const calculateBodyFat = () => {
    const height = parseFloat(formData.height);
    const waist = parseFloat(formData.waist);
    const neck = parseFloat(formData.neck);
    const hip = parseFloat(formData.hip);

    if (formData.gender === "female") {
      // Women: %BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
      const bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
      return Math.max(0, Math.min(100, bodyFat));
    } else {
      // Men: %BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
      const bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
      return Math.max(0, Math.min(100, bodyFat));
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      setLoading(true);
      try {
        const bodyFat = calculateBodyFat();
        setResult(bodyFat);

        // Save to database
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from("body_measurements").insert({
            user_id: session.user.id,
            height_cm: parseFloat(formData.height),
            weight_kg: parseFloat(formData.weight),
            neck_cm: parseFloat(formData.neck),
            waist_cm: parseFloat(formData.waist),
            hip_cm: formData.gender === "female" ? parseFloat(formData.hip) : null,
            body_fat_percentage: bodyFat,
          });
        }

        setCurrentStep(4);
        toast({
          title: "¡Cálculo completado! 📊",
          description: "Tus medidas han sido guardadas.",
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo guardar el resultado.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.height && formData.weight;
      case 3:
        if (formData.gender === "female") {
          return formData.neck && formData.waist && formData.hip;
        }
        return formData.neck && formData.waist;
      default:
        return true;
    }
  };

  const getBodyFatCategory = (bf: number, gender: Gender) => {
    if (gender === "female") {
      if (bf < 14) return { label: "Esencial", color: "text-blue-400" };
      if (bf < 21) return { label: "Atlético", color: "text-green-400" };
      if (bf < 25) return { label: "Fitness", color: "text-gold" };
      if (bf < 32) return { label: "Promedio", color: "text-orange-400" };
      return { label: "Por mejorar", color: "text-red-400" };
    } else {
      if (bf < 6) return { label: "Esencial", color: "text-blue-400" };
      if (bf < 14) return { label: "Atlético", color: "text-green-400" };
      if (bf < 18) return { label: "Fitness", color: "text-gold" };
      if (bf < 25) return { label: "Promedio", color: "text-orange-400" };
      return { label: "Por mejorar", color: "text-red-400" };
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-28">
        <div className="w-full max-w-md mx-auto flex flex-col flex-1 px-5 pt-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={handleBack} className="p-2 -ml-2 text-muted-foreground hover:text-gold transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Calculadora de Medidas</h1>
              <p className="text-muted-foreground text-sm">Fórmula Navy Seal</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                    backgroundColor: currentStep >= step.id ? "hsl(45 100% 50%)" : "hsl(0 0% 15%)",
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <step.icon className={`w-5 h-5 ${currentStep >= step.id ? "text-black" : "text-muted-foreground"}`} />
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? "bg-gold" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {currentStep === 1 && (
                <div className="glass-card rounded-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Selecciona tu género</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {(["female", "male"] as const).map((gender) => (
                      <motion.button
                        key={gender}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, gender })}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          formData.gender === gender
                            ? "border-gold bg-gold/10"
                            : "border-border bg-secondary/30 hover:border-gold/50"
                        }`}
                      >
                        <div className="text-4xl mb-2">{gender === "female" ? "👩" : "👨"}</div>
                        <div className={`font-medium ${formData.gender === gender ? "text-gold" : "text-white"}`}>
                          {gender === "female" ? "Mujer" : "Hombre"}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="glass-card rounded-card p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Altura y Peso</h2>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Altura (cm)</label>
                    <Input
                      type="number"
                      placeholder="165"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="bg-secondary/50 border-border/50 focus:border-gold h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Peso (kg)</label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="bg-secondary/50 border-border/50 focus:border-gold h-12 text-lg"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="glass-card rounded-card p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Medidas corporales</h2>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Cuello (cm)</label>
                    <Input
                      type="number"
                      placeholder="35"
                      value={formData.neck}
                      onChange={(e) => setFormData({ ...formData, neck: e.target.value })}
                      className="bg-secondary/50 border-border/50 focus:border-gold h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Cintura (cm)</label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      className="bg-secondary/50 border-border/50 focus:border-gold h-12 text-lg"
                    />
                  </div>

                  {formData.gender === "female" && (
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Cadera (cm)</label>
                      <Input
                        type="number"
                        placeholder="95"
                        value={formData.hip}
                        onChange={(e) => setFormData({ ...formData, hip: e.target.value })}
                        className="bg-secondary/50 border-border/50 focus:border-gold h-12 text-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && result !== null && (
                <div className="glass-card rounded-card p-6 text-center">
                  <h2 className="text-lg font-semibold text-white mb-6">Tu resultado</h2>
                  
                  {/* Animated Gauge */}
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="hsl(0 0% 15%)"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="hsl(45 100% 50%)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={553}
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 - (553 * Math.min(result, 50)) / 50 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-4xl font-bold text-gold-gradient text-glow"
                      >
                        {result.toFixed(1)}%
                      </motion.span>
                      <span className="text-muted-foreground text-sm">Grasa corporal</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <span className={`text-lg font-semibold ${getBodyFatCategory(result, formData.gender).color}`}>
                      {getBodyFatCategory(result, formData.gender).label}
                    </span>
                  </motion.div>

                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="mt-8 btn-gold text-primary-foreground font-semibold px-8"
                  >
                    Volver al inicio
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="mt-auto pt-6">
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="w-full h-14 btn-gold text-primary-foreground font-semibold text-base"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {currentStep === 3 ? "Calcular" : "Siguiente"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <BottomNavVIP active="calculator" onNavigate={(item) => {
          if (item === "home") navigate("/dashboard");
          else if (item === "coach") navigate("/coach");
          else if (item === "challenges") navigate("/desafios");
        }} />
      </div>
    </PageTransition>
  );
};

export default Calculadora;