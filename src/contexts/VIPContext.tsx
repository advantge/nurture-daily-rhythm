import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VIPContextType {
  isVip: boolean;
  setIsVip: (value: boolean) => void;
  showUpsellModal: boolean;
  setShowUpsellModal: (value: boolean) => void;
}

const VIPContext = createContext<VIPContextType | undefined>(undefined);

export const VIPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVip, setIsVip] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  useEffect(() => {
    // Check VIP status from localStorage (simulated for now)
    const vipStatus = localStorage.getItem('isVip');
    if (vipStatus === 'true') {
      setIsVip(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isVip', isVip.toString());
  }, [isVip]);

  return (
    <VIPContext.Provider value={{ isVip, setIsVip, showUpsellModal, setShowUpsellModal }}>
      {children}
    </VIPContext.Provider>
  );
};

export const useVIP = () => {
  const context = useContext(VIPContext);
  if (!context) {
    throw new Error('useVIP must be used within a VIPProvider');
  }
  return context;
};
