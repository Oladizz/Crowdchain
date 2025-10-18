
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { doc, setDoc, collection, addDoc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
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

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, 'projects');
      const projectSnapshot = await getDocs(projectsCollection);
      const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projectList);
    };

    const fetchProposals = async () => {
      const proposalsCollection = collection(db, 'proposals');
      const proposalSnapshot = await getDocs(proposalsCollection);
      const proposalList = proposalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
      setProposals(proposalList);
    };

    fetchProjects();
    fetchProposals();
  }, []);

  const addToast = (message: string, type: Toast['type']) => {
      const id = Date.now();
      setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const connectWallet = async (isAutoConnect = false) => {
    console.log('Attempting to connect wallet. Auto-connect:', isAutoConnect);
    if (!(window as any).ethereum) {
      console.error('No web3 wallet detected.');
      if (!isAutoConnect) addToast('Please install a web3 wallet!', 'error');
      return;
    }

    try {
      console.log('Requesting accounts...');
      const accounts = await (window as any).ethereum.request({
        method: isAutoConnect ? 'eth_accounts' : 'eth_requestAccounts'
      });
      console.log('Accounts received:', accounts);

      if (!accounts || accounts.length === 0) {
        console.warn('No accounts found.');
        if (!isAutoConnect) addToast('No accounts found.', 'error');
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
      
      const userRef = doc(db, 'users', walletAddress);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log('User found in Firestore:', userSnap.data());
        setUser(userSnap.data() as User);
      } else {
        console.log('User not found in Firestore, creating new user...');
        const newUser: User = {
          walletAddress,
          createdProjectIds: [],
          fundedProjects: [],
        };
        await setDoc(userRef, newUser);
        console.log('New user created:', newUser);
        setUser(newUser);
      }
      localStorage.setItem('walletAddress', walletAddress);
      console.log('Wallet address saved to localStorage.');
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
            await connectWallet(true);
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

  const fundProject = async (projectId: string, amount: number) => {
    if (!user) {
      addToast("Connect your wallet to fund a project.", 'error');
      return;
    }
    try {
      const projectRef = doc(db, "projects", projectId);
      const project = projects.find(p => p.id === projectId);
      if (project) {
        const newAmount = project.amountRaised + amount;
        await updateDoc(projectRef, { amountRaised: newAmount });

        const userRef = doc(db, 'users', user.walletAddress);
        const updatedFundedProjects = [...user.fundedProjects, { projectId, amount }];
        await updateDoc(userRef, { fundedProjects: updatedFundedProjects });

        setUser({ ...user, fundedProjects: updatedFundedProjects });
        setProjects(prevProjects =>
          prevProjects.map(p =>
            p.id === projectId ? { ...p, amountRaised: newAmount } : p
          )
        );
        addToast(`Successfully funded with $${amount}!`, 'success');
      }
    } catch (error) {
      console.error("Error funding project:", error);
      addToast('Failed to fund project.', 'error');
    }
  };

  const voteOnProposal = async (proposalId: string, voteType: 'for' | 'against') => {
    if (!user) {
      addToast("Connect your wallet to vote.", 'error');
      return;
    }
    try {
      const proposalRef = doc(db, "proposals", proposalId);
      const proposal = proposals.find(p => p.id === proposalId);
      if (proposal) {
        const newVotesFor = voteType === 'for' ? proposal.votesFor + 1 : proposal.votesFor;
        const newVotesAgainst = voteType === 'against' ? proposal.votesAgainst + 1 : proposal.votesAgainst;

        await updateDoc(proposalRef, {
          votesFor: newVotesFor,
          votesAgainst: newVotesAgainst
        });

        setProposals(prevProposals =>
          prevProposals.map(p => {
            if (p.id === proposalId) {
              return { ...p, votesFor: newVotesFor, votesAgainst: newVotesAgainst };
            }
            return p;
          })
        );
        addToast('Your vote has been cast!', 'success');
      }
    } catch (error) {
      console.error("Error voting on proposal:", error);
      addToast('Failed to cast vote.', 'error');
    }
  };
  
  const updateMilestoneStatus = async (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete') => {
    if (!user) {
      addToast("Connect your wallet to update milestone status.", 'error');
      return;
    }
    try {
      const projectRef = doc(db, "projects", projectId);
      const project = projects.find(p => p.id === projectId);
      if (project) {
        const updatedMilestones = project.milestones.map(m =>
          m.id === milestoneId ? { ...m, status } : m
        );
        await updateDoc(projectRef, { milestones: updatedMilestones });

        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    milestones: updatedMilestones
                }
            }
            return p;
        }));
        if (status === 'In Review') {
            addToast('Milestone submitted for DAO review.', 'info');
        }
      }
    } catch (error) {
      console.error("Error updating milestone status:", error);
      addToast('Failed to update milestone status.', 'error');
    }
  };

  const createProject = async (projectData: GeneratedProjectData) => {
    if (!user) {
      addToast("Connect your wallet to create a project.", 'error');
      return;
    }
    try {
      const fundingGoal = projectData.milestones.reduce((sum, m) => sum + m.fundsRequired, 0);

      const projectDocRef = await addDoc(collection(db, "projects"), {
        name: projectData.name,
        creator: user.username || user.walletAddress,
        creatorWallet: user.walletAddress,
        image: `https://picsum.photos/seed/${Date.now()}/800/600`,
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
      });

      const newProjectId = projectDocRef.id;

      const proposalDocRef = await addDoc(collection(db, "proposals"), {
        projectId: newProjectId,
        projectName: projectData.name,
        type: 'New Project',
        description: `Proposal to approve the new project: "${projectData.name}".`,
        votesFor: 0,
        votesAgainst: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // This part will be updated when we fetch data from Firestore
      // For now, we'll optimistically update the UI
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
        id: proposalDocRef.id,
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

      const userRef = doc(db, 'users', user.walletAddress);
      const updatedCreatedProjectIds = [...user.createdProjectIds, newProjectId];
      await updateDoc(userRef, { createdProjectIds: updatedCreatedProjectIds });
      setUser({ ...user, createdProjectIds: updatedCreatedProjectIds });

      addToast('Project submitted to DAO for review!', 'success');
    } catch (error) {
      console.error("Error creating project:", error);
      addToast('Failed to create project.', 'error');
    }
  };

  const updateUserProfile = async (profileData: { username?: string; avatar?: string }) => {
    if (!user) {
      addToast("Connect your wallet to update your profile.", 'error');
      return;
    }
    try {
      const userRef = doc(db, "users", user.walletAddress);
      await updateDoc(userRef, profileData);

      setUser(prevUser => {
          if (!prevUser) return null;
          return { ...prevUser, ...profileData };
      });
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error("Error updating user profile:", error);
      addToast('Failed to update profile.', 'error');
    }
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