import type { Character, User } from './types';

const STORAGE_KEY = 'cyberpunk-red-characters';

const getCharactersFromStorage = (): Character[] => {
    try {
        const storedChars = localStorage.getItem(STORAGE_KEY);
        return storedChars ? JSON.parse(storedChars) : [];
    } catch (error) {
        console.error("Falha ao ler personagens do localStorage", error);
        return [];
    }
};

const saveCharactersToStorage = (characters: Character[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
        console.error("Falha ao salvar personagens no localStorage", error);
    }
};

/**
 * Simulates a login request to the backend.
 * @param googleUser The user object from Google Sign-In.
 * @returns A promise that resolves to a User object with an isAdmin flag.
 */
export const simulateLogin = (googleUser: {
  name?: string;
  email?: string;
  sub?: string;
  picture?: string;
}): Promise<User> => {
  console.log('Simulando login para:', googleUser.email);
  return new Promise((resolve) => {
    setTimeout(() => {
      const user: User = {
        id: googleUser.sub || `user_${Date.now()}`,
        name: googleUser.name || 'Unknown User',
        email: googleUser.email || '',
        picture: googleUser.picture || '',
        isAdmin: false,
      };
      resolve(user);
    }, 500);
  });
};

/**
 * Fetches characters from local storage.
 * @param user The currently logged-in user.
 * @returns A promise that resolves to an array of characters.
 */
export const fetchCharacters = (user: User): Promise<Character[]> => {
  console.log(`Buscando personagens para ${user.name} (isAdmin: ${user.isAdmin})`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const charactersDB = getCharactersFromStorage();
      if (user.isAdmin) {
        // Admins get all characters
        resolve(JSON.parse(JSON.stringify(charactersDB)));
      } else {
        // Players get only their own characters
        const userChars = charactersDB.filter((char) => char.userId === user.id);
        resolve(JSON.parse(JSON.stringify(userChars)));
      }
    }, 500);
  });
};

/**
 * Saves a character to local storage.
 * @param character The character to save.
 * @param user The user saving the character.
 * @returns A promise that resolves to the saved character.
 */
export const saveCharacter = (character: Character, user: User): Promise<Character> => {
  console.log(`${user.name} está salvando o personagem: ${character.info.handle}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const charactersDB = getCharactersFromStorage();
      const charWithUser = {
        ...character,
        userId: user.id,
        userName: user.name,
      };

      const existingIndex = charactersDB.findIndex((c) => c.id === charWithUser.id);

      if (existingIndex > -1) {
        // Update existing character
        charactersDB[existingIndex] = charWithUser;
      } else {
        // Add new character
        charactersDB.push(charWithUser);
      }
      saveCharactersToStorage(charactersDB);
      resolve(JSON.parse(JSON.stringify(charWithUser)));
    }, 250);
  });
};

/**
 * Deletes a character from local storage.
 * @param characterId The ID of the character to delete.
 * @param user The user attempting to delete the character.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteCharacter = (characterId: string, user: User): Promise<void> => {
  console.log(`${user.name} está tentando deletar o personagem: ${characterId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const charactersDB = getCharactersFromStorage();
      const charIndex = charactersDB.findIndex((c) => c.id === characterId);
      if (charIndex === -1) {
        return reject(new Error('Personagem não encontrado.'));
      }

      const characterToDelete = charactersDB[charIndex];

      if (user.isAdmin || characterToDelete.userId === user.id) {
        charactersDB.splice(charIndex, 1);
        saveCharactersToStorage(charactersDB);
        console.log('Deleção bem-sucedida.');
        resolve();
      } else {
        console.log('Falha na deleção: Permissão negada.');
        reject(new Error('Você não tem permissão para deletar este personagem.'));
      }
    }, 250);
  });
};
