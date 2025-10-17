
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

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface AppContextType {
  projects: Project[];
  proposals: Proposal[];
  user: User | null;
  theme: 'dark' | 'light';
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: number) => void;
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  fundProject: (projectId: string, amount: number) => void;
  voteOnProposal: (proposalId: string, voteType: 'for' | 'against') => void;
  updateMilestoneStatus: (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete') => void;
  createProject: (projectData: GeneratedProjectData) => void;
  updateUserProfile: (profileData: { username?: string; avatar?: string }) => void;
  truncateAddress: (address: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'; // 84532 in hex

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const addToast = (message: string, type: Toast['type']) => {
      const id = Date.now();
      setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      addToast('Please install a web3 wallet!', 'error');
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        addToast('No accounts found.', 'error');
        return;
      }
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await (window as any).ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: BASE_SEPOLIA_CHAIN_ID,
                    chainName: 'Base Sepolia',
                    nativeCurrency: {
                      name: 'Ethereum',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://sepolia.base.org'],
                    blockExplorerUrls: ['https://sepolia-explorer.base.org'],
                  },
                ],
              });
            } catch (addError) {
              addToast('Failed to add Base Sepolia network.', 'error');
              return;
            }
          } else {
            addToast('Failed to switch to Base Sepolia.', 'error');
            return;
          }
        }
      }

      const walletAddress = accounts[0];
      const savedProfileJSON = localStorage.getItem(`user_profile_${walletAddress}`);
      const savedProfile = savedProfileJSON ? JSON.parse(savedProfileJSON) : {};
      
      setUser({
        walletAddress,
        createdProjectIds: [], // In real app, this would be fetched
        fundedProjects: [], // In real app, this would be fetched
        ...savedProfile,
      });
      localStorage.setItem('walletAddress', walletAddress);
      addToast('Wallet connected!', 'success');

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      addToast('Failed to connect wallet.', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('walletAddress');
    addToast('Wallet disconnected.', 'info');
  };

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
    addToast(`Successfully funded with $${amount}!`, 'success');
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
    addToast('Your vote has been cast!', 'success');
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
    }));
    if (status === 'In Review') {
        addToast('Milestone submitted for DAO review.', 'info');
    }
  };

  const createProject = (projectData: GeneratedProjectData) => {
    if (!user) {
        addToast("Connect your wallet to create a project.", 'error');
        return;
    }
    const newProjectId = (projects.length + 1 + Date.now()).toString();
    const fundingGoal = projectData.milestones.reduce((sum, m) => sum + m.fundsRequired, 0);
    const newProject: Project = {
        id: newProjectId,
        name: projectData.name,
        creator: user.username || user.walletAddress,
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
    addToast('Project submitted to DAO for review!', 'success');
  };

  const updateUserProfile = (profileData: { username?: string; avatar?: string }) => {
    if (!user) return;
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, ...profileData };
        const profileToSave = {
            username: updatedUser.username,
            avatar: updatedUser.avatar,
        };
        localStorage.setItem(`user_profile_${updatedUser.walletAddress}`, JSON.stringify(profileToSave));
        return updatedUser;
    });
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <AppContext.Provider value={{ projects, proposals, user, theme, toasts, addToast, removeToast, login: connectWallet, logout, toggleTheme, fundProject, voteOnProposal, updateMilestoneStatus, createProject, updateUserProfile, truncateAddress }}>
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