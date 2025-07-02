import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewMode = 'user' | 'admin';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [showWelcome, setShowWelcome] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Credenciais do administrador
  const ADMIN_CREDENTIALS = {
    username: 'marcos',
    password: '12345678'
  };

  // Show welcome modal on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBirthdayApp');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisitedBirthdayApp', 'true');
    }

    // Check if user was authenticated previously
    const wasAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (wasAuthenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setViewMode('user');
  };

  // Override setViewMode to check authentication for admin mode
  const handleSetViewMode = (mode: ViewMode) => {
    if (mode === 'admin' && !isAuthenticated) {
      // Don't switch to admin mode if not authenticated
      // The login modal will be handled by the component
      return;
    }
    setViewMode(mode);
  };

  return (
    <AppContext.Provider value={{ 
      viewMode, 
      setViewMode: handleSetViewMode, 
      showWelcome, 
      setShowWelcome,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
