import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Project, Proposal, User, ProjectCategory, Milestone } from './types';

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
  isLoading: boolean;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: number) => void;
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  fundProject: (projectId: string, amount: number) => void;
  voteOnProposal: (proposalId: string, voteType: 'for' | 'against') => void;
  updateMilestoneStatus: (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete', proof?: string) => void;
  createProject: (projectData: GeneratedProjectData) => void;
  updateUserProfile: (profileData: { username?: string; avatar?: string }) => void;
  truncateAddress: (address: string) => string;
  getUserProfileByWallet: (walletAddress: string) => { username?: string; avatar?: string } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'; // 84532 in hex

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Data loading effect
  useEffect(() => {
    const loadInitialData = () => {
        setIsLoading(true);

        // MOCK DATA GENERATION
        const MOCK_WALLETS = [
            '0x1234567890123456789012345678901234567890',
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            '0xfedcba9876543210fedcba9876543210fedcba98',
            '0x11223344556677889900aabbccddeeff11223344',
            '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        ];

        const mockProjects: Project[] = [
            {
                id: '1',
                name: 'Decentralized AI Network',
                creator: 'AI Innovators',
                creatorWallet: MOCK_WALLETS[0],
                image: 'https://picsum.photos/seed/project1/800/600',
                description: 'Building a censorship-resistant, peer-to-peer network for training and sharing AI models. Our vision is to democratize AI development.',
                category: ProjectCategory.TECH,
                fundingGoal: 50000,
                amountRaised: 25000,
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
                milestones: [
                    { id: 1, title: 'Network Protocol Alpha', description: 'Develop and test the core P2P protocol.', fundsRequired: 15000, status: 'Complete', proof: 'https://github.com/protocol' },
                    { id: 2, title: 'AI Model Hosting', description: 'Implement functionality for users to upload and download models.', fundsRequired: 20000, status: 'In Review' },
                    { id: 3, title: 'Public Beta Launch', description: 'Launch the network to the public for open testing.', fundsRequired: 15000, status: 'Pending' },
                ],
                daoStatus: 'Approved',
                updates: [{ date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), message: 'Milestone 1 completed ahead of schedule! The protocol is stable.' }],
            },
            {
                id: '2',
                name: 'PixelVerse: A Community-Owned Game',
                creator: 'Indie Game Devs',
                creatorWallet: MOCK_WALLETS[1],
                image: 'https://picsum.photos/seed/project2/800/600',
                description: 'An open-world sandbox game where players own the assets and shape the world. All game assets are NFTs, and the world is governed by the players.',
                category: ProjectCategory.GAMING,
                fundingGoal: 100000,
                amountRaised: 85000,
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
                milestones: [
                    { id: 1, title: 'Core Game Engine', description: 'Develop the basic physics and world generation.', fundsRequired: 40000, status: 'Complete', proof: '#' },
                    { id: 2, title: 'NFT Asset Integration', description: 'Integrate blockchain for player-owned assets.', fundsRequired: 35000, status: 'Complete', proof: '#' },
                    { id: 3, title: 'Multiplayer Alpha Test', description: 'Enable multiplayer and conduct initial tests.', fundsRequired: 25000, status: 'Pending' },
                ],
                daoStatus: 'Approved',
                updates: [{ date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), message: 'NFT integration is live! Check out the marketplace.' }],
            },
            {
                id: '3',
                name: 'Art Synthesis: Generative Gallery',
                creator: 'Sci-Fi Artists',
                creatorWallet: MOCK_WALLETS[2],
                image: 'https://picsum.photos/seed/project3/800/600',
                description: 'An interactive digital art gallery where new pieces are generated by AI based on community prompts. Each piece is minted as a unique NFT.',
                category: ProjectCategory.ART,
                fundingGoal: 20000,
                amountRaised: 20000,
                deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Ended
                milestones: [
                    { id: 1, title: 'AI Art Generator', description: 'Train and deploy the core AI model.', fundsRequired: 10000, status: 'Complete', proof: '#' },
                    { id: 2, title: 'Web Gallery Launch', description: 'Launch the interactive web-based gallery.', fundsRequired: 10000, status: 'Complete', proof: '#' },
                ],
                daoStatus: 'Approved',
                updates: [{ date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), message: 'Fully funded! Thank you for your support!' }],
            },
            {
                id: '4',
                name: 'Project Oasis: Reforestation DAO',
                creator: 'Eco Warriors',
                creatorWallet: MOCK_WALLETS[3],
                image: 'https://picsum.photos/seed/project4/800/600',
                description: 'A DAO to fund and verify reforestation projects globally. We use satellite imagery and on-the-ground verification to track real-world impact.',
                category: ProjectCategory.COMMUNITY,
                fundingGoal: 250000,
                amountRaised: 75000,
                deadline: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
                milestones: [
                    { id: 1, title: 'Partnership with 3 NGOs', description: 'Establish legal partnerships for on-the-ground work.', fundsRequired: 25000, status: 'In Review' },
                    { id: 2, title: 'Satellite Monitoring System', description: 'Develop a system to track progress via satellite.', fundsRequired: 100000, status: 'Pending' },
                    { id: 3, title: 'Fund First 10,000 Trees', description: 'Allocate funds for the first major planting initiative.', fundsRequired: 125000, status: 'Pending' },
                ],
                daoStatus: 'Approved',
                updates: [],
            },
            {
                id: '5',
                name: 'QuantumLeap OS',
                creator: 'Open Source Gurus',
                creatorWallet: MOCK_WALLETS[4],
                image: 'https://picsum.photos/seed/project5/800/600',
                description: 'Developing a new, privacy-focused operating system that is fully open source and built to be resistant to quantum computing attacks.',
                category: ProjectCategory.SCIENCE,
                fundingGoal: 120000,
                amountRaised: 30000,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                milestones: [
                    { id: 1, title: 'Core Kernel Development', description: 'Build the post-quantum cryptography kernel.', fundsRequired: 60000, status: 'Pending' },
                    { id: 2, title: 'Basic UI/UX', description: 'Create a simple desktop environment.', fundsRequired: 40000, status: 'Pending' },
                    { id: 3, title: 'Developer Preview Release', description: 'Release an initial version for developers to test.', fundsRequired: 20000, status: 'Pending' },
                ],
                daoStatus: 'Pending',
                updates: [],
            },
        ];

        const mockProposals: Proposal[] = [
            {
                id: 'p1',
                projectId: '1',
                projectName: mockProjects[0].name,
                type: 'Milestone Release',
                description: `Requesting fund release for Milestone 2: AI Model Hosting. The work has been completed and proof submitted.`,
                votesFor: 120,
                votesAgainst: 15,
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'p2',
                projectId: '5',
                projectName: mockProjects[4].name,
                type: 'New Project',
                description: `Proposal to approve the new project: "${mockProjects[4].name}". This project aims to create a quantum-resistant OS.`,
                votesFor: 350,
                votesAgainst: 80,
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'p3',
                projectId: '4',
                projectName: mockProjects[3].name,
                type: 'Milestone Release',
                description: 'Requesting funds for Milestone 1: Partnership with 3 NGOs. Agreements have been drafted.',
                votesFor: 210,
                votesAgainst: 5,
                deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];

        setTimeout(() => {
            setProjects(mockProjects);
            setProposals(mockProposals);
            setIsLoading(false);
        }, 1500); // Simulate 1.5 second load time
    };

    // Load data on initial mount
    useEffect(() => {
        loadInitialData();
    }, []);
  }, []);

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
            addToast('Please add Base Sepolia to your wallet.', 'error');
          } else {
            addToast('Failed to switch to Base Sepolia.', 'error');
          }
          return;
        }
      }

      const walletAddress = accounts[0];
      const savedProfileJSON = localStorage.getItem(`user_profile_${walletAddress.toLowerCase()}`);
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
  
  const updateMilestoneStatus = (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete', proof?: string) => {
    setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === projectId) {
            return {
                ...p,
                milestones: p.milestones.map(m => {
                    if (m.id === milestoneId) {
                        const updatedMilestone: Milestone = { ...m, status };
                        if (proof) {
                           updatedMilestone.proof = proof;
                        }
                        return updatedMilestone;
                    }
                    return m;
                })
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
        localStorage.setItem(`user_profile_${updatedUser.walletAddress.toLowerCase()}`, JSON.stringify(profileToSave));
        return updatedUser;
    });
    addToast('Profile updated successfully!', 'success');
  };
  
  const getUserProfileByWallet = (walletAddress: string): { username?: string; avatar?: string } | null => {
    if (!walletAddress) return null;
    const savedProfileJSON = localStorage.getItem(`user_profile_${walletAddress.toLowerCase()}`);
    if (!savedProfileJSON) return null;
    return JSON.parse(savedProfileJSON);
  };


  return (
    <AppContext.Provider value={{ projects, proposals, user, theme, toasts, isLoading, addToast, removeToast, login: connectWallet, logout, toggleTheme, fundProject, voteOnProposal, updateMilestoneStatus, createProject, updateUserProfile, truncateAddress, getUserProfileByWallet }}>
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