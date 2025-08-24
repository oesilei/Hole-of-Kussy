import { supabase } from './supabaseClient'; // Importa nosso cliente Supabase
import type { Character, User } from './types';

/**
 * Busca os personagens do usuário logado no Supabase.
 */
export const fetchCharacters = async (user: User): Promise<Character[]> => {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id); // Busca apenas onde user_id é igual ao do usuário

  if (error) {
    console.error("Falha ao buscar personagens:", error);
    return [];
  }
  // O Supabase pode retornar 'null', então garantimos um array vazio como fallback
  return (data || []) as Character[];
};

/**
 * Salva (cria ou atualiza) um personagem no Supabase.
 */
export const saveCharacter = async (character: Character, user: User): Promise<Character> => {
  // Garante que o ID do usuário e o nome do usuário estão associados ao personagem
  const characterData = {
    ...character,
    user_id: user.id,
    userName: user.name,
  };

  // Remove o campo 'userId' do objeto antigo, se existir, para usar o 'user_id' padrão do Supabase
  if ('userId' in characterData) {
    delete (characterData as any).userId;
  }
  
  const { data, error } = await supabase
    .from('characters')
    .upsert(characterData, { onConflict: 'id' }) // 'upsert' cria se não existe, ou atualiza se o 'id' já existe
    .select()
    .single(); // Retorna o objeto salvo/atualizado

  if (error) {
    console.error("Falha ao salvar personagem:", error);
    throw error;
  }
  return data as Character;
};

/**
 * Deleta um personagem do Supabase.
 */
export const deleteCharacter = async (characterId: string, user: User): Promise<void> => {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', characterId)
    .eq('user_id', user.id); // A regra de segurança (RLS) já nos protege, mas isso é uma boa prática

  if (error) {
    console.error("Falha ao deletar personagem:", error);
    throw error;
  }
};