import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import LoginView from './components/LoginView';
import CharacterListView from './components/CharacterListView';
import CharacterSheetView from './components/CharacterSheetView';
import ConfirmationModal from './components/ConfirmationModal';
import CharacterSummaryModal from './components/CharacterSummaryModal';
import DiceRoller from './components/DiceRoller';
import type { Character, User } from './types';
import { View } from './types';
import {
    simulateLogin,
    fetchCharacters,
    saveCharacter,
    deleteCharacter
} from './api';

declare var google: any;

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

    const handleLogin = useCallback(async (response: any) => {
        setIsLoading(true);
        try {
            const googleUser: any = jwtDecode(response.credential);
            const appUser = await simulateLogin(googleUser);
            setUser(appUser);
        } catch (error) {
            console.error("Falha no login:", error);
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
        setUser(null);
        setCharacters([]);
        setView(View.LIST);
        console.log("Usuário deslogado.");
    };

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
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

    const handleBack = () => {
        setView(View.LIST);
    };
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-display text-4xl text-cyan-300">Carregando...</div>;
    }

    if (!user) {
        return <LoginView onLogin={handleLogin} />;
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