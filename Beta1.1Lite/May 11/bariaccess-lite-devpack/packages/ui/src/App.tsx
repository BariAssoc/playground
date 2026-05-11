/**
 * App — top-level container.
 * Wraps the React Query client + simple hash router.
 *
 * Routes:
 *   /            → SimulationScreen (default — best demo path)
 *   #main        → MainScreen (production composition)
 *   #q           → QScreen
 *   #archive     → ArchiveScreen
 */

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SimulationScreen } from './screens/SimulationScreen.js';
import { MainScreen } from './screens/MainScreen.js';
import { QScreen } from './screens/QScreen.js';
import { ArchiveScreen } from './screens/ArchiveScreen.js';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

type Route = 'sim' | 'main' | 'q' | 'archive';

function readHashRoute(): Route {
  const h = window.location.hash.replace('#', '');
  if (h === 'main') return 'main';
  if (h === 'q') return 'q';
  if (h === 'archive') return 'archive';
  return 'sim';
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<Route>(readHashRoute);

  useEffect(() => {
    const onHash = () => setRoute(readHashRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <QueryClientProvider client={qc}>
      <RouteNav route={route} />
      {route === 'sim' && <SimulationScreen />}
      {route === 'main' && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4ECE6' }}>
          <MainScreen userId="demo-user" />
        </div>
      )}
      {route === 'q' && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4ECE6' }}>
          <QScreen />
        </div>
      )}
      {route === 'archive' && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4ECE6' }}>
          <ArchiveScreen />
        </div>
      )}
    </QueryClientProvider>
  );
};

const ROUTES: Array<{ id: Route; label: string }> = [
  { id: 'sim', label: 'Simulation' },
  { id: 'main', label: 'Main' },
  { id: 'q', label: 'Q Inbox' },
  { id: 'archive', label: 'Archive' },
];

const RouteNav: React.FC<{ route: Route }> = ({ route }) => (
  <div className="fixed top-2 right-2 z-50 flex gap-1 p-1 rounded-xl"
    style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', border: '1px solid #E5E7EB' }}>
    {ROUTES.map((r) => (
      <a key={r.id} href={`#${r.id}`}
        className="px-2 py-1 rounded-md text-[10px] font-semibold"
        style={{
          background: route === r.id ? '#0A0A0A' : 'transparent',
          color: route === r.id ? '#FFFFFF' : '#374151',
          textDecoration: 'none',
        }}>
        {r.label}
      </a>
    ))}
  </div>
);
