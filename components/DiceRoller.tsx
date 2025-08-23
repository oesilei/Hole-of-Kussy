import React, { useState, useRef, useEffect } from 'react';

const DiceRoller: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [result, setResult] = useState<number | string>('-');
    const [sidesLabel, setSidesLabel] = useState<string>('Resultado');
    const [customSides, setCustomSides] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isRolling, setIsRolling] = useState(false);
    const resultDisplayRef = useRef<HTMLDivElement>(null);

    const rollDie = (sides: number) => {
        setError('');
        setIsRolling(true);
        
        // Math to get a random integer from 1 to sides
        const rollResult = Math.floor(Math.random() * sides) + 1;
        
        setSidesLabel(`Resultado (D${sides})`);
        
        setTimeout(() => {
            setResult(rollResult);
            setIsRolling(false);
        }, 500); // Corresponds to animation duration
    };

    const rollCustomDie = () => {
        const sides = parseInt(customSides);

        if (isNaN(sides) || sides < 1 || sides > 1000) {
            setError('Insira um número entre 1 e 1000.');
            setSidesLabel('Resultado');
            setResult('-');
            return;
        }
        
        rollDie(sides);
    };

    const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomSides(e.target.value);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            rollCustomDie();
        }
    };

    useEffect(() => {
        if (isRolling && resultDisplayRef.current) {
            const display = resultDisplayRef.current;
            display.classList.remove('dice-roll-animation');
            void display.offsetWidth; // Trigger reflow
            display.classList.add('dice-roll-animation');
        }
    }, [isRolling]);

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-red-600/90 border-2 border-cyan-400 text-cyan-300 font-display text-2xl flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:scale-110 hover:shadow-[0_0_15px_#f00] focus:outline-none"
                    aria-label="Abrir rolador de dados"
                >
                    D20
                </button>
            )}

            {/* Dice Roller Popup */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-[#1a1a1a] border-2 border-red-500 p-6 cyber-section-bg text-center flex flex-col gap-4 animate-slide-in">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h2 className="font-display text-3xl text-cyan-300 uppercase">Rolador de Dados</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="font-bold py-1 px-3 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-gray-900"
                            aria-label="Fechar rolador de dados"
                        >
                            X
                        </button>
                    </div>

                    {/* Result Display */}
                    <div className="bg-cyan-900/10 border border-cyan-400 p-4">
                        <h3 className="text-md text-cyan-400 mb-1">{sidesLabel}</h3>
                        <div ref={resultDisplayRef} className="text-7xl font-black text-white h-20 flex items-center justify-center">
                            {isRolling ? '...' : result}
                        </div>
                    </div>

                    {/* Common Dice */}
                    <div className="grid grid-cols-3 gap-2">
                        {[4, 6, 8, 10, 12, 20].map(sides => (
                             <button key={sides} onClick={() => rollDie(sides)} className="font-bold py-3 px-2 rounded-none bg-transparent border-2 border-cyan-400 text-cyan-400 transition-all duration-300 uppercase hover:bg-cyan-400 hover:text-gray-900 text-lg">
                                D{sides}
                            </button>
                        ))}
                    </div>

                    {/* Custom Roll */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                         <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-bold">D</span>
                            <input
                                type="number"
                                value={customSides}
                                onChange={handleCustomInputChange}
                                onKeyUp={handleKeyUp}
                                placeholder="100"
                                className="w-full p-3 pl-8 bg-cyan-900/10 border border-cyan-400 text-gray-100 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_#0ff] focus:bg-cyan-900/20 text-center"
                            />
                        </div>
                        <button onClick={rollCustomDie} className="w-full sm:w-auto font-bold py-3 px-6 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900 whitespace-nowrap">
                            Rolar
                        </button>
                    </div>
                     {/* Error Message */}
                    <p className="text-red-400 h-5">{error}</p>
                </div>
            )}
        </>
    );
};

export default DiceRoller;