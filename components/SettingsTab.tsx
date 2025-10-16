import React from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './Button';

const SettingsTab: React.FC = () => {
    const { theme, toggleTheme, logout } = useAppContext();

    return (
        <div className="space-y-6 animate-fade-in max-w-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Application Settings</h2>
            
            <div className="p-4 bg-gray-100 dark:bg-brand-surface rounded-lg flex justify-between items-center">
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                    <p className="text-sm text-brand-muted">Switch between light and dark mode.</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <button 
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-blue' : 'bg-gray-400'}`}
                    >
                        <span className={`block w-4 h-4 m-1 rounded-full bg-white transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></span>
                    </button>
                </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-brand-surface rounded-lg flex justify-between items-center">
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Wallet</h3>
                    <p className="text-sm text-brand-muted">Disconnect your wallet from the application.</p>
                </div>
                <Button variant="secondary" onClick={logout} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500">
                    Disconnect
                </Button>
            </div>
        </div>
    );
};

export default SettingsTab;
