export interface CharacterInfo {
    handle: string;
    role: string;
    rank: string;
    roleAbility: string;
}

export interface Stats {
    [key: string]: string;
    int: string;
    ref: string;
    dex: string;
    tech: string;
    cool: string;
    will: string;
    luck: string;
    move: string;
    body: string;
    emp: string;
}

export interface Weapon {
    id: string;
    name: string;
    dmg: string;
    ammo: string;
    rof: string;
    notes: string;
}

export type CyberwareCategory = 
  | 'Right Cybereye' | 'Left Cybereye'
  | 'Right Cyberarm' | 'Left Cyberarm'
  | 'Right Cyberleg' | 'Left Cyberleg'
  | 'Cyberaudio Suite' | 'Neural Link'
  | 'Internal' | 'External' | 'Fashionware' | 'Borgware';

export interface Cyberware {
    id: string;
    name: string;
    loss: string;
    category: CyberwareCategory;
}

export interface ArmorPiece {
    sp: string;
}

export interface Armor {
    head: ArmorPiece;
    body: ArmorPiece;
    shield: ArmorPiece;
}

export interface Combat {
    hp: string;
    wounded: string;
    death: string;
    weapons: Weapon[];
    armor: Armor;
}

export interface Friend {
    id: string;
    name: string;
}

export interface Enemy {
    id: string;
    name: string;
    details: string;
}

export interface TragicLoveAffair {
    id: string;
    name: string;
}

export interface AmmunitionItem {
    id: string;
    type: string;
    quantity: string;
}

export interface Lifepath {
    culturalOrigins: string;
    personality: string;
    clothingStyle: string;
    hairstyle: string;
    valueMost: string;
    valuedPerson: string;
    feelingsAboutPeople: string;
    valuedPossession: string;
    familyBackground: string;
    childhoodEnvironment: string;
    familyCrisis: string;
    lifeGoals: string;
    friends: Friend[];
    enemies: Enemy[];
    tragicLoveAffairs: TragicLoveAffair[];
    roleSpecificLifepath: string;
}

export interface Housing {
    rent: string;
    lifestyle: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
    isAdmin: boolean;
}

export interface Character {
    id: string;
    avatar: string; // Base64 encoded image string
    info: CharacterInfo;
    stats: Stats;
    skills: { [key: string]: string };
    combat: Combat;
    cyberware: Cyberware[];
    eddies: string;
    
    // New Fields from Sheet
    lifepath: Lifepath;
    gear: string;
    fashion: string;
    housing: Housing;
    ammunition: AmmunitionItem[];
    aliases: string;
    reputation: string;
    notes: string;
    criticalInjuries: string;
    addictions: string;

    // User association
    userId?: string;
    userName?: string;
}

export enum View {
    LIST,
    SHEET,
    CREATION,
}