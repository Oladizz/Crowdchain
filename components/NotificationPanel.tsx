import React from 'react';
import { Link } from 'react-router-dom';

export interface Notification {
    id: string;
    message: string;
    link: string;
    isRead: boolean;
    createdAt: any;
}

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAllAsRead: () => void;
    onNotificationClick: (notificationId: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onMarkAllAsRead, onNotificationClick }) => {
    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-brand-surface/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg z-40">
            <div className="p-3 flex justify-between items-center border-b border-brand-surface">
                <h3 className="font-semibold text-white text-sm">Notifications</h3>
                <button onClick={onMarkAllAsRead} className="text-xs text-brand-blue-light hover:underline">Mark all as read</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <Link
                            to={notif.link}
                            key={notif.id}
                            onClick={() => onNotificationClick(notif.id)}
                            className={`block p-3 border-b border-brand-surface last:border-b-0 hover:bg-brand-button-hover transition-colors ${!notif.isRead ? 'bg-brand-blue/10' : ''}`}
                        >
                            <p className="text-sm text-white">{notif.message}</p>
                            <p className="text-xs text-brand-muted mt-1">{notif.createdAt ? new Date(notif.createdAt.toDate()).toLocaleString() : ''}</p>
                        </Link>
                    ))
                ) : (
                    <p className="text-brand-muted text-center p-8">You have no notifications.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
