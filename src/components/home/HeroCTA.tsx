import logo from "@/assets/logo-gelatina-bariatrica.png";

interface HeroCTAProps {
  onClick?: () => void;
}

export const HeroCTA = ({ onClick }: HeroCTAProps) => {
  return (
    <button
      onClick={onClick}
      className="btn-hero w-full py-8 px-6 flex flex-col items-center gap-3 cursor-pointer group"
    >
      <div className="animate-float">
        <img 
          src={logo} 
          alt="Gelatina Bariátrica" 
          className="w-28 h-28 object-contain drop-shadow-lg"
        />
      </div>
      <span className="text-lg font-bold text-primary tracking-wide uppercase">
        PREPARAR MINHA DOSE
      </span>
    </button>
  );
};
