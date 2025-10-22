
// A placeholder for the DKG class from dkg.js
// This allows us to type the dkg instance without needing full type definitions from the library.
export type DKG = any;

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
