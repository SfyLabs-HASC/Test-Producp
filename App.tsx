
import React, { useState, useCallback } from 'react';
import type { DkgResult, DKG } from './types';
import { initializeDkg } from './services/dkg';
import { CreateAssetCard } from './components/CreateAssetCard';
import { GetAssetCard } from './components/GetAssetCard';
import { KeyIcon, AlertTriangleIcon } from './components/Icons';

export default function App(): React.ReactElement {
  const [privateKey, setPrivateKey] = useState<string>('');
  const [dkg, setDkg] = useState<DKG | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUal, setCreatedUal] = useState<string | null>(null);

  const handlePrivateKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pk = e.target.value;
    setPrivateKey(pk);
    setError(null);
    setCreatedUal(null);
    if (pk.trim().length === 64 || pk.trim().startsWith('0x') && pk.trim().length === 66) {
      try {
        const dkgInstance = initializeDkg(pk.trim());
        setDkg(dkgInstance);
      } catch (err: any) {
        setError(`Failed to initialize DKG: ${err.message}`);
        setDkg(null);
      }
    } else {
      setDkg(null);
    }
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
          {/* Private Key Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <KeyIcon className="w-6 h-6 text-purple-400" />
              1. Configure Your Wallet
            </h2>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your EVM private key (0x...)"
                value={privateKey}
                onChange={handlePrivateKeyChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
            {!dkg && privateKey.length > 0 && (
                <p className="text-yellow-400 text-sm mt-2">Invalid private key format. It should be 64 hex characters, optionally prefixed with '0x'.</p>
            )}
             <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg flex items-start gap-3 text-yellow-300 text-sm">
                <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                    <span className="font-bold">Security Warning:</span> This is a test tool. Never use a private key from a wallet with real funds. It is recommended to create a new, temporary wallet for testing. Get test tokens from the{' '}
                    <a href="https://faucet.neuroweb.ai/" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100">NeuroWeb Faucet</a>.
                </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-8">
              <p><span className="font-bold">Error:</span> {error}</p>
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

          {!dkg && (
            <div className="text-center text-gray-500 mt-8">
              Please enter a valid private key to enable DKG operations.
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
