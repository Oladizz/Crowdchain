import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './Button';
import { storage } from '../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Spinner from './Spinner';

const UserCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-24 w-24 text-brand-muted"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const QuestionMarkCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InformationCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TwitterIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></svg>
);

const LinkIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const SettingsTab: React.FC = () => {
    const { user, theme, toggleTheme, logout, updateUserProfile, startGuide } = useAppContext();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');
    const [twitterHandle, setTwitterHandle] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setAvatar(user.avatar || '');
            setBio(user.bio || '');
            setTwitterHandle(user.twitterHandle || '');
            setWebsite(user.website || '');
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setUploading(true);

        let newAvatarUrl = user.avatar;

        if (avatarFile) {
            const storageRef = ref(storage, `avatars/${user.walletAddress}/${avatarFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, avatarFile);

            await new Promise<void>((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {},
                    (error) => {
                        console.error("Upload failed:", error);
                        setUploading(false);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        newAvatarUrl = downloadURL;
                        resolve();
                    }
                );
            });
        }

        await updateUserProfile({ username, bio, twitterHandle, website, avatar: newAvatarUrl });
        setUploading(false);
        setAvatarFile(null);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-lg mx-auto">
            {/* Profile Settings */}
            <form onSubmit={handleProfileSave} className="p-6 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl space-y-4 shadow-lg">
                <h2 className="text-xl font-semibold text-center text-white mb-4">Profile Settings</h2>
                <div className="flex flex-col items-center space-y-4">
                     <label htmlFor="avatar-upload" className="cursor-pointer group relative">
                        <div className="w-24 h-24 bg-brand-surface rounded-full border-2 border-brand-surface shadow-md flex items-center justify-center overflow-hidden">
                            {avatar ? (
                                <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircleIcon className="w-20 h-20 text-brand-muted" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">Change</span>
                        </div>
                    </label>
                    <input type="file" id="avatar-upload" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                    <div className="w-full space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-brand-muted">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-2 focus:ring-brand-blue rounded-lg p-2 text-white transition-all" placeholder="Your public display name" />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-brand-muted">Bio</label>
                            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-2 focus:ring-brand-blue rounded-lg p-2 text-white transition-all" placeholder="Tell us about yourself" />
                        </div>
                        <div>
                            <label htmlFor="twitterHandle" className="block text-sm font-medium text-brand-muted">Twitter Handle</label>
                            <div className="mt-1 relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><TwitterIcon className="w-4 h-4 text-brand-muted" /></div><input type="text" id="twitterHandle" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} className="w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-2 focus:ring-brand-blue rounded-lg p-2 pl-10 text-white transition-all" placeholder="your_handle" /></div>
                        </div>
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-brand-muted">Website</label>
                            <div className="mt-1 relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LinkIcon className="w-4 h-4 text-brand-muted" /></div><input type="url" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-2 focus:ring-brand-blue rounded-lg p-2 pl-10 text-white transition-all" placeholder="https://example.com" /></div>
                        </div>
                    </div>
                </div>
                <div className="pt-2 text-right">
                    <Button type="submit" variant="primary" disabled={uploading}>
                        {uploading ? <><Spinner className="mr-2"/> Saving...</> : 'Save Profile'}
                    </Button>
                </div>
            </form>
            
            {/* Application Settings */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-center text-white">Application Settings</h2>
                
                <div className="p-6 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg flex flex-wrap justify-between items-center gap-4">
                    <div className="min-w-0 mr-4">
                        <h3 className="font-medium text-white">Theme</h3>
                        <p className="text-sm text-brand-muted">Switch between light and dark mode.</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`w-14 h-7 rounded-full transition-colors flex items-center p-1 shadow-inner flex-shrink-0 ${theme === 'dark' ? 'bg-brand-blue' : 'bg-gray-400'}`}
                    >
                        <span className={`block w-5 h-5 rounded-full bg-white transform transition-transform shadow-md ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></span>
                    </button>
                </div>

                <div className="p-6 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg flex flex-wrap justify-between items-center gap-4">
                     <div className="min-w-0 mr-4">
                        <h3 className="font-medium text-white">Wallet</h3>
                        <p className="text-sm text-brand-muted">Disconnect your wallet from the app.</p>
                    </div>
                    <Button variant="secondary" onClick={logout} Icon={LogoutIcon} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500">
                        Disconnect
                    </Button>
                </div>

                <div className="p-6 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg flex flex-wrap justify-between items-center gap-4">
                     <div className="min-w-0 mr-4">
                        <h3 className="font-medium text-white">Guide</h3>
                        <p className="text-sm text-brand-muted">Restart the dashboard tour.</p>
                    </div>
                    <Button variant="secondary" onClick={() => startGuide('dashboard')} Icon={QuestionMarkCircleIcon}>
                        Start Tour
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
