import { useEffect, useState } from 'react';
import { Container, Engine } from 'tsparticles-engine';

export function useParticles(
  init: (engine: Engine) => Promise<void>,
  options: any
) {
  const [container, setContainer] = useState<Container | null>(null);

  useEffect(() => {
    const initParticles = async () => {
      try {
        await init(window.tsParticles);
        const container = await window.tsParticles.load('tsparticles', options);
        setContainer(container);
      } catch (error) {
        console.error('Error initializing particles:', error);
      }
    };

    initParticles();

    return () => {
      container?.destroy();
    };
  }, [init, options]);

  const particlesLoaded = async (container: Container) => {
    setContainer(container);
  };

  return { particlesLoaded };
}