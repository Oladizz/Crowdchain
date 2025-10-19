import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './Button';

const UserCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-24 w-24 text-brand-muted"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

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
        <div className="space-y-16 animate-fade-in max-w-lg mx-auto">
            {/* Profile Settings */}
            <div className="relative mt-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-brand-surface rounded-full border-4 border-brand-surface shadow-lg flex items-center justify-center overflow-hidden">
                    {avatar ? (
                        <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-20 h-20 text-brand-muted" />
                    )}
                </div>
                <form onSubmit={handleProfileSave} className="p-6 pt-16 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl space-y-4 shadow-2xl">
                    <h2 className="text-xl font-semibold text-center text-white">Profile Settings</h2>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-brand-muted">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-2 focus:ring-brand-blue rounded-md p-2 text-white transition-all"
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
                            className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-2 focus:ring-brand-blue rounded-md p-2 text-white transition-all"
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                    <div className="pt-2 text-right">
                        <Button type="submit" variant="primary">Save Profile</Button>
                    </div>
                </form>
            </div>
            
            {/* Application Settings */}
            <div className="space-y-12">
                <h2 className="text-xl font-semibold text-center text-white">Application Settings</h2>
                
                <div className="relative">
                    <div className="p-6 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl overflow-visible">
                        <h3 className="font-medium text-white">Theme</h3>
                        <p className="text-sm text-brand-muted">Switch between light and dark mode.</p>
                        <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/4">
                            <button 
                                onClick={toggleTheme}
                                className={`w-14 h-7 rounded-full transition-colors flex items-center p-1 shadow-inner ${theme === 'dark' ? 'bg-brand-blue' : 'bg-gray-400'}`}
                            >
                                <span className={`block w-5 h-5 rounded-full bg-white transform transition-transform shadow-md ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="p-6 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl overflow-visible">
                        <h3 className="font-medium text-white">Wallet</h3>
                        <p className="text-sm text-brand-muted">Disconnect your wallet from the application.</p>
                    </div>
                    <div className="absolute bottom-0 right-6 translate-y-1/2">
                         <Button variant="secondary" onClick={logout} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-lg">
                            Disconnect
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;