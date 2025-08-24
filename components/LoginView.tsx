import React from 'react';
import { supabase } from '../supabaseClient'; // Importa nosso cliente Supabase

// A interface não é mais necessária, pois o App.tsx gerencia o estado de login
const LoginView: React.FC = () => {

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            console.error("Erro no login com Google:", error);
            alert('Falha no login. Verifique o console para mais detalhes.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <header className="mb-8">
                <h1 className="glitch font-display text-5xl sm:text-6xl md:text-7xl uppercase" data-text="HOLE OF KUSSY">HOLE OF KUSSY</h1>
                <p className="text-cyan-300">Gerenciador de Personagens - Cyberpunk RED</p>
            </header>
            <div className="border border-red-500 cyber-section-bg p-8 max-w-md w-full">
                <h2 className="font-display text-3xl text-red-500 mb-6">LOGIN</h2>
                <p className="mb-6">Use sua conta Google para salvar e acessar seus personagens de qualquer lugar.</p>
                <div className="flex justify-center">
                    {/* Botão de login que chama a função do Supabase */}
                    <button 
                        onClick={handleGoogleLogin} 
                        className="bg-gray-800 border-2 border-cyan-400 text-cyan-300 font-bold py-2 px-6 hover:bg-cyan-900/50 transition-colors"
                    >
                        Entrar com Google
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">Os personagens são salvos de forma segura e associados à sua conta.</p>
            </div>
        </div>
    );
};

export default LoginView;