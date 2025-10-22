import type { DkgCreateOptions, DkgResult, KnowledgeAsset, DKG } from '../types';

// NeuroWeb Testnet Configuration
const NEUROWEB_TESTNET_CONFIG = {
  endpoint: 'dkg-testnet.origin-trail.network',
  port: 443,
  useSSL: true,
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
  
  if (!window.DkgClient) {
    throw new Error('DKG library not loaded. `window.DkgClient` is not available.');
  }

  // The DKG library might expose its constructor directly or under a .default property.
  // This handles both cases to prevent "is not a constructor" errors.
  const DkgConstructor = window.DkgClient.default || window.DkgClient;

  if (typeof DkgConstructor !== 'function') {
    throw new Error('DKG library failed to load or `window.DkgClient` is not a constructor.');
  }
  
  // @ts-ignore
  return new DkgConstructor(config);
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
    frequency: 1, // How often to check for rewards in epochs.
    tokenAmount: 1, // Amount of TRAC to stake.
    // Add other options as needed
  };
  
  // @ts-ignore dkg.js type definitions might not be perfect
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
  // @ts-ignore dkg.js type definitions might not be perfect
  const result: DkgResult = await dkg.asset.get(ual, options);
  return result;
}
