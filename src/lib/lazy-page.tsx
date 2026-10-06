import { lazy, useState, type ComponentType } from 'react';

type PageModule = { default: ComponentType };

export interface LazyPage {
  (): JSX.Element;
  /** Descarga el chunk de la página. entry-client lo llama antes de hidratar la ruta actual. */
  preload: () => Promise<PageModule>;
}

/**
 * React.lazy por ruta (Fase 6): cada página va en su propio chunk y no pesa en la carga inicial.
 *
 * Si el chunk ya se descargó (preload antes de hidratar, o una visita anterior a la ruta), la
 * página se monta directo, sin suspender: la hidratación de la ruta actual no espera un ciclo
 * extra ni deja que Helmet pise por un instante el <head> prerenderizado. Si no, suspende con
 * React.lazy dentro del <Suspense> de AppRoutes. El componente elegido queda fijo durante todo
 * el montaje, para no remontar la página cuando termina la descarga.
 * En el prerender, onAllReady espera a todos los lazy: el HTML nunca trae un fallback.
 */
export function lazyPage(load: () => Promise<PageModule>): LazyPage {
  let loaded: ComponentType | null = null;
  let pending: Promise<PageModule> | null = null;

  const preload = () => {
    pending ??= load().then(
      (module) => {
        loaded = module.default;
        return module;
      },
      (error: unknown) => {
        // Permite reintentar (p. ej. tras un corte de red); el deploy nuevo lo maneja entry-client.
        pending = null;
        throw error;
      },
    );
    return pending;
  };

  const Lazy = lazy(preload);

  const Page = () => {
    const [Component] = useState(() => loaded);
    return Component ? <Component /> : <Lazy />;
  };

  Page.preload = preload;
  return Page;
}
