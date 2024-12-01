import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clsx } from 'clsx';

export function WalletButton() {
  const { connected } = useWallet();

  return (
    <WalletMultiButton
      className={clsx(
        'px-4 py-2 font-medium rounded-lg transition-opacity',
        connected
          ? 'bg-equinox-green text-equinox-black hover:opacity-90'
          : 'bg-background-secondary border border-equinox-silver/20 hover:bg-background-primary'
      )}
    />
  );
}