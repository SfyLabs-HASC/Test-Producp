
import React, { useState, useEffect } from 'react';
import type { DKG, KnowledgeAsset } from '../types';
import { getAsset } from '../services/dkg';
import { DownloadCloudIcon } from './Icons';

interface GetAssetCardProps {
  dkg: DKG | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  initialUal: string | null;
}

export function GetAssetCard({ dkg, setIsLoading, setError, isLoading, initialUal }: GetAssetCardProps) {
  const [ual, setUal] = useState<string>('');
  const [retrievedAsset, setRetrievedAsset] = useState<KnowledgeAsset | null>(null);

  useEffect(() => {
    if (initialUal) {
      setUal(initialUal);
      setRetrievedAsset(null); // Clear previous result when a new asset is created
    }
  }, [initialUal]);

  const handleGetAsset = async () => {
    if (!dkg) {
      setError('DKG is not initialized. Please provide a valid private key.');
      return;
    }
    if (!ual.trim()) {
      setError('Please enter a UAL to retrieve.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRetrievedAsset(null);

    try {
      const result = await getAsset(dkg, ual.trim());
      if (result.assertion) {
        setRetrievedAsset(result.assertion);
      } else {
        throw new Error('Asset retrieval did not return any data (assertion).');
      }
    } catch (err: any) {
      console.error(err);
      setError(`Failed to get asset: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <DownloadCloudIcon className="w-6 h-6 text-purple-400" />
        3. Get a Knowledge Asset
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Enter the Uniform Asset Locator (UAL) to fetch an asset from the DKG.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={ual}
          onChange={(e) => setUal(e.target.value)}
          placeholder="did:dkg:otp:20430.../..."
          className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        />
        <button
          onClick={handleGetAsset}
          disabled={isLoading || !dkg || !ual}
          className="bg-purple-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : 'Get'}
        </button>
      </div>

      <div className="mt-4 flex-grow">
        <label className="text-sm font-semibold text-gray-400">Retrieved Asset Content:</label>
        <div className="w-full min-h-[16rem] bg-gray-900 border border-gray-600 rounded-md p-3 mt-1">
          {retrievedAsset ? (
            <pre className="text-sm font-mono text-green-300 whitespace-pre-wrap break-all">
              {JSON.stringify(retrievedAsset, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500 flex items-center justify-center h-full">
              Asset data will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
