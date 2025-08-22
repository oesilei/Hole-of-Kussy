import type { Character, User } from './types';

// In-memory "database" to simulate backend storage.
// This will reset on page refresh.
let charactersDB: Character[] = [];

// Hardcoded admin email for demonstration purposes.
// To test the admin view, sign in with this Google account.
const ADMIN_EMAIL = 'admin@example.com';

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
  console.log('Simulating login for:', googleUser.email);
  return new Promise((resolve) => {
    setTimeout(() => {
      const user: User = {
        id: googleUser.sub || `user_${Date.now()}`,
        name: googleUser.name || 'Unknown User',
        email: googleUser.email || '',
        picture: googleUser.picture || '',
        isAdmin: googleUser.email === ADMIN_EMAIL,
      };
      resolve(user);
    }, 500);
  });
};

/**
 * Simulates fetching characters from the backend.
 * @param user The currently logged-in user.
 * @returns A promise that resolves to an array of characters.
 */
export const fetchCharacters = (user: User): Promise<Character[]> => {
  console.log(`Fetching characters for ${user.name} (isAdmin: ${user.isAdmin})`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (user.isAdmin) {
        // Admins get all characters
        resolve(JSON.parse(JSON.stringify(charactersDB)));
      } else {
        // Players get only their own characters
        const userChars = charactersDB.filter((char) => char.userId === user.id);
        resolve(JSON.parse(JSON.stringify(userChars)));
      }
    }, 1000);
  });
};

/**
 * Simulates saving a character to the backend.
 * @param character The character to save.
 * @param user The user saving the character.
 * @returns A promise that resolves to the saved character.
 */
export const saveCharacter = (character: Character, user: User): Promise<Character> => {
  console.log(`${user.name} is saving character: ${character.info.handle}`);
  return new Promise((resolve) => {
    setTimeout(() => {
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
      resolve(JSON.parse(JSON.stringify(charWithUser)));
    }, 500);
  });
};

/**
 * Simulates deleting a character from the backend.
 * @param characterId The ID of the character to delete.
 * @param user The user attempting to delete the character.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteCharacter = (characterId: string, user: User): Promise<void> => {
  console.log(`${user.name} is attempting to delete character: ${characterId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const charIndex = charactersDB.findIndex((c) => c.id === characterId);
      if (charIndex === -1) {
        return reject(new Error('Character not found.'));
      }

      const characterToDelete = charactersDB[charIndex];

      if (user.isAdmin || characterToDelete.userId === user.id) {
        charactersDB.splice(charIndex, 1);
        console.log('Deletion successful.');
        resolve();
      } else {
        console.log('Deletion failed: Permission denied.');
        reject(new Error('You do not have permission to delete this character.'));
      }
    }, 500);
  });
};
