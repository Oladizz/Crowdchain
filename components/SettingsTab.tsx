

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './Button';

const SettingsTab: React.FC = () => {
    const { user, theme, toggleTheme, logout, updateUserProfile } = useAppContext();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setAvatar(user.avatar || '');
        }
    }, [user]);

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({ username, avatar });
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-lg">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h2>
                <form onSubmit={handleProfileSave} className="p-4 bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-brand-muted">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full bg-white dark:bg-brand-bg border border-gray-300 dark:border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-gray-900 dark:text-white"
                            placeholder="Your public display name"
                        />
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-brand-muted">Avatar URL</label>
                        <input
                            type="url"
                            id="avatar"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="mt-1 w-full bg-white dark:bg-brand-bg border border-gray-300 dark:border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-gray-900 dark:text-white"
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                    <div className="text-right">
                        <Button type="submit" variant="primary">Save Profile</Button>
                    </div>
                </form>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Application Settings</h2>
                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl flex justify-between items-center">
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

                    <div className="p-4 bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Wallet</h3>
                            <p className="text-sm text-brand-muted">Disconnect your wallet from the application.</p>
                        </div>
                        <Button variant="secondary" onClick={logout} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500">
                            Disconnect
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
