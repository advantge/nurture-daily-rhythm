import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Mail, Lock, User, Eye, EyeOff, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  testimonials: Testimonial[];
  onSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignUp?: (e: React.FormEvent<HTMLFormElement>) => void;
  onResetPassword?: () => void;
  loading?: boolean;
  formData: {
    email: string;
    password: string;
    firstName: string;
  };
  setFormData: (data: { email: string; password: string; firstName: string }) => void;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4 }}
    className="glass-card rounded-2xl p-6 max-w-sm mx-auto"
  >
    <Quote className="w-8 h-8 text-gold/40 mb-4" />
    <p className="text-foreground/90 text-sm leading-relaxed mb-6">
      "{testimonial.text}"
    </p>
    <div className="flex items-center gap-3">
      <img
        src={testimonial.avatarSrc}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full object-cover border-2 border-gold/30"
      />
      <div>
        <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
        <p className="text-muted-foreground text-xs">{testimonial.handle}</p>
      </div>
    </div>
  </motion.div>
);

export const SignInPage = ({
  testimonials,
  onSignIn,
  onSignUp,
  onResetPassword,
  loading = false,
  formData,
  setFormData,
}: SignInPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      onSignIn(e);
    } else if (onSignUp) {
      onSignUp(e);
    } else {
      onSignIn(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Testimonials */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              className="inline-block mb-4"
            >
              <Crown className="w-12 h-12 text-gold gold-glow mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gold-gradient mb-2">
              Lo que dicen nuestras VIPs
            </h2>
            <p className="text-muted-foreground text-sm">
              Únete a miles de mujeres transformando su vida
            </p>
          </div>

          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentTestimonial}
              testimonial={testimonials[currentTestimonial]}
            />
          </AnimatePresence>

          {/* Navigation dots and arrows */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gold w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Logo for mobile */}
          <div className="text-center mb-8 lg:mb-10">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <Crown className="w-14 h-14 text-gold gold-glow mx-auto" />
            </motion.div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gold-gradient text-glow">
              VIP Wellness
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {isLogin ? "Bienvenida de vuelta" : "Crea tu cuenta VIP"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                <label className="text-sm text-muted-foreground">Nombre</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="pl-12 bg-secondary/50 border-border/50 focus:border-gold h-12"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 bg-secondary/50 border-border/50 focus:border-gold h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Contraseña</label>
                {isLogin && onResetPassword && (
                  <button
                    type="button"
                    onClick={onResetPassword}
                    className="text-xs text-gold hover:text-gold-light transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 pr-12 bg-secondary/50 border-border/50 focus:border-gold h-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 btn-gold text-primary-foreground font-semibold text-base"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                isLogin ? "Iniciar Sesión" : "Crear Cuenta"
              )}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-6 text-muted-foreground text-sm">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold hover:text-gold-light transition-colors font-medium"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>

          {/* Mobile testimonial */}
          <div className="lg:hidden mt-10">
            <div className="border-t border-border/30 pt-8">
              <AnimatePresence mode="wait">
                <TestimonialCard
                  key={currentTestimonial}
                  testimonial={testimonials[currentTestimonial]}
                />
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-gold w-6"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
