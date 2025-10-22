
import React, { useState } from 'react';
import type { DKG, KnowledgeAsset } from '../types';
import { createAsset } from '../services/dkg';
import { UploadCloudIcon } from './Icons';

interface CreateAssetCardProps {
  dkg: DKG | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCreatedUal: (ual: string | null) => void;
  isLoading: boolean;
}

const defaultAsset: KnowledgeAsset = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "John Doe",
  "description": "A test asset created with the DKG Testbed.",
  "timestamp": new Date().toISOString()
};

export function CreateAssetCard({ dkg, setIsLoading, setError, setCreatedUal, isLoading }: CreateAssetCardProps) {
  const [assetContent, setAssetContent] = useState<string>(JSON.stringify(defaultAsset, null, 2));

  const handleCreateAsset = async () => {
    if (!dkg) {
      setError('DKG is not initialized. Please provide a valid private key.');
      return;
    }

    let parsedContent: KnowledgeAsset;
    try {
      parsedContent = JSON.parse(assetContent);
    } catch (e) {
      setError('Invalid JSON format for asset content.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCreatedUal(null);

    try {
      const result = await createAsset(dkg, parsedContent);
      if (result.UAL) {
        setCreatedUal(result.UAL);
      } else {
        throw new Error('Asset creation did not return a UAL.');
      }
    } catch (err: any) {
      console.error(err);
      setError(`Failed to create asset: ${err.message || 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UploadCloudIcon className="w-6 h-6 text-purple-400" />
        2. Create a Knowledge Asset
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Enter the JSON content for your asset below and publish it to the DKG.
      </p>
      <div className="flex-grow flex flex-col">
        <textarea
          value={assetContent}
          onChange={(e) => setAssetContent(e.target.value)}
          className="w-full h-64 flex-grow bg-gray-900 border border-gray-600 rounded-md p-3 text-sm font-mono text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          placeholder="Enter asset JSON here..."
        />
      </div>
      <button
        onClick={handleCreateAsset}
        disabled={isLoading || !dkg}
        className="mt-4 w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
            <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Publishing...
            </>
        ) : (
          'Publish Asset'
        )}
      </button>
    </div>
  );
}
