import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DaoPage from './pages/DaoPage';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import CreateProjectPage from './pages/CreateProjectPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserGuide from './components/UserGuide';
import GuideButton from './components/GuideButton';
import { guideConfig } from './guideConfig';

const AppContent: React.FC = () => {
    const location = useLocation();
    const [activeGuide, setActiveGuide] = useState<string | null>(null);

    const pathParts = location.pathname.split('/');
    const guideKey = pathParts[1] === 'project' ? 'project' : pathParts[1] || 'explore';

    useEffect(() => {
        const hasViewed = localStorage.getItem(`guide_${guideKey}_viewed`);
        if (!hasViewed && guideConfig[guideKey]) {
            // Delay to allow page content to render
            const timer = setTimeout(() => setActiveGuide(guideKey), 500);
            return () => clearTimeout(timer);
        }
    }, [guideKey]);

    const startGuide = () => {
        if(guideConfig[guideKey]){
            setActiveGuide(guideKey);
        }
    }

    const closeGuide = () => {
        setActiveGuide(null);
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-brand-bg font-sans transition-colors duration-300">
            <Header />
            <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/create" element={<CreateProjectPage />} />
                    <Route path="/project/:id" element={<ProjectDetailPage />} />
                    <Route path="/dao" element={<DaoPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </main>
            <BottomNavBar />
            {activeGuide && guideConfig[activeGuide] && (
                <UserGuide 
                    steps={guideConfig[activeGuide]} 
                    guideKey={activeGuide}
                    onClose={closeGuide} 
                />
            )}
            <GuideButton onClick={startGuide} />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;