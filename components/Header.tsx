import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from './Button';
import { useAppContext } from '../context/AppContext';

const BlockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7" />
  </svg>
);

const Header: React.FC = () => {
  const { user, login } = useAppContext();

  return (
    <header className="bg-white/80 dark:bg-brand-bg/80 backdrop-blur-sm sticky top-0 z-30 border-b border-gray-200 dark:border-brand-surface/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2 md:hidden">
            <BlockIcon />
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-wider">CrowdChain</span>
          </NavLink>
          <div className="w-full flex justify-end">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard" className="text-xs sm:text-sm font-medium bg-brand-surface text-brand-muted px-3 py-2 rounded-lg hover:text-white transition-colors">
                  {user.walletAddress}
                </Link>
              </div>
            ) : (
              <div data-guide="connect-wallet">
                <Button onClick={login} variant="secondary">Connect on Base</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;