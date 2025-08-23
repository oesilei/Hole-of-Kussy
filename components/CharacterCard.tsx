import React from 'react';
import type { Character } from '../types';

interface CharacterCardProps {
    character: Character;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onShowSummary: (id: string) => void;
    showOwner?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onEdit, onDelete, onShowSummary, showOwner }) => {
    const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2YwMCI+PHBhdGggZD0iTTIgMjBoMjB2M0gyem0zLjA1LTguNDVsMS40Mi0xLjQyTDExIDQuMjdMMTYuNTQgMTAuMTNsMS40MSAxLjQyTDEyIDE4LjY5bC02Ljk1LTYuMTR6Ii8+PC9zdmc+';

    return (
        <div className="border border-red-500 cyber-section-bg p-4 flex flex-col justify-between transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_15px_#0ff4]">
            <div onClick={() => onShowSummary(character.id)} className="cursor-pointer flex-grow">
                 <div className="w-full max-w-[360px] mx-auto aspect-square overflow-hidden mb-4 border-2 border-cyan-400">
                    <img
                        src={character.avatar || defaultAvatar}
                        alt={`${character.info.handle}'s avatar`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="font-display text-2xl text-cyan-300 truncate">{character.info.handle || 'Mercenário Sem Nome'}</h3>
                <p className="text-red-500">{character.info.role || 'Sem Role'}</p>
                {showOwner && character.userName && (
                    <p className="text-xs text-gray-400 mt-1 truncate" title={`Criado por: ${character.userName}`}>Criado por: {character.userName}</p>
                )}
            </div>
            <div className="flex gap-2 mt-4">
                <button onClick={() => onEdit(character.id)} className="text-sm flex-1 py-1 px-2 rounded-none bg-transparent border-2 border-cyan-400 text-cyan-400 transition-all duration-300 uppercase hover:bg-cyan-400 hover:text-gray-900 hover:shadow-[0_0_10px_#0ff]">
                    Editar
                </button>
                <button onClick={() => onDelete(character.id)} className="text-sm flex-1 py-1 px-2 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900 hover:shadow-[0_0_10px_#f00]">
                    Excluir
                </button>
            </div>
        </div>
    );
};

export default CharacterCard;