

import React, { useState } from 'react';


import { useAppContext } from '../context/AppContext';


import Button from '../components/Button';


import InvestmentsTab from '../components/InvestmentsTab';


import ProjectsTab from '../components/ProjectsTab';


import SettingsTab from '../components/SettingsTab';


import CreateProjectTab from '../components/CreateProjectTab';





type Tab = 'investments' | 'projects' | 'create' | 'settings';





const UserIcon: React.FC<{className?: string}> = ({className}) => (


    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>


        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />


    </svg>


);





const CashIcon: React.FC<{className?: string}> = ({className}) => (


    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>


        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />


    </svg>


);





const CollectionIcon: React.FC<{className?: string}> = ({className}) => (


    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>


        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />


    </svg>


);





const PlusIcon: React.FC<{className?: string}> = ({className}) => (


    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>


        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />


    </svg>


);





const CogIcon: React.FC<{className?: string}> = ({className}) => (


    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>


        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />


        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />


    </svg>


);








const DashboardPage: React.FC = () => {


    const { user, login, truncateAddress } = useAppContext();


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





    const tabInfo: Record<Tab, { label: string, icon: React.ElementType }> = {


        investments: { label: 'My Investments', icon: CashIcon },


        projects: { label: 'My Projects', icon: CollectionIcon },


        create: { label: 'Create Project', icon: PlusIcon },


        settings: { label: 'Settings', icon: CogIcon },


    };





    const renderTabContent = () => {


        switch (activeTab) {


            case 'investments':


                return <InvestmentsTab />;


            case 'projects':


                return <ProjectsTab setActiveTab={setActiveTab} />;


            case 'create':


                return <CreateProjectTab />;


            case 'settings':


                return <SettingsTab />;


            default:


                return <InvestmentsTab />;


        }


    };





    const TabButton: React.FC<{tabName: Tab}> = ({ tabName }) => {


        const { label, icon: Icon } = tabInfo[tabName];


        return (


            <button


                onClick={() => setActiveTab(tabName)}


                className={`lg:w-full flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium rounded-full transition-colors border ${activeTab === tabName ? 'bg-brand-button text-white border-brand-button-hover' : 'text-brand-muted hover:bg-brand-surface hover:text-white border-transparent'}`}


            >


                <Icon className="w-5 h-5 mr-2" />


                <span>{label}</span>


            </button>


        );


    };





    return (


        <div className="space-y-8 pb-8">


            <div data-guide="dashboard-welcome" className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">


                <div>


                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">Welcome, {user.username || 'Creator'}</h1>


                    <p className="text-brand-muted mt-1 font-mono text-sm break-words">{truncateAddress(user.walletAddress)}</p>


                </div>


                 {user.avatar ? (


                    <img src={user.avatar} alt="User Avatar" className="w-16 h-16 rounded-full object-cover bg-brand-surface self-start sm:self-center flex-shrink-0 border-2 border-brand-surface" />


                 ) : (


                    <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center self-start sm:self-center flex-shrink-0 border-2 border-brand-surface">


                        <UserIcon className="w-10 h-10 text-brand-muted" />


                    </div>


                 )}


            </div>





            <div className="lg:grid lg:grid-cols-12 gap-8">


                                <aside className="lg:col-span-3 mb-6 lg:mb-0">


                                    <div className="bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl p-2">


                                        <nav data-guide="dashboard-tabs" className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:space-y-1" aria-label="Tabs">


                                            {(Object.keys(tabInfo) as Tab[]).map(tabName => (


                                                <TabButton key={tabName} tabName={tabName} />


                                            ))}


                                        </nav>


                                    </div>


                                </aside>





                <main className="lg:col-span-9">


                    <div className="bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 min-h-[400px]">


                        <h2 className="text-2xl font-bold text-white mb-6 lg:hidden">{tabInfo[activeTab].label}</h2>


                        {renderTabContent()}


                    </div>


                </main>


            </div>


        </div>


    );


};





export default DashboardPage;

