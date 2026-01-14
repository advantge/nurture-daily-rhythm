import React, { useState } from 'react';
import { type LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  indicatorPosition: number;
  position: number;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label,
  isActive = false, 
  onClick,
  indicatorPosition,
  position
}) => {
  const distance = Math.abs(indicatorPosition - position);
  const spotlightOpacity = isActive ? 1 : Math.max(0, 1 - distance * 0.6);

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 px-4 py-2 transition-all duration-300"
    >
      {/* Spotlight glow effect */}
      <div 
        className="absolute inset-0 rounded-xl transition-all duration-300"
        style={{
          background: isActive 
            ? 'radial-gradient(ellipse at center, rgba(202, 138, 4, 0.25) 0%, transparent 70%)'
            : 'transparent',
          opacity: spotlightOpacity,
        }}
      />
      
      {/* Active indicator border */}
      {isActive && (
        <div className="absolute inset-1 rounded-xl border-2 border-yellow-500/80 transition-all duration-300" />
      )}
      
      {/* Icon */}
      <Icon 
        className={`w-5 h-5 relative z-10 transition-colors duration-300 ${
          isActive ? 'text-yellow-500' : 'text-zinc-500'
        }`}
      />
      
      {/* Label */}
      <span 
        className={`text-xs font-medium relative z-10 transition-colors duration-300 ${
          isActive ? 'text-yellow-500' : 'text-zinc-500'
        }`}
      >
        {label}
      </span>
    </button>
  );
};

interface SpotlightNavProps {
  items: { icon: LucideIcon; label: string; id: string }[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export const SpotlightNav: React.FC<SpotlightNavProps> = ({ 
  items, 
  activeId, 
  onNavigate 
}) => {
  const activeIndex = items.findIndex(item => item.id === activeId);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50">
      <div className="max-w-md mx-auto px-2 py-2 flex justify-around items-center relative">
        {/* Background spotlight glow */}
        <div 
          className="absolute h-full w-16 transition-all duration-500 ease-out pointer-events-none"
          style={{
            left: `calc(${(activeIndex / items.length) * 100}% + ${100 / items.length / 2}% - 32px)`,
            background: 'radial-gradient(ellipse at center bottom, rgba(202, 138, 4, 0.15) 0%, transparent 60%)',
          }}
        />

        {items.map((item, index) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeId === item.id}
            onClick={() => onNavigate(item.id)}
            indicatorPosition={activeIndex}
            position={index}
          />
        ))}
      </div>
    </nav>
  );
};

export default SpotlightNav;
