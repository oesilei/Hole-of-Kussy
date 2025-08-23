import React, { useState, useMemo } from 'react';
import type { Character, Stats } from '../types';
import { createNewCharacter, STATS_LIST, STREETRAT_STATS_ARRAYS, EDGERUNNER_POINTS, STAT_MIN, STAT_MAX, SKILL_CATEGORIES, getSkillId } from '../constants';

interface WizardProps {
    onSave: (character: Character) => void;
    onBack: () => void;
}

const Section: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({title, children, className}) => (
    <div className={`border border-red-500 cyber-section-bg p-4 ${className}`}>
        <h3 className="font-display text-2xl text-red-500 mb-4">{title}</h3>
        {children}
    </div>
);

const CyberLabeledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => {
    const id = props.id || `input-${props.name || label.replace(/\s+/g, '-')}`;
    return (
        <div className="relative">
            <input {...props} id={id} placeholder=" " className={`peer w-full p-2 bg-cyan-900/10 border border-cyan-400 text-gray-100 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_#0ff] focus:bg-cyan-900/20 ${props.className}`} />
            <label htmlFor={id} className={`absolute left-3 top-2 text-gray-400 transition-all duration-200 ease-in-out pointer-events-none peer-placeholder-shown:text-base peer-focus:text-xs peer-focus:-translate-y-4 peer-focus:text-cyan-300 peer-focus:px-1 peer-focus:bg-[#1a1a1a] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:text-cyan-300 peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:bg-[#1a1a1a]`}>
                {label}
            </label>
        </div>
    );
};


const CharacterCreationWizard: React.FC<WizardProps> = ({ onSave, onBack }) => {
    const [step, setStep] = useState(1);
    const [character, setCharacter] = useState<Character>(createNewCharacter());
    const [statMethod, setStatMethod] = useState<'streetrat' | 'edgerunner' | 'complete' | null>(null);

    const handleStatMethodSelect = (method: 'streetrat' | 'edgerunner' | 'complete') => {
        setStatMethod(method);
        setStep(step + 1);
    };
    
    const handleNestedChange = <T extends keyof Character>(section: T, field: keyof Character[T], value: any) => {
        setCharacter(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            },
        }));
    };

    const handleStatsChange = (newStats: Stats) => {
         setCharacter(prev => ({ ...prev, stats: newStats }));
    };
    
    const totalStatPoints = useMemo(() => {
        return Object.values(character.stats).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
    }, [character.stats]);
    
    const remainingStatPoints = EDGERUNNER_POINTS - totalStatPoints;

    const handleEdgerunnerStatChange = (statKey: string, value: string) => {
        const numValue = parseInt(value, 10);
        if (value === '' || (!isNaN(numValue) && numValue >= STAT_MIN && numValue <= STAT_MAX)) {
            const tempStats = { ...character.stats, [statKey]: value };
            const tempTotal = Object.values(tempStats).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
            if (tempTotal <= EDGERUNNER_POINTS) {
                handleNestedChange('stats', statKey, value);
            }
        }
    };
    
    const handleSkillChange = (skillId: string, value: string) => {
        const currentVal = parseInt(character.skills[skillId] || '0', 10);
        const change = (parseInt(value, 10) || 0) - currentVal;
        
        if (remainingSkillPoints - change >= 0) {
            handleNestedChange('skills', skillId, value);
        }
    };

    const skillPoints = useMemo(() => {
        const int = parseInt(character.stats.int, 10) || 0;
        const ref = parseInt(character.stats.ref, 10) || 0;
        return 40 + int + ref; // Simplified rule for base skills
    }, [character.stats.int, character.stats.ref]);

    const usedSkillPoints = useMemo(() => {
        return Object.values(character.skills).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
    }, [character.skills]);

    const remainingSkillPoints = skillPoints - usedSkillPoints;


    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const canProceed = () => {
        if (step === 2 && statMethod === 'edgerunner' && remainingStatPoints !== 0) return false;
        if (step === 2 && !Object.values(character.stats).every(s => s && s !== '')) return false;
        if (step === 3 && remainingSkillPoints < 0) return false;
        return true;
    };
    
    const renderStep = () => {
        switch (step) {
            case 1: // Stat Method Selection
                return (
                    <Section title="Passo 1: Método de Geração de Atributos">
                        <p className="mb-6 text-gray-300">Escolha como você irá definir os atributos do seu personagem, conforme as regras do Cyberpunk RED.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button onClick={() => handleStatMethodSelect('streetrat')} className="p-4 border-2 border-cyan-400 text-left hover:bg-cyan-900/30 transition-all">
                                <h4 className="font-display text-2xl text-cyan-300">Streetrat</h4>
                                <p className="text-sm">Rápido e direto. Escolha um dos 5 conjuntos de atributos pré-definidos. Ideal para começar a jogar rapidamente.</p>
                            </button>
                            <button onClick={() => handleStatMethodSelect('edgerunner')} className="p-4 border-2 border-cyan-400 text-left hover:bg-cyan-900/30 transition-all">
                                <h4 className="font-display text-2xl text-cyan-300">Edgerunner</h4>
                                <p className="text-sm">Customizável e balanceado. Distribua 62 pontos entre seus atributos (mínimo 2, máximo 8 em cada).</p>
                            </button>
                            <button onClick={() => handleStatMethodSelect('complete')} className="p-4 border-2 border-cyan-400 text-left hover:bg-cyan-900/30 transition-all">
                                <h4 className="font-display text-2xl text-cyan-300">Complete Package</h4>
                                <p className="text-sm">Aleatório e imprevisível. Role 1d10 para cada atributo. Requer o componente de rolador de dados.</p>
                            </button>
                        </div>
                    </Section>
                );
            case 2: // Stats Allocation
                return (
                     <Section title="Passo 2: Definir Atributos">
                        {statMethod === 'streetrat' && (
                            <div>
                                <h4 className="font-display text-xl text-cyan-300 mb-2">Escolha um Array de Atributos</h4>
                                <div className="space-y-3">
                                {STREETRAT_STATS_ARRAYS.map((arr, i) => (
                                    <button key={i} onClick={() => handleStatsChange(arr.stats as Stats)} className={`w-full p-2 border-2 text-left transition-all ${JSON.stringify(character.stats) === JSON.stringify(arr.stats) ? 'border-red-500 bg-red-900/30' : 'border-cyan-400 hover:bg-cyan-900/20'}`}>
                                        <p className="font-bold text-lg">{arr.name}</p>
                                        <p className="text-xs">{STATS_LIST.map(s => `${s.name}: ${arr.stats[s.key]}`).join(', ')}</p>
                                    </button>
                                ))}
                                </div>
                            </div>
                        )}
                        {statMethod === 'edgerunner' && (
                            <div>
                                <div className="bg-cyan-900/10 p-3 border border-cyan-400/50 mb-4 text-center">
                                    <p className="font-display text-xl text-cyan-300">PONTOS RESTANTES</p>
                                    <p className={`text-4xl font-bold ${remainingStatPoints === 0 ? 'text-green-400' : 'text-white'}`}>{remainingStatPoints}</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {STATS_LIST.map(stat => (
                                    <CyberLabeledInput key={stat.key} type="number" min={STAT_MIN} max={STAT_MAX} label={stat.name} className="text-center" value={character.stats[stat.key]} onChange={e => handleEdgerunnerStatChange(stat.key, e.target.value)} />
                                ))}
                                </div>
                                {remainingStatPoints !== 0 && <p className="text-red-400 text-center mt-4">Você deve usar todos os {EDGERUNNER_POINTS} pontos.</p>}
                            </div>
                        )}
                         {statMethod === 'complete' && (
                            <div>
                               <p className="text-center text-cyan-300 mb-4">Use o rolador de dados (botão D20 no canto inferior direito) para rolar 1d10 para cada atributo.</p>
                               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {STATS_LIST.map(stat => (
                                    <CyberLabeledInput key={stat.key} type="number" label={stat.name} className="text-center" value={character.stats[stat.key]} onChange={e => handleNestedChange('stats', stat.key, e.target.value)} />
                                ))}
                                </div>
                            </div>
                        )}
                    </Section>
                );
            case 3: // Skills Allocation
                 return (
                    <Section title="Passo 3: Distribuir Perícias">
                        <div className="bg-cyan-900/10 p-3 border border-cyan-400/50 mb-4 text-center">
                            <p className="font-display text-xl text-cyan-300">PONTOS DE PERÍCIA RESTANTES</p>
                            <p className={`text-4xl font-bold ${remainingSkillPoints >= 0 ? 'text-white' : 'text-red-500'}`}>{remainingSkillPoints} / {skillPoints}</p>
                            <p className="text-xs text-gray-400">(Baseado em 40 + INT {character.stats.int} + REF {character.stats.ref})</p>
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                         {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                            <div key={category} className="mb-4">
                                <h4 className="font-display text-xl text-cyan-300 border-b border-cyan-700/50 mb-2 pb-1">{category}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    {skills.map(skill => {
                                        const skillId = getSkillId(skill);
                                        return (
                                            <div key={skillId} className="grid grid-cols-[1fr_auto] items-center gap-2">
                                                <label htmlFor={skillId} className="text-cyan-300 truncate">{skill}</label>
                                                <input type="number" id={skillId} name={skillId} className="w-16 p-1 text-center bg-cyan-900/10 border border-cyan-400 text-gray-100" placeholder="0" value={character.skills[skillId] || ''} onChange={e => handleSkillChange(skillId, e.target.value)} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                         ))}
                        </div>
                    </Section>
                );

            case 4: // Finalize
                return (
                    <Section title="Passo 4: Finalizar Personagem">
                        <p className="mb-4 text-gray-300">Defina o apelido do seu personagem. Os outros detalhes poderão ser preenchidos na ficha completa após a criação.</p>
                        <CyberLabeledInput type="text" label="Apelido do Personagem" value={character.info.handle} onChange={e => handleNestedChange('info', 'handle', e.target.value)} />
                        {!character.info.handle && <p className="text-red-400 text-center mt-4">O personagem precisa de um apelido.</p>}
                    </Section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-6">
                 <h2 className="font-display text-5xl text-red-500 uppercase">Criação de Personagem</h2>
                 <p className="text-cyan-300">Siga os passos para criar seu mercenário.</p>
            </header>
            
            <div className="min-h-[50vh]">
                {renderStep()}
            </div>
            
            <footer className="flex justify-between items-center mt-6 pt-4 border-t-2 border-red-500">
                <div>
                     {step > 1 && <button type="button" onClick={prevStep} className="font-bold py-2 px-6 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">Voltar</button>}
                     {step === 1 && <button type="button" onClick={onBack} className="font-bold py-2 px-6 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900">Cancelar</button>}
                </div>
                <div>
                    {step < 4 && <button type="button" disabled={!canProceed()} onClick={nextStep} className="font-bold py-2 px-6 rounded-none bg-transparent border-2 border-cyan-400 text-cyan-400 transition-all duration-300 uppercase hover:bg-cyan-400 hover:text-gray-900 disabled:border-gray-600 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed">Próximo</button>}
                    {step === 4 && <button type="button" disabled={!character.info.handle} onClick={() => onSave(character)} className="font-bold py-2 px-6 rounded-none bg-transparent border-2 border-green-500 text-green-500 transition-all duration-300 uppercase hover:bg-green-500 hover:text-gray-900 disabled:border-gray-600 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed">Finalizar e Salvar</button>}
                </div>
            </footer>
        </div>
    );
};

export default CharacterCreationWizard;
