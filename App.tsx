import React, { useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode'; // Não é mais necessário para o login
import CharacterListView from './components/CharacterListView';
import CharacterSheetView from './components/CharacterSheetView';
import CharacterCreationWizard from './components/CharacterCreationWizard';
import ConfirmationModal from './components/ConfirmationModal';
import CharacterSummaryModal from './components/CharacterSummaryModal';
import DiceRoller from './components/DiceRoller';
import LoginView from './components/LoginView';
import type { Character, User } from './types';
import { View } from './types';
import { createNewCharacter } from './constants';
import {
    fetchCharacters,
    saveCharacter,
    deleteCharacter
    // simulateLogin não é mais necessário
} from './api';
import { supabase } from './supabaseClient'; // Importe o cliente Supabase
import { Session } from '@supabase/supabase-js'; // Importe o tipo Session

// declare var google: any; // Não é mais necessário

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // isLoading agora é controlado pelo Supabase
    const [view, setView] = useState<View>(View.LIST);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [summaryCharacter, setSummaryCharacter] = useState<Character | null>(null);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        message: string;
        onConfirm: (() => void) | null;
    }>({ isOpen: false, message: '', onConfirm: null });

    // NOVO: Gerenciamento de sessão com Supabase
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                // Cria um objeto 'user' a partir da sessão do Supabase
                const currentUser: User = {
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || 'Usuário',
                    email: session.user.email || '',
                    picture: session.user.user_metadata.avatar_url,
                    isAdmin: false, // Adicione sua lógica de admin aqui se necessário
                };
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setIsLoading(false); // Finaliza o carregamento após verificar a sessão
        });

        return () => subscription.unsubscribe();
    }, []);

    // Efeito para carregar os personagens QUANDO o usuário mudar
    useEffect(() => {
        if (user) {
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
        } else {
            // Se não há usuário, limpa a lista de personagens
            setCharacters([]);
        }
    }, [user]);

    // ATUALIZADO: Logout com Supabase
    const handleLogout = async () => {
        if (window.confirm('Você tem certeza que quer sair?')) {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Erro ao fazer logout:', error);
            } else {
                setUser(null); // Limpa o usuário do estado local
            }
        }
    };
    
    // As funções abaixo (handleAddNew, handleEdit, etc.) continuam iguais por enquanto.
    // Iremos modificá-las quando atualizarmos o api.ts.

    const handleAddNew = () => {
        setEditingCharacter(null);
        setView(View.CREATION);
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
                        await deleteCharacter(id, user); // Esta função será atualizada depois
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

    const handleSave = async (character: Character) => {
        if (!user) {
            console.error("Usuário não está logado. Não é possível salvar.");
            return;
        }
        try {
            const savedChar = await saveCharacter(character, user); // Esta função será atualizada
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
    };

    const handleUpdateFromSummary = async (character: Character) => {
        if (!user) return;
         try {
            const savedChar = await saveCharacter(character, user); // Esta função será atualizada
             setCharacters(prevChars => {
                return prevChars.map(c => c.id === savedChar.id ? savedChar : c);
            });
        } catch (error) {
             console.error("Falha ao atualizar personagem:", error);
        }
    };

    const handleImportCharacter = async (characterData: Partial<Character>) => {
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
            ammunition: [],
        };

        await handleSave(importedCharacter);
        setView(View.LIST);
    };


    const handleBack = () => {
        setView(View.LIST);
    };
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-display text-4xl text-cyan-300">Autenticando...</div>;
    }

    if (!user) {
        // A função onLogin não é mais necessária, o listener do Supabase cuida de tudo
        return <LoginView />;
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
            {view === View.CREATION && (
                <CharacterCreationWizard
                    onSave={handleSave}
                    onBack={handleBack}
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