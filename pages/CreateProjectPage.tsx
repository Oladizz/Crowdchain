import React, { useState } from 'react';
import { ProjectCategory } from '../types';
import Button from '../components/Button';

// Define interfaces for form data
interface MilestoneData {
    title: string;
    description: string;
    fundsRequired: number | '';
}

interface ProjectFormData {
    name: string;
    description: string;
    category: ProjectCategory;
    milestones: MilestoneData[];
}

// Initial state for new milestones and the form
const initialMilestone: MilestoneData = { title: '', description: '', fundsRequired: '' };
const initialProjectData: ProjectFormData = {
    name: '',
    description: '',
    category: ProjectCategory.TECH,
    milestones: [{ ...initialMilestone }]
};

const CreateProjectPage: React.FC = () => {
    const [projectData, setProjectData] = useState<ProjectFormData>(initialProjectData);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProjectData(prev => ({ ...prev, [name]: value }));
    };

    const handleMilestoneChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newMilestones = [...projectData.milestones];
        const parsedValue = name === 'fundsRequired' ? (value === '' ? '' : parseInt(value, 10)) : value;
        (newMilestones[index] as any)[name] = parsedValue;
        setProjectData(prev => ({ ...prev, milestones: newMilestones }));
    };

    const addMilestone = () => {
        setProjectData(prev => ({
            ...prev,
            milestones: [...prev.milestones, { ...initialMilestone }]
        }));
    };

    const removeMilestone = (index: number) => {
        if (projectData.milestones.length > 1) {
            const newMilestones = projectData.milestones.filter((_, i) => i !== index);
            setProjectData(prev => ({ ...prev, milestones: newMilestones }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectData.name.trim() || !projectData.description.trim()) {
            setError('Project Name and Description are required.');
            return;
        }
        for (const milestone of projectData.milestones) {
            if (!milestone.title.trim() || milestone.fundsRequired === '' || milestone.fundsRequired <= 0) {
                setError('All milestones must have a valid title and funding amount greater than zero.');
                return;
            }
        }
        setError(null);
        console.log('Submitting project:', projectData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center py-16 animate-fade-in">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Thank You!</h1>
                <p className="mt-4 text-brand-muted">Your project has been submitted for DAO review.</p>
                <p className="text-brand-muted">You will be notified once the proposal is live for voting.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Create a New Project</h1>
                <p className="mt-2 sm:mt-4 text-sm sm:text-base text-brand-muted">
                    Fill out the details below to submit your project for DAO review.
                </p>
            </div>

            <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4">
                    <h2 className="text-lg font-semibold text-white">Project Details</h2>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-muted">Project Name</label>
                        <input type="text" name="name" id="name" value={projectData.name} onChange={handleFormChange} required className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-brand-muted">Category</label>
                        <select name="category" id="category" value={projectData.category} onChange={handleFormChange} className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white">
                            {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-muted">Description</label>
                        <textarea name="description" id="description" rows={6} value={projectData.description} onChange={handleFormChange} required className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white" />
                    </div>
                </div>

                <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4">
                    <h2 className="text-lg font-semibold text-white">Initial Milestones</h2>
                    <div className="space-y-4">
                        {projectData.milestones.map((milestone, index) => (
                            <div key={index} className="p-3 border border-brand-bg rounded-md space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-medium text-white">Milestone {index + 1}</h3>
                                    {projectData.milestones.length > 1 && (
                                        <button type="button" onClick={() => removeMilestone(index)} className="text-red-500 hover:text-red-400 text-xs font-semibold">Remove</button>
                                    )}
                                </div>
                                <input type="text" name="title" value={milestone.title} onChange={(e) => handleMilestoneChange(index, e)} placeholder="Milestone Title" required className="w-full bg-brand-bg border-none focus:ring-0 rounded-md p-1 text-white font-medium" />
                                <textarea name="description" value={milestone.description} onChange={(e) => handleMilestoneChange(index, e)} placeholder="Milestone Description" rows={2} className="w-full bg-brand-bg border-none focus:ring-0 rounded-md p-1 text-sm text-brand-muted" />
                                <div className="flex items-center space-x-2">
                                    <span className="text-brand-blue-light">$</span>
                                    <input type="number" name="fundsRequired" value={milestone.fundsRequired} onChange={(e) => handleMilestoneChange(index, e)} placeholder="Funds Required" required min="1" className="w-1/3 bg-brand-bg border-none focus:ring-0 rounded-md p-1 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addMilestone}>Add Another Milestone</Button>
                </div>

                {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md animate-fade-in">{error}</p>}

                <div className="flex justify-end space-x-4">
                    <Button type="submit" variant="primary">Submit for DAO Review</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateProjectPage;