import React from 'react';
import Skeleton from './Skeleton';

const ProjectCardSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col bg-brand-surface/60 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg h-full">
            <Skeleton className="h-48 w-full" />
            <div className="p-3 flex flex-col flex-grow">
                <div className="flex-grow">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-1" />
                    <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
                <div className="mt-3">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                <div className="mt-3 pt-2">
                    <Skeleton className="h-2.5 w-full rounded-full" />
                    <div className="mt-2 flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCardSkeleton;
