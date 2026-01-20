import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Users, Shield, Search, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  user_id: string;
  first_name: string | null;
  is_vip: boolean | null;
  vip_purchased_at: string | null;
  avatar_url: string | null;
}

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  profile: UserProfile | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check admin role via edge function (it validates server-side)
      const { data, error } = await supabase.functions.invoke("admin-users?action=list");

      // If we can list users, we're admin
      if (!error && data?.users) {
        setIsAdmin(true);
        setUsers(data.users);
      } else {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão de administrador.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-users?action=list");

      if (error) throw error;
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      });
    }
  };

  const toggleVIP = async (userId: string, currentVipStatus: boolean) => {
    setUpdatingUser(userId);
    try {
      const { error } = await supabase.functions.invoke("admin-users?action=toggle-vip", {
        body: { targetUserId: userId, isVip: !currentVipStatus },
      });

      if (error) throw error;

      // Update local state
      setUsers(prev =>
        prev.map(u =>
          u.id === userId
            ? {
                ...u,
                profile: {
                  ...u.profile,
                  user_id: userId,
                  first_name: u.profile?.first_name || null,
                  avatar_url: u.profile?.avatar_url || null,
                  is_vip: !currentVipStatus,
                  vip_purchased_at: !currentVipStatus ? new Date().toISOString() : null,
                },
              }
            : u
        )
      );

      toast({
        title: "Sucesso",
        description: `Status VIP ${!currentVipStatus ? "ativado" : "desativado"} com sucesso.`,
      });
    } catch (error) {
      console.error("Error toggling VIP:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status VIP.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold" />
            <h1 className="text-xl font-heading font-bold text-foreground">
              Painel Admin
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Usuários</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-card border border-gold/30"
            style={{ boxShadow: "0 0 20px rgba(218, 165, 32, 0.1)" }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold/20">
                <Crown className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gold">
                  {users.filter(u => u.profile?.is_vip).length}
                </p>
                <p className="text-xs text-muted-foreground">Usuários VIP</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email ou nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl bg-card border transition-all ${
                user.profile?.is_vip
                  ? "border-gold/40"
                  : "border-border/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {user.profile?.first_name || "Sem nome"}
                    </p>
                    {user.profile?.is_vip && (
                      <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Cadastrado: {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant={user.profile?.is_vip ? "outline" : "default"}
                  onClick={() => toggleVIP(user.id, user.profile?.is_vip || false)}
                  disabled={updatingUser === user.id}
                  className={
                    user.profile?.is_vip
                      ? "border-destructive/50 text-destructive hover:bg-destructive/10"
                      : "bg-gold hover:bg-gold/90 text-primary-foreground"
                  }
                >
                  {updatingUser === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : user.profile?.is_vip ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Remover
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-1" />
                      Ativar VIP
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
