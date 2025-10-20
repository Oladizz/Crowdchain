import React from 'react';
import { Link } from 'react-router-dom';

interface CommentProps {
    authorAvatar?: string;
    authorUsername: string;
    authorWallet: string;
    text: string;
    date: Date;
}

const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const Comment: React.FC<CommentProps> = ({ authorAvatar, authorUsername, authorWallet, text, date }) => {
    return (
        <div className="flex items-start space-x-4">
            <Link to={`/profile/${authorWallet}`}>
                {authorAvatar ? (
                    <img src={authorAvatar} alt={authorUsername} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-brand-muted" />
                    </div>
                )}
            </Link>
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <Link to={`/profile/${authorWallet}`} className="font-semibold text-white hover:underline">
                        {authorUsername}
                    </Link>
                    <span className="text-xs text-brand-muted">{date.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-brand-muted">{text}</p>
            </div>
        </div>
    );
};

export default Comment;
