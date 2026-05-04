"""
spike_constants.py — Shared constants used across app.py, sync_job.py, and routes/.

Centralised here to avoid circular imports: app.py imports from routes/, which would
otherwise need to import from app.py.
"""

# ── Canonical Spike interval-stats types ─────────────────────────────────────
# Single source of truth for every /statistics/interval request across ALL sync
# paths (on-demand, scheduled, Azure Function).
# Spike silently omits any type a given provider does not support.
CANONICAL_STAT_TYPES = ",".join([
    # Activity
    "steps",
    "distance_total",
    "distance_walking",
    "distance_cycling",
    "distance_running",
    "floors_climbed",
    "active_minutes",
    # Calories
    "calories_burned_basal",
    "calories_burned_active",
    "calories_burned_total",
    # Heart rate
    "heartrate",
    "heartrate_max",
    "heartrate_min",
    "heartrate_resting",
    # Heart rate zones (durations in ms from Spike; stored as seconds)
    "heartrate_zone0_duration",
    "heartrate_zone1_duration",
    "heartrate_zone2_duration",
    "heartrate_zone3_duration",
    "heartrate_zone4_duration",
    "heartrate_zone5_duration",
    # HRV
    "hrv_rmssd",
    "hrv_sdnn",
    # SpO2 / Breathing
    "spo2",
    "respiratory_rate",
    # Stress / Readiness
    "stress_score",
    "readiness_score",
    "recovery_score",
    # Sleep aggregates — requesting sleep_duration_total returns stage sub-metrics in ms.
    # Requesting sleep_score also returns sleep_duration and stage durations.
    # All values are in milliseconds per Spike API spec; converted to seconds on ingest.
    "sleep_score",
    "sleep_duration_total",
    # Temperature
    "skin_temperature",
    "sleep_skin_temperature_deviation",
    # Body (wrist-based estimates)
    "weight",
    "body_fat_percentage",
    # Glucose spot checks (non-CGM)
    "blood_glucose",
])

# Keys returned inside Spike interval-stats `values` dicts that are in milliseconds.
# We normalise to seconds before writing to normalized_data.
STAT_INTERVAL_MS_KEYS = frozenset({
    "sleep_duration",
    "sleep_duration_deep",
    "sleep_duration_light",
    "sleep_duration_rem",
    "sleep_duration_awake",
    "bedtime_duration",
    "sleep_duration_nap",
    "sleep_latency",
    "wakeup_latency",
    "heartrate_zone0_duration",
    "heartrate_zone1_duration",
    "heartrate_zone2_duration",
    "heartrate_zone3_duration",
    "heartrate_zone4_duration",
    "heartrate_zone5_duration",
})

# Keys in Spike sleep-record `metrics` dicts that are in milliseconds (before sleep_ prefix).
SLEEP_RECORD_MS_KEYS = frozenset({
    "sleep_duration",
    "sleep_duration_awake",
    "sleep_duration_deep",
    "sleep_duration_light",
    "sleep_duration_rem",
    "sleep_duration_nap",
    "bedtime_duration",
    "sleep_latency",
    "wakeup_latency",
    "heartrate_zone0_duration",
    "heartrate_zone1_duration",
    "heartrate_zone2_duration",
    "heartrate_zone3_duration",
    "heartrate_zone4_duration",
    "heartrate_zone5_duration",
})
