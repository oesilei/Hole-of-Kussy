import React from 'react';
import type { Cyberware, CyberwareCategory } from '../types';

interface CyberwareViewProps {
    cyberware: Cyberware[];
    onAdd: (category: CyberwareCategory) => void;
    onRemove: (id: string) => void;
    onChange: (id: string, field: keyof Omit<Cyberware, 'id' | 'category'>, value: string) => void;
}

const CyberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full p-1 bg-gray-800 border border-red-500 text-gray-100 focus:outline-none focus:bg-gray-700 ${props.className}`}
    />
);

interface CyberwareCategorySectionProps {
    title: CyberwareCategory;
    items: Cyberware[];
    onAdd: (category: CyberwareCategory) => void;
    onRemove: (id: string) => void;
    onChange: (id: string, field: keyof Omit<Cyberware, 'id' | 'category'>, value: string) => void;
    slots: number;
}

const CyberwareCategorySection: React.FC<CyberwareCategorySectionProps> = ({ title, items, onAdd, onRemove, onChange, slots }) => {
    return (
        <div className="border-2 border-red-500 flex flex-col h-full">
            <h3 className="bg-red-600 p-2 text-left text-lg tracking-wider uppercase">{title}</h3>
            <div className="p-2 space-y-2 flex-grow">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_50px_auto] gap-1 items-center">
                        <CyberInput
                            type="text"
                            placeholder="Nome..."
                            value={item.name}
                            onChange={(e) => onChange(item.id, 'name', e.target.value)}
                        />
                         <CyberInput
                            type="number"
                            placeholder="Custo"
                            className="text-center"
                            value={item.loss}
                            onChange={(e) => onChange(item.id, 'loss', e.target.value)}
                        />
                        <button type="button" onClick={() => onRemove(item.id)} className="px-2 h-full text-xs bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-gray-900 transition-colors">X</button>
                    </div>
                ))}
                {items.length < slots && Array.from({ length: slots - items.length }).map((_, i) => (
                     <div key={i} className="h-8 border border-red-900/50"></div>
                ))}
            </div>
            <button
                type="button"
                onClick={() => onAdd(title)}
                className="text-xs m-2 py-1 px-2 bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900"
            >
                + Adicionar
            </button>
        </div>
    );
};


const CyberwareView: React.FC<CyberwareViewProps> = ({ cyberware, onAdd, onRemove, onChange }) => {

    const filterByCategory = (category: CyberwareCategory) => {
        return cyberware.filter(cw => cw.category === category);
    };

    return (
        <div className="border-4 border-red-600 p-4 relative font-cyber bg-gray-900">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Coluna Esquerda */}
                <div className="space-y-4 flex flex-col">
                    <CyberwareCategorySection title="Right Cybereye" items={filterByCategory('Right Cybereye')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                    <CyberwareCategorySection title="Right Cyberarm" items={filterByCategory('Right Cyberarm')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                    <CyberwareCategorySection title="Right Cyberleg" items={filterByCategory('Right Cyberleg')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                </div>

                {/* Coluna Central */}
                <div className="space-y-4 flex flex-col justify-between">
                    <CyberwareCategorySection title="Cyberaudio Suite" items={filterByCategory('Cyberaudio Suite')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={2} />
                    <CyberwareCategorySection title="Neural Link" items={filterByCategory('Neural Link')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                </div>
                
                {/* Coluna Direita */}
                <div className="space-y-4 flex flex-col">
                    <CyberwareCategorySection title="Left Cybereye" items={filterByCategory('Left Cybereye')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                    <CyberwareCategorySection title="Left Cyberarm" items={filterByCategory('Left Cyberarm')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                    <CyberwareCategorySection title="Left Cyberleg" items={filterByCategory('Left Cyberleg')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                </div>

                {/* Coluna Geral */}
                <div className="space-y-4 flex flex-col">
                    <CyberwareCategorySection title="Internal" items={filterByCategory('Internal')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={5} />
                    <CyberwareCategorySection title="External" items={filterByCategory('External')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={4} />
                    <CyberwareCategorySection title="Fashionware" items={filterByCategory('Fashionware')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={3} />
                    <CyberwareCategorySection title="Borgware" items={filterByCategory('Borgware')} onAdd={onAdd} onRemove={onRemove} onChange={onChange} slots={2} />
                </div>
            </div>
        </div>
    );
};

export default CyberwareView;