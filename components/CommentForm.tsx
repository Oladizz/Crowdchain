import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './Button';

interface CommentFormProps {
    projectId: string;
    onCommentPosted?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ projectId, onCommentPosted }) => {
    const { user, addComment } = useAppContext();
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !text.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(projectId, text);
            setText('');
            if (onCommentPosted) onCommentPosted();
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center text-brand-muted p-4 bg-brand-surface/60 rounded-lg border border-brand-surface">
                <p>Please connect your wallet to leave a comment.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-start space-x-4 mt-6">
             <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a public comment..."
                rows={2}
                className="w-full bg-brand-bg border border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-lg p-2 text-white"
                required
            />
            <Button type="submit" variant="primary" disabled={isSubmitting || !text.trim()}>
                {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
        </form>
    );
};

export default CommentForm;
