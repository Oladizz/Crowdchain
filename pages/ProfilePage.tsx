import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../context/types';
import Button from '../components/Button';

const UserCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-24 w-24 text-brand-muted"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const ProfilePage: React.FC = () => {
    const { walletAddress } = useParams<{ walletAddress: string }>();
    const { projects, user: loggedInUser, truncateAddress, getUserProfileByWallet } = useAppContext();
    const [profileData, setProfileData] = React.useState<{ username?: string; avatar?: string } | null>(null);

    React.useEffect(() => {
        if (walletAddress) {
            // In a real app, you'd fetch this profile data from a backend.
            // Here, we simulate by reading from localStorage.
            const savedProfileJSON = localStorage.getItem(`user_profile_${walletAddress.toLowerCase()}`);
            const savedProfile = savedProfileJSON ? JSON.parse(savedProfileJSON) : {};
            setProfileData(savedProfile);
        }
    }, [walletAddress]);

    if (!walletAddress) {
        return (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-white">User Not Found</h1>
            <p className="mt-4 text-brand-muted">The profile you're looking for doesn't exist.</p>
            <Link to="/explore">
                <Button variant="primary" className="mt-8">Back to Explore</Button>
            </Link>
          </div>
        );
    }

    const createdProjects = projects.filter(p => p.creatorWallet.toLowerCase() === walletAddress.toLowerCase());

    const isOwnProfile = loggedInUser?.walletAddress.toLowerCase() === walletAddress.toLowerCase();
    
    const fundedProjects = isOwnProfile 
        ? loggedInUser.fundedProjects.map(funding => {
            return projects.find(p => p.id === funding.projectId);
          }).filter((p): p is Project => !!p) // Type guard to remove undefined
        : [];
    
    const username = profileData?.username || truncateAddress(walletAddress);
    const avatar = profileData?.avatar;

    return (
        <div className="space-y-8 sm:space-y-12 animate-fade-in">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl">
                {avatar ? (
                    <img src={avatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover bg-brand-surface flex-shrink-0" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-brand-surface flex items-center justify-center flex-shrink-0">
                        <UserCircleIcon className="w-20 h-20 text-brand-muted" />
                    </div>
                )}
                <div className="text-center sm:text-left min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">{username}</h1>
                    <p className="text-brand-muted mt-1 font-mono text-sm break-all">{walletAddress}</p>
                </div>
            </div>

            {/* Created Projects */}
            <section>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Created Projects ({createdProjects.length})</h2>
                {createdProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {createdProjects.map(project => {
                            const creatorProfile = getUserProfileByWallet(project.creatorWallet);
                            return (
                                <ProjectCard 
                                    key={project.id} 
                                    project={project} 
                                    creatorUsername={creatorProfile?.username}
                                    creatorAvatar={creatorProfile?.avatar}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl">
                        <p className="text-brand-muted">This user hasn't created any projects yet.</p>
                    </div>
                )}
            </section>

            {/* Funded Projects */}
            {isOwnProfile && (
                 <section>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Funded Projects ({fundedProjects.length})</h2>
                    {fundedProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {fundedProjects.map(project => {
                                const creatorProfile = getUserProfileByWallet(project.creatorWallet);
                                return (
                                    <ProjectCard 
                                        key={project.id} 
                                        project={project}
                                        creatorUsername={creatorProfile?.username}
                                        creatorAvatar={creatorProfile?.avatar}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl">
                            <p className="text-brand-muted">You haven't funded any projects yet.</p>
                             <Link to="/explore" className="text-brand-blue-light hover:underline mt-2 inline-block">Explore projects to support</Link>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default ProfilePage;