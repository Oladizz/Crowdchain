
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DaoPage from './pages/DaoPage';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import DashboardPage from './pages/DashboardPage';
import CreateProjectPage from './pages/CreateProjectPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WaitlistPage from './pages/WaitlistPage';
import UserGuide from './components/UserGuide';
import GuideButton from './components/GuideButton';
import { guideConfig } from './guideConfig';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [activeGuide, setActiveGuide] = useState<string | null>(null);
    const isDashboardPage = location.pathname === '/dashboard';

    const pathParts = location.pathname.split('/');
    let guideKey = pathParts[1] || 'home';
    if (pathParts[1] === 'project') {
        guideKey = 'project';
    } else if (pathParts[1] === 'home') {
        guideKey = 'home';
    }


    useEffect(() => {
        const hasViewed = localStorage.getItem(`guide_${guideKey}_viewed`);
        if (!hasViewed && guideConfig[guideKey]) {
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
        <div className="flex min-h-screen bg-white dark:bg-brand-bg font-sans text-gray-800 dark:text-white transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col md:pl-64">
                <Header />
                <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-6">
                    {children}
                </main>
                {isDashboardPage && <Footer />}
            </div>
            <BottomNavBar />
            <ToastContainer />
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
}


const AppContent: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/explore" element={<MainLayout><ExplorePage /></MainLayout>} />
            <Route path="/project/:id" element={<MainLayout><ProjectDetailPage /></MainLayout>} />
            <Route path="/dao" element={<MainLayout><DaoPage /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
            <Route path="/create" element={<MainLayout><CreateProjectPage /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/waitlist" element={<MainLayout><WaitlistPage /></MainLayout>} />
        </Routes>
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
