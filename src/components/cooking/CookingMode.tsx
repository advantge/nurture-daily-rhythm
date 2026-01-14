import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Timer, Check, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import confetti from "canvas-confetti";

interface CookingModeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
}

interface Step {
  id: number;
  title: string;
  description: string;
  timerSeconds?: number;
  tip?: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: "1", name: "Gelatina sin sabor", amount: "1 sobre (7g)", checked: false },
  { id: "2", name: "Agua fría", amount: "1/4 taza", checked: false },
  { id: "3", name: "Agua caliente", amount: "1 taza", checked: false },
  { id: "4", name: "Limón (jugo)", amount: "2 cucharadas", checked: false },
  { id: "5", name: "Miel o stevia", amount: "Al gusto", checked: false },
  { id: "6", name: "Hojas de menta", amount: "Para decorar", checked: false },
];

const STEPS: Step[] = [
  {
    id: 1,
    title: "Hidratar la gelatina",
    description: "Coloca el sobre de gelatina sin sabor en 1/4 taza de agua fría. Deja reposar por 5 minutos hasta que se hidrate y forme una masa esponjosa.",
    timerSeconds: 300, // 5 minutes
    tip: "No revuelvas la gelatina mientras se hidrata",
  },
  {
    id: 2,
    title: "Disolver la gelatina",
    description: "Calienta 1 taza de agua hasta que hierva. Agrega la gelatina hidratada y revuelve constantemente hasta que se disuelva por completo.",
    tip: "Revuelve en movimientos circulares para evitar grumos",
  },
  {
    id: 3,
    title: "Agregar sabor",
    description: "Retira del fuego y añade el jugo de limón fresco y la miel o stevia al gusto. Mezcla bien para integrar todos los sabores.",
    tip: "El limón aporta vitamina C y mejora la absorción del colágeno",
  },
  {
    id: 4,
    title: "Refrigerar",
    description: "Vierte la mezcla en un molde o recipiente de tu preferencia. Refrigera por al menos 3 horas hasta que esté firme.",
    timerSeconds: 180, // 3 minutes demo (would be 3 hours in real)
    tip: "Decora con hojas de menta antes de servir",
  },
];

const CookingMode = ({ isOpen, onClose, onComplete }: CookingModeProps) => {
  const [currentView, setCurrentView] = useState<"ingredients" | "steps" | "complete">("ingredients");
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState(INGREDIENTS);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const allIngredientsChecked = ingredients.every((i) => i.checked);
  const progressPercentage = currentView === "ingredients" 
    ? 0 
    : currentView === "complete" 
      ? 100 
      : ((currentStep + 1) / STEPS.length) * 100;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && !timerPaused && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            // Play sound or vibrate when timer ends
            if ("vibrate" in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, timerPaused, remainingSeconds]);

  const toggleIngredient = (id: string) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id ? { ...ing, checked: !ing.checked } : ing
      )
    );
  };

  const startTimer = (seconds: number) => {
    setRemainingSeconds(seconds);
    setTimerActive(true);
    setTimerPaused(false);
  };

  const toggleTimerPause = () => {
    setTimerPaused((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setTimerActive(false);
      setRemainingSeconds(0);
    } else {
      triggerCompletion();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setTimerActive(false);
      setRemainingSeconds(0);
    }
  };

  const triggerCompletion = useCallback(() => {
    setCurrentView("complete");
    
    // Golden confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const goldColors = ["#FFD700", "#FFA500", "#FFDF00", "#F4C430", "#DAA520"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: goldColors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: goldColors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
    
    // Call onComplete after animation
    setTimeout(() => {
      onComplete();
    }, 2000);
  }, [onComplete]);

  const handleClose = () => {
    setCurrentView("ingredients");
    setCurrentStep(0);
    setIngredients(INGREDIENTS);
    setTimerActive(false);
    setRemainingSeconds(0);
    onClose();
  };

  const currentStepData = STEPS[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg h-[90vh] bg-gradient-to-b from-[#0a0a0a] to-[#111] rounded-t-3xl overflow-hidden flex flex-col"
          >
            {/* Glass effect header */}
            <div className="relative px-6 pt-6 pb-4">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Progress indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading text-xl font-bold text-gold-gradient">
                    {currentView === "ingredients" 
                      ? "Ingredientes" 
                      : currentView === "complete"
                        ? "¡Completado!"
                        : `Paso ${currentStep + 1} de ${STEPS.length}`}
                  </h2>
                  <span className="text-sm text-white/60 font-body">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-white/10" />
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-6 pb-32">
              <AnimatePresence mode="wait">
                {/* Ingredients View */}
                {currentView === "ingredients" && (
                  <motion.div
                    key="ingredients"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-white/70 font-body text-sm mb-6">
                      Marca los ingredientes que ya tienes listos antes de comenzar.
                    </p>

                    <div className="space-y-3">
                      {ingredients.map((ingredient) => (
                        <motion.div
                          key={ingredient.id}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                            ingredient.checked
                              ? "bg-gold/10 border-gold/30"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                          onClick={() => toggleIngredient(ingredient.id)}
                        >
                          <Checkbox
                            checked={ingredient.checked}
                            className="w-6 h-6 border-2 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <div className="flex-1">
                            <span className={`font-body font-medium ${ingredient.checked ? "text-gold" : "text-white"}`}>
                              {ingredient.name}
                            </span>
                          </div>
                          <span className="text-white/50 font-body text-sm">
                            {ingredient.amount}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Steps View */}
                {currentView === "steps" && (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Step Title */}
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                        <span className="text-2xl font-heading font-bold text-gold">
                          {currentStep + 1}
                        </span>
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-white mb-2">
                        {currentStepData.title}
                      </h3>
                    </div>

                    {/* Step Description */}
                    <p className="text-white/80 font-body text-lg leading-relaxed text-center">
                      {currentStepData.description}
                    </p>

                    {/* Timer Section */}
                    {currentStepData.timerSeconds && (
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex flex-col items-center gap-4">
                          <Timer className="w-8 h-8 text-gold" />
                          
                          {!timerActive && remainingSeconds === 0 ? (
                            <Button
                              onClick={() => startTimer(currentStepData.timerSeconds!)}
                              className="btn-gold text-black font-heading font-semibold px-8 py-3 rounded-full"
                            >
                              <Timer className="w-5 h-5 mr-2" />
                              Iniciar Cronómetro
                            </Button>
                          ) : (
                            <div className="flex flex-col items-center gap-4">
                              <span className="font-heading text-4xl font-bold text-gold text-glow">
                                {formatTime(remainingSeconds)}
                              </span>
                              
                              <div className="flex gap-3">
                                <Button
                                  onClick={toggleTimerPause}
                                  variant="outline"
                                  className="border-gold/50 text-gold hover:bg-gold/10"
                                >
                                  {timerPaused ? (
                                    <>
                                      <Play className="w-4 h-4 mr-2" />
                                      Reanudar
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="w-4 h-4 mr-2" />
                                      Pausar
                                    </>
                                  )}
                                </Button>
                              </div>

                              {remainingSeconds === 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-2 text-green-400"
                                >
                                  <Check className="w-6 h-6" />
                                  <span className="font-body font-medium">¡Tiempo completado!</span>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tip */}
                    {currentStepData.tip && (
                      <div className="bg-gold/10 rounded-2xl p-4 border border-gold/20">
                        <p className="text-gold font-body text-sm">
                          💡 <strong>Tip:</strong> {currentStepData.tip}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Completion View */}
                {currentView === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mb-8 shadow-gold-lg"
                    >
                      <Check className="w-16 h-16 text-black" />
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="font-heading text-3xl font-bold text-gold-gradient mb-4"
                    >
                      ¡Misión Cumplida!
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-white/70 font-body text-lg mb-8"
                    >
                      Tu gelatina está en camino. <br />
                      Has completado tu rutina del día. 🌟
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button
                        onClick={handleClose}
                        className="btn-gold text-black font-heading font-semibold px-8 py-4 rounded-full text-lg"
                      >
                        Volver al inicio
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fixed bottom navigation */}
            {currentView !== "complete" && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
                <div className="flex gap-4">
                  {currentView === "steps" && (
                    <Button
                      onClick={handlePrevStep}
                      variant="outline"
                      className="flex-1 py-6 rounded-2xl border-white/20 text-white hover:bg-white/10 font-heading"
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Anterior
                    </Button>
                  )}

                  <Button
                    onClick={
                      currentView === "ingredients"
                        ? () => setCurrentView("steps")
                        : handleNextStep
                    }
                    className="flex-1 btn-gold text-black py-6 rounded-2xl font-heading font-semibold"
                    disabled={currentView === "ingredients" && !allIngredientsChecked}
                  >
                    {currentView === "ingredients" ? (
                      <>
                        Comenzar
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    ) : currentStep === STEPS.length - 1 ? (
                      <>
                        Finalizar
                        <Check className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookingMode;
