import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WelcomeBar from './components/WelcomeBar';
import StatsCards from './components/StatsCards';
import AssistantGrid from './components/AssistantGrid';
import MobileMenu from './components/MobileMenu';
import Training from './components/Training';
import { useUser } from '../../hooks/useUser';

type ActiveScreen = 'dashboard' | 'training';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1370);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const { userData, loading } = useUser();
  
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1370);
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScreenChange = (screen: ActiveScreen) => {
    setActiveScreen(screen);
  };

  const renderContent = () => {
    switch (activeScreen) {
      case 'training':
        return <Training />;
      default:
        return (
          <>
            <WelcomeBar userName={userData?.user_nome || 'Carregando...'} />
            <StatsCards />
            <AssistantGrid />
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {!isMobile && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userName={userData?.user_nome || 'Carregando...'}
          userProfile={userData?.user_perfil}
          activeScreen={activeScreen}
          setActiveScreen={handleScreenChange}
        />
      )}
      
      <main 
        className={`flex-1 transition-all duration-300 overflow-x-hidden ${
          !isMobile ? (isSidebarCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'
        }`}
      >
        <div className={`py-4 md:py-6 lg:py-8 space-y-6 md:space-y-8 ${isMobile ? 'pb-24' : ''}`}>
          {renderContent()}
        </div>
      </main>

      {isMobile && (
        <MobileMenu 
          userName={userData?.user_nome || 'Carregando...'}
          userProfile={userData?.user_perfil}
          activeScreen={activeScreen}
          setActiveScreen={handleScreenChange}
        />
      )}
    </div>
  );
};

export default Dashboard;