# Spike API — Metrics Coverage Analysis

## Methodology

This analysis was derived entirely from live data observed across **three Cosmos DB containers**:

- **Raw Data Container** — Stores raw API responses fetched from Spike. Each document has a `data_type` of either `provider_records` (a list of individual health records keyed by `provider_slug` and `provider_source`) or `interval_stats` (intraday step totals). These are the closest representation of what Spike is actually sending us per sync.
- **Normalized Data Container** — Stores one merged document per user per day. Contains a top-level `metrics` object (the single best value per metric across all connected providers), `provider_metrics` (each provider's raw contribution before merging), `metric_sources` (which provider "won" each metric), and a `sources` array listing all connected vendors for that user.
- **Workout Container** — Stores one document per discrete workout session. Contains session-level fields including `provider_slug`, `duration_minutes`, `calories_burned`, `avg_heart_rate`, and `max_heart_rate`.

Metrics were catalogued by inspecting every unique `provider_slug` × `provider_source` combination seen in the raw data records, and cross-referencing with the `provider_metrics` blocks in the normalized container to confirm what each vendor is actually contributing. The comparison column is sourced directly from the [Spike API Metrics Matrix](https://docs.spikeapi.com/technical-references/metrics_matrix).

**Vendors observed across the three containers:**

| Vendor | Identifier | Containers Present In |
|---|---|---|
| Oura | `oura` | Raw, Normalized, Workout |
| Polar | `polar` | Raw, Normalized, Workout |
| Garmin | `garmin` | Raw, Normalized |
| Apple Health | `apple_health` | Normalized only |
| Withings | `withings` | Raw only |
| Spike (internal aggregator) | `spike` | Normalized only |

> **Note on Spike:** `spike` appears in `metric_sources` and `provider_metrics` in the normalized container. It is Spike's internal aggregation layer — it recombines raw records (e.g. merging Polar sleep HR into a daily sleep-prefixed metric set). It is not a hardware vendor and has no entry in the Spike metrics matrix.

---

## Provider-by-Provider Breakdown

---

### 1. Oura

#### Raw Sources Observed
| Provider Source | Metrics Delivered |
|---|---|
| `oura_user_collection_daily_spo2_document` | `spo2` |
| `oura_user_collection_hr_document` | `heartrate_max`, `heartrate_min`, `heartrate` |
| `oura_user_collection_daily_activity_document` | `calories_burned_active`, `calories_burned_basal`, `steps`, `duration_low_intensity`, `duration_moderate_intensity`, `duration_high_intensity` |
| `oura_user_collection_sleep_document` | `heartrate_max`, `heartrate_min`, `heartrate`, `heartrate_resting`, `hrv_rmssd`, `breathing_rate`, `sleep_efficiency`, `sleep_duration`, `sleep_duration_deep`, `sleep_duration_light`, `sleep_duration_rem`, `sleep_duration_awake`, `bedtime_duration`, `sleep_interruptions`, `sleep_latency`, `sleep_skin_temperature_deviation` + provider-specific: `readiness_score` |
| `oura_user_collection_daily_sleep` | provider-specific: `sleep_score` |
| `oura_user_collection_workout_document` | `calories_burned` |

#### Metrics We Are Receiving from Oura
`bedtime_duration` · `breathing_rate` · `breathing_rate_max` · `breathing_rate_min` · `calories_burned` · `calories_burned_active` · `calories_burned_basal` · `duration_high_intensity` · `duration_low_intensity` · `duration_moderate_intensity` · `heartrate` · `heartrate_max` · `heartrate_min` · `heartrate_resting` · `hrv_rmssd` · `sleep_duration` · `sleep_duration_awake` · `sleep_duration_deep` · `sleep_duration_light` · `sleep_duration_nap` · `sleep_duration_rem` · `sleep_efficiency` · `sleep_interruptions` · `sleep_latency` · `sleep_skin_temperature_deviation` · `spo2` · `steps` · `weight`

Plus provider-specific (outside standard matrix): `oura_sleep_score` · `oura_readiness_score`

#### Metrics Available in Spike Matrix but NOT Being Received

| Missing Metric | Description | Unit |
|---|---|---|
| `body_temperature` | Body temperature | celsius |
| `body_temperature_max` | Max body temperature | celsius |
| `body_temperature_min` | Min body temperature | celsius |
| `distance` | Total distance | meters |
| `distance_cycling` | Cycling distance | meters |
| `distance_running` | Running distance | meters |
| `distance_walking` | Walking distance | meters |
| `height` | Height | meters |
| `spo2_max` | Max blood oxygen level | percentage |
| `spo2_min` | Min blood oxygen level | percentage |
| `vo2max` | VO2 max | mL/kg/min |  need to do test

---

### 2. Polar

#### Raw Sources Observed
| Provider Source | Metrics Delivered |
|---|---|
| `polar_continuous_heart_rate_by_date` | `heartrate_max`, `heartrate` |
| `polar_activity_transaction` | `calories_burned_active`, `calories_burned_basal`, `steps` |
| `polar_activity_transaction_steps` | `steps` |
| `polar_nightly_recharge` | `heartrate`, `hrv_rmssd`, `breathing_rate`, `breathing_rate_min`, `breathing_rate_max` |
| `polar_sleep_by_date` | `heartrate_max`, `heartrate_min`, `heartrate_zone0_duration`, `heartrate`, `sleep_duration`, `sleep_duration_deep`, `sleep_duration_light`, `sleep_duration_rem`, `sleep_duration_awake` + provider-specific: `sleep_score` |
| `polar_exercise` | `heartrate_max`, `heartrate_min`, `heartrate_zone0_duration`, `heartrate_zone1_duration`, `heartrate_zone2_duration`, `heartrate_zone3_duration`, `heartrate`, `calories_burned_active` |

#### Metrics We Are Receiving from Polar
`breathing_rate` · `breathing_rate_max` · `breathing_rate_min` · `calories_burned_active` · `calories_burned_basal` · `heartrate` · `heartrate_max` · `heartrate_min` · `hrv_rmssd` · `sleep_duration` · `sleep_duration_awake` · `sleep_duration_deep` · `sleep_duration_light` · `sleep_duration_rem` · `sleep_efficiency` · `steps`

Plus non-matrix fields: `heartrate_zone0_duration` · `heartrate_zone1_duration` · `heartrate_zone2_duration` · `heartrate_zone3_duration` · `polar_sleep_score`

#### Metrics Available in Spike Matrix but NOT Being Received

| Missing Metric | Description | Unit |
|---|---|---|
| `ascent` | Total ascent | meters |
| `body_temperature` | Body temperature | celsius |
| `body_temperature_max` | Max body temperature | celsius |
| `body_temperature_min` | Min body temperature | celsius |
| `cadence` | Average cadence | rpm |
| `cadence_max` | Max cadence | rpm |
| `cadence_min` | Min cadence | rpm |
| `descent` | Total descent | meters |
| `distance` | Total distance | meters |
| `distance_cycling` | Cycling distance | meters |
| `distance_running` | Running distance | meters |
| `distance_swimming` | Swimming distance | meters |
| `distance_walking` | Walking distance | meters |
| `distance_wheelchair` | Wheelchair distance | meters |
| `ecg_rri` | ECG R-R interval | ms |
| `ecg_voltage` | ECG voltage | uV |
| `elevation` | Elevation | meters |
| `elevation_gain` | Total elevation gain | meters |
| `elevation_loss` | Total elevation loss | meters |
| `elevation_max` | Max elevation | meters |
| `elevation_min` | Min elevation | meters |
| `heartrate_resting` | Resting heart rate | bpm |
| `height` | Height | meters |
| `latitude` | Latitude | degrees |
| `longitude` | Longitude | degrees |
| `skin_temperature` | Skin temperature | celsius |
| `skin_temperature_max` | Max skin temperature | celsius |
| `skin_temperature_min` | Min skin temperature | celsius |
| `sleep_skin_temperature_deviation` | Skin temp deviation from baseline | celsius |
| `speed` | Average speed | m/sec |
| `speed_max` | Max speed | m/sec |
| `speed_min` | Min speed | m/sec |
| `spo2` | Blood oxygen level | percentage |
| `spo2_max` | Max blood oxygen level | percentage |
| `spo2_min` | Min blood oxygen level | percentage |
| `swimming_distance_per_stroke` | Swimming distance per stroke | meters |
| `swimming_lengths` | Swimming lengths | count |
| `vo2max` | VO2 max | mL/kg/min |
| `weight` | Weight | g |

---

### 3. Garmin

#### Raw Sources Observed
| Provider Source | Metrics Delivered |
|---|---|
| `garmin_wellness_dailies` | `heartrate_max`, `heartrate_min`, `heartrate`, `heartrate_resting`, `calories_burned_active`, `calories_burned_basal`, `steps`, `distance`, `duration_active` |
| `garmin_wellness_body_comps` | `body_mass_index`, `weight`, `body_fat`, `body_bone_mass` |
| `garmin_wellness_epochs` | `calories_burned_active`, `steps`, `distance` (15-min intraday intervals) |
| `garmin_wellness_activity_details` | `spo2`, `spo2_max`, `spo2_min` |
| `garmin_wellness_stress_details` | provider-specific: `time_offset_stress_level_values` (intraday stress time series) |

Additional metrics confirmed via `provider_metrics.garmin` in normalized container: `breathing_rate` · `breathing_rate_min` · `breathing_rate_max` · `hrv_rmssd` · `sleep_duration` · `sleep_duration_deep` · `sleep_duration_light` · `sleep_duration_rem` · `sleep_duration_awake` · `sleep_interruptions` · `sleep_skin_temperature_deviation` · `sleep_score` · `floors_climbed` · `duration_moderate_intensity`

#### Metrics We Are Receiving from Garmin
`body_bone_mass` · `body_fat` · `body_mass_index` · `weight` · `breathing_rate` · `breathing_rate_max` · `breathing_rate_min` · `calories_burned_active` · `calories_burned_basal` · `distance` · `duration_active` · `duration_moderate_intensity` · `floors_climbed` · `heartrate` · `heartrate_max` · `heartrate_min` · `heartrate_resting` · `hrv_rmssd` · `sleep_duration` · `sleep_duration_awake` · `sleep_duration_deep` · `sleep_duration_light` · `sleep_duration_rem` · `sleep_interruptions` · `sleep_skin_temperature_deviation` · `spo2` · `spo2_max` · `spo2_min` · `steps`

#### Metrics Available in Spike Matrix but NOT Being Received

| Missing Metric | Description | Unit |
|---|---|---|
| `ascent` | Total ascent | meters |
| `blood_pressure_diastolic` | Diastolic blood pressure | mmHg |
| `blood_pressure_diastolic_max` | Max diastolic blood pressure | mmHg |
| `blood_pressure_diastolic_min` | Min diastolic blood pressure | mmHg |
| `blood_pressure_systolic` | Systolic blood pressure | mmHg |
| `blood_pressure_systolic_max` | Max systolic blood pressure | mmHg |
| `blood_pressure_systolic_min` | Min systolic blood pressure | mmHg |
| `cadence` | Average cadence | rpm |
| `cadence_max` | Max cadence | rpm |
| `cadence_min` | Min cadence | rpm |
| `descent` | Total descent | meters |
| `distance_cycling` | Cycling distance | meters |
| `distance_running` | Running distance | meters |
| `distance_swimming` | Swimming distance | meters |
| `distance_walking` | Walking distance | meters |
| `distance_wheelchair` | Wheelchair distance | meters |
| `duration_high_intensity` | High intensity duration | ms |
| `elevation` | Elevation | meters |
| `elevation_max` | Max elevation | meters |
| `elevation_min` | Min elevation | meters |
| `latitude` | Latitude | degrees |
| `longitude` | Longitude | degrees |
| `pace` | Average pace | sec/m |
| `sleep_duration_nap` | Nap duration | ms |
| `speed` | Average speed | m/sec |
| `speed_max` | Max speed | m/sec |
| `speed_min` | Min speed | m/sec |
| `swimming_distance_per_stroke` | Swimming distance per stroke | meters |
| `swimming_lengths` | Swimming lengths | count |
| `vo2max` | VO2 max | mL/kg/min |

---

### 4. Apple Health

> Apple Health does not appear in the raw data container. Its metrics flow into the normalized container directly via a separate ingestion path. It appears in `provider_metrics.apple_health`, `metric_sources`, and the `sources` array within normalized documents.

#### Metrics We Are Receiving from Apple Health
`steps` · `heartrate` · `heartrate_resting` · `calories_burned_active` · `calories_burned_total` (mapped from `calories_burned`) · `sleep_duration_total` (mapped from `sleep_duration`) · `sleep_duration_light` · `sleep_duration_awake`

#### Metrics Available in Spike Matrix but NOT Being Received

| Missing Metric | Description | Unit |
|---|---|---|
| `blood_pressure_diastolic` / `_max` / `_min` | Diastolic blood pressure | mmHg |
| `blood_pressure_systolic` / `_max` / `_min` | Systolic blood pressure | mmHg |
| `body_fat` / `body_fat_max` / `body_fat_min` | Body fat percentage | percentage |
| `body_mass_index` | Body mass index | count |
| `body_temperature` / `_max` / `_min` | Body temperature | celsius |
| `breathing_rate` / `_max` / `_min` | Breathing rate | breaths/min |
| `calories_burned_basal` | Basal calories burned | kcal |
| `distance` | Total distance | meters |
| `distance_cycling` / `distance_running` / `distance_swimming` / `distance_walking` / `distance_wheelchair` | Type-specific distances | meters |
| `ecg_voltage` | ECG voltage | uV |
| `elevation` | Elevation | meters |
| `floors_climbed` | Floors climbed | count |
| `glucose` | Blood glucose | mg/dL |
| `heartrate_max` / `heartrate_min` | Heart rate range | bpm |
| `height` | Height | meters |
| `hrv_sdnn` | HRV SDNN | ms |
| `latitude` / `longitude` | GPS coordinates | degrees |
| `skin_temperature` / `_max` / `_min` | Skin temperature | celsius |
| `sleep_duration_deep` | Deep sleep duration | ms |
| `sleep_duration_rem` | REM sleep duration | ms |
| `speed` / `speed_max` / `speed_min` | Speed | m/sec |
| `spo2` / `spo2_max` / `spo2_min` | Blood oxygen level | percentage |
| `vo2max` | VO2 max | mL/kg/min |
| `weight` | Weight | g |

---

### 5. Withings

#### Raw Sources Observed
| Provider Source | Metrics Delivered |
|---|---|
| `withings_measure_meas` | `weight`, `body_fat`, `body_bone_mass` |

> Withings only appears in the raw data container and only contributes body composition snapshots. It does not appear in any normalized document's `provider_metrics` as a contributing source for daily metrics.

#### Metrics We Are Receiving from Withings
`weight` · `body_fat` · `body_bone_mass`

#### Metrics Available in Spike Matrix but NOT Being Received

| Missing Metric | Description | Unit |
|---|---|---|
| `bedtime_duration` | Bedtime duration | ms |
| `blood_pressure_diastolic` / `_max` / `_min` | Diastolic blood pressure | mmHg |
| `blood_pressure_systolic` / `_max` / `_min` | Systolic blood pressure | mmHg |
| `body_fat_max` / `body_fat_min` | Body fat range | percentage |
| `body_temperature` / `_max` / `_min` | Body temperature | celsius |
| `breathing_rate` / `_max` / `_min` | Breathing rate | breaths/min |
| `calories_burned_active` | Active calories burned | kcal |
| `calories_burned_basal` | Basal calories burned | kcal |
| `distance` | Total distance | meters |
| `duration_high_intensity` | High intensity duration | ms |
| `duration_low_intensity` | Low intensity duration | ms |
| `duration_moderate_intensity` | Moderate intensity duration | ms |
| `ecg_voltage` | ECG voltage | uV |
| `elevation` | Elevation | meters |
| `heartrate` / `heartrate_max` / `heartrate_min` | Heart rate | bpm |
| `height` | Height | meters |
| `hrv_rmssd` | HRV RMSSD | ms |
| `hrv_sdnn` | HRV SDNN | ms |
| `skin_temperature` / `_max` / `_min` | Skin temperature | celsius |
| `sleep_duration` / `_awake` / `_deep` / `_light` / `_rem` | Sleep stage durations | ms |
| `sleep_efficiency` | Sleep efficiency | percentage |
| `sleep_interruptions` | Sleep interruptions | count |
| `sleep_latency` | Sleep latency | ms |
| `sleep_skin_temperature_deviation` | Skin temp deviation from baseline | celsius |
| `spo2` / `spo2_max` / `spo2_min` | Blood oxygen level | percentage |
| `steps` | Total steps | count |
| `vo2max` | VO2 max | mL/kg/min |

> Withings is the most underutilized integration. We are receiving 3 of approximately 35 available metrics.

---

## Coverage Summary Table

| Provider | Metrics Receiving | Metrics Missing | Coverage |
|---|---|---|---|
| Oura | 28 | 11 | ~72% |
| Polar | 16 | 39 | ~29% |
| Garmin | 30 | 30 | ~50% |
| Apple Health | 8 | 24 | ~25% |
| Withings | 3 | 35 | ~8% |

---

## Cross-Provider Gaps Worth Highlighting

These metrics are available from multiple connected vendors and are clinically relevant for bariatric patients, but are not being received from **any** provider:

| Metric | Available From (per Spike matrix) | Clinical Relevance |
|---|---|---|
| `vo2max` | Oura, Garmin, Polar, Apple | Cardiorespiratory fitness — key post-op recovery indicator |
| `body_temperature` | Oura, Polar, Apple, Withings | Post-op infection / fever detection |
| `spo2_max` / `spo2_min` | Oura, Polar, Apple, Garmin | Oxygen saturation range during sleep — apnea/hypoxia detection |
| `distance` (type-specific) | Oura, Polar, Garmin, Apple | Walking vs. cycling breakdown — activity rehabilitation tracking |
| `sleep_duration_deep` / `sleep_duration_rem` | Apple (not receiving) | Sleep quality completeness for Apple-only users |
| `blood_pressure_systolic` / `diastolic` | Garmin, Withings, Apple | Hypertension management — extremely common post-op comorbidity |
| `height` | Oura, Polar, Apple, Withings | Required for accurate BMI calculation and dosing |
| `floors_climbed` | Garmin, Apple (not receiving from Apple) | Physical activity milestone for post-op patients |
