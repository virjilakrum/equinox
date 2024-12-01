import { 
  Connection, 
  PublicKey, 
  SystemProgram,
} from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { IDL, MarketAccount, CustomProgram } from '../../anchor/target/idl/equinox';

const DEVNET_ENDPOINT = 'https://api.devnet.solana.com';
const connection = new Connection(DEVNET_ENDPOINT);
const PROGRAM_ID = new PublicKey('4V7bQi7Fus5Mj4Hr5sXtMjoBmZu5kQnFGvuLBhEPVpDh');

function getProgram(wallet: WalletContextState): CustomProgram {
  const provider = new AnchorProvider(
    connection,
    wallet as any,
    AnchorProvider.defaultOptions()
  );
  return new Program(IDL, PROGRAM_ID, provider) as unknown as CustomProgram;
}

export async function createMarket(
  wallet: WalletContextState,
  marketData: {
    question: string;
    resolutionDate: number;
    initialStake: number;
    paperId: string;
  }
) {
  if (!wallet.publicKey) throw new Error('Wallet not connected');
  
  try {
    const program = getProgram(wallet);
    const marketKeypair = web3.Keypair.generate();

    const tx = await program.methods
      .createMarket(
        marketData.paperId,
        marketData.question,
        new BN(marketData.resolutionDate),
        new BN(marketData.initialStake)
      )
      .accounts({
        user: wallet.publicKey,
        market: marketKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([marketKeypair])
      .rpc();

    return {
      signature: tx,
      marketId: marketKeypair.publicKey.toString(),
    };
  } catch (error) {
    console.error('Error creating market:', error);
    throw new Error('Failed to create market. Please try again.');
  }
}

export async function validatePaper(
  wallet: WalletContextState,
  marketId: string,
  isValid: boolean
) {
  if (!wallet.publicKey) throw new Error('Wallet not connected');

  try {
    const program = getProgram(wallet);
    
    const tx = await program.methods
      .validatePaper(isValid)
      .accounts({
        user: wallet.publicKey,
        market: new PublicKey(marketId),
      })
      .rpc();

    return { signature: tx };
  } catch (error) {
    console.error('Validation error:', error);
    throw new Error('Validation failed. Please try again.');
  }
}

export async function getMarketData(marketId: string, wallet: WalletContextState) {
  try {
    const marketPubkey = new PublicKey(marketId);
    const program = getProgram(wallet);
    
    const account = await program.account.market.fetch(marketPubkey);
    const marketAccount = account as unknown as MarketAccount;
    
    return {
      isInitialized: true,
      validationCount: marketAccount.validationCount.toNumber(),
      totalStake: marketAccount.totalStake.toNumber(),
      owner: marketAccount.owner.toString(),
      paperId: marketAccount.paperId,
      question: marketAccount.question,
      resolutionDate: marketAccount.resolutionDate.toNumber(),
      address: marketId
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data');
  }
}

export async function getValidationHistory(marketId: string) {
  try {
    const marketPubkey = new PublicKey(marketId);
    
    const signatures = await connection.getSignaturesForAddress(marketPubkey);
    const events = await Promise.all(
      signatures.map(async (sig) => {
        const blockTime = sig.blockTime ?? 0;
        return {
          signature: sig.signature,
          timestamp: new Date(blockTime * 1000),
        };
      })
    );
    
    return events;
  } catch (error) {
    console.error('Error fetching validation history:', error);
    throw new Error('Failed to fetch validation history');
  }
}