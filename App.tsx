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
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/AdminRoute';

import { guideConfig } from './guideConfig';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';

import { useAppContext } from './context/AppContext';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { setStartGuide } = useAppContext();
    const [activeGuide, setActiveGuide] = useState<string | null>(null);
    

    const pathParts = location.pathname.split('/');
    let guideKey = pathParts[1] || 'home';
    if (pathParts[1] === 'project') {
        guideKey = 'project';
    } else if (pathParts[1] === 'home') {
        guideKey = 'home';
    }

    const startGuide = (key: string) => {
        if(guideConfig[key]){
            setActiveGuide(key);
        }
    }

    useEffect(() => {
        setStartGuide(() => startGuide);
    }, [setStartGuide]);


    useEffect(() => {
        const hasSeenWelcomeGuide = localStorage.getItem('has_seen_welcome_guide');
        if (!hasSeenWelcomeGuide && guideKey !== 'home' && guideConfig[guideKey]) {
            localStorage.setItem('has_seen_welcome_guide', 'true');
            const timer = setTimeout(() => setActiveGuide(key), 500);
            return () => clearTimeout(timer);
        }
    }, [guideKey]);

    const closeGuide = () => {
        setActiveGuide(null);
    }

    return (
        <div className="flex min-h-screen font-sans text-gray-800 dark:text-white transition-colors duration-300 relative isolate">
            {/* Background and Glow effect */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-brand-bg" />
            <div className="fixed top-0 left-0 -z-10 h-screen w-screen bg-transparent bg-[radial-gradient(circle_800px_at_50%_200px,#00bfff10,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,#00bfff20,transparent)]" />
            
            <Sidebar />
            <div className="flex-1 flex flex-col md:pl-64">
                <Header />
                <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-6">
                    {children}
                </main>
                {(location.pathname === '/dashboard' || location.pathname === '/') && (
                    <div className={location.pathname === '/dashboard' ? "pb-14 md:pb-0" : ""}>
                        <Footer />
                    </div>
                )}
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
        </div>
    );
}


const AppContent: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/explore" element={<MainLayout><ExplorePage /></MainLayout>} />
            <Route path="/project/:id" element={<MainLayout><ProjectDetailPage /></MainLayout>} />
            <Route path="/profile/:walletAddress" element={<MainLayout><ProfilePage /></MainLayout>} />
            <Route path="/dao" element={<MainLayout><DaoPage /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
            <Route path="/create" element={<MainLayout><CreateProjectPage /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/waitlist" element={<MainLayout><WaitlistPage /></MainLayout>} />
            <Route path="/admin" element={<AdminRoute><MainLayout><AdminPage /></MainLayout></AdminRoute>} />
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