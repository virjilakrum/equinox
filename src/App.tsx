import React from 'react';
import { WalletContextProvider } from './contexts/WalletContext';
import { Header } from './components/layout/Header';
import { MarketsPage } from './components/markets/MarketsPage';
import { ParticleBackground } from './components/background/ParticleBackground';

function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-background-primary text-text-primary relative">
        <ParticleBackground />
        <div className="relative z-10">
          <Header />
          <main>
            <MarketsPage />
          </main>
        </div>
      </div>
    </WalletContextProvider>
  );
}

export default App;