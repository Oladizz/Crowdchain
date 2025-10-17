
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const BlockIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8 text-brand-blue"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7" />
  </svg>
);

const CompassIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const DaoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon: Icon }) => {
  const baseClasses = 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200';
  const inactiveClasses = 'text-brand-muted hover:bg-brand-button-hover hover:text-white';
  const activeClasses = 'bg-brand-button text-white';

  return (
    <NavLink to={to} className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} end={to === "/" || to === "/explore"}>
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
    const { user, truncateAddress } = useAppContext();
    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-brand-surface border-r border-gray-800 hidden md:flex flex-col p-4">
            <div className="flex items-center space-x-2 mb-8 px-2">
                <BlockIcon />
                <span className="text-xl font-bold text-white tracking-wider">CrowdChain</span>
            </div>
            <nav className="flex-1 flex flex-col space-y-2">
                <NavItem to="/explore" label="Explore" icon={CompassIcon} />
                <NavItem to="/dao" label="DAO Governance" icon={DaoIcon} />
                {user && <NavItem to="/dashboard" label="Dashboard" icon={UserIcon} />}
            </nav>
            {user && (
                <div className="mt-auto p-2 bg-brand-bg rounded-lg">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center flex-shrink-0">
                           <UserIcon className="w-6 h-6 text-brand-muted" />
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-semibold text-white">Connected</p>
                            <p className="text-xs text-brand-muted truncate font-mono">{truncateAddress(user.walletAddress)}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
