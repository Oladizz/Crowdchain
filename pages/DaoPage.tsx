
import React, { useState, useMemo } from 'react';
import ProposalCard from '../components/ProposalCard';
import StatCard from '../components/StatCard';
import { Proposal } from '../types';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import Button from '../components/Button';

const DaoPage: React.FC = () => {
    const { proposals, projects, user, voteOnProposal } = useAppContext();
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    
    const proposalsPassed = useMemo(() => {
        return proposals.filter(p => new Date(p.deadline) < new Date() && p.votesFor > p.votesAgainst).length;
    }, [proposals]);

    const totalMembers = useMemo(() => {
        const creatorWallets = new Set(projects.map(p => p.creatorWallet));
        return creatorWallets.size;
    }, [projects]);

    const handleVoteClick = (proposal: Proposal) => {
        if (user) {
            setSelectedProposal(proposal);
        } else {
            // In a real app, you might prompt the user to connect their wallet first.
            alert("Please connect your wallet to vote.");
        }
    };
    
    const submitVote = (vote: 'for' | 'against') => {
        if(selectedProposal) {
            voteOnProposal(selectedProposal.id, vote);
            setSelectedProposal(null);
        }
    };

  return (
    <>
    <div className="space-y-10 sm:space-y-12">
      <div className="text-center" data-guide="dao-welcome">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">DAO Governance</h1>
        <p className="mt-2 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base text-brand-muted">
          Your voice matters. Participate in the governance of CrowdChain by voting on project proposals and milestone approvals.
        </p>
      </div>

      <section>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <StatCard label="Total Members" value={totalMembers} />
              <StatCard label="Proposals Passed" value={proposalsPassed} />
              <StatCard label="Active Proposals" value={proposals.length} />
          </div>
      </section>

      <section data-guide="proposal-section">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Active Proposals</h2>
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {proposals.length > 0 ? (
            proposals.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} onVoteClick={() => handleVoteClick(proposal)} />
            ))
          ) : (
             <div className="text-center py-10 bg-gray-100 dark:bg-brand-surface rounded-lg">
                <p className="text-brand-muted">There are no active proposals at this time.</p>
             </div>
          )}
        </div>
      </section>
    </div>
    <Modal isOpen={!!selectedProposal} onClose={() => setSelectedProposal(null)} title={`Vote on "${selectedProposal?.projectName}"`}>
        {selectedProposal && (
            <div className="space-y-4">
                <p className="text-sm text-brand-muted">{selectedProposal.description}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Are you sure you want to cast your vote? This action is irreversible.</p>
                <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="primary" className="bg-green-600 hover:bg-green-700 w-full" onClick={() => submitVote('for')}>Vote Yes</Button>
                    <Button variant="primary" className="bg-red-600 hover:bg-red-700 w-full" onClick={() => submitVote('against')}>Vote No</Button>
                </div>
            </div>
        )}
    </Modal>
    </>
  );
};

export default DaoPage;
