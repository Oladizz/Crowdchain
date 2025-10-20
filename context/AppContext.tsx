import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Project, Proposal, User, ProjectCategory, Milestone } from './types';
import { db } from '../services/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc, increment, getDoc, setDoc, runTransaction, arrayUnion, serverTimestamp, query, orderBy, writeBatch } from "firebase/firestore";
import { Notification } from '../components/NotificationPanel';

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
  notifications: Notification[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: number) => void;
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  fundProject: (projectId: string, amount: number) => void;
  voteOnProposal: (proposalId: string, voteType: 'for' | 'against') => void;
  updateMilestoneStatus: (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete', proof?: string) => void;
  createProject: (projectData: GeneratedProjectData) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  addComment: (projectId: string, text: string) => Promise<void>;
  addProjectUpdate: (projectId: string, updateText: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  truncateAddress: (address: string) => string;
  getUserProfileByWallet: (walletAddress: string) => Partial<User> | null;
  startGuide: (guideKey: string) => void;
  setStartGuide: (fn: (guideKey: string) => void) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'; // 84532 in hex

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [startGuide, setStartGuide] = useState(() => (key: string) => {});
  const [userProfiles, setUserProfiles] = useState<Record<string, Partial<User>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribeProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projectList);
      setIsLoading(false);
    });

    const unsubscribeProposals = onSnapshot(collection(db, "proposals"), (snapshot) => {
      const proposalList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
      setProposals(proposalList);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeProposals();
    };
  }, []);

  useEffect(() => {
    if (!user?.walletAddress) {
        setNotifications([]);
        return;
    }

    const userRef = doc(db, "users", user.walletAddress.toLowerCase());
    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUser({ walletAddress: doc.id, ...doc.data() } as User);
      }
    });

    const notificationsRef = collection(db, 'users', user.walletAddress.toLowerCase(), 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    const unsubscribeNotifications = onSnapshot(q, (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification));
        setNotifications(notificationsData);
    });

    return () => {
        unsubscribeUser();
        unsubscribeNotifications();
    }
  }, [user?.walletAddress]);

  useEffect(() => {
      if (projects.length === 0) return;
      const creatorWallets = [...new Set(projects.map(p => p.creatorWallet.toLowerCase()))];
      
      creatorWallets.forEach(async (address) => {
          if (userProfiles[address]) return; // Already fetched
          const userRef = doc(db, "users", address);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
              setUserProfiles(prev => ({...prev, [address]: userSnap.data()}));
          }
      });
  }, [projects]);

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

      const walletAddress = accounts[0].toLowerCase();
      const userRef = doc(db, "users", walletAddress);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
          setUser({ walletAddress, ...userSnap.data() } as User);
      } else {
          const newUser: Omit<User, 'walletAddress'> = {
              createdProjectIds: [],
              fundedProjects: [],
          };
          await setDoc(userRef, newUser);
          setUser({ walletAddress, ...newUser } as User);
      }
      
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

  const fundProject = async (projectId: string, amount: number) => {
    if (!user) return;
    const projectRef = doc(db, "projects", projectId);
    const userRef = doc(db, "users", user.walletAddress.toLowerCase());
    try {
        await updateDoc(projectRef, { 
            amountRaised: increment(amount),
            backers: arrayUnion(user.walletAddress.toLowerCase())
        });
        
        const existingFundingIndex = user.fundedProjects.findIndex(fp => fp.projectId === projectId);
        let updatedFundedProjects;
        if (existingFundingIndex > -1) {
            updatedFundedProjects = [...user.fundedProjects];
            updatedFundedProjects[existingFundingIndex].amount += amount;
        } else {
            updatedFundedProjects = [...user.fundedProjects, {projectId, amount}];
        }
        await updateDoc(userRef, { fundedProjects: updatedFundedProjects });

        addToast(`Successfully funded with $${amount}!`, 'success');
    } catch (e) {
        console.error("Error funding project: ", e);
        addToast('Failed to fund project.', 'error');
    }
  };

  const voteOnProposal = async (proposalId: string, voteType: 'for' | 'against') => {
    if (!user) {
        addToast("Please connect your wallet to vote.", 'error');
        return;
    }

    const proposalRef = doc(db, "proposals", proposalId);

    try {
        await runTransaction(db, async (transaction) => {
            const proposalDoc = await transaction.get(proposalRef);
            if (!proposalDoc.exists()) {
                throw "Proposal does not exist!";
            }

            const proposalData = proposalDoc.data();
            const votedBy = proposalData.votedBy || [];

            if (votedBy.includes(user.walletAddress)) {
                throw "You have already voted on this proposal.";
            }

            const updateData: any = {
                votedBy: arrayUnion(user.walletAddress)
            };

            if (voteType === 'for') {
                updateData.votesFor = increment(1);
            } else {
                updateData.votesAgainst = increment(1);
            }

            transaction.update(proposalRef, updateData);
        });

        addToast('Your vote has been cast!', 'success');
    } catch (e: any) {
        console.error("Error voting on proposal: ", e);
        const errorMessage = typeof e === 'string' ? e : 'Failed to cast vote.';
        addToast(errorMessage, 'error');
    }
  };
  
  const updateMilestoneStatus = async (projectId: string, milestoneId: number, status: 'Pending' | 'In Review' | 'Complete', proof?: string) => {
    const projectRef = doc(db, "projects", projectId);
    try {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const newMilestones = project.milestones.map(m => {
            if (m.id === milestoneId) {
                const updatedMilestone: Milestone = { ...m, status };
                if (proof) {
                   updatedMilestone.proof = proof;
                }
                return updatedMilestone;
            }
            return m;
        });

        await updateDoc(projectRef, { milestones: newMilestones });

        if (status === 'In Review') {
            addToast('Milestone submitted for DAO review.', 'info');
        }
    } catch (e) {
        console.error("Error updating milestone: ", e);
        addToast('Failed to update milestone.', 'error');
    }
  };

  const createProject = async (projectData: GeneratedProjectData) => {
    if (!user) {
        addToast("Connect your wallet to create a project.", 'error');
        return;
    }
    try {
        const fundingGoal = projectData.milestones.reduce((sum, m) => sum + m.fundsRequired, 0);
        
        const projectPayload = {
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
            backers: [],
        };

        const projectDocRef = await addDoc(collection(db, "projects"), projectPayload);

        await addDoc(collection(db, "proposals"), {
            projectId: projectDocRef.id,
            projectName: projectData.name,
            type: 'New Project',
            description: `Proposal to approve the new project: "${projectData.name}".`,
            votesFor: 0,
            votesAgainst: 0,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

        const userRef = doc(db, "users", user.walletAddress.toLowerCase());
        const updatedCreatedProjectIds = [...user.createdProjectIds, projectDocRef.id];
        await updateDoc(userRef, { createdProjectIds: updatedCreatedProjectIds });

        addToast('Project submitted to DAO for review!', 'success');
    } catch (e) {
        console.error("Error adding document: ", e);
        addToast('Failed to create project.', 'error');
    }
  };

  const updateUserProfile = async (profileData: Partial<User>) => {
    if (!user) return;
    const userRef = doc(db, "users", user.walletAddress.toLowerCase());
    try {
        await setDoc(userRef, profileData, { merge: true });
        addToast('Profile updated successfully!', 'success');
    } catch (e) {
        console.error("Error updating profile: ", e);
        addToast('Failed to update profile.', 'error');
    }
  };

  const addComment = async (projectId: string, text: string) => {
    if (!user) {
        throw new Error("User must be logged in to comment.");
    }
    const commentsRef = collection(db, 'projects', projectId, 'comments');
    await addDoc(commentsRef, {
        text: text,
        authorWallet: user.walletAddress,
        authorUsername: user.username || truncateAddress(user.walletAddress),
        authorAvatar: user.avatar || '',
        createdAt: serverTimestamp(),
    });
  };

  const addProjectUpdate = async (projectId: string, updateText: string) => {
    if (!user) throw new Error("User must be logged in to post an update.");
    
    const projectRef = doc(db, "projects", projectId);
    const newUpdate = { message: updateText, date: new Date().toISOString() };
    await updateDoc(projectRef, { updates: arrayUnion(newUpdate) });

    const project = projects.find(p => p.id === projectId);
    if (project?.backers && project.backers.length > 0) {
        const batch = writeBatch(db);
        project.backers.forEach(backerWallet => {
            const notificationRef = doc(collection(db, 'users', backerWallet, 'notifications'));
            batch.set(notificationRef, {
                message: `Project "${project.name}" has a new update.`,
                link: `/project/${projectId}`,
                isRead: false,
                createdAt: serverTimestamp(),
            });
        });
        await batch.commit();
    }
    addToast("Project update posted!", 'success');
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;
    const notifRef = doc(db, 'users', user.walletAddress, 'notifications', notificationId);
    await updateDoc(notifRef, { isRead: true });
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    notifications.filter(n => !n.isRead).forEach(n => {
        const notifRef = doc(db, 'users', user.walletAddress, 'notifications', n.id);
        batch.update(notifRef, { isRead: true });
    });
    await batch.commit();
  };
  
  const getUserProfileByWallet = (walletAddress: string): Partial<User> | null => {
      return userProfiles[walletAddress.toLowerCase()] || null;
  };


  return (
    <AppContext.Provider value={{ projects, proposals, user, theme, toasts, isLoading, notifications, addToast, removeToast, login: connectWallet, logout, toggleTheme, fundProject, voteOnProposal, updateMilestoneStatus, createProject, updateUserProfile, addComment, addProjectUpdate, markNotificationAsRead, markAllNotificationsAsRead, truncateAddress, getUserProfileByWallet, startGuide, setStartGuide }}>
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