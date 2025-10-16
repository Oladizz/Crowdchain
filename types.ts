
export enum ProjectCategory {
  TECH = 'Technology',
  ART = 'Art',
  GAMING = 'Gaming',
  COMMUNITY = 'Community',
  SCIENCE = 'Science'
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  fundsRequired: number;
  status: 'Pending' | 'In Review' | 'Complete';
  proof?: string;
}

export interface Project {
  id: string;
  name: string;
  creator: string;
  creatorWallet: string;
  image: string;
  description: string;
  category: ProjectCategory;
  fundingGoal: number;
  amountRaised: number;
  deadline: string;
  milestones: Milestone[];
  daoStatus: 'Pending' | 'Approved' | 'Rejected';
  updates: { date: string; message: string }[];
}

export interface Proposal {
  id: string;
  projectId: string;
  projectName: string;
  type: 'New Project' | 'Milestone Release';
  description: string;
  votesFor: number;
  votesAgainst: number;
  deadline: string;
}

export interface User {
  walletAddress: string;
  username: string;
  bio: string;
  avatar: string;
  createdProjectIds: string[];
  fundedProjects: { projectId: string; amount: number }[];
}
