import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import InvestmentsTab from '../components/InvestmentsTab';
import ProjectsTab from '../components/ProjectsTab';
import SettingsTab from '../components/SettingsTab';

type Tab = 'investments' | 'projects' | 'settings';

const DashboardPage: React.FC = () => {
    const { user, login } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('investments');

    if (!user) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Access Your Dashboard</h1>
                <p className="mt-4 text-brand-muted">Please connect your wallet to view your projects and investments.</p>
                <Button onClick={login} variant="primary" className="mt-8">Connect Wallet</Button>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'investments':
                return <InvestmentsTab />;
            case 'projects':
                return <ProjectsTab />;
            case 'settings':
                return <SettingsTab />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{tabName: Tab, label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-brand-button text-white' : 'text-brand-muted hover:bg-brand-surface hover:text-white'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-8">
            <div data-guide="dashboard-welcome" className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.username}</h1>
                    <p className="text-brand-muted mt-1">{user.bio}</p>
                </div>
                <img src={user.avatar} alt="User avatar" className="w-16 h-16 rounded-full self-start sm:self-center" />
            </div>

            <div>
                <div data-guide="dashboard-tabs" className="border-b border-gray-200 dark:border-brand-surface mb-6">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <TabButton tabName="investments" label="My Investments" />
                        <TabButton tabName="projects" label="My Projects" />
                        <TabButton tabName="settings" label="Settings" />
                    </nav>
                </div>
                <div>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
