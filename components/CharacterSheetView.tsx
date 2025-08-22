import React, { useState, useMemo } from 'react';
import type { Character, Weapon, Cyberware, Lifepath, Friend, Enemy, TragicLoveAffair, User } from '../types';
import { STATS_LIST, SKILL_CATEGORIES, ALL_SKILLS, getSkillId, ROLES_LIST } from '../constants';

interface CharacterSheetViewProps {
    character: Character | null;
    user: User;
    onSave: (character: Character) => void;
    onBack: () => void;
}

const CyberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full p-2 bg-cyan-900/10 border border-cyan-400 text-gray-100 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_#0ff] focus:bg-cyan-900/20 ${props.className}`}
    />
);
const CyberTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className={`w-full p-2 bg-cyan-900/10 border border-cyan-400 text-gray-100 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_#0ff] focus:bg-cyan-900/20 ${props.className}`}
    />
);

const CyberSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }> = ({ children, ...props }) => (
    <div className="relative w-full">
        <select
            {...props}
            className={`w-full p-2 bg-cyan-900/10 border border-cyan-400 text-gray-100 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_#0ff] focus:bg-cyan-900/20 appearance-none ${props.className}`}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
);

const Section: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({title, children, className}) => (
    <div className={`border border-red-500 cyber-section-bg p-4 ${className}`}>
        <h3 className="font-display text-2xl text-red-500 mb-4">{title}</h3>
        {children}
    </div>
);

const newCharacterTemplate: Character = {
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
  gear: '', fashion: '', ammunition: '', aliases: '', reputation: '', notes: '',
  criticalInjuries: '', addictions: '',
  housing: { rent: '', lifestyle: '' },
};

const CharacterSheetView: React.FC<CharacterSheetViewProps> = ({ character, user, onSave, onBack }) => {
    
    const [sheetData, setSheetData] = useState<Character>(() => {
        const initialData = {
            ...newCharacterTemplate,
            ...character,
            id: character?.id || `char_${Date.now()}`,
            info: { ...newCharacterTemplate.info, ...character?.info },
            stats: { ...newCharacterTemplate.stats, ...character?.stats },
            skills: { ...newCharacterTemplate.skills, ...character?.skills },
            combat: { 
                ...newCharacterTemplate.combat, 
                ...character?.combat,
                armor: { ...newCharacterTemplate.combat.armor, ...character?.combat?.armor },
                weapons: character?.combat?.weapons || [],
            },
            cyberware: character?.cyberware || [],
            lifepath: { 
                ...newCharacterTemplate.lifepath,
                ...character?.lifepath,
                friends: character?.lifepath?.friends || [],
                enemies: character?.lifepath?.enemies || [],
                tragicLoveAffairs: character?.lifepath?.tragicLoveAffairs || [],
            },
            housing: { ...newCharacterTemplate.housing, ...character?.housing },
        };
        return initialData;
    });
    
    const [activeTab, setActiveTab] = useState('principal');

    const humanity = useMemo(() => {
        const emp = parseInt(sheetData.stats.emp, 10) || 0;
        const max = emp * 10;
        const loss = sheetData.cyberware.reduce((acc, cw) => acc + (parseInt(cw.loss, 10) || 0), 0);
        const current = max - loss;
        return { current, max };
    }, [sheetData.stats.emp, sheetData.cyberware]);

    const handleNestedChange = <T extends keyof Character>(section: T, field: keyof Character[T], value: any) => {
        setSheetData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            },
        }));
    };
    
    const handleRootChange = (field: keyof Character, value: string) => {
        setSheetData(prev => ({ ...prev, [field]: value }));
    };

    const handleDynamicListChange = <T extends 'weapons' | 'cyberware' | 'friends' | 'enemies' | 'tragicLoveAffairs'>(
        listName: T,
        index: number,
        field: T extends 'weapons' ? keyof Weapon : T extends 'cyberware' ? keyof Cyberware : T extends 'friends' ? keyof Friend : T extends 'enemies' ? keyof Enemy : keyof TragicLoveAffair,
        value: string
    ) => {
        setSheetData(prev => {
            let list;
            if (listName === 'weapons') list = [...prev.combat.weapons];
            else if (listName === 'cyberware') list = [...prev.cyberware];
            else list = [...prev.lifepath[listName as 'friends' | 'enemies' | 'tragicLoveAffairs']];

            const item = { ...list[index], [field]: value };
            list[index] = item;

            if (listName === 'weapons') return { ...prev, combat: { ...prev.combat, weapons: list as Weapon[] } };
            if (listName === 'cyberware') return { ...prev, cyberware: list as Cyberware[] };
            
            return { ...prev, lifepath: { ...prev.lifepath, [listName as 'friends' | 'enemies' | 'tragicLoveAffairs']: list } };
        });
    };
    
    const addListItem = <T extends 'weapons' | 'cyberware' | 'friends' | 'enemies' | 'tragicLoveAffairs'>(listName: T) => {
        const id = `item_${Date.now()}`;
        let newItem: any;
        if (listName === 'weapons') newItem = { id, name: '', dmg: '', ammo: '', rof: '', notes: '' };
        else if (listName === 'cyberware') newItem = { id, name: '', loss: '' };
        else if (listName === 'friends') newItem = { id, name: '' };
        else if (listName === 'enemies') newItem = { id, name: '', details: '' };
        else if (listName === 'tragicLoveAffairs') newItem = { id, name: '' };

        setSheetData(prev => {
            if (listName === 'weapons') return { ...prev, combat: { ...prev.combat, weapons: [...prev.combat.weapons, newItem] } };
            if (listName === 'cyberware') return { ...prev, cyberware: [...prev.cyberware, newItem] };
            const lifepathListName = listName as 'friends' | 'enemies' | 'tragicLoveAffairs';
            return { ...prev, lifepath: { ...prev.lifepath, [lifepathListName]: [...prev.lifepath[lifepathListName], newItem] } };
        });
    };
    
    const removeListItem = <T extends 'weapons' | 'cyberware' | 'friends' | 'enemies' | 'tragicLoveAffairs'>(listName: T, id: string) => {
        setSheetData(prev => {
            let list;
            if (listName === 'weapons') list = prev.combat.weapons.filter(item => item.id !== id);
            else if (listName === 'cyberware') list = prev.cyberware.filter(item => item.id !== id);
            else list = prev.lifepath[listName as 'friends' | 'enemies' | 'tragicLoveAffairs'].filter((item: any) => item.id !== id);

            if (listName === 'weapons') return { ...prev, combat: { ...prev.combat, weapons: list as Weapon[] } };
            if (listName === 'cyberware') return { ...prev, cyberware: list as Cyberware[] };
            return { ...prev, lifepath: { ...prev.lifepath, [listName as 'friends' | 'enemies' | 'tragicLoveAffairs']: list } };
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if(event.target && typeof event.target.result === 'string') {
                    setSheetData(prev => ({ ...prev, avatar: event.target.result as string}));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(sheetData);
    };
    
    const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2YwMCI+PHBhdGggZD0iTTIgMjBoMjB2M0gyem0zLjA1LTguNDVsMS40Mi0xLjQyTDExIDQuMjdMMTYuNTQgMTAuMTNsMS40MSAxLjQyTDEyIDE4LjY5bC02Ljk1LTYuMTR6Ii8+PC9zdmc+';

    const TabButton: React.FC<{name: string, label: string}> = ({name, label}) => (
        <button type="button" onClick={() => setActiveTab(name)} className={`font-display text-2xl py-2 px-6 uppercase transition-all duration-300 ${activeTab === name ? 'text-cyan-300 bg-cyan-900/20 border-b-2 border-cyan-300' : 'text-gray-500 hover:text-cyan-300'}`}>
            {label}
        </button>
    );

    const selectedRole = useMemo(() => ROLES_LIST.find(r => r.name === sheetData.info.role), [sheetData.info.role]);

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="font-display text-5xl text-red-500 uppercase">Ficha de Personagem</h2>
                    <p className="text-cyan-300">Preencha os dados e salve seu progresso.</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto">
                    <button type="button" onClick={onBack} className="flex-1 md:flex-none font-bold py-2 px-4 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900 hover:shadow-[0_0_10px_#f00]">Voltar</button>
                    <button type="submit" className="flex-1 md:flex-none font-bold py-2 px-4 rounded-none bg-transparent border-2 border-cyan-400 text-cyan-400 transition-all duration-300 uppercase hover:bg-cyan-400 hover:text-gray-900 hover:shadow-[0_0_10px_#0ff]">Salvar Personagem</button>
                </div>
            </header>

            <nav className="flex border-b-2 border-red-500 mb-6 flex-wrap">
                <TabButton name="principal" label="Principal" />
                <TabButton name="lifepath" label="Lifepath" />
                <TabButton name="equipamento" label="Equipamento" />
            </nav>
            
            {activeTab === 'principal' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-6">
                        <Section title="AVATAR">
                            <img src={sheetData.avatar || defaultAvatar} alt="Avatar" className="w-full max-w-[366px] mx-auto aspect-square object-cover mb-4 border-2 border-cyan-400" />
                            <input type="file" id="avatar-upload" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                            <label htmlFor="avatar-upload" className="w-full block text-center cursor-pointer font-bold py-2 px-4 rounded-none bg-transparent border-2 border-cyan-400 text-cyan-400 transition-all duration-300 uppercase hover:bg-cyan-400 hover:text-gray-900 hover:shadow-[0_0_10px_#0ff]">Carregar Imagem</label>
                        </Section>
                         <Section title="INFORMAÇÕES">
                            <div className="space-y-3">
                                <CyberInput type="text" placeholder="Apelido" value={sheetData.info.handle} onChange={e => handleNestedChange('info', 'handle', e.target.value)} />
                                <div>
                                    <CyberSelect
                                        value={sheetData.info.role}
                                        onChange={e => handleNestedChange('info', 'role', e.target.value)}
                                    >
                                        <option value="" disabled>Selecione uma Role</option>
                                        {ROLES_LIST.map(role => (
                                            <option key={role.name} value={role.name}>{role.name}</option>
                                        ))}
                                    </CyberSelect>
                                    {selectedRole && <p className="text-xs text-cyan-300 mt-1">{selectedRole.description}</p>}
                                </div>
                                <CyberInput type="number" placeholder="Rank da Role" value={sheetData.info.rank} onChange={e => handleNestedChange('info', 'rank', e.target.value)} />
                                <CyberInput type="text" placeholder="Habilidade de Role" value={sheetData.info.roleAbility} onChange={e => handleNestedChange('info', 'roleAbility', e.target.value)} />
                            </div>
                        </Section>
                        <Section title="ATRIBUTOS">
                            <div className="bg-cyan-900/10 p-3 border border-cyan-400/50 mb-4 text-center">
                                <p className="font-display text-xl text-cyan-300">HUMANIDADE</p>
                                <p className="text-4xl font-bold text-white">
                                    {humanity.current}
                                    <span className="text-2xl text-gray-400"> / {humanity.max}</span>
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {STATS_LIST.map(stat => (
                                    <CyberInput key={stat.key} type="number" placeholder={stat.name} className="text-center" value={sheetData.stats[stat.key]} onChange={e => handleNestedChange('stats', stat.key, e.target.value)} />
                                ))}
                            </div>
                        </Section>
                    </div>
                     <div className="flex flex-col gap-6">
                        <Section title="COMBATE">
                             <div className="grid grid-cols-3 gap-3 mb-4">
                               <CyberInput type="number" placeholder="PV" className="text-center" value={sheetData.combat.hp} onChange={e => handleNestedChange('combat', 'hp', e.target.value)} />
                               <CyberInput type="number" placeholder="Ferido" className="text-center" value={sheetData.combat.wounded} onChange={e => handleNestedChange('combat', 'wounded', e.target.value)} />
                               <CyberInput type="number" placeholder="Teste de Morte" className="text-center" value={sheetData.combat.death} onChange={e => handleNestedChange('combat', 'death', e.target.value)} />
                            </div>
                            <h4 className="font-display text-xl text-cyan-300 mb-2">BLINDAGEM</h4>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <CyberInput type="number" placeholder="Cabeça SP" className="text-center" value={sheetData.combat.armor.head.sp} onChange={e => setSheetData(p => ({...p, combat: {...p.combat, armor: {...p.combat.armor, head: {sp: e.target.value}}}}))} />
                                <CyberInput type="number" placeholder="Corpo SP" className="text-center" value={sheetData.combat.armor.body.sp} onChange={e => setSheetData(p => ({...p, combat: {...p.combat, armor: {...p.combat.armor, body: {sp: e.target.value}}}}))} />
                                <CyberInput type="number" placeholder="Escudo SP" className="text-center" value={sheetData.combat.armor.shield.sp} onChange={e => setSheetData(p => ({...p, combat: {...p.combat, armor: {...p.combat.armor, shield: {sp: e.target.value}}}}))} />
                            </div>
                            <h4 className="font-display text-xl text-cyan-300 mb-2">ARMAS</h4>
                            <div className="space-y-2">
                               {sheetData.combat.weapons.map((w, index) => (
                                   <div key={w.id} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center border-t border-cyan-700/50 pt-2">
                                       <CyberInput type="text" placeholder="Nome da Arma" value={w.name} onChange={e => handleDynamicListChange('weapons', index, 'name', e.target.value)} />
                                       <CyberInput type="text" placeholder="Dano" className="w-20" value={w.dmg} onChange={e => handleDynamicListChange('weapons', index, 'dmg', e.target.value)} />
                                       <button type="button" onClick={() => removeListItem('weapons', w.id)} className="row-span-2 self-center h-full px-2 text-xs rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">X</button>
                                       <CyberInput type="text" placeholder="Munição" className="w-full col-span-1" value={w.ammo} onChange={e => handleDynamicListChange('weapons', index, 'ammo', e.target.value)} />
                                       <CyberInput type="text" placeholder="ROF" className="w-20" value={w.rof} onChange={e => handleDynamicListChange('weapons', index, 'rof', e.target.value)} />
                                   </div>
                               ))}
                            </div>
                            <button type="button" onClick={() => addListItem('weapons')} className="text-xs mt-2 py-1 px-2 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">+ Arma</button>
                        </Section>
                        <Section title="SAÚDE">
                            <h4 className="font-display text-xl text-cyan-300 mb-2">LESÕES CRÍTICAS</h4>
                            <CyberTextarea rows={4} value={sheetData.criticalInjuries} onChange={e => handleRootChange('criticalInjuries', e.target.value)} />
                            <h4 className="font-display text-xl text-cyan-300 mt-4 mb-2">VÍCIOS</h4>
                            <CyberTextarea rows={4} value={sheetData.addictions} onChange={e => handleRootChange('addictions', e.target.value)} />
                        </Section>
                     </div>
                    <Section title="PERÍCIAS" className="lg:col-span-1 flex flex-col">
                        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                                <div key={category} className="mb-4">
                                    <h4 className="font-display text-xl text-cyan-300 border-b border-cyan-700/50 mb-2 pb-1">{category}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        {skills.map(skill => {
                                            const skillId = getSkillId(skill);
                                            return (
                                                <div key={skillId} className="grid grid-cols-[1fr_auto] items-center gap-2">
                                                    <label htmlFor={skillId} className="text-cyan-300 truncate">{skill}</label>
                                                    <CyberInput type="number" id={skillId} name={skillId} className="w-16 p-1 text-center" placeholder="0" value={sheetData.skills[skillId] || ''} onChange={e => handleNestedChange('skills', skillId, e.target.value)} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            )}
            {activeTab === 'lifepath' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Section title="Origens e Personalidade" className="lg:col-span-1">
                        <div className="space-y-3">
                           <CyberInput placeholder="Origens Culturais" value={sheetData.lifepath.culturalOrigins} onChange={e => handleNestedChange('lifepath', 'culturalOrigins', e.target.value)} />
                           <CyberInput placeholder="Personalidade" value={sheetData.lifepath.personality} onChange={e => handleNestedChange('lifepath', 'personality', e.target.value)} />
                           <CyberInput placeholder="Estilo de Roupa" value={sheetData.lifepath.clothingStyle} onChange={e => handleNestedChange('lifepath', 'clothingStyle', e.target.value)} />
                           <CyberInput placeholder="Penteado" value={sheetData.lifepath.hairstyle} onChange={e => handleNestedChange('lifepath', 'hairstyle', e.target.value)} />
                           <CyberInput placeholder="O que você mais valoriza?" value={sheetData.lifepath.valueMost} onChange={e => handleNestedChange('lifepath', 'valueMost', e.target.value)} />
                           <CyberInput placeholder="Como você se sente sobre as pessoas?" value={sheetData.lifepath.feelingsAboutPeople} onChange={e => handleNestedChange('lifepath', 'feelingsAboutPeople', e.target.value)} />
                        </div>
                    </Section>
                     <Section title="Família e Vida" className="lg:col-span-1">
                        <div className="space-y-3">
                           <CyberInput placeholder="Pessoa mais valorizada" value={sheetData.lifepath.valuedPerson} onChange={e => handleNestedChange('lifepath', 'valuedPerson', e.target.value)} />
                           <CyberInput placeholder="Posse mais valiosa" value={sheetData.lifepath.valuedPossession} onChange={e => handleNestedChange('lifepath', 'valuedPossession', e.target.value)} />
                           <CyberInput placeholder="Histórico Familiar" value={sheetData.lifepath.familyBackground} onChange={e => handleNestedChange('lifepath', 'familyBackground', e.target.value)} />
                           <CyberInput placeholder="Ambiente da Infância" value={sheetData.lifepath.childhoodEnvironment} onChange={e => handleNestedChange('lifepath', 'childhoodEnvironment', e.target.value)} />
                           <CyberInput placeholder="Crise Familiar" value={sheetData.lifepath.familyCrisis} onChange={e => handleNestedChange('lifepath', 'familyCrisis', e.target.value)} />
                           <CyberInput placeholder="Objetivos de Vida" value={sheetData.lifepath.lifeGoals} onChange={e => handleNestedChange('lifepath', 'lifeGoals', e.target.value)} />
                        </div>
                    </Section>
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Section title="Amigos">
                            {sheetData.lifepath.friends.map((f, i) => (
                                <div key={f.id} className="flex gap-2 items-center mb-2">
                                    <CyberInput placeholder="Nome do Amigo" value={f.name} onChange={e => handleDynamicListChange('friends', i, 'name', e.target.value)} />
                                    <button type="button" onClick={() => removeListItem('friends', f.id)} className="py-1 px-2 text-xs rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">X</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addListItem('friends')} className="text-xs mt-2 py-1 px-2 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">+ Amigo</button>
                        </Section>
                        <Section title="Inimigos">
                            {sheetData.lifepath.enemies.map((e, i) => (
                                <div key={e.id} className="flex flex-col gap-2 items-center mb-2">
                                    <div className="flex gap-2 w-full">
                                        <CyberInput placeholder="Nome do Inimigo" value={e.name} onChange={e => handleDynamicListChange('enemies', i, 'name', e.target.value)} />
                                        <button type="button" onClick={() => removeListItem('enemies', e.id)} className="py-1 px-2 text-xs rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">X</button>
                                    </div>
                                    <CyberTextarea placeholder="O que aconteceu?" rows={2} value={e.details} onChange={ev => handleDynamicListChange('enemies', i, 'details', ev.target.value)} />
                                </div>
                            ))}
                            <button type="button" onClick={() => addListItem('enemies')} className="text-xs mt-2 py-1 px-2 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">+ Inimigo</button>
                        </Section>
                        <Section title="Amores Trágicos">
                            {sheetData.lifepath.tragicLoveAffairs.map((t, i) => (
                                <div key={t.id} className="flex gap-2 items-center mb-2">
                                    <CyberInput placeholder="Nome do Amor" value={t.name} onChange={e => handleDynamicListChange('tragicLoveAffairs', i, 'name', e.target.value)} />
                                    <button type="button" onClick={() => removeListItem('tragicLoveAffairs', t.id)} className="py-1 px-2 text-xs rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">X</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addListItem('tragicLoveAffairs')} className="text-xs mt-2 py-1 px-2 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">+ Amor</button>
                        </Section>
                    </div>
                 </div>
            )}
            {activeTab === 'equipamento' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <Section title="Dinheiro e Equipamentos">
                            <CyberInput type="number" placeholder="Grana (E$)" value={sheetData.eddies} onChange={e => handleRootChange('eddies', e.target.value)} className="mb-4" />
                            <h4 className="font-display text-xl text-cyan-300 mb-2">Equipamentos</h4>
                            <CyberTextarea rows={10} value={sheetData.gear} onChange={e => handleRootChange('gear', e.target.value)} />
                             <h4 className="font-display text-xl text-cyan-300 mt-4 mb-2">Munição</h4>
                            <CyberTextarea rows={5} value={sheetData.ammunition} onChange={e => handleRootChange('ammunition', e.target.value)} />
                        </Section>
                    </div>
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <Section title="CYBERWARES">
                           <div className="space-y-2">
                               {sheetData.cyberware.map((c, index) => (
                                   <div key={c.id} className="flex gap-2 items-center">
                                       <CyberInput type="text" placeholder="Nome do Cyberware" value={c.name} onChange={e => handleDynamicListChange('cyberware', index, 'name', e.target.value)} />
                                       <CyberInput type="number" placeholder="Custo" className="w-20" value={c.loss} onChange={e => handleDynamicListChange('cyberware', index, 'loss', e.target.value)} />
                                       <button type="button" onClick={() => removeListItem('cyberware', c.id)} className="py-1 px-2 text-xs rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">X</button>
                                   </div>
                               ))}
                            </div>
                            <button type="button" onClick={() => addListItem('cyberware')} className="text-xs mt-2 py-1 px-2 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">+ Cyber</button>
                        </Section>
                    </div>
                    <div className="flex flex-col gap-6 lg:col-span-1">
                         <Section title="Estilo e Reputação">
                            <h4 className="font-display text-xl text-cyan-300 mb-2">Moda</h4>
                            <CyberTextarea rows={4} value={sheetData.fashion} onChange={e => handleRootChange('fashion', e.target.value)} className="mb-4"/>
                            <h4 className="font-display text-xl text-cyan-300 mb-2">Moradia</h4>
                            <div className="flex gap-2 mb-4">
                               <CyberInput placeholder="Aluguel" value={sheetData.housing.rent} onChange={e => handleNestedChange('housing', 'rent', e.target.value)} />
                               <CyberInput placeholder="Estilo de Vida" value={sheetData.housing.lifestyle} onChange={e => handleNestedChange('housing', 'lifestyle', e.target.value)} />
                            </div>
                            <h4 className="font-display text-xl text-cyan-300 mb-2">Reputação</h4>
                            <CyberTextarea rows={2} value={sheetData.reputation} onChange={e => handleRootChange('reputation', e.target.value)} className="mb-4"/>
                            <h4 className="font-display text-xl text-cyan-300 mb-2">Pseudônimos</h4>
                            <CyberTextarea rows={2} value={sheetData.aliases} onChange={e => handleRootChange('aliases', e.target.value)} />
                        </Section>
                        <Section title="Notas Gerais">
                            <CyberTextarea rows={8} value={sheetData.notes} onChange={e => handleRootChange('notes', e.target.value)} />
                        </Section>
                    </div>
                </div>
            )}
        </form>
    );
};

export default CharacterSheetView;
