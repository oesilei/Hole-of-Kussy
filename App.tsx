import React, { useState, useEffect, useCallback } from 'react';
import CharacterListView from './components/CharacterListView';
import CharacterSheetView from './components/CharacterSheetView';
import ConfirmationModal from './components/ConfirmationModal';
import CharacterSummaryModal from './components/CharacterSummaryModal';
import DiceRoller from './components/DiceRoller';
import type { Character, User } from './types';
import { View } from './types';
import { createNewCharacter } from './constants';
import {
    fetchCharacters,
    saveCharacter,
    deleteCharacter
} from './api';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [view, setView] = useState<View>(View.LIST);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [summaryCharacter, setSummaryCharacter] = useState<Character | null>(null);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        message: string;
        onConfirm: (() => void) | null;
    }>({ isOpen: false, message: '', onConfirm: null });

    useEffect(() => {
        // Ignora o login e cria um usuário local para salvar os dados no navegador.
        const localUser: User = {
            id: 'local-user-01',
            name: 'Mercenário Local',
            email: 'local@nightcity.com',
            picture: '',
            isAdmin: true, // Permite gerenciar todos os personagens salvos localmente.
        };
        setUser(localUser);
    }, []);

    const handleLogout = () => {
        if (window.confirm('Você tem certeza que quer sair? Isso irá APAGAR TODOS os personagens salvos no seu navegador.')) {
            // O nome da chave aqui deve corresponder ao usado em api.ts
            localStorage.removeItem('cyberpunk-red-characters');
            window.location.reload();
        }
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadCharacters = async () => {
            setIsLoading(true);
            try {
                const chars = await fetchCharacters(user);
                setCharacters(chars);
            } catch (error) {
                console.error("Falha ao carregar personagens:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCharacters();
    }, [user]);


    const handleAddNew = () => {
        setEditingCharacter(null);
        setView(View.SHEET);
    };

    const handleEdit = (id: string) => {
        const charToEdit = characters.find(c => c.id === id);
        if (charToEdit) {
            setEditingCharacter(charToEdit);
            setView(View.SHEET);
        }
    };

    const handleDelete = (id: string) => {
        if (!user) return;
        const charToDelete = characters.find(c => c.id === id);
        if (charToDelete) {
            setModalState({
                isOpen: true,
                message: `Você tem certeza que quer deletar "${charToDelete.info.handle || 'Mercenário Sem Nome'}"?`,
                onConfirm: async () => {
                    try {
                        await deleteCharacter(id, user);
                        setCharacters(prevChars => prevChars.filter(c => c.id !== id));
                    } catch (error) {
                        console.error("Falha ao deletar personagem:", error);
                        alert(error);
                    } finally {
                        closeModal();
                    }
                }
            });
        }
    };

    const handleShowSummary = (id: string) => {
        const charToShow = characters.find(c => c.id === id);
        if (charToShow) {
            setSummaryCharacter(charToShow);
        }
    };

    const handleCloseSummary = () => {
        setSummaryCharacter(null);
    };
    
    const closeModal = () => {
        setModalState({ isOpen: false, message: '', onConfirm: null });
    };

    const handleSave = useCallback(async (character: Character) => {
        if (!user) {
            console.error("Usuário não está logado. Não é possível salvar.");
            return;
        }
        try {
            const savedChar = await saveCharacter(character, user);
            setCharacters(prevChars => {
                const exists = prevChars.some(c => c.id === savedChar.id);
                if (exists) {
                    return prevChars.map(c => c.id === savedChar.id ? savedChar : c);
                }
                return [...prevChars, savedChar];
            });
            setView(View.LIST);
        } catch (error) {
             console.error("Falha ao salvar personagem:", error);
        }
    }, [user]);

    const handleUpdateFromSummary = useCallback(async (character: Character) => {
        if (!user) return;
         try {
            const savedChar = await saveCharacter(character, user);
             setCharacters(prevChars => {
                return prevChars.map(c => c.id === savedChar.id ? savedChar : c);
            });
        } catch (error) {
             console.error("Falha ao atualizar personagem:", error);
        }
    }, [user]);

    const handleImportCharacter = useCallback(async (characterData: Partial<Character>) => {
        if (!user) {
            console.error("Usuário não está logado. Não é possível importar.");
            alert("Erro: usuário não encontrado. Não é possível importar.");
            return;
        }

        const template = createNewCharacter();
        
        const importedCharacter: Character = {
            ...template,
            ...characterData,
            info: { ...template.info, ...characterData.info },
            stats: { ...template.stats, ...characterData.stats },
            skills: { ...template.skills, ...characterData.skills },
            combat: {
                ...template.combat,
                ...characterData.combat,
                armor: { ...template.combat.armor, ...characterData.combat?.armor },
                weapons: (characterData.combat?.weapons || []).map((w, i) => ({ ...w, id: `w_${Date.now()}_${i}` })),
            },
            cyberware: (characterData.cyberware || []).map((cw, i) => ({ ...cw, id: `cw_${Date.now()}_${i}` })),
            lifepath: {
                ...template.lifepath,
                ...characterData.lifepath,
                friends: (characterData.lifepath?.friends || []).map((f, i) => ({ ...f, id: `f_${Date.now()}_${i}` })),
                enemies: (characterData.lifepath?.enemies || []).map((e, i) => ({ ...e, id: `e_${Date.now()}_${i}` })),
                tragicLoveAffairs: (characterData.lifepath?.tragicLoveAffairs || []).map((t, i) => ({ ...t, id: `t_${Date.now()}_${i}` })),
            },
            housing: { ...template.housing, ...characterData.housing },
            id: `char_${Date.now()}`,
            userId: user.id,
            userName: user.name,
            avatar: characterData.avatar || '',
        };

        await handleSave(importedCharacter);
        // Set view back to list, as handleSave does this already.
        setView(View.LIST);

    }, [user, handleSave]);


    const handleBack = () => {
        setView(View.LIST);
    };
    
    if (isLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center font-display text-4xl text-cyan-300">Carregando...</div>;
    }

    return (
        <>
            {view === View.LIST && (
                <CharacterListView
                    characters={characters}
                    user={user}
                    onAddNew={handleAddNew}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onShowSummary={handleShowSummary}
                    onLogout={handleLogout}
                    onImport={handleImportCharacter}
                />
            )}
            {view === View.SHEET && (
                <CharacterSheetView
                    character={editingCharacter}
                    user={user}
                    onSave={handleSave}
                    onBack={handleBack}
                />
            )}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
                onCancel={closeModal}
            />
            <CharacterSummaryModal
                character={summaryCharacter}
                onClose={handleCloseSummary}
                onUpdate={handleUpdateFromSummary}
            />
            <DiceRoller />
        </>
    );
};

export default App;