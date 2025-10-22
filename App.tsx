import React, { useState, useEffect } from 'react';
import { initializeDkg } from './services/dkg';
import { CreateAssetCard } from './components/CreateAssetCard';
import { GetAssetCard } from './components/GetAssetCard';
import { KeyIcon, AlertTriangleIcon, CheckCircleIcon } from './components/Icons';
import type { DKG } from './types';

function App() {
  const [isDkgLibLoaded, setIsDkgLibLoaded] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [dkg, setDkg] = useState<DKG | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUal, setCreatedUal] = useState<string | null>(null);

  // Poll to check if the DKG library script has loaded
  useEffect(() => {
    if (window.DKG) {
      setIsDkgLibLoaded(true);
      return;
    }

    const intervalId = setInterval(() => {
      if (window.DKG) {
        setIsDkgLibLoaded(true);
        clearInterval(intervalId);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleInitializeDkg = () => {
    if (!privateKey.trim()) {
      setError('Private key cannot be empty.');
      return;
    }
    try {
      setError(null);
      const dkgInstance = initializeDkg(privateKey.trim());
      setDkg(dkgInstance);
    } catch (err: any) {
      setError(`Failed to initialize DKG: ${err.message}`);
      setDkg(null);
    }
  };

  if (!isDkgLibLoaded) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-400">Loading DKG library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-400">DKG Testbed Application</h1>
          <p className="text-lg text-gray-400 mt-2">
            Interact with the OriginTrail Decentralized Knowledge Graph.
          </p>
        </header>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangleIcon className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}
        {createdUal && (
          <div className="mb-6 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6" />
            <span>
              Asset created successfully! UAL: <strong className="font-mono">{createdUal}</strong>
            </span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left side: Setup and Create */}
          <div className="flex flex-col gap-8">
            {/* Step 1: Initialize DKG */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <KeyIcon className="w-6 h-6 text-purple-400" />
                1. Initialize DKG Client
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Enter your NeuroWeb Testnet EVM private key to connect to the DKG.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Enter your private key"
                  className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={handleInitializeDkg}
                  disabled={!privateKey}
                  className="bg-purple-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Initialize
                </button>
              </div>
              {dkg && (
                <p className="text-green-400 text-sm mt-3">DKG Client Initialized Successfully.</p>
              )}
            </div>

            {/* Step 2: Create Asset */}
            <CreateAssetCard 
              dkg={dkg}
              setIsLoading={setIsLoading}
              setError={setError}
              setCreatedUal={setCreatedUal}
              isLoading={isLoading}
            />
          </div>

          {/* Right side: Get Asset */}
          <GetAssetCard
            dkg={dkg}
            setIsLoading={setIsLoading}
            setError={setError}
            isLoading={isLoading}
            initialUal={createdUal}
          />
        </div>
      </main>
    </div>
  );
}

export default App;