import React, { useRef } from 'react';
import CharacterCard from './CharacterCard';
import UserProfile from './UserProfile';
import type { Character, User } from '../types';

interface CharacterListViewProps {
    characters: Character[];
    user: User;
    onAddNew: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onShowSummary: (id: string) => void;
    onLogout: () => void;
    onImport: (characterData: Partial<Character>) => void;
}

const CharacterListView: React.FC<CharacterListViewProps> = ({ characters, user, onAddNew, onEdit, onDelete, onShowSummary, onLogout, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            alert('Por favor, selecione um arquivo JSON válido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("Falha ao ler o arquivo.");
                }
                const data = JSON.parse(text);

                if (!data.info || !data.stats || !data.skills) {
                    throw new Error("O arquivo JSON não parece ser uma ficha de personagem válida.");
                }

                const { id, userId, userName, ...characterToImport } = data;

                onImport(characterToImport);
                alert(`Personagem "${characterToImport.info.handle || 'personagem'}" importado com sucesso!`);

            } catch (error) {
                console.error("Erro ao importar personagem:", error);
                alert(`Falha ao importar personagem: ${error instanceof Error ? error.message : 'Erro desconhecido.'}`);
            } finally {
                if (event.target) {
                    event.target.value = '';
                }
            }
        };
        reader.onerror = () => {
             alert('Falha ao ler o arquivo.');
        };
        reader.readAsText(file);
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 text-center sm:text-left">
                <div>
                    <h1 className="glitch font-display text-5xl sm:text-6xl uppercase" data-text="HOLE OF KUSSY">HOLE OF KUSSY</h1>
                    <p className="text-cyan-300">Gerenciador de Personagens - Cyberpunk RED</p>
                </div>
                <UserProfile user={user} onLogout={onLogout} />
            </header>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
                <h2 className="font-display text-4xl text-red-500">PERSONAGENS {user.isAdmin && <span className="text-sm text-cyan-300">(ADMIN)</span>}</h2>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={handleImportClick} className="w-full md:w-auto font-bold py-2 px-4 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900 hover:shadow-[0_0_10px_#f00]">
                        Importar Personagem
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="application/json"
                        className="hidden"
                    />
                    <button onClick={onAddNew} className="w-full md:w-auto font-bold py-2 px-4 rounded-none bg-transparent border-2 border-cyan-400 text-cyan-400 transition-all duration-300 uppercase hover:bg-cyan-400 hover:text-gray-900 hover:shadow-[0_0_10px_#0ff]">
                        + Novo Personagem
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.length > 0 ? (
                    characters.map(char => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onShowSummary={onShowSummary}
                            showOwner={user.isAdmin}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">Nenhum personagem encontrado. Crie um novo!</p>
                )}
            </div>
        </div>
    );
};

export default CharacterListView;