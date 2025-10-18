
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const BlockIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8 text-brand-blue"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7" />
  </svg>
);

const LandingPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-brand-bg text-white">
      {/* Background Animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-surface to-black animate-gradient-xy" 
        style={{ backgroundSize: '200% 200%' }} 
      />

      {/* Content */}
      <div className="relative z-10 text-center p-4">
        <div className="animate-fade-in mx-auto mb-6">
          <BlockIcon className="h-20 w-20 text-brand-blue mx-auto" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-text-focus-in" style={{ animationDelay: '0.5s' }}>
          CrowdChain
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-brand-muted animate-fade-in" style={{ animationDelay: '1s' }}>
          The Future of Funding, Built by Community.
        </p>
        <div className="mt-10 animate-slide-in-bottom" style={{ animationDelay: '1.5s' }} data-guide="enter-app">
          <Link to="/home">
            <Button variant="primary" className="text-lg px-10 py-4 rounded-full shadow-lg shadow-brand-blue/30 transform hover:scale-110 transition-transform duration-300">
              Enter Platform
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
