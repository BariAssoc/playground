# WoOz database — Cosmos containers, partition keys, and purpose

Partition keys and purposes are reconciled with **`Backends/bariaccess-note-ingest`** and **`Backends/spike-backend`**. Default container **ids** are shown; many can be overridden with `COSMOS_*` env vars on the Function App or spike service. Containers are grouped by category.

---

## Identity and users


| Container        | Partition key | Purpose / used for                                                                                     |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| Users            | /id           | App user profiles; created/updated on auth (e.g. Apple/Spike). Used for JWT and profile.               |
| user_connections | /id           | User profiles and connected providers (Spike, etc.); sync and auth. Updated by **`spikeWebhookHttp`** on `provider_integration_created` (set active, store `provider_user_id`) and `provider_integration_deleted` (set inactive). Also updated by `spikeProactiveSyncTimer` on every successful sync (`last_spike_sync`, `last_sync`). Read by `patientBiometrics` to populate `connected_devices` in the health summary. |
| clients          | /id           | Provider-side client records (one doc per client). GET clients/{clientId}, notifications, assignments. |


---

## Bookends (daily Q flow)


| Container          | Partition key | Purpose / used for                                                                       |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------- |
| BookendDefinitions | /id           | Global segment/phase definitions (e.g. morning, midday, evening) and question templates. |
| BookendAssignments | /userId       | Per-user assignments: which segments, FABs, quiz, and b1/b2 questions are scheduled.     |
| BookendSessions    | /userId       | One doc per daily session; qListItems, completion flags (b1, quiz, FABs, b2).            |
| BookendResponses   | /userId       | Submitted answers and timing (B1, QMQN, B2); scores and credits awarded.                 |


---

## FABs (Focused Action Bursts)


| Container      | Partition key | Purpose / used for                                                               |
| -------------- | ------------- | -------------------------------------------------------------------------------- |
| FABDefinitions | /id           | Global FAB definitions (label, icon, time, segment); e.g. 9 FABs, 3 per segment. |
| FABAssignments | /userId       | Which FABs are assigned to the user and their schedule.                          |
| FABResponses   | /userId       | Log when user completes a FAB (sessionId, fabDefinitionId, loggedAt).            |
| FABSessions    | /userId       | Per-session FAB completion state (which FABs done in that bookend session).      |


---

## ITBs (Interventional Blocks)


| Container      | Partition key | Purpose / used for                                                    |
| -------------- | ------------- | --------------------------------------------------------------------- |
| ITBDefinitions | /id           | Global ITB definitions (programs, content).                           |
| ITBAssignments | /userId       | Which ITBs are assigned to the user and status.                       |
| ITBSessions    | /userId       | Per-session ITB progress or completion for that day/session.          |
| ITBResponse    | /userId       | User responses or check-ins for ITB activities (answers, completion). |


---

## Routines


| Container          | Partition key | Purpose / used for                                            |
| ------------------ | ------------- | ------------------------------------------------------------- |
| RoutineDefinitions | /id           | Global routine templates (segments, steps).                   |
| RoutineAssignments | /userId       | Which routines are assigned to the user and schedule.         |
| RoutineSessions    | /userId       | Per-day or per-session routine state (what was done).         |
| RoutineResponses   | /userId       | User-submitted routine data (e.g. segments completed, notes). |


---

## QMQN (quizzes / nudges)


| Container       | Partition key | Purpose / used for                                                                                |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| QMQNDefinitions | /id           | Quiz/mini-quiz/nudge definitions: questions, correct answers, passing threshold, credits on pass. |
| QMQNAssignments | /userId       | Which QMQN content is assigned to the user (e.g. per segment).                                    |
| QMQNSessions    | /userId       | Per-session QMQN state (e.g. which quiz was opened/completed in that bookend session).            |
| QMQNResponses   | /userId       | User quiz answers, score, pass/fail, and credits awarded.                                         |


---

## Credits


| Container    | Partition key | Purpose / used for                                                                            |
| ------------ | ------------- | --------------------------------------------------------------------------------------------- |
| CreditLedger | /userId       | Append-only CPIE/CCIE ledger (odometer). Bookend/quiz completion and other awards write here. |


---

## Events and metrics

**FirstLogic container ids:** `bariaccess-note-ingest` (`firstlogicCosmos.ts`) defaults to **`firstlogic_events`**, **`firstlogic_daily_user_metrics`**, **`firstlogic_woz_state`** (env `COSMOS_CONTAINER_EVENTS`, `COSMOS_CONTAINER_DAILY_METRICS`, `COSMOS_CONTAINER_WOZ_STATE`). **spike-backend** uses the same defaults but can redirect to human-readable ids via **`COSMOS_CONTAINER_EVENTS_ALT`** → `Events`, **`COSMOS_CONTAINER_DAILY_METRICS_ALT`** → `Daily User Metrics`, **`COSMOS_CONTAINER_WOZ_STATE_ALT`** → `WozState` (`db.py`). Pick one naming family per environment so writers and readers agree.


| Container          | Partition key | Purpose / used for                                                                                                                                                                                                                                 |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| firstlogic_events (env `COSMOS_CONTAINER_EVENTS`) | /user_id | Default container id **`firstlogic_events`**. Behavior event stream: **User↔Claude (Ollie) chat** — outgoing `ollie_request`, incoming `ollie_response`; also bookend_completed and other typed events (`type`, `ts`, `payload`). Documents use property `user_id`. |
| firstlogic_daily_user_metrics (env `COSMOS_CONTAINER_DAILY_METRICS`) | /user_id | Default id **`firstlogic_daily_user_metrics`**. One doc per user per day; aggregates from the events stream (e.g. bookend_completed, credits). Property `user_id`. |
| normalized_data    | /user_id      | Aggregated daily health metrics (steps, sleep, etc.) from Spike/normalization pipeline. Written by **`spikeWebhookHttp`** (`POST /api/webhooks/spike`) on every `record_change` event, and by **`spikeProactiveSyncTimer`** (15-min timer). Also receives `nutrition_*` keys (additive per day) from **`nutritionAiHttp`** and `lab_*` keys from **`labReportHttp`**. **`patientBiometrics`** (portal + mobile JWT) uses these documents for merged “best available” **`metrics`**, `metric_sources`, and daily **`workouts`** in the API response. Document id format: `{userId}:{date}`. May also store `provider_metrics` on the document for ingest/debug; the API rebuilds per-vendor slices from **raw_data** instead. Env: `COSMOS_NORMALIZED_DATA_CONTAINER_ID` (default `normalized_data`). |
| raw_data           | /user_id      | Full Spike API response archive (stats, sleeps, workouts). Written by **`spikeWebhookHttp`** and **`spikeProactiveSyncTimer`** alongside normalized upserts. Document id format: `{userId}:{provider}:{dataType}:{date}`. **`patientBiometrics`** reads a bounded TOP query of recent rows to populate API **`provider_metrics`** (per vendor / calendar day). Optional probe: `?includeRawMeta=1`. Env: `COSMOS_RAW_DATA_CONTAINER_ID` (default `raw_data`). |
| nutrition_logs     | /user_id      | One doc per meal log — full Spike `NutritionRecord` with ingredients, Nutri-Score, and dish description. Written by **`nutritionAiHttp`** (`POST /api/nutrition/log`) for both image and manual entries, and by **`spikeWebhookHttp`** on `nutrition_record_completed` events (async mode final result). Document id format: `{userId}:nutrition:{timestamp}`. Stores `dish_name`, `dish_description`, `nutri_score`, `nutritional_fields`, `ingredients[]`, `mapped_metrics`, `input_type`, `meal_type`. Env: `COSMOS_NUTRITION_LOGS_CONTAINER_ID` (default `nutrition_logs`). Create: `npm run create-nutrition-logs-container`. |
| lab_results        | /user_id      | One doc per lab panel submission — full results with reference ranges, flags, lab facility, and ordering provider. Written by **`labReportHttp`** (`POST /api/clients/{clientId}/lab-results`). Read by `GET /api/clients/{clientId}/lab-results`. Document id format: `{userId}:lab:{date}:{timestamp}`. Stores `results[]` (test, value, unit, reference_range, flag), `mapped_metrics` (lab_* keys), `ordered_by`, `lab_facility`, `notes`. Env: `COSMOS_LAB_RESULTS_CONTAINER_ID` (default `lab_results`). Create: `npm run create-lab-results-container`. |
| firstlogic_woz_state (env `COSMOS_CONTAINER_WOZ_STATE`) | /user_id | Default id **`firstlogic_woz_state`**. WOZ/ISE intervention state per user. |


---

## Provider and client (documents, messages, Jotform)


| Container          | Partition key | Purpose / used for                                                                               |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------ |
| ClientDocuments    | /clientId     | Document metadata per client (name, mimeType, size, blobPath); list, upload, download, delete. Includes `classificationReviewNeeded`, `classificationReviewReason`, `classificationReviewSetAt` set by the extraction pipeline after auto-classification. |
| ExtractedDocuments | /clientId     | Extracted text/structured data from ClientDocuments (Document Intelligence + OpenAI).            |
| DocumentFieldNameReferences | /documentType | Field-schema references per (documentType, company); id format `{docType}__{company}`. Used by `compareToReference` to detect missing/extra fields in extracted docs. Updated only through admin-approved proposals or alert approvals — never directly by extraction. |
| DocumentIntervalReferences  | /documentType | Clinical numeric interval bands (normalMin/normalMax) per (documentType, company); id format `{docType}__{company}`. Used for abnormal-low/normal/abnormal-high evaluation. Updated only through admin-approved proposals — never directly by extraction. |
| DocumentComparisonAlerts    | /clientId     | Alerts for field-schema mismatches and classification review flags raised during extraction. `status`: pending / approved. Resolved by admin in Document Alerts page. |
| DocumentComparisonAudit     | /clientId     | Audit trail: one row per alert approval or dismissal action. |
| DocumentReferenceProposals  | /documentType | Pending field-schema and interval-rule proposals generated by the extraction pipeline. Extraction writes here; admins approve → `createReference`/`updateReference` or interval upsert runs. Env: `COSMOS_DOCUMENT_REFERENCE_PROPOSALS_CONTAINER_ID` (default `DocumentReferenceProposals`). |
| ClientMessages     | /clientId     | Messages from care team (provider portal) to client; app Messages tab.                           |
| Messages           | /clientId     | Admin push messages (Communication tab); user-portal Messages.                                   |
| JotformDirectory   | /id           | Directory of Jotform forms: `Visit Type Name`, `Description`, `Quiz Link`, optional **`Nudge Text`** (SMS nudge; seeded via `npm run seed-jotform-directory` from CSV + `data/jotform-directory-nudges.json`). |
| JotformAssignments | /clientId     | Which Jotform forms are assigned to which client; status (incomplete/complete). Optional `outreach` object stores per-send timestamps (`emailSentAt`, `smsNudgeSentAt`, `smsLinkSentAt`) when sent via portal `jotform_send` job. |
| JotFormSubmissions | /clientId     | Webhook payloads from Jotform; one doc per submission, linked to assignment when clientId known. |
| JotformSendSchedules | /id       | Future-dated Jotform email/SMS sends: `runAt` (ISO UTC), `clientIds`, `formId`, channels, nudge copy; timer marks `completed` / `failed` and writes an `OutreachJobs` row when executed. |
| Campaigns | /id | Patient outreach campaigns: named collection of scheduled actions (email, SMS, Jotform, in-app notification) on absolute dates. Each campaign has `clientIds[]`, `actions[]`, `actionResults[]` (one per action × client). Timer (`processCampaignActions`) executes due actions. `status`: active / paused / archived. |
| StaffMessages | /threadId | Provider portal staff messaging: legacy broadcast/role threads (`global`, `provider_admin`, …); Talk to Team **direct** (`dm:` + two sorted Entra oids) and **group chat messages** (`grp:` + uuid, partition = that thread id). **Group metadata** for each `grp:…` (and org-wide staff talk channels) is a row in the same container with `threadId = "__staff_talk_group_registry__"`, `docType = "staff_talk_group_meta"`, `id = grp:…`. Env: `COSMOS_STAFF_MESSAGES_CONTAINER_ID` (default `StaffMessages`). |
| Practices | /id | One doc per org (`id` = orgId). Practice profile + optional **`calendlySchedulingLinks`** (label + Calendly HTTPS URLs) for the Appointments tab. Env: `COSMOS_PRACTICES_CONTAINER_ID` (default `Practices`). |
| PracticeMeetings | /orgId | Canonical Calendly bookings for the portal calendar: one doc per scheduled event (`meet_<calendlyEventId>`), upserted from `POST /api/integrations/calendly/webhook` or from `GET /api/practice-meetings?sync=1` when `CALENDLY_API_TOKEN` is set (Calendly REST backfill). The note-ingest runtime calls `createIfNotExists` on first webhook or that GET; optional `npm run create-practice-meetings-container` in `bariaccess-note-ingest`. Env: `COSMOS_PRACTICE_MEETINGS_CONTAINER_ID` (default `PracticeMeetings`). |
| ConsultationSessions | /consultationId | Live intake / speech sessions: transcript + bound form state. Upserted via `POST /api/consultation-sessions` (staff JWT). Env: `COSMOS_CONSULTATION_SESSIONS_CONTAINER_ID` (default `ConsultationSessions`). Create: `node scripts/create-consultation-sessions-container.js`. |
| ProviderNotes | /clientId | Provider-authored clinical notes per client. Env: `COSMOS_PROVIDER_NOTES_CONTAINER_ID` (default `ProviderNotes`). Create: `node scripts/create-provider-notes-container.js`. |
| PostOpNotes | /clientId | Post-operative notes per client. Env: `COSMOS_POSTOP_NOTES_CONTAINER_ID` (default `PostOpNotes`). Create: `node scripts/create-postop-notes-container.js`. |
| PostOpAuditLog | /clientId | Immutable append-only audit of post-op note lifecycle (survives direct Cosmos deletes on `PostOpNotes`). Env: `COSMOS_POSTOP_AUDIT_LOG_CONTAINER_ID` (default `PostOpAuditLog`). Create: `node scripts/create-postop-audit-log-container.js`. |
| PatientProfiles | /id | Extended patient/phone identity used for SMS matching and client-auth sync (often keyed to Spike `user_connections` id). Env: `COSMOS_PATIENT_PROFILES_CONTAINER_ID` (default `PatientProfiles`). Create: `node scripts/create-patient-profiles-container.js`. |


---

## Staff portal (Entra roster, inbox, sessions)


| Container       | Partition key   | Purpose / used for |
| --------------- | --------------- | ------------------ |
| Staff           | /organizationId | WoOz portal staff records keyed by org; unique key on `entraObjectId` (one row per Entra user per conventions). Create: `node scripts/create-staff-container.js`. Env: `COSMOS_STAFF_CONTAINER_ID` (default `Staff`). |
| StaffProfiles   | /role           | Talk-to-team roster and @-mention directory: one doc per Entra oid **per portal role** (`Admin`, `Provider`, `Developer`); synced from Entra app roles (`POST /api/staff-users/sync`) and enriched on login. Env: `COSMOS_STAFF_PROFILES_CONTAINER_ID` (default `StaffProfiles`). |
| StaffSessions     | /staffId        | Staff session audit: login, heartbeat, logout (`POST` / `PATCH /api/staff/sessions`). Env: `COSMOS_STAFF_SESSIONS_CONTAINER_ID` (default `StaffSessions`). Create: `node scripts/create-staff-sessions-container.js`. |
| StaffInboxItems | /assignedTo     | Personal inbox rows (document review, lab review, tasks, clinical notes, appointments, etc.), fan-out by role via `staffInboxFanOut`. Env: `COSMOS_STAFF_INBOX_CONTAINER_ID` (default `StaffInboxItems`). |


---

## Portal activity audit


| Container   | Partition key | Purpose / used for |
| ----------- | ------------- | ------------------ |
| ActivityLog | /id           | Immutable portal activity events (create/update/delete/sent/…); admin acknowledge / reject. Env: `COSMOS_ACTIVITY_LOG_CONTAINER_ID` (default `ActivityLog`). Ensured via `createIfNotExists` on first write in `activityLog.ts`. |


---

## Outreach, jobs, and reusable templates


| Container             | Partition key | Purpose / used for |
| --------------------- | ------------- | ------------------ |
| OutreachJobs          | /id           | Audit/history rows for bulk outreach / scheduled sends (e.g. Jotform send timer completion). Env: `COSMOS_OUTREACH_JOBS_CONTAINER_ID` (default `OutreachJobs`). Create: `node scripts/create-outreach-jobs-container.js`. |
| PatientOutreachGroups | /id           | Saved named patient lists for Jotform / outreach. Env: `COSMOS_PATIENT_OUTREACH_GROUPS_CONTAINER_ID` (default `PatientOutreachGroups`). Create: `node scripts/create-patient-outreach-groups-container.js`. |
| MessageTemplates      | /id           | Reusable SMS / email / call-script / in-app templates with merge variables (`{{patient.first_name}}`, etc.); CRUD + seed under `/api/message-templates`. Env: `COSMOS_MESSAGE_TEMPLATES_CONTAINER_ID` (default `MessageTemplates`). Auto-created on first access. |


---

## Spike identity linking and org codes


| Container           | Partition key | Purpose / used for |
| ------------------- | ------------- | ------------------ |
| ClientIdentityLinks | /spikeUserId  | Authoritative map from Spike user id → portal org / client identity; drives proactive sync user list, lab/nutrition resolution, and portal pull flows. Env: `COSMOS_CLIENT_IDENTITY_LINKS_CONTAINER_ID` (default `ClientIdentityLinks`). Create: `npm run create-client-identity-links-container`. |
| OrgCodes              | /id           | Four-digit org signup codes → `organizationId` / practice name for patient onboarding. Env: `COSMOS_ORG_CODES_CONTAINER_ID` (default `OrgCodes`). Create: `node scripts/create-org-codes-container.js`. |


---

## Admin — lab extraction rules (document pipeline)


| Container      | Partition key | Purpose / used for |
| -------------- | ------------- | ------------------ |
| TestThresholds | /id         | Admin-defined numeric threshold rules for auto-labeling extracted lab values (program-specific bands). Env: `COSMOS_TEST_THRESHOLDS_CONTAINER_ID` (default `TestThresholds`). Create: `node scripts/create-thresholds-container.js`. |
| TestCards        | /id         | Admin-defined categorical labels assigned to extracted test names (tags / program taxonomy). Env: `COSMOS_TEST_CARDS_CONTAINER_ID` (default `TestCards`). Create: `node scripts/create-test-cards-container.js`. |


---

## User state and sync


| Container        | Partition key | Purpose / used for                                        |
| ---------------- | ------------- | --------------------------------------------------------- |
| user_environment | /user_id      | User environment or context settings.                     |
| user_mood        | /user_id      | Mood entries (e.g. daily mood log).                       |
| workout_sessions | /user_id      | Workout or activity sessions (one doc per session). Written by **`spikeWebhookHttp`** and **`spikeProactiveSyncTimer`** when workouts are received from Spike. Also read by `patientBiometrics` via partition-scoped query. Document id format: `{userId}:{workout_id}`. Env: `COSMOS_WORKOUT_SESSIONS_CONTAINER_ID` (default `workout_sessions`). |
| sync_history     | /user_id      | History of sync operations (e.g. last sync time, source). Read with partition scope and `user_id` / `userId`. Env: `COSMOS_SYNC_HISTORY_CONTAINER_ID` (default `sync_history`). |


---

## Provisioning Azure to match this outline

### R&R containers (Bookend, FAB, ITB, Routine, QMQN — 20 total)

Run from `bariaccess-note-ingest`:

```bash
# 1. Create all 20 containers (safe to re-run)
npm run provision-rr-containers

# 2. Seed the global catalog (Definitions — all 5 domains)
npm run seed-rr-definitions

# 3. Seed per-user assignments (repeat for each enrolled user)
npm run seed-rr-assignments -- --userId <userId>
```

After seeding, the client app receives real `qListItems` from `GET /bookends/sessions/{userId}`
when `BOOKENDS_USE_REAL_COSMOS=true` (or `USE_MOCK_DATA=false`) is set in the app `.env`.

### Other containers

- **Spike-backend (`Backends/spike-backend`):** `db.py` auto-provisions WoOz containers including `user_connections`, `raw_data`, `normalized_data`, `workout_sessions`, `user_environment`, `user_mood`, **`credit_ledger`** (underscore id; **distinct** from R&R **`CreditLedger`** used by bookends in note-ingest), `sync_history`, plus optional **`lab_reports`** and **`nutrition_records`** entries (same `/user_id` partition; BariAccess lab/meal APIs primarily use **`lab_results`** / **`nutrition_logs`** above — align envs if you rely on one path only).
- **Nutrition logs:** `npm run create-nutrition-logs-container` (one-time, safe to re-run).
- **Lab results:** `npm run create-lab-results-container` (one-time, safe to re-run).
- **Everything else in this doc** (Staff, Jotform, documents, consultation sessions, staff inbox, etc.): use the matching `Backends/bariaccess-note-ingest/scripts/create-*-container.js` (or `create-client-identity-links-container` npm script).

**Sources:** `Backends/spike-backend/db.py`, `Backends/spike-backend/app.py`, `Backends/bariaccess-note-ingest/src/lib/rrContainers.ts`, `src/lib/bookendService.ts`, `src/lib/firstlogicCosmos.ts`,
`scripts/provision-rr-containers.js`, `scripts/seed-rr-definitions.js`, `scripts/seed-rr-assignments.js`,
`src/functions/clientMobileApi.ts`, `src/functions/spikeWebhookHttp.ts`, `src/functions/spikeProactiveSyncTimer.ts`,
`src/functions/consultationSessionsHttp.ts`, `src/functions/staffInboxHttp.ts`, `src/functions/staffUsersHttp.ts`, `src/lib/staffInboxFanOut.ts`.