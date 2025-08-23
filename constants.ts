import type { Character, CyberwareCategory } from './types';

export const STATS_LIST = [
    { key: 'int', name: 'INT' },
    { key: 'ref', name: 'REF' },
    { key: 'dex', name: 'DEX' },
    { key: 'tech', name: 'TECH' },
    { key: 'cool', name: 'COOL' },
    { key: 'will', name: 'WILL' },
    { key: 'luck', name: 'LUCK' },
    { key: 'move', name: 'MOVE' },
    { key: 'body', name: 'BODY' },
    { key: 'emp', name: 'EMP' },
];

export const SKILL_CATEGORIES = {
    "Percepção": ["Concentração", "Ver/Ouvir", "Ocultar/Revelar Objeto", "Leitura Labial", "Rastreamento"],
    "Corpo": ["Atletismo", "Contorcionismo", "Dança", "Resistir a Tortura/Drogas", "Furtividade", "Tolerância"],
    "Controle": ["Condução", "Pilotagem Aérea", "Pilotagem Marítima", "Cavalgar"],
    "Educação": ["Contabilidade", "Ciência Animal", "Burocracia", "Negócios", "Composição", "Criminologia", "Criptografia", "Dedução", "Educação", "Apostar", "Pesquisa Bibliotecária", "Conhecimento Local", "Ciência", "Tática", "Sobrevivência"],
    "Luta": ["Briga", "Evasão", "Artes Marciais", "Arma Corpo-a-Corpo"],
    "Performance": ["Atuação", "Tocar Instrumento"],
    "Armas de Longo Alcance": ["Arquearia", "Tiro Automático", "Pistolas", "Armas Pesadas", "Armas de Ombro"],
    "Social": ["Suborno", "Conversação", "Percepção Humana", "Interrogação", "Persuasão", "Aparência", "Manha", "Negociação", "Estilo"],
    "Técnica": ["Tec. Veicular Aérea", "Tecnologia Básica", "Cybertecnologia", "Demolições", "Eletrônica/Segurança", "Primeiros Socorros", "Falsificação", "Tec. Veicular Terrestre", "Pintura/Desenho/Escultura", "Paramedicina", "Fotografia/Filme", "Arrombamento", "Punga", "Tec. Veicular Marítima", "Armeiro"]
};


export const getSkillId = (skill: string) => `skill-${skill.toLowerCase().replace(/[\s/(),]/g, '-')}`;

export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

export const ROLES_LIST = [
    { name: 'Rockerboys', description: 'Rebeldes do rock-and-roll que utilizam performance, arte e retórica para lutar contra a autoridade.' },
    { name: 'Solos', description: 'Assassinos, guarda-costas, matadores e soldados de aluguel em um novo mundo sem lei.' },
    { name: 'Netrunners', description: 'Mestres hackers cibernéticos do mundo pós-NET e ladrões de segredos que queimam cérebros.' },
    { name: 'Techs', description: 'Mecânicos renegados e inventores de supertecnologia; as pessoas que fazem o Futuro Sombrio funcionar.' },
    { name: 'Medtechs', description: 'Médicos de rua não sancionados e médicos de cyberware, remendando carne e metal.' },
    { name: 'Medias', description: 'Repórteres, estrelas da mídia e influenciadores sociais arriscando tudo pela verdade — ou pela glória.' },
    { name: 'Execs', description: 'Intermediários de poder corporativo e invasores de negócios lutando para restaurar o domínio das Megacorps.' },
    { name: 'Lawmen', description: 'Policiais da lei máxima patrulhando as ruas perigosas e as estradas bárbaras de guerreiros além.' },
    { name: 'Fixers', description: 'Negociantes, organizadores e corretores de informação nos Mercados da Meia-Noite pós-guerra da Rua.' },
    { name: 'Nomads', description: 'Especialistas em transporte, guerreiros de estrada supremos, piratas e contrabandistas que mantêm o mundo conectado.' },
];

export const CYBERWARE_CATEGORIES: CyberwareCategory[] = [
    'Right Cybereye', 'Left Cybereye',
    'Right Cyberarm', 'Left Cyberarm',
    'Right Cyberleg', 'Left Cyberleg',
    'Cyberaudio Suite', 'Neural Link',
    'Internal', 'External', 'Fashionware', 'Borgware'
];

export const STREETRAT_STATS_ARRAYS = [
    { name: 'Array 1', stats: { int: '6', ref: '7', dex: '7', tech: '6', cool: '8', will: '6', luck: '5', move: '6', body: '6', emp: '5' } },
    { name: 'Array 2', stats: { int: '7', ref: '8', dex: '6', tech: '5', cool: '6', will: '6', luck: '6', move: '5', body: '7', emp: '6' } },
    { name: 'Array 3', stats: { int: '6', ref: '6', dex: '6', tech: '8', cool: '7', will: '8', luck: '3', move: '4', body: '8', emp: '6' } },
    { name: 'Array 4', stats: { int: '8', ref: '8', dex: '8', tech: '3', cool: '5', will: '6', luck: '4', move: '6', body: '5', emp: '5' } },
    { name: 'Array 5', stats: { int: '5', ref: '6', dex: '7', tech: '7', cool: '6', will: '5', luck: '8', move: '6', body: '6', emp: '8' } },
];

export const EDGERUNNER_POINTS = 62;
export const STAT_MIN = 2;
export const STAT_MAX = 8;

export const createNewCharacter = (): Character => ({
  id: '',
  avatar: '',
  info: { handle: '', role: '', rank: '', roleAbility: '' },
  stats: Object.fromEntries(STATS_LIST.map(s => [s.key, ''])) as any,
  skills: Object.fromEntries(ALL_SKILLS.map(s => [getSkillId(s), ''])),
  combat: {
    hp: '',
    wounded: '',
    death: '',
    weapons: [],
    armor: {
        head: { sp: '' },
        body: { sp: '' },
        shield: { sp: '' }
    }
  },
  cyberware: [],
  eddies: '',
  lifepath: {
    culturalOrigins: '', personality: '', clothingStyle: '', hairstyle: '',
    valueMost: '', valuedPerson: '', feelingsAboutPeople: '', valuedPossession: '',
    familyBackground: '', childhoodEnvironment: '', familyCrisis: '', lifeGoals: '',
    friends: [], enemies: [], tragicLoveAffairs: [],
    roleSpecificLifepath: '',
  },
  gear: '', fashion: '', ammunition: [], aliases: '', reputation: '', notes: '',
  criticalInjuries: '', addictions: '',
  housing: { rent: '', lifestyle: '' },
  userId: '',
  userName: '',
});