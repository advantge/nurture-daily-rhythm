import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VIPContextType {
  isVip: boolean;
  setIsVip: (value: boolean) => void;
  showUpsellModal: boolean;
  setShowUpsellModal: (value: boolean) => void;
  refreshVIPStatus: () => Promise<void>;
}

const VIPContext = createContext<VIPContextType | undefined>(undefined);

export const VIPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVip, setIsVip] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const refreshVIPStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsVip(false);
        localStorage.removeItem('isVip');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_vip')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.is_vip) {
        setIsVip(true);
        localStorage.setItem('isVip', 'true');
      } else {
        // Check localStorage as fallback (for simulated VIP during development)
        const localVip = localStorage.getItem('isVip');
        setIsVip(localVip === 'true');
      }
    } catch (error) {
      console.error('Error fetching VIP status:', error);
      // Fallback to localStorage
      const localVip = localStorage.getItem('isVip');
      setIsVip(localVip === 'true');
    }
  };

  useEffect(() => {
    refreshVIPStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshVIPStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isVip', isVip.toString());
  }, [isVip]);

  return (
    <VIPContext.Provider value={{ isVip, setIsVip, showUpsellModal, setShowUpsellModal, refreshVIPStatus }}>
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
