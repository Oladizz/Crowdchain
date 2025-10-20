import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import Comment from './Comment';
import CommentForm from './CommentForm';
import Skeleton from './Skeleton';

interface CommentData {
    id: string;
    authorAvatar?: string;
    authorUsername: string;
    authorWallet: string;
    text: string;
    createdAt: Timestamp;
}

interface CommentSectionProps {
    projectId: string;
}

const CommentSkeleton: React.FC = () => (
    <div className="flex items-start space-x-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    </div>
);

const CommentSection: React.FC<CommentSectionProps> = ({ projectId }) => {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        const commentsRef = collection(db, 'projects', projectId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CommentData));
            setComments(commentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [projectId]);

    return (
        <div className="bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl p-4 sm:p-5 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Community Comments ({comments.length})
            </h2>
            
            <CommentForm projectId={projectId} />

            <div className="space-y-6 pt-4 border-t border-brand-surface">
                {loading ? (
                    <div className="space-y-6">
                        <CommentSkeleton />
                        <CommentSkeleton />
                    </div>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <Comment
                            key={comment.id}
                            authorAvatar={comment.authorAvatar}
                            authorUsername={comment.authorUsername}
                            authorWallet={comment.authorWallet}
                            text={comment.text}
                            date={comment.createdAt.toDate()}
                        />
                    ))
                ) : (
                    <p className="text-brand-muted text-center py-4">No comments yet. Be the first to say something!</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
