import DKG from '@origintrail/dkg-js-v6';
import type { DkgCreateOptions, DkgResult, KnowledgeAsset } from '../types';

// NeuroWeb Testnet Configuration for DKG v6
const NEUROWEB_TESTNET_CONFIG = {
  endpoint: 'dkg-testnet.origintrail.network',
  blockchain: {
    name: 'otp:20430',
    rpc: 'https://neuroweb-testnet.origin-trail.network',
    hubContract: '0x7ee6665a29a3a8a3551486586255C2C400b46d03',
  },
};

/**
 * Initializes the DKG instance with a provided private key.
 * @param {string} privateKey - The user's EVM private key.
 * @returns {DKG} A new DKG instance.
 */
export function initializeDkg(privateKey: string): DKG {
  if (!privateKey) {
    throw new Error('Private key is required to initialize DKG.');
  }
  const config = {
    ...NEUROWEB_TESTNET_CONFIG,
    blockchain: {
      ...NEUROWEB_TESTNET_CONFIG.blockchain,
      privateKey,
    },
  };

  // @ts-ignore - The constructor might not be perfectly typed in all environments
  return new DKG(config);
}

/**
 * Creates a new knowledge asset on the DKG.
 * @param {DKG} dkg - The initialized DKG instance.
 * @param {KnowledgeAsset} content - The JSON content of the asset.
 * @returns {Promise<DkgResult>} The result of the creation operation.
 */
export async function createAsset(dkg: DKG, content: KnowledgeAsset): Promise<DkgResult> {
  if (!dkg) {
    throw new Error('DKG not initialized.');
  }

  const options: DkgCreateOptions = {
    epochs: 5,
    frequency: 1,
    tokenAmount: 1,
  };
  
  const result: DkgResult = await dkg.asset.create(content, options);
  return result;
}

/**
 * Retrieves a knowledge asset from the DKG using its UAL.
 * @param {DKG} dkg - The initialized DKG instance.
 * @param {string} ual - The Uniform Asset Locator of the asset.
 * @returns {Promise<DkgResult>} The result of the get operation, including the asset's assertion.
 */
export async function getAsset(dkg: DKG, ual: string): Promise<DkgResult> {
  if (!dkg) {
    throw new Error('DKG not initialized.');
  }

  const options = {
    state: 'LATEST_FINALIZED',
    validate: true
  };
  
  const result: DkgResult = await dkg.asset.get(ual, options);
  return result;
}