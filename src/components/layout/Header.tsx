import React from 'react';
import { Beaker } from 'lucide-react';
import { WalletButton } from '../wallet/WalletButton';

export function Header() {
  return (
    <header className="border-b border-equinox-silver/10 backdrop-blur-xl bg-background-primary/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Beaker className="w-8 h-8 text-equinox-green animate-pulse" />
            <div className="absolute inset-0 bg-equinox-green/20 blur-xl rounded-full"></div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-glow">EQUINOX</h1>
        </div>
        <WalletButton />
      </div>
    </header>
  );
}