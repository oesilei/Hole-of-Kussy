import React, { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../config';

declare var google: any;

interface LoginViewProps {
    onLogin: (response: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    const isConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

    useEffect(() => {
        if (!isConfigured || hasInitialized.current) return;
        
        if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
            // Google script might not be loaded yet, wait and retry.
            const timeoutId = setTimeout(() => {
                 if (googleButtonRef.current) {
                    // Force a re-render or re-run useEffect if needed, though state change will handle it
                 }
            }, 500);
            return () => clearTimeout(timeoutId);
        }

        hasInitialized.current = true;
        
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: onLogin,
        });

        if (googleButtonRef.current) {
            google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', shape: 'rectangular' }
            );
        }

        // google.accounts.id.prompt(); // Optional: show one-tap

    }, [onLogin, isConfigured]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <header className="mb-8">
                <h1 className="glitch font-display text-5xl sm:text-6xl md:text-7xl uppercase" data-text="HOLE OF KUSSY">HOLE OF KUSSY</h1>
                <p className="text-cyan-300">Gerenciador de Personagens - Cyberpunk RED</p>
            </header>
            <div className="border border-red-500 cyber-section-bg p-8 max-w-md w-full">
                <h2 className="font-display text-3xl text-red-500 mb-6">LOGIN</h2>
                
                {isConfigured ? (
                    <>
                        <p className="mb-6">Use sua conta Google para salvar e acessar seus personagens na nuvem.</p>
                        <div className="flex justify-center">
                            <div ref={googleButtonRef} id="google-signin-button"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">Os personagens são salvos de forma segura e associados à sua conta Google.</p>
                    </>
                ) : (
                    <div className="bg-red-900/50 border border-red-500 p-4 text-left">
                        <h3 className="font-bold text-red-400 text-lg">CONFIGURAÇÃO NECESSÁRIA</h3>
                        <p className="text-red-300 mt-2">
                            O ID do Cliente Google não foi configurado. Para habilitar o login,
                            por favor, edite o arquivo <code className="bg-black/50 px-1 py-0.5 rounded text-cyan-300">config.ts</code> e
                            substitua o valor do placeholder pelo seu ID de cliente real.
                        </p>
                        <p className="text-xs text-red-400 mt-2">
                            Instruções detalhadas estão nos comentários dentro do arquivo.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginView;