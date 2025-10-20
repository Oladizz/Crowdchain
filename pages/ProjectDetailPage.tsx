import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Milestone } from '../context/types';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { getDynamicFontSize } from '../utils';
import CommentSection from '../components/CommentSection';

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LockClosedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const UserCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-brand-muted"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const MilestoneStatusIcon: React.FC<{ status: Milestone['status'] }> = ({ status }) => {
    switch (status) {
        case 'Complete': return <CheckCircleIcon />;
        case 'In Review': return <ClockIcon />;
        case 'Pending': return <LockClosedIcon />;
        default: return null;
    }
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, user, fundProject, addProjectUpdate, addToast } = useAppContext();
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [updateText, setUpdateText] = useState('');

  const project = projects.find(p => p.id === id);

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project && fundAmount && Number(fundAmount) > 0) {
      const amount = Number(fundAmount);
      const remainingAmount = project.fundingGoal - project.amountRaised;
      if (amount > remainingAmount) {
        addToast("You cannot fund more than the remaining amount.", 'error');
        return;
      }
      fundProject(project.id, amount);
      setIsFundingModalOpen(false);
      setFundAmount('');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !updateText.trim()) return;
    await addProjectUpdate(project.id, updateText);
    setUpdateText('');
  };

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Project Not Found</h1>
        <p className="mt-4 text-brand-muted">The project you're looking for doesn't exist.</p>
        <Link to="/explore">
            <Button variant="primary" className="mt-8">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const isCreator = user?.walletAddress.toLowerCase() === project.creatorWallet.toLowerCase();
  const percentage = Math.round((project.amountRaised / project.fundingGoal) * 100);
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const remainingAmount = project.fundingGoal - project.amountRaised;

  return (
    <>
      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Left Column (Image & Funding) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300 mb-2">
                {project.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-3xl lg:text-4xl break-words">{project.name}</h1>
          </div>
          <img src={project.image} alt={project.name} className="w-full h-auto object-cover rounded-xl shadow-2xl border border-white/10" />
          
          <div className="bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Project Story</h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed break-words">{project.description}</p>
          </div>

          <div className="bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Updates</h2>
              {isCreator && (
                  <form onSubmit={handleUpdateSubmit} className="mb-6 space-y-2">
                      <textarea value={updateText} onChange={(e) => setUpdateText(e.target.value)} placeholder="Post a new update for your backers..." rows={3} className="w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-lg p-2 text-white" required />
                      <div className="text-right"><Button type="submit" variant="primary" disabled={!updateText.trim()}>Post Update</Button></div>
                  </form>
              )}
              {project.updates.length > 0 ? (
                <div className="space-y-4">
                    {project.updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((update, index) => (
                        <div key={index} className="border-l-4 border-brand-blue pl-4">
                            <p className="text-xs sm:text-sm text-brand-muted">{new Date(update.date).toLocaleDateString()}</p>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white">{update.message}</p>
                        </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base text-brand-muted">No updates yet. Stay tuned!</p>
              )}
          </div>

          <CommentSection projectId={project.id} />
        </div>

        {/* Right Column (Stats & Milestones) */}
        <div className="mt-8 lg:mt-0 space-y-4 sm:space-y-6">
          <div data-guide="project-funding" className="bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl p-4 sm:p-5 sticky top-24">
            <ProgressBar value={project.amountRaised} max={project.fundingGoal} />
            <div className="mt-4">
              <p className="text-xl sm:text-2xl font-bold text-brand-blue-light break-words" style={getDynamicFontSize(project.amountRaised)}>${project.amountRaised.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-brand-muted" style={getDynamicFontSize(project.fundingGoal)}>raised of ${project.fundingGoal.toLocaleString()} goal</p>
            </div>
            <div className="mt-4 sm:mt-6 flex justify-between text-sm sm:text-base">
                <div>
                    <p className="font-bold text-gray-900 dark:text-white" style={getDynamicFontSize(percentage)}>{percentage}%</p>
                    <p className="text-xs sm:text-sm text-brand-muted">Funded</p>
                </div>
                <div>
                    <p className="font-bold text-gray-900 dark:text-white" style={getDynamicFontSize(daysLeft)}>{daysLeft}</p>
                    <p className="text-xs sm:text-sm text-brand-muted">Days Left</p>
                </div>
            </div>
            {project.daoStatus === 'Pending' && <p className="mt-4 text-center text-xs sm:text-sm bg-yellow-900 text-yellow-300 p-2 rounded-lg">Project is under DAO review.</p>}
            <Button 
              data-guide="fund-button"
              variant="primary" 
              className="w-full mt-6 text-sm sm:text-base"
              onClick={() => setIsFundingModalOpen(true)}
              disabled={!user || project.daoStatus !== 'Approved' || daysLeft <= 0 || project.amountRaised >= project.fundingGoal}
            >
              {daysLeft > 0 ? 'Fund this Project' : 'Funding Ended'}
            </Button>
          </div>

          <div className="bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">About the Creator</h3>
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <UserCircleIcon />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white break-words truncate">{project.creator}</p>
                    <Link to={`/profile/${project.creatorWallet}`} className="text-xs text-brand-blue-light hover:underline mt-1 inline-block">
                        View Profile
                    </Link>
                </div>
            </div>
          </div>

          <div data-guide="milestones" className="bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Milestones</h3>
            <ul className="space-y-4">
              {project.milestones.map(milestone => (
                <li key={milestone.id} className="flex items-start space-x-3 sm:space-x-4">
                    <div><MilestoneStatusIcon status={milestone.status}/></div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">{milestone.title} - <span className="text-brand-blue-light" style={getDynamicFontSize(milestone.fundsRequired)}>${milestone.fundsRequired.toLocaleString()}</span></p>
                        <p className="text-xs sm:text-sm text-brand-muted break-words">{milestone.description}</p>
                        {milestone.proof && (
                            <a href={milestone.proof} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue-light hover:underline mt-1 inline-block">
                                View Proof
                            </a>
                        )}
                    </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <Modal isOpen={isFundingModalOpen} onClose={() => setIsFundingModalOpen(false)} title={`Fund "${project.name}"`}>
        <form onSubmit={handleFundSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="fundAmount" className="block text-sm font-medium text-brand-muted">Amount (in USD)</label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-brand-muted sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            name="fundAmount"
                            id="fundAmount"
                            className="w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-lg py-2 pl-7 pr-4 text-white"
                            placeholder="0.00"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                            min="1"
                            max={remainingAmount > 0 ? remainingAmount : 0}
                            required
                            autoFocus
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={() => setIsFundingModalOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">Confirm Funding</Button>
                </div>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default ProjectDetailPage;