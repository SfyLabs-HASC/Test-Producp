import type DkgClient from 'dkg.js';

// The DKG type is now the actual DkgClient type imported from the library.
// This provides much better type safety and autocompletion.
export type DKG = DkgClient;

// The structure of a knowledge asset. Can be any JSON-LD object.
export interface KnowledgeAsset {
  [key: string]: any;
}

// Options for the dkg.asset.create method
export interface DkgCreateOptions {
  epochs: number;
  frequency?: number;
  tokenAmount?: number;
  [key: string]: any;
}

// Represents the result from a DKG operation (create or get)
export interface DkgResult {
  UAL?: string;
  assertion?: KnowledgeAsset;
  [key: string]: any;
}
