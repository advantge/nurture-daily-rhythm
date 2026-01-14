import { Home, Utensils, BarChart3, User } from "lucide-react";

type NavItem = "home" | "receitas" | "progresso" | "perfil";

interface BottomNavProps {
  active?: NavItem;
  onNavigate?: (item: NavItem) => void;
}

const navItems: { id: NavItem; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "receitas", label: "Recetas", icon: Utensils },
  { id: "progresso", label: "Progreso", icon: BarChart3 },
  { id: "perfil", label: "Perfil", icon: User },
];

export const BottomNav = ({ active = "home", onNavigate }: BottomNavProps) => {
  return (
    <nav className="nav-bottom fixed bottom-0 left-0 right-0 px-4 py-3 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate?.(id)}
              className={`relative flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "text-[#4A9F4A]" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#4A9F4A] rounded-full" />
              )}
              <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
