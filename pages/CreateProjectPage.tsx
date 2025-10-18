import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ProjectCategory } from '../types';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { useAppContext } from '../context/AppContext';

interface GeneratedMilestone {
    title: string;
    description: string;
    fundsRequired: number;
}

interface GeneratedProjectData {
    name: string;
    description: string;
    category: ProjectCategory;
    milestones: GeneratedMilestone[];
}

const CreateProjectPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedData, setGeneratedData] = useState<GeneratedProjectData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const { user, createProject } = useAppContext();

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a project idea.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'A creative and concise name for the project.' },
                    description: { type: Type.STRING, description: 'A compelling, detailed description of the project (2-3 sentences).' },
                    category: {
                        type: Type.STRING,
                        enum: Object.values(ProjectCategory),
                        description: 'The most appropriate category for the project.'
                    },
                    milestones: {
                        type: Type.ARRAY,
                        description: 'A list of 3-4 logical milestones to complete the project.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: 'A short, clear title for the milestone.' },
                                description: { type: Type.STRING, description: 'A brief description of what this milestone entails.' },
                                fundsRequired: { type: Type.INTEGER, description: 'The estimated amount of funds (USD) required for this milestone.' }
                            },
                            required: ['title', 'description', 'fundsRequired']
                        }
                    }
                },
                required: ['name', 'description', 'category', 'milestones']
            };

            const fullPrompt = `You are a creative project manager for a decentralized crowdfunding platform. Based on the user's idea, generate a complete project plan.
            User Idea: "${prompt}"
            Your task is to flesh this out into a structured project with a name, description, category, and logical funding milestones. Ensure the total funding goal (sum of milestones) is realistic for a crowdfunded project. Respond ONLY with the JSON object.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema,
                },
            });

            const parsedData = JSON.parse(response.text);
            setGeneratedData(parsedData);

        } catch (err) {
            console.error(err);
            setError('Failed to generate project plan. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!generatedData) {
            setError("No project data to submit.");
            return;
        }
        if (!user) {
            setError("You must be logged in to submit a project.");
            return;
        }
        createProject(generatedData);
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Bring Your Idea to Life</h1>
                <p className="mt-2 sm:mt-4 text-sm sm:text-base text-brand-muted">
                    Describe your project idea, and our AI will help you build a comprehensive plan to submit for funding.
                </p>
            </div>
            
            <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4 animate-fade-in">
                <label htmlFor="prompt" className="block text-sm font-medium text-brand-muted">Your Project Idea</label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., An open-source, decentralized social media app focused on user privacy."
                    rows={4}
                    className="w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white"
                    disabled={isLoading}
                />
                 <div className="flex justify-end">
                    <Button onClick={handleGenerate} disabled={isLoading || !prompt} variant="primary">
                        {isLoading ? <><Spinner className="mr-2" /> Generating...</> : 'Generate Project Plan'}
                    </Button>
                </div>
            </div>

            {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md animate-fade-in">{error}</p>}

            {isLoading && (
                <div className="text-center py-10">
                    <div className="flex justify-center items-center">
                        <Spinner className="h-8 w-8" />
                    </div>
                    <p className="mt-4 text-brand-muted animate-pulse">Generating your project... this may take a moment.</p>
                </div>
            )}

            {generatedData && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-semibold text-center text-white">Review Your Generated Project</h2>
                    <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4">
                        <h3 className="text-lg font-semibold text-white">Project Details</h3>
                        <div>
                            <p className="text-sm font-medium text-brand-muted">Project Name</p>
                            <p className="mt-1 text-white">{generatedData.name}</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium text-brand-muted">Category</p>
                            <p className="mt-1 text-white">{generatedData.category}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-brand-muted">Description</p>
                            <p className="mt-1 text-brand-muted">{generatedData.description}</p>
                        </div>
                    </div>
                     <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4">
                        <h3 className="text-lg font-semibold text-white">Generated Milestones</h3>
                        <div className="space-y-3">
                            {generatedData.milestones.map((milestone, index) => (
                                <div key={index} className="p-3 border border-brand-bg rounded-md">
                                    <p className="font-medium text-white">{milestone.title} - <span className="text-brand-blue-light">${milestone.fundsRequired.toLocaleString()}</span></p>
                                    <p className="text-sm text-brand-muted">{milestone.description}</p>
                                </div>
                            ))}
                        </div>
                         <p className="text-right font-bold text-white">Total Funding Goal: ${generatedData.milestones.reduce((sum, m) => sum + m.fundsRequired, 0).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button variant="secondary" onClick={handleGenerate} disabled={isLoading}>
                            {isLoading ? <Spinner className="mr-2" /> : 'Regenerate'}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={isLoading || !user}>Submit to DAO</Button>
                    </div>
                    {!user && <p className="text-right text-yellow-400 text-xs mt-2">Please connect your wallet to submit.</p>}
                </div>
            )}
        </div>
    );
};

export default CreateProjectPage;