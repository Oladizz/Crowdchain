

import React from 'react';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100/60 dark:bg-brand-surface/60 backdrop-blur-lg border-t border-gray-200 dark:border-white/10">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-sm text-brand-muted">
                        &copy; {new Date().getFullYear()} CrowdChain. All rights reserved.
                    </div>
                    <nav className="flex gap-x-6 gap-y-2 text-sm flex-wrap justify-center">
                        <Link to="/" className="text-brand-muted hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Home</Link>
                        <Link to="/explore" className="text-brand-muted hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Explore</Link>
                        <Link to="/dao" className="text-brand-muted hover:text-gray-900 dark:hover:text-white transition-colors duration-300">DAO</Link>
                        <Link to="/about" className="text-brand-muted hover:text-gray-900 dark:hover:text-white transition-colors duration-300">About</Link>
                        <Link to="/contact" className="text-brand-muted hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Contact</Link>
                        <Link to="/waitlist" className="text-brand-muted hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Waitlist</Link>
                    </nav>
                    <div className="flex flex-wrap justify-center gap-6">
                        <SocialIcon url="https://twitter.com" style={{ height: 24, width: 24 }} />
                        <SocialIcon url="https://discord.com" style={{ height: 24, width: 24 }} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
