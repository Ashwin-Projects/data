# DataDignity — Master Development Plan & Phased Roadmap

This document serves as the master execution roadmap for DataDignity. It reflects the project's actual repository state, architectural requirements, and security gates across 13 development phases.

---

## Phase 0 — Project Foundation, Threat Model & Architecture
**Status**: `IN PROGRESS`

- [x] Inspect existing repository state, PDF specifications, and frontend structure.
- [x] Establish root-level project management documents (`CLAUDE.md`, `DEVELOPMENT_PLAN.md`).
- [x] Create `THREAT_MODEL.md` defining zero-knowledge trust boundaries, threat vectors, server visibility matrix, threat scenarios, and security rules.
- [x] Create `KEY_LIFECYCLE_SPEC.md` defining key hierarchy, AES-GCM-256 DEK generation, beneficiary key-wrapping, SHA-256 fingerprint verification, DEK rotation, and server visibility constraints.
- [x] Create `STATE_MACHINE_SPEC.md` defining core lifecycle states, transition matrix, liveness hierarchy, Day 60/75/85/90+ warning schedules, cancellation mechanics, trusted contact role, 9-check Final Eligibility Safety Gate, `SAFE_HOLD` triggers, idempotency rules, and Mermaid state diagram.
- [ ] Establish directory structure for backend service (`backend/package.json`, `server.js`, directory skeletons) and shared contracts.

---

## Phase 1 — Application Shell & UI Foundation
**Status**: `IN PROGRESS`

- [x] Initialize frontend Vite + React project shell in `frontend/`.
- [x] Build initial prototype dashboard UI with tab navigation.
- [ ] Modularize monolithic `App.jsx` into structured page components (`Landing`, `Login`, `Dashboard`, `Beneficiaries`, `CheckIn`, `Settings`).
- [ ] Set up client-side routing (e.g. React Router) and protected layout wrappers.
- [ ] Implement global application state management store (e.g. Zustand or Context API) replacing `mockDb.js`.
- [ ] Refine visual design system with clear feedback for consent, warning states, and irreversible actions.

---

## Phase 2 — Client-Side Cryptography & Key Management
**Status**: `NOT STARTED`

- [ ] Implement client-side Web Crypto API wrapper module for AES-GCM-256 vault encryption.
- [ ] Implement Data Encryption Key (DEK) generation independent of user passphrase.
- [ ] Implement asymmetric key generation (RSA-OAEP / ECDH) for user and beneficiary pairs.
- [ ] Build DEK wrapping logic to encrypt DEK with beneficiary public keys while user is active.
- [ ] Build beneficiary DEK unwrapping logic for offline passphrase-independent recovery.
- [ ] Implement key health status checks and recovery backup path generation.
- [ ] Add unit test suite for cryptographic correctness, key wrapping, and tampering detection.

---

## Phase 3 — Vault, Database & Identity Unlinkability
**Status**: `NOT STARTED`

- [ ] Initialize Express backend application structure (`backend/server.js`, middleware, routes).
- [ ] Configure PostgreSQL database connection and Prisma ORM schema (`schema.prisma`).
- [ ] Implement pseudonymous identity architecture separating `users`, `identity_vault_mapping`, and `encrypted_vaults`.
- [ ] Enforce strict access control on the mapping layer to prevent identity-to-vault correlation.
- [ ] Build ciphertext-only CRUD endpoints for encrypted vault entries and wrapped DEKs.
- [ ] Implement JWT authentication and tenant isolation authorization middleware.
- [ ] Conduct database compromise correlation analysis to verify unlinkability guarantees.

---

## Phase 4 — Vault Management & Beneficiary Onboarding
**Status**: `NOT STARTED`

- [ ] Build vault asset creation, updating, deletion, and policy assignment UI/API.
- [ ] Implement beneficiary onboarding workflow and public key registration.
- [ ] Implement out-of-band fingerprint generation and manual trustee verification flow.
- [ ] Build beneficiary key management interface (add, replace, re-verify beneficiaries).
- [ ] Implement DEK rotation workflow: rotate DEK and re-wrap for active beneficiaries upon trustee revocation.
- [ ] Test revocation, key replacement, and cross-user isolation.

---

## Phase 5 — Liveness, Check-In, OAuth & Trusted Contact
**Status**: `NOT STARTED`

- [ ] Build primary user check-in system with configurable threshold schedules.
- [ ] Integrate secondary OAuth activity corroboration (GitHub, Google Workspace, LinkedIn).
- [ ] Handle OAuth token lifecycle (expiry, revocation, provider downtime) without triggering false inactivity.
- [ ] Implement trusted-contact onboarding and escalation notification channel during warning windows.
- [ ] Enforce strict boundary: trusted contact notifications serve as human escalation, not legal proof of death.
- [ ] Test multi-signal liveness aggregation and provider outage resilience.

---

## Phase 6 — Warning System, State Machine & Cron Engine
**Status**: `NOT STARTED`

- [ ] Build background cron engine for inactivity evaluation (staged warnings: e.g. Day 60, Day 75, Day 85, Day 90+ trigger).
- [ ] Implement state machine transitions (`ACTIVE` → `WARNING_STAGE_1` → `WARNING_STAGE_2` → `FINAL_WARNING` → `TRIGGER_ELIGIBLE`).
- [ ] Send progressively urgent notification dispatches across multiple channels (Email, SMS/Webhook).
- [ ] Implement single-click user check-in cancellation and account reactivation mechanism.
- [ ] Implement job locking, idempotency, retries, and duplicate-execution guards.
- [ ] Add pre-execution safety gate to prevent accidental or unverified protocol triggers.

---

## Phase 7 — Asset Classification & Policy Engine
**Status**: `NOT STARTED`

- [ ] Implement deterministic asset policy engine enforcing `LEGACY`, `SCRUB`, and `UNCLASSIFIED` behaviors.
- [ ] Enforce mutual exclusivity between `LEGACY` (recovery) and `SCRUB` (erasure) policies.
- [ ] Build `SAFE HOLD` state handler for assets with conflicting classification or unverified beneficiaries.
- [ ] Ensure user explicit configuration strictly overrides default or inferred system behavior.
- [ ] Test policy engine evaluation logic against edge-case asset configurations.

---

## Phase 8 — Legacy Protocol
**Status**: `NOT STARTED`

- [ ] Build Legacy Protocol execution pipeline verifying asset classification, trigger eligibility, and beneficiary key health.
- [ ] Implement secure ciphertext and wrapped-DEK payload packaging for authorized beneficiaries.
- [ ] Build beneficiary recovery portal allowing offline local unwrapping of DEK and vault asset decryption.
- [ ] Enforce zero-knowledge constraint: server never receives unwrapped DEK or plaintext asset.
- [ ] Handle error states: revoked keys, missing beneficiaries, corrupted ciphertext, and duplicate delivery attempts.
- [ ] Perform end-to-end verification of Legacy recovery using synthetic test vectors.

---

## Phase 9 — Scrub Protocol
**Status**: `NOT STARTED`

- [ ] Build Scrub Protocol execution pipeline verifying `SCRUB` classification and safety gate approval.
- [ ] Implement third-party API erasure connectors (GitHub, Google Workspace, etc.).
- [ ] Explicitly track and audit erasure statuses: `DELETION_REQUESTED`, `DELETION_CONFIRMED`, `DELETION_FAILED`, `DELETION_UNAVAILABLE`.
- [ ] Implement DataDignity internal database record purging according to retention rules.
- [ ] Enforce job idempotency, audit logging, and safeguard against unverified deletion triggers.
- [ ] Verify truthful reporting during provider failures and API permission errors.

---

## Phase 10 — Incremental Security & Reliability Testing
**Status**: `NOT STARTED`

- [ ] Conduct cryptographic security testing (DEK exposure, key wrapping, tampering, replay attacks).
- [ ] Conduct database security testing (unlinkability verification, tenant isolation, SQL injection).
- [ ] Conduct liveness and state machine testing (race conditions, false triggers, provider outage simulation).
- [ ] Perform application security audit (XSS, CSRF, auth bypass, secret leakage, dependency vulnerabilities).
- [ ] Update threat model documentation with test findings and mitigation verification.

---

## Phase 11 — Integration, Deployment & Production Readiness
**Status**: `NOT STARTED`

- [ ] Integrate frontend, Express backend, PostgreSQL, cron orchestrator, and protocol engines.
- [ ] Execute full end-to-end validation across all user flows using synthetic test datasets.
- [ ] Configure production infrastructure, secrets management, rate limiting, monitoring, and alerts.
- [ ] Implement database backups, disaster recovery, and incident response procedures.
- [ ] Keep irreversible actions disabled until all safety gates pass verification.

---

## Phase 12 — Final Demo, Documentation & Evaluation
**Status**: `NOT STARTED`

- [ ] Finalize technical documentation (architecture diagrams, API spec, key lifecycle, database schema).
- [ ] Document legal disclaimers: inactivity detection is a technical signal, not legal proof of death.
- [ ] Prepare comprehensive demonstration scenarios (Legacy recovery, false-trigger cancellation, OAuth failure, Scrub failure).
- [ ] Finalize repository README, quickstart guides, and project evaluation package.
