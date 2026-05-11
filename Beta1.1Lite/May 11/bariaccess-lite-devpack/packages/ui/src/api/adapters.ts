/**
 * Mock/stub adapters for endpoints the backend doesn't yet have.
 * Zakiy: each TODO is a hand-off point. Replace localStorage with real API call
 * once the backend exposes the endpoint.
 *
 * Why this exists: the UI canon (§3, §5) defines surfaces that need persistence
 * (JotForm submission, Q inbox, Parking Lot, ABA name save, Memory Snap).
 * Backend v0.1.2 is scoring-only. These adapters give the UI a working local
 * implementation today + a clean swap-point for tomorrow.
 */

export interface JotFormSubmissionPayload {
  jotFormId: string;
  userId: string;
  answers: Record<string, unknown>;
}

export const JotFormSubmissionAdapter = {
  /** TODO (backend): POST /api/jotforms/:id/submissions */
  async submit(payload: JotFormSubmissionPayload): Promise<{ ok: true }> {
    const key = `bariaccess.jotform.sub.${payload.jotFormId}`;
    localStorage.setItem(key, JSON.stringify({ ...payload, submittedAt: Date.now() }));
    return { ok: true };
  },
};

export interface QPersistenceAdapter {
  /** TODO (backend): GET /api/q/:userId */
  load(userId: string): Promise<unknown[]>;
  /** TODO (backend): POST /api/q/:userId */
  save(userId: string, items: unknown[]): Promise<void>;
}

export const QPersistence: QPersistenceAdapter = {
  async load(userId) {
    const raw = localStorage.getItem(`bariaccess.q.${userId}`);
    return raw ? (JSON.parse(raw) as unknown[]) : [];
  },
  async save(userId, items) {
    localStorage.setItem(`bariaccess.q.${userId}`, JSON.stringify(items));
  },
};

export interface AbaProfileAdapter {
  /** TODO (backend): GET /api/users/:userId/aba */
  load(userId: string): Promise<{ name: string; voiceId: string | null } | null>;
  /** TODO (backend): PUT /api/users/:userId/aba */
  save(userId: string, profile: { name: string; voiceId: string | null }): Promise<void>;
}

export const AbaProfile: AbaProfileAdapter = {
  async load(userId) {
    const raw = localStorage.getItem(`bariaccess.aba.${userId}`);
    return raw ? (JSON.parse(raw) as { name: string; voiceId: string | null }) : null;
  },
  async save(userId, profile) {
    localStorage.setItem(`bariaccess.aba.${userId}`, JSON.stringify(profile));
  },
};

export interface MemorySnapAdapter {
  /** TODO (Val): Memory Snap content rules TBD per §9 Open Items */
  list(userId: string): Promise<{ id: string; thumb: string; ts: number }[]>;
}

export const MemorySnap: MemorySnapAdapter = {
  async list() {
    return []; // stub — Val defines content
  },
};
