import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/logo-gelatina-bariatrica.png";

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
}

export const Header = ({ userName = "Usuário", avatarUrl }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <img 
          src={logo} 
          alt="Gelatina Bariátrica" 
          className="w-12 h-12 object-contain"
        />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Gelatina Bariátrica
          </span>
          <span className="text-base font-semibold text-card-foreground">
            Olá, {userName}
          </span>
        </div>
      </div>
      <Avatar className="h-10 w-10 border-2 border-primary/30 shadow-lg">
        <AvatarImage src={avatarUrl} alt={userName} />
        <AvatarFallback className="bg-accent text-accent-foreground font-medium">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </header>
  );
};
