/**
 * BariAccess Beta — Demo App
 *
 * Wires Bookshelf + Bookend cards + Journal together for testing.
 * Replace with your existing app shell in production.
 */

import { useState } from 'react';
import { Bookshelf } from './components/Bookshelf/Bookshelf';
import { WarmupCard } from './components/Bookend/WarmupCard';
import { CooldownCard } from './components/Bookend/CooldownCard';
import { Journal } from './components/Journal/Journal';
import type { ColorState, FAB } from '@bariaccess/shared';
import './styles.css';

type View = 'bookshelf' | 'journal';
type Modal = { type: 'warmup' | 'cooldown'; fab: FAB } | null;

export function App() {
  const [user_id] = useState('val_andrei'); // Hardcoded for demo
  const [view, setView] = useState<View>('bookshelf');
  const [modal, setModal] = useState<Modal>(null);

  const handleTapFAB = (fab: FAB, color_state: ColorState | null) => {
    // If no color_state yet → show warm-up. Otherwise → cool-down.
    if (color_state == null || color_state === 'blue') {
      setModal({ type: 'warmup', fab });
    } else {
      setModal({ type: 'cooldown', fab });
    }
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <button
          className={view === 'bookshelf' ? 'active' : ''}
          onClick={() => setView('bookshelf')}
        >
          Bookshelf
        </button>
        <button
          className={view === 'journal' ? 'active' : ''}
          onClick={() => setView('journal')}
        >
          Journal
        </button>
      </nav>

      <main className="app-main">
        {view === 'bookshelf' && (
          <Bookshelf user_id={user_id} onTapFAB={handleTapFAB} />
        )}
        {view === 'journal' && <Journal user_id={user_id} />}
      </main>

      {modal?.type === 'warmup' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <WarmupCard
              fab={modal.fab}
              user_id={user_id}
              onComplete={() => setModal(null)}
              onSkip={() => setModal(null)}
            />
          </div>
        </div>
      )}

      {modal?.type === 'cooldown' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CooldownCard
              fab={modal.fab}
              user_id={user_id}
              onComplete={() => setModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
