import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Crown,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/PageTransition";
import { BottomNavVIP } from "@/components/dashboard/BottomNavVIP";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVIP } from "@/contexts/VIPContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Perfil = () => {
  const navigate = useNavigate();
  const { isVip, setShowUpsellModal } = useVIP();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: "",
    email: "",
    avatarUrl: "",
  });
  
  const [editForm, setEditForm] = useState({
    firstName: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setProfile(prev => ({
        ...prev,
        email: session.user.email || "",
      }));

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, avatar_url")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(prev => ({
          ...prev,
          firstName: profileData.first_name || "",
          avatarUrl: profileData.avatar_url || "",
        }));
        setEditForm({
          firstName: profileData.first_name || "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editForm.firstName,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        firstName: editForm.firstName,
      }));

      setEditModalOpen(false);
      toast({
        title: "Perfil actualizado ✨",
        description: "Tus cambios han sido guardados.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar los cambios.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
        navigate("/recetas");
        break;
      case "profile":
        break;
    }
  };

  const menuItems = [
    { icon: Bell, label: "Notificaciones", action: () => toast({ title: "Próximamente", description: "Configuración de notificaciones llegará pronto." }) },
    { icon: Shield, label: "Privacidad y Seguridad", action: () => toast({ title: "Próximamente", description: "Configuración de privacidad llegará pronto." }) },
    { icon: HelpCircle, label: "Ayuda y Soporte", action: () => toast({ title: "Próximamente", description: "Centro de ayuda llegará pronto." }) },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-28">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-md mx-auto flex flex-col flex-1 px-5 pt-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-card-foreground">Mi Perfil</h1>
              <p className="font-body text-muted-foreground text-sm">Gestiona tu cuenta</p>
            </div>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-card p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-gold/30">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
                {/* VIP Badge */}
                {isVip && (
                  <div className="absolute -top-1 -left-1 p-1.5 rounded-full bg-gold shadow-lg" style={{
                    boxShadow: "0 0 12px rgba(218, 165, 32, 0.6)",
                  }}>
                    <Crown className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-heading font-bold text-card-foreground">
                    {profile.firstName || "Usuario"}
                  </h2>
                  {isVip && (
                    <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-heading font-semibold border border-gold/30">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-body">{profile.email}</p>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setEditModalOpen(true)}
              variant="outline"
              className="w-full mt-4 border-gold/30 text-card-foreground hover:bg-gold/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </motion.div>

          {/* VIP Upgrade Card (only if not VIP) */}
          {!isVip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUpsellModal(true)}
              className="relative overflow-hidden rounded-card p-5 mb-6 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(218, 165, 32, 0.2) 0%, rgba(218, 165, 32, 0.05) 100%)",
                border: "1px solid rgba(218, 165, 32, 0.4)",
                boxShadow: "0 0 30px rgba(218, 165, 32, 0.1)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="relative p-3 rounded-xl bg-gold/20">
                  <div className="absolute inset-0 rounded-xl bg-gold/10 blur-md" />
                  <Crown className="relative w-7 h-7 text-gold" style={{
                    filter: "drop-shadow(0 0 8px rgba(218, 165, 32, 0.6))",
                  }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-card-foreground">
                    ¡Hazte VIP!
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Desbloquea todas las funciones premium
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
            </motion.div>
          )}

          {/* Menu Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-card overflow-hidden mb-6"
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors border-b border-border/30 last:border-0"
              >
                <div className="p-2 rounded-xl bg-secondary">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="flex-1 text-left font-body text-card-foreground">
                  {item.label}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </motion.div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavVIP active="profile" onNavigate={handleNavigate} />

        {/* Edit Profile Dialog */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading text-card-foreground">
                Editar Perfil
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-body text-muted-foreground">
                  Nombre
                </label>
                <Input
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  placeholder="Tu nombre"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-body text-muted-foreground">
                  Email
                </label>
                <Input
                  value={profile.email}
                  disabled
                  className="bg-secondary/50 border-border text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  El email no puede ser modificado
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn-gold"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Perfil;
