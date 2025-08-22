import React, { useState, useEffect, useMemo } from 'react';
import type { Character } from '../types';
import { STATS_LIST } from '../constants';

interface CharacterSummaryModalProps {
    character: Character | null;
    onClose: () => void;
    onUpdate: (character: Character) => void;
}

const SummaryInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string;}> = ({ label, value, onChange, placeholder, type = "number" }) => (
    <div className="bg-cyan-900/10 p-2 border border-cyan-400/50">
        <label className="text-sm text-cyan-300 block text-center">{label}</label>
        <input 
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder || '0'}
            className="w-full bg-transparent text-2xl font-bold text-white text-center focus:outline-none focus:ring-0 border-0 p-0"
            aria-label={label}
        />
    </div>
);


const CharacterSummaryModal: React.FC<CharacterSummaryModalProps> = ({ character, onClose, onUpdate }) => {
    const [editableCharacter, setEditableCharacter] = useState<Character | null>(character);

    useEffect(() => {
        setEditableCharacter(character);
    }, [character]);
    
    const humanity = useMemo(() => {
        if (!editableCharacter) return { current: 0, max: 0 };
        const emp = parseInt(editableCharacter.stats.emp, 10) || 0;
        const max = emp * 10;
        const loss = (editableCharacter.cyberware || []).reduce((acc, cw) => acc + (parseInt(cw.loss, 10) || 0), 0);
        const current = max - loss;
        return { current, max };
    }, [editableCharacter]);

    if (!editableCharacter) return null;
    
    const handleClose = () => {
        if (editableCharacter) {
            onUpdate(editableCharacter);
        }
        onClose();
    };

    const handleEddiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableCharacter(prev => prev ? { ...prev, eddies: e.target.value } : null);
    };

    const handleCombatChange = (field: 'hp' | 'wounded' | 'death', value: string) => {
        setEditableCharacter(prev => {
            if (!prev) return null;
            return {
                ...prev,
                combat: { ...prev.combat, [field]: value }
            };
        });
    };
    
    const handleArmorChange = (piece: 'head' | 'body' | 'shield', value: string) => {
         setEditableCharacter(prev => {
            if (!prev) return null;
            return {
                ...prev,
                combat: {
                    ...prev.combat,
                    armor: { ...prev.combat.armor, [piece]: { sp: value } }
                }
            };
        });
    };

    const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2YwMCI+PHBhdGggZD0iTTIgMjBoMjB2M0gyem0zLjA1LTguNDVsMS40Mi0xLjQyTDExIDQuMjdMMTYuNTQgMTAuMTNsMS40MSAxLjQyTDEyIDE4LjY5bC02Ljk1LTYuMTR6Ii8+PC9zdmc+';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={handleClose}>
            <div className="bg-[#1a1a1a] border-2 border-red-500 p-6 max-w-md w-full text-center cyber-section-bg relative custom-scrollbar overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-2 right-2 font-bold py-1 px-3 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-gray-900 z-10">
                    X
                </button>
                
                <img 
                    src={editableCharacter.avatar || defaultAvatar} 
                    alt={`${editableCharacter.info.handle}'s avatar`}
                    className="w-full max-w-[366px] aspect-square object-cover mx-auto mb-4 border-4 border-cyan-400"
                />

                <h2 className="font-display text-4xl md:text-5xl text-cyan-300 uppercase shadow-[1px_1px_0px_#f00,-1px_-1px_0px_#0ff]">{editableCharacter.info.handle || 'Mercenário Sem Nome'}</h2>
                <p className="font-display text-2xl text-red-500 mb-4">{editableCharacter.info.role || 'Sem Role'}</p>
                
                <div className="bg-cyan-900/10 p-2 border border-cyan-400/50 mb-6">
                    <p className="text-sm text-cyan-300">HUMANIDADE</p>
                    <p className="text-3xl font-bold text-white">
                        {humanity.current}
                        <span className="text-xl text-gray-400"> / {humanity.max}</span>
                    </p>
                </div>
                
                <div className="relative mb-6">
                    <label htmlFor="summary-eddies" className="absolute -top-2 left-2 text-xs bg-[#1a1a1a] px-1 text-cyan-300">Grana (E$)</label>
                    <input 
                        id="summary-eddies"
                        type="number"
                        value={editableCharacter.eddies || ''}
                        onChange={handleEddiesChange}
                        className="w-full p-2 bg-transparent border-2 border-cyan-400 text-white font-bold text-xl text-center focus:outline-none focus:shadow-[0_0_10px_#0ff]"
                        placeholder="0"
                    />
                </div>

                <div className="border-t-2 border-red-500 pt-4 mb-6">
                    <h3 className="font-display text-3xl text-red-500 mb-4">COMBATE</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <SummaryInput label="PV" value={editableCharacter.combat.hp} onChange={(e) => handleCombatChange('hp', e.target.value)} />
                        <SummaryInput label="Ferido" value={editableCharacter.combat.wounded} onChange={(e) => handleCombatChange('wounded', e.target.value)} />
                        <SummaryInput label="Morte" value={editableCharacter.combat.death} onChange={(e) => handleCombatChange('death', e.target.value)} />
                    </div>
                    <h4 className="font-display text-xl text-cyan-300 mb-2">BLINDAGEM</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <SummaryInput label="Cabeça SP" value={editableCharacter.combat.armor.head.sp} onChange={(e) => handleArmorChange('head', e.target.value)} />
                        <SummaryInput label="Corpo SP" value={editableCharacter.combat.armor.body.sp} onChange={(e) => handleArmorChange('body', e.target.value)} />
                        <SummaryInput label="Escudo SP" value={editableCharacter.combat.armor.shield.sp} onChange={(e) => handleArmorChange('shield', e.target.value)} />
                    </div>
                </div>

                <div className="border-t-2 border-red-500 pt-4">
                    <h3 className="font-display text-3xl text-red-500 mb-4">ATRIBUTOS</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                        {STATS_LIST.map(stat => (
                            <div key={stat.key} className="bg-cyan-900/10 p-2 border border-cyan-400/50">
                                <p className="text-sm text-cyan-300">{stat.name}</p>
                                <p className="text-2xl font-bold text-white text-center">{editableCharacter.stats[stat.key] || '0'}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CharacterSummaryModal;