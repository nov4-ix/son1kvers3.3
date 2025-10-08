import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  clickCount: number;
  resetClickCount: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    // Cargar tema desde localStorage
    const savedTheme = localStorage.getItem('son1kvers3-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema al documento
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    
    // Guardar en localStorage
    localStorage.setItem('son1kvers3-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const now = Date.now();
    
    // Resetear contador si han pasado más de 2 segundos
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);
    
    // Si son 5 clicks rápidos, activar ritual de Nexus
    if (clickCount >= 4) { // 4 porque ya se incrementó arriba
      // Disparar evento personalizado para el ritual
      window.dispatchEvent(new CustomEvent('nexus-ritual-triggered', {
        detail: { source: 'mobile-theme-button' }
      }));
      setClickCount(0);
      return;
    }
    
    // Cambio normal de tema
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const resetClickCount = () => {
    setClickCount(0);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, clickCount, resetClickCount }}>
      {children}
    </ThemeContext.Provider>
  );
};
