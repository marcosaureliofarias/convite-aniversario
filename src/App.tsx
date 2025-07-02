import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ViewToggle } from './components/ViewToggle';
import { WelcomeModal } from './components/WelcomeModal';
import { UserView } from './views/UserView';
import { AdminView } from './views/AdminView';

const AppContent: React.FC = () => {
  const { viewMode, showWelcome, setShowWelcome, isAuthenticated, setViewMode } = useApp();

  // Redirect to user view if trying to access admin without authentication
  React.useEffect(() => {
    if (viewMode === 'admin' && !isAuthenticated) {
      setViewMode('user');
    }
  }, [viewMode, isAuthenticated, setViewMode]);

  return (
    <div className="relative">
      <ViewToggle />
      {viewMode === 'user' ? <UserView /> : <AdminView />}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;