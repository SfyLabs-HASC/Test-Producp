import React, { useState, useEffect } from 'react';
import type { DKG } from './types';
import { initializeDkg } from './services/dkg';
import { CreateAssetCard } from './components/CreateAssetCard';
import { GetAssetCard } from './components/GetAssetCard';
import { KeyIcon, AlertTriangleIcon, CheckCircleIcon } from './components/Icons';

export default function App(): React.ReactElement {
  const [dkg, setDkg] = useState<DKG | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUal, setCreatedUal] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Vercel exposes environment variables via process.env
    // Ensure you set PRIVATE_KEY in your Vercel project settings
    const privateKey = process.env.PRIVATE_KEY;

    if (privateKey && privateKey.trim()) {
      try {
        const pkTrimmed = privateKey.trim();
        // Basic validation for the private key format
        if (pkTrimmed.length === 64 || (pkTrimmed.startsWith('0x') && pkTrimmed.length === 66)) {
          const dkgInstance = initializeDkg(pkTrimmed);
          setDkg(dkgInstance);
          setError(null);
        } else {
          setError("The PRIVATE_KEY environment variable has an invalid format. It should be 64 hex characters, optionally prefixed with '0x'.");
          setDkg(null);
        }
      } catch (err: any) {
        setError(`Failed to initialize DKG from private key: ${err.message}`);
        setDkg(null);
      }
    } else {
      setError("The PRIVATE_KEY environment variable is not set. Please configure it in your Vercel project settings.");
      setDkg(null);
    }
    setIsInitialized(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4">
            <img src="https://origintrail.io/images/ot-logo-white.svg" alt="OriginTrail Logo" className="h-12"/>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              DKG Testbed
            </h1>
          </div>
          <p className="text-lg text-gray-400 mt-2">
            Interact with the NeuroWeb Testnet
          </p>
        </header>

        <main>
          {/* Wallet Configuration Status */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <KeyIcon className="w-6 h-6 text-purple-400" />
              1. Wallet Configuration
            </h2>
             {isInitialized && dkg && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircleIcon className="w-5 h-5"/>
                <p>DKG successfully initialized from environment variable.</p>
              </div>
            )}
            {!dkg && !isInitialized && (
                <p className="text-gray-400">Attempting to initialize DKG from environment variable...</p>
            )}
             <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg flex items-start gap-3 text-yellow-300 text-sm">
                <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                    <span className="font-bold">Security Note:</span> The private key is sourced from an environment variable. Ensure your Vercel project is private and you only use a temporary testnet wallet. Get test tokens from the{' '}
                    <a href="https://faucet.neuroweb.ai/" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100">NeuroWeb Faucet</a>.
                </div>
            </div>
          </div>
          
          {isInitialized && error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-8">
              <p><span className="font-bold">Configuration Error:</span> {error}</p>
            </div>
          )}
          
          {createdUal && (
            <div className="bg-green-900/50 border border-green-700 text-green-300 p-4 rounded-lg mb-8">
                <p><span className="font-bold">Success!</span> Asset created with UAL: <code className="bg-green-900/60 p-1 rounded text-xs">{createdUal}</code></p>
                <p className="text-sm mt-1">UAL has been copied to the 'Get Asset' card below.</p>
            </div>
          )}

          {/* DKG Interaction Panes */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-500 ${!dkg ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <CreateAssetCard
                dkg={dkg}
                setIsLoading={setIsLoading}
                setError={setError}
                setCreatedUal={setCreatedUal}
                isLoading={isLoading}
            />
            <GetAssetCard
                dkg={dkg}
                setIsLoading={setIsLoading}
                setError={setError}
                isLoading={isLoading}
                initialUal={createdUal}
            />
          </div>

          {isInitialized && !dkg && (
            <div className="text-center text-gray-500 mt-8">
              Could not initialize DKG. Please check the error message above and ensure your PRIVATE_KEY is correctly set in Vercel.
            </div>
          )}

        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by OriginTrail. For more details, visit the <a href="https://docs.origintrail.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400">official documentation</a>.</p>
        </footer>
      </div>
    </div>
  );
}