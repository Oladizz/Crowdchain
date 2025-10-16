import { Project, Proposal, ProjectCategory, User } from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Quantum Leap AI',
    creator: 'Ada Lovelace',
    creatorWallet: '0x123...abc',
    image: 'https://picsum.photos/seed/quantum/800/600',
    description: 'Developing a next-generation AI core based on quantum computing principles to solve complex global challenges, from climate change to drug discovery. Our goal is to create a truly sentient AI for the betterment of humanity.',
    category: ProjectCategory.TECH,
    fundingGoal: 50000,
    amountRaised: 37500,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    daoStatus: 'Approved',
    milestones: [
      { id: 1, title: 'Whitepaper & Team Assembly', description: 'Finalize the project whitepaper and assemble the core development team.', fundsRequired: 5000, status: 'Complete' },
      { id: 2, title: 'Prototype Quantum Algorithm', description: 'Develop and test the first version of the core quantum algorithm.', fundsRequired: 20000, status: 'In Review' },
      { id: 3, title: 'Hardware Integration', description: 'Integrate the quantum algorithm with specialized quantum computing hardware.', fundsRequired: 25000, status: 'Pending' },
    ],
    updates: [
        { date: '2024-07-20', message: 'Milestone 1 complete! Our team is fully assembled and the whitepaper has been published.'},
        { date: '2024-08-05', message: 'Incredible progress on the prototype algorithm. Submitting for Milestone 2 review!'}
    ]
  },
  {
    id: '2',
    name: 'Project Nebula',
    creator: 'Carl Sagan',
    creatorWallet: '0x456...def',
    image: 'https://picsum.photos/seed/nebula/800/600',
    description: 'An open-source, community-driven space exploration game. Explore a procedurally generated galaxy, trade with other players, and build your own starships. All in-game assets are player-owned NFTs.',
    category: ProjectCategory.GAMING,
    fundingGoal: 75000,
    amountRaised: 76000,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    daoStatus: 'Approved',
    milestones: [
      { id: 1, title: 'Game Design Document', description: 'Create a comprehensive GDD outlining all game mechanics, lore, and art direction.', fundsRequired: 10000, status: 'Complete' },
      { id: 2, title: 'Playable Alpha', description: 'Build a playable alpha version of the game with core gameplay loops.', fundsRequired: 30000, status: 'Complete' },
      { id: 3, title: 'NFT Integration & Beta Launch', description: 'Integrate NFT assets into the game and launch the open beta to the public.', fundsRequired: 35000, status: 'In Review' },
    ],
    updates: [
        { date: '2024-08-01', message: 'We are fully funded! Thank you to our amazing community.'}
    ]
  },
  {
    id: '3',
    name: 'BioSynth Food Initiative',
    creator: 'Marie Curie',
    creatorWallet: '0x789...ghi',
    image: 'https://picsum.photos/seed/biosynth/800/600',
    description: 'A research project to create sustainable, lab-grown food sources using advanced biosynthesis techniques. Our mission is to combat food scarcity and reduce the environmental impact of traditional agriculture.',
    category: ProjectCategory.SCIENCE,
    fundingGoal: 120000,
    amountRaised: 45000,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    daoStatus: 'Approved',
    milestones: [
        { id: 1, title: 'Lab Setup & Equipment', description: 'Procure all necessary lab equipment and set up the research facility.', fundsRequired: 40000, status: 'In Review' },
        { id: 2, title: 'First Successful Protein Synthesis', description: 'Achieve the first successful synthesis of a stable, edible protein.', fundsRequired: 40000, status: 'Pending' },
        { id: 3, title: 'Scale Production & Taste Testing', description: 'Develop a method for scaling production and conduct initial taste tests with volunteers.', fundsRequired: 40000, status: 'Pending' },
    ],
    updates: []
  },
  {
    id: '4',
    name: 'Cyber Sanctuaries',
    creator: 'Katsushika Hokusai',
    creatorWallet: '0xabc...123',
    image: 'https://picsum.photos/seed/cyber/800/600',
    description: 'A generative art collection exploring the intersection of nature and digital life. Each piece is a unique, evolving digital terrarium, minted on-chain. Holders can influence the growth of their sanctuary.',
    category: ProjectCategory.ART,
    fundingGoal: 20000,
    amountRaised: 12000,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    daoStatus: 'Pending',
    milestones: [
        { id: 1, title: 'Generative Art Engine', description: 'Build the core generative algorithm that creates the unique digital terrariums.', fundsRequired: 10000, status: 'Pending' },
        { id: 2, title: 'Minting dApp and Launch', description: 'Develop the decentralized application for minting the art pieces and launch the collection.', fundsRequired: 10000, status: 'Pending' },
    ],
    updates: []
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'p1',
    projectId: '4',
    projectName: 'Cyber Sanctuaries',
    type: 'New Project',
    description: 'A new generative art project seeking initial funding approval from the DAO.',
    votesFor: 125890,
    votesAgainst: 11230,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p2',
    projectId: '1',
    projectName: 'Quantum Leap AI',
    type: 'Milestone Release',
    description: 'Requesting release of funds for Milestone 2: Prototype Quantum Algorithm, following successful completion of initial research phase.',
    votesFor: 890543,
    votesAgainst: 54321,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: 'p3',
    projectId: '3',
    projectName: 'BioSynth Food Initiative',
    type: 'Milestone Release',
    description: 'Requesting funds for Milestone 1: Lab Setup & Equipment. We have secured a location and have quotes from suppliers.',
    votesFor: 34567,
    votesAgainst: 890,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockUser: User = {
    walletAddress: '0x1A4b...CdeF',
    username: 'Creator123',
    bio: 'Innovator, builder, and early adopter of decentralized tech.',
    avatar: 'https://i.pravatar.cc/150?u=0x1A4bCdeF',
    createdProjectIds: ['4'],
    fundedProjects: [
        { projectId: '1', amount: 500 },
        { projectId: '2', amount: 1000 },
    ],
};
