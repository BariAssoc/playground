/**
 * BariAccess Beta — Spike API Adapter (V1 Wearable Streams)
 *
 * Source: BETA-VTAG-001 §Wearable Bookend Streams
 *
 * Wraps the Spike API for normalized wearable data ingestion.
 * Spike provides a unified shape across Oura / WHOOP / Polar / Apple / Garmin / Fitbit.
 *
 * Configure env vars:
 *   SPIKE_API_BASE_URL
 *   SPIKE_API_KEY
 *   SPIKE_APP_ID
 */

import type { WearableStream } from '@bariaccess/shared';

export interface SpikeConfig {
  base_url: string;
  api_key: string;
  app_id: string;
}

export interface SpikeStreamFetchOptions {
  spike_user_id: string;
  metric: WearableStream['metric'];
  from: string; // ISO 8601
  to: string;
}

// ────────────────────────────────────────────────────────────
// CLIENT
// ────────────────────────────────────────────────────────────
export class SpikeClient {
  constructor(private config: SpikeConfig) {}

  async fetchStream(
    opts: SpikeStreamFetchOptions
  ): Promise<WearableStream[]> {
    const url = `${this.config.base_url}/v1/${opts.metric}?user_id=${encodeURIComponent(opts.spike_user_id)}&from=${opts.from}&to=${opts.to}`;
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.config.api_key}`,
        'X-App-Id': this.config.app_id,
        Accept: 'application/json',
      },
    });
    if (!resp.ok) {
      throw new Error(`Spike API ${resp.status}: ${await resp.text()}`);
    }
    const json = (await resp.json()) as SpikeRawResponse;
    return json.data.map((d) => normalize(d, opts.metric));
  }
}

interface SpikeRawResponse {
  data: Array<{
    user_id: string;
    timestamp: string;
    value: number | object;
    unit?: string;
    source?: string;
  }>;
}

function normalize(
  raw: SpikeRawResponse['data'][number],
  metric: WearableStream['metric']
): WearableStream {
  const device = inferDevice(raw.source);
  return {
    stream_id: `${raw.user_id}_${metric}_${raw.timestamp}`,
    user_id: raw.user_id,
    metric,
    raw_value: raw.value,
    unit: raw.unit ?? defaultUnit(metric),
    v_tags: ['V1'],
    source_device: device,
    timestamp: raw.timestamp,
  };
}

function inferDevice(source?: string): WearableStream['source_device'] {
  if (!source) return 'other';
  const s = source.toLowerCase();
  if (s.includes('oura')) return 'oura_ring';
  if (s.includes('whoop')) return 'whoop';
  if (s.includes('polar')) return 'polar_360';
  if (s.includes('apple')) return 'apple_watch';
  if (s.includes('garmin')) return 'garmin';
  if (s.includes('fitbit')) return 'fitbit';
  return 'other';
}

function defaultUnit(metric: WearableStream['metric']): string {
  switch (metric) {
    case 'hrv':
      return 'ms';
    case 'rhr':
      return 'bpm';
    case 'temperature':
      return '°C';
    case 'steps':
      return 'count';
    case 'spo2':
      return '%';
    case 'sleep_stages':
      return 'object';
  }
}

// Singleton — wire to env
let _client: SpikeClient | null = null;
export function getSpikeClient(): SpikeClient {
  if (_client) return _client;
  _client = new SpikeClient({
    base_url: process.env.SPIKE_API_BASE_URL ?? 'https://api.spikeapi.com',
    api_key: process.env.SPIKE_API_KEY ?? '',
    app_id: process.env.SPIKE_APP_ID ?? '',
  });
  return _client;
}
