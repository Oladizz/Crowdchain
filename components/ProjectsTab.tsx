import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Milestone } from '../types';
import Button from './Button';

const StatusBadge: React.FC<{ status: Milestone['status'] }> = ({ status }) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    const statusClasses = {
        'Pending': 'bg-gray-700 text-gray-300',
        'In Review': 'bg-yellow-800 text-yellow-200',
        'Complete': 'bg-green-800 text-green-200',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}

const ProjectsTab: React.FC = () => {
    const { user, projects, updateMilestoneStatus } = useAppContext();

    if (!user) return null;

    const myProjects = projects.filter(p => user.createdProjectIds.includes(p.id));

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Created Projects</h2>
            {myProjects.length > 0 ? (
                <div className="space-y-6">
                    {myProjects.map(project => (
                        <div key={project.id} className="bg-gray-100 dark:bg-brand-surface p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <Link to={`/project/${project.id}`} className="font-semibold text-lg text-gray-900 dark:text-white hover:underline">{project.name}</Link>
                                    <p className={`text-sm font-medium mt-1 ${project.daoStatus === 'Approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        DAO Status: {project.daoStatus}
                                    </p>
                                </div>
                                <Link to={`/project/${project.id}`}><Button variant="secondary">View</Button></Link>
                            </div>

                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Milestone Management</h3>
                            <ul className="space-y-3">
                                {project.milestones.map(milestone => (
                                    <li key={milestone.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-gray-200 dark:bg-brand-bg rounded-md gap-3">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                                            <p className="text-xs text-brand-muted">{milestone.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-3 self-end sm:self-center">
                                            <StatusBadge status={milestone.status} />
                                            {milestone.status === 'Pending' && (
                                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => updateMilestoneStatus(project.id, milestone.id, 'In Review')}>
                                                    Submit for Review
                                                </Button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-100 dark:bg-brand-surface rounded-lg">
                    <p className="text-brand-muted">You haven't created any projects yet.</p>
                     <Link to="/create"><Button variant="primary" className="mt-4">Create a Project</Button></Link>
                </div>
            )}
        </div>
    );
};

export default ProjectsTab;
