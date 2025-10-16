import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ProjectCategory } from '../types';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

interface GeneratedData {
  name: string;
  description: string;
  category: ProjectCategory;
  milestones: {
    title: string;
    description: string;
    fundsRequired: number;
  }[];
}

const CreateProjectPage: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleGenerate = async () => {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      setError('AI features are disabled. An API key is required but was not found in the environment configuration.');
      return;
    }

    if (!idea.trim()) {
      setError('Please enter your project idea.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedData(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'A creative and catchy name for the project.' },
          description: { type: Type.STRING, description: 'A compelling, detailed description of the project (2-3 paragraphs).' },
          category: {
            type: Type.STRING,
            enum: Object.values(ProjectCategory),
            description: 'The most fitting category for the project.'
          },
          milestones: {
            type: Type.ARRAY,
            description: 'A list of 3 essential milestones to get the project started.',
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'A concise title for the milestone.' },
                description: { type: Type.STRING, description: 'A short description of what this milestone entails.' },
                fundsRequired: { type: Type.INTEGER, description: 'An estimated amount of funds required for this milestone, as a number.' }
              },
              required: ['title', 'description', 'fundsRequired']
            }
          }
        },
        required: ['name', 'description', 'category', 'milestones']
      };

      const prompt = `You are an expert in creating successful crowdfunding campaigns. Based on the following user idea, generate a complete project proposal. The proposal should be engaging and well-structured. User idea: "${idea}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      
      const parsedData = JSON.parse(response.text);
      setGeneratedData(parsedData);

    } catch (e) {
      console.error(e);
      setError('Failed to generate project details. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!generatedData) return;
      const { name, value } = e.target;
      setGeneratedData({ ...generatedData, [name]: value });
  };

  const handleMilestoneChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!generatedData) return;
    const { name, value } = e.target;
    const newMilestones = [...generatedData.milestones];
    newMilestones[index] = { ...newMilestones[index], [name]: name === 'fundsRequired' ? Number(value) : value };
    setGeneratedData({ ...generatedData, milestones: newMilestones });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the generatedData to the backend/blockchain
    console.log('Submitting project:', generatedData);
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
          Let our AI assistant help you craft the perfect campaign.
        </p>
      </div>

      {!generatedData && (
        <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4 animate-fade-in">
          <label htmlFor="idea" className="block text-sm font-medium text-brand-muted">
            Start with your core idea
          </label>
          <textarea
            id="idea"
            name="idea"
            rows={4}
            className="w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white"
            placeholder="e.g., An open-source, decentralized social media platform where users own their data."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button onClick={handleGenerate} disabled={isLoading} Icon={isLoading ? Spinner : undefined}>
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md animate-fade-in">{error}</p>}
      
      {generatedData && (
        <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
            <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-semibold text-white">Review & Refine Your Project</h2>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-muted">Project Name</label>
                    <input type="text" name="name" id="name" value={generatedData.name} onChange={handleFormChange} className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white" />
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-brand-muted">Category</label>
                    <select name="category" id="category" value={generatedData.category} onChange={handleFormChange} className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white">
                        {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-brand-muted">Description</label>
                    <textarea name="description" id="description" rows={6} value={generatedData.description} onChange={handleFormChange} className="mt-1 w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-white" />
                </div>
            </div>

            <div className="bg-brand-surface p-4 sm:p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-semibold text-white">Initial Milestones</h2>
                <div className="space-y-4">
                    {generatedData.milestones.map((milestone, index) => (
                        <div key={index} className="p-3 border border-brand-bg rounded-md space-y-2">
                             <input type="text" name="title" value={milestone.title} onChange={(e) => handleMilestoneChange(index, e)} placeholder="Milestone Title" className="w-full bg-brand-bg border-none focus:ring-0 rounded-md p-1 text-white font-medium" />
                             <input type="text" name="description" value={milestone.description} onChange={(e) => handleMilestoneChange(index, e)} placeholder="Milestone Description" className="w-full bg-brand-bg border-none focus:ring-0 rounded-md p-1 text-sm text-brand-muted" />
                             <div className="flex items-center space-x-2">
                                <span className="text-brand-blue-light">$</span>
                                <input type="number" name="fundsRequired" value={milestone.fundsRequired} onChange={(e) => handleMilestoneChange(index, e)} placeholder="Funds" className="w-1/3 bg-brand-bg border-none focus:ring-0 rounded-md p-1 text-white" />
                             </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={() => setGeneratedData(null)}>Start Over</Button>
                <Button type="submit" variant="primary">Submit for DAO Review</Button>
            </div>
        </form>
      )}
    </div>
  );
};

export default CreateProjectPage;