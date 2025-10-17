

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Project, Proposal, User, ProjectCategory } from '../types';

interface GeneratedProjectData {
    name: string;
    description: string;
    category: ProjectCategory;
    milestones: {
        title: string;
        description: string;
        fundsRequired: number;
    }[];
}

interface AppContextType {
  projects: Project[];
  proposals: Proposal[];
  user: User | null;
  theme: 'dark' | 'light';
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  fundProject: (projectId: string, amount: number) => void;
  voteOnProposal: (proposalId: string, voteType: 'for' | 'against') => void;
  updateMilestoneStatus: (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete') => void;
  createProject: (projectData: GeneratedProjectData) => void;
  truncateAddress: (address: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'; // 84532 in hex

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert('Please install a web3 wallet like MetaMask!');
      return;
    }

    try {
      // FIX: Untyped function calls may not accept type arguments. Removed generic type argument.
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        console.error('No accounts found.');
        return;
      }

      // FIX: Untyped function calls may not accept type arguments. Removed generic type argument.
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            alert('Please add the Base Sepolia network to your wallet.');
          } else {
            alert('Failed to switch to Base Sepolia network.');
          }
          return;
        }
      }

      const walletAddress = accounts[0];
      // In a real app, you'd fetch user data. Here we create a new user object.
      // This means project/investment associations are lost on disconnect.
      setUser({
        walletAddress,
        createdProjectIds: [],
        fundedProjects: [],
      });
      localStorage.setItem('walletAddress', walletAddress);

    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('walletAddress');
  };

  // Effect for auto-connecting and setting up listeners
  useEffect(() => {
    const autoConnect = async () => {
        if ((window as any).ethereum && localStorage.getItem('walletAddress')) {
            await connectWallet();
        }
    };
    autoConnect();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        logout();
      } else if (user && accounts[0].toLowerCase() !== user.walletAddress.toLowerCase()) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);

      return () => {
        (window as any).ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const fundProject = (projectId: string, amount: number) => {
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId ? { ...p, amountRaised: p.amountRaised + amount } : p
      )
    );
    if (user) {
        const existingFunding = user.fundedProjects.find(fp => fp.projectId === projectId);
        if (existingFunding) {
            const updatedFundedProjects = user.fundedProjects.map(fp => fp.projectId === projectId ? {...fp, amount: fp.amount + amount} : fp);
            setUser({...user, fundedProjects: updatedFundedProjects});
        } else {
            setUser({...user, fundedProjects: [...user.fundedProjects, {projectId, amount}]});
        }
    }
  };

  const voteOnProposal = (proposalId: string, voteType: 'for' | 'against') => {
    setProposals(prevProposals =>
      prevProposals.map(p => {
        if (p.id === proposalId) {
          return voteType === 'for'
            ? { ...p, votesFor: p.votesFor + 1 } 
            : { ...p, votesAgainst: p.votesAgainst + 1 };
        }
        return p;
      })
    );
  };
  
  const updateMilestoneStatus = (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete') => {
    setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === projectId) {
            return {
                ...p,
                milestones: p.milestones.map(m => m.id === milestoneId ? {...m, status} : m)
            }
        }
        return p;
    }))
  };

  const createProject = (projectData: GeneratedProjectData) => {
    if (!user) {
        console.error("User must be logged in to create a project");
        return;
    }

    const newProjectId = (projects.length + 1 + Date.now()).toString();
    const fundingGoal = projectData.milestones.reduce((sum, m) => sum + m.fundsRequired, 0);

    const newProject: Project = {
        id: newProjectId,
        name: projectData.name,
        creator: user.walletAddress,
        creatorWallet: user.walletAddress,
        image: `https://picsum.photos/seed/${newProjectId}/800/600`,
        description: projectData.description,
        category: projectData.category,
        fundingGoal: fundingGoal,
        amountRaised: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        milestones: projectData.milestones.map((m, index) => ({
            id: index + 1,
            title: m.title,
            description: m.description,
            fundsRequired: m.fundsRequired,
            status: 'Pending',
        })),
        daoStatus: 'Pending',
        updates: [],
    };

    const newProposal: Proposal = {
        id: `p${proposals.length + 1 + Date.now()}`,
        projectId: newProjectId,
        projectName: newProject.name,
        type: 'New Project',
        description: `Proposal to approve the new project: "${newProject.name}".`,
        votesFor: 0,
        votesAgainst: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setProjects(prevProjects => [...prevProjects, newProject]);
    setProposals(prevProposals => [newProposal, ...prevProposals]);
    setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, createdProjectIds: [...prevUser.createdProjectIds, newProjectId] };
    });
  };

  return (
    <AppContext.Provider value={{ projects, proposals, user, theme, login: connectWallet, logout, toggleTheme, fundProject, voteOnProposal, updateMilestoneStatus, createProject, truncateAddress }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};