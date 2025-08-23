import React from 'react';
import type { User } from '../types';

interface UserProfileProps {
    user: User;
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
    const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OSA0IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYy DDIwdi0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==';
    
    return (
        <div className="flex items-center gap-3 bg-black/20 p-2 border border-cyan-400/30">
            <img src={user.picture || defaultAvatar} alt="Avatar do usuário" className="w-10 h-10 rounded-full border-2 border-cyan-400" />
            <div>
                <p className="text-white font-bold truncate max-w-40" title={user.name}>{user.name}</p>
                <button onClick={onLogout} className="text-xs text-red-500 hover:text-red-400 transition-colors uppercase font-bold tracking-wider">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
