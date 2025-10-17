
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import { useAppContext } from '../context/AppContext';

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const HomePage: React.FC = () => {
  const { projects, user } = useAppContext();
  
  const approvedProjects = useMemo(() => projects.filter(p => p.daoStatus === 'Approved'), [projects]);

  const spotlightProjects = approvedProjects.slice(0, 4);
  const newestProjects = [...approvedProjects].sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()).slice(0, 4); // Simplistic way to get "newest"

  const recommendedProjects = useMemo(() => {
    if (!user) return [];

    const fundedProjectIds = new Set(user.fundedProjects.map(p => p.projectId));
    if (fundedProjectIds.size === 0) return [];

    const fundedCategories = new Set(
        projects
            .filter(p => fundedProjectIds.has(p.id))
            .map(p => p.category)
    );

    return approvedProjects.filter(p => 
        !fundedProjectIds.has(p.id) &&
        !user.createdProjectIds.includes(p.id) &&
        fundedCategories.has(p.category)
    ).slice(0, 4);
  }, [user, projects, approvedProjects]);
  
  const totalFundsRaised = Math.round(projects.reduce((sum, p) => sum + p.amountRaised, 0));
  const activeProjectsCount = approvedProjects.length;
  
  const daoMembers = useMemo(() => {
    const creatorWallets = new Set(projects.map(p => p.creatorWallet));
    return creatorWallets.size;
  }, [projects]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center pt-8 pb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white animate-text-focus-in">
          The Future of Funding, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
            Decentralized.
          </span>
        </h1>
        <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-brand-muted animate-fade-in" style={{ animationDelay: '0.5s' }}>
          CrowdChain empowers creators and communities by connecting innovative ideas with blockchain-powered funding and DAO governance.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-row justify-center space-x-4 animate-fade-in" style={{ animationDelay: '1s' }}>
          <Link to="/explore">
            <Button variant="primary">
              Explore Projects
            </Button>
          </Link>
          <Link to="/create">
            <Button variant="secondary">Start a Project</Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="animate-slide-in-bottom" style={{ animationDelay: '1.2s' }}>
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
          <StatCard label="Total Funds Raised" value={totalFundsRaised} prefix="$" />
          <StatCard label="Active Projects" value={activeProjectsCount} />
          <StatCard label="DAO Members" value={daoMembers} />
        </div>
      </section>

      {/* Spotlight Projects Section */}
      <section className="animate-slide-in-bottom" style={{ animationDelay: '1.4s' }}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Spotlight Projects</h2>
            <Link to="/explore">
                <Button variant="ghost" Icon={ChevronRightIcon}>
                    View All
                </Button>
            </Link>
        </div>
        {spotlightProjects.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 -mx-4 px-4">
            {spotlightProjects.map(project => (
              <div key={project.id} className="flex-shrink-0 w-64">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-100 dark:bg-brand-surface rounded-lg">
            <p className="text-brand-muted">No spotlight projects available right now.</p>
          </div>
        )}
      </section>

      {/* Recommended For You Section */}
      {user && recommendedProjects.length > 0 && (
          <section className="animate-slide-in-bottom" style={{ animationDelay: '1.6s' }}>
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Recommended For You</h2>
              </div>
              <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 -mx-4 px-4">
                  {recommendedProjects.map(project => (
                      <div key={project.id} className="flex-shrink-0 w-64">
                          <ProjectCard project={project} />
                      </div>
                  ))}
              </div>
          </section>
      )}

      {/* Newest Projects Section */}
      <section className="animate-slide-in-bottom" style={{ animationDelay: '1.8s' }}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Newest Projects</h2>
        </div>
        {newestProjects.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 -mx-4 px-4">
            {newestProjects.map(project => (
              <div key={project.id} className="flex-shrink-0 w-64">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-100 dark:bg-brand-surface rounded-lg">
            <p className="text-brand-muted">No new projects available right now.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default HomePage;
