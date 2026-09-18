# CLAUDE.md — DataDignity Development State & Guidelines

## 1. Project Overview

DataDignity is a zero-knowledge digital estate planning and post-mortem privacy infrastructure platform. It enables users to predefine how encrypted digital assets are transferred to verified beneficiaries or permanently scrubbed upon extended inactivity, backed by cryptographic guarantees, multi-signal liveness detection, and explicit legal boundaries.

---

## 2. Current Repository Structure & State

```
data dignity/
├── .gitignore                           # Git ignore definitions for Node, build outputs, & env
├── DataDignity_Final_Project_Structure.pdf # Project specification & 13-phase execution plan
├── README.md                            # High-level architecture overview & quickstart guide
├── CLAUDE.md                            # Living development-state document (This file)
├── DEVELOPMENT_PLAN.md                  # Condensed, actionable 13-phase roadmap
├── THREAT_MODEL.md                      # Threat model, trust boundaries & security rules
├── KEY_LIFECYCLE_SPEC.md                # Key hierarchy, DEK wrapping, fingerprinting & rotation spec
├── STATE_MACHINE_SPEC.md                # Inactivity states, warning schedules, cancellation & safety gate spec
└── frontend/                            # React + Vite frontend application
    ├── index.html                       # HTML entry point
    ├── package.json                     # Frontend dependencies (React 18, Vite 5, TailwindCSS 3)
    ├── postcss.config.js                # PostCSS config
    ├── tailwind.config.js               # TailwindCSS theme config
    ├── vite.config.js                   # Vite server & build config
    └── src/
        ├── App.jsx                      # Monolithic React UI container & simulation controller
        ├── index.css                    # Tailwind imports & baseline styling
        ├── main.jsx                     # React DOM root render
        ├── components/
        │   ├── Header.jsx               # Header bar with liveness heartbeat trigger
        │   ├── ServiceStatus.jsx        # Service health indicators
        │   ├── Sidebar.jsx              # Navigation sidebar
        │   └── Dashboard/
        │       ├── ActivityMonitoring.jsx   # Heartbeat assertion panel
        │       ├── InactivityThreshold.jsx # Liveness threshold slider & trigger trigger
        │       ├── LegacyVault.jsx         # Vault entry listing & encryption controls
        │       └── TrustedContacts.jsx     # Trustee / contact list
        └── utils/
            ├── crypto.js                # Web Crypto API helper (AES-GCM-256 / PBKDF2 passphrase derivation)
            └── mockDb.js                # LocalStorage / state mock database for UI prototype
```

> **Note**: The backend directory (`backend/`), database schema (`prisma/`), and production cryptographic key-wrapping/DEK services do not exist in the repository yet.

---

## 3. Current Implemented Functionality

- **Frontend UI Prototype Shell**: React 18 dashboard interface with tab navigation (Overview, Vault, Scrub, Contacts, Audit Logs).
- **Simulated Liveness & Threshold Logic**: Inactivity timer simulation in `App.jsx` and `InactivityThreshold.jsx`.
- **Client Passphrase Crypto Helper**: `crypto.js` using Web Crypto API (`AES-GCM-256`, `PBKDF2`, `TextEncoder/Decoder`) for basic passphrase-based payload encryption/decryption.
- **Mock DB State**: `mockDb.js` providing in-memory initial state for user preferences, mock vault entries, and mock log entries.
- **Protocol Simulation**: Interactive visual step-through in UI for `LEGACY` and `SCRUB` execution sequences.
- **Formal Threat Model & Security Boundaries**: `THREAT_MODEL.md` documenting assets, security goals, trust boundaries, server visibility matrix, threat actors, 9 threat scenarios with mitigations, and 12 mandatory architectural rules.
- **Formal Cryptographic Key Lifecycle Specification**: `KEY_LIFECYCLE_SPEC.md` documenting key hierarchy, AES-GCM-256 DEK generation, beneficiary key wrapping, out-of-band SHA-256 fingerprint verification, DEK rotation upon revocation, server visibility matrix, failure modes, and security requirements.
- **Formal State Machine & Inactivity Specification**: `STATE_MACHINE_SPEC.md` documenting 11 core lifecycle states, transition matrix, liveness signal hierarchy, Day 60/75/85/90+ warning schedules, cancellation mechanics, trusted contact role, 9-check Final Eligibility Safety Gate, `SAFE_HOLD` triggers, idempotency locks, failure recovery, and Mermaid state diagram.

---

## 4. Current Technology Stack

| Layer | Technology | Status |
|---|---|---|
| **Frontend Framework** | React 18, Vite 5 | Implemented |
| **Styling** | TailwindCSS 3, Lucide React icons | Implemented |
| **Client Cryptography** | Web Crypto API (SubtleCrypto) | Prototype helper in `frontend/src/utils/crypto.js` |
| **Backend API** | Node.js / Express | Not Started (Backend directory missing) |
| **Database** | PostgreSQL + Prisma ORM | Not Started |
| **Authentication** | JWT / Session auth | Not Started |
| **OAuth Corroboration** | GitHub, Google Workspace, LinkedIn OAuth2 | Not Started |

---

## 5. Important Architecture & Security Decisions Established

1. **Zero-Knowledge Trust Model**: The server stores only ciphertext and wrapped key material; plaintext assets are encrypted/decrypted strictly on the client.
2. **Data Encryption Key (DEK) Architecture**: Each vault asset is encrypted with a unique DEK. The DEK itself is wrapped with beneficiary public keys while the user is active.
3. **Passphrase Independence for Beneficiaries**: Beneficiaries must be able to recover DEKs using their own pre-registered private keys without needing the user's passphrase.
4. **Beneficiary Authenticity & Fingerprint Verification**: Beneficiary public keys require out-of-band SHA-256 fingerprint verification before being trusted for DEK wrapping.
5. **DEK Rotation for True Revocation**: When a beneficiary is revoked, the DEK is rotated and re-wrapped only for remaining verified beneficiaries.
6. **Liveness Verification Hierarchy**: Dedicated user check-in is the primary liveness signal; OAuth API activity is strictly secondary corroboration.
7. **Trusted-Contact Escalation**: Designated trusted contacts are notified during warning windows for human escalation, but hold no automated probate authority.
8. **Asset Policy Classification**: Explicit policies `LEGACY` (beneficiary recovery), `SCRUB` (secure deletion), and `UNCLASSIFIED` (no automatic action).
9. **SAFE HOLD Conflict Resolution**: Assets with conflicting policy metadata enter `SAFE HOLD` and halt execution until manually resolved.
10. **Identity Unlinkability**: Identity records and vault storage are decoupled using pseudonymous vault IDs and separate access permissions.
11. **Truthful Scrub Reporting**: Third-party deletion explicitly tracks `DELETION_REQUESTED`, `DELETION_CONFIRMED`, `DELETION_FAILED`, and `DELETION_UNAVAILABLE`.
12. **Legal Boundary**: Automated inactivity detection is a technical signal only and does not constitute legal proof of death or probate authorization.
13. **Unresolved Decisions**:
    - Asymmetric Key Wrapping Standard: RSA-OAEP-4096 vs. ECDH-ES + AES-KW (`DECISION REQUIRED`).
    - Secondary OAuth Delay Window: Extension of Warning Stage 1 by up to 14 days without resetting primary $T_{\text{last}}$ (`DECISION REQUIRED`).

---

## 6. Security & Privacy Constraints

- **Zero Plaintext Exposure**: Plaintext data or unwrapped DEKs must never touch backend API endpoints, logs, or persistent databases.
- **Unlinkable Pseudonyms**: Database queries must prevent trivial correlation between user identities and vault IDs.
- **Idempotency & Safety Gates**: Inactivity state transitions must enforce strict pre-execution checks and locking to prevent race conditions or duplicate triggers.

---

## 7. Development Conventions & Testing Commands

### Code Conventions
- Frontend components reside in `frontend/src/components/`.
- Utility helpers reside in `frontend/src/utils/`.
- JavaScript standard ES modules (`import/export`) are used across `frontend/`.

### Existing Validation Commands
Run from the `frontend/` directory:

```bash
# Start Vite development server
npm run dev

# Production build and typecheck
npm run build

# Run ESLint static code analysis
npm run lint

# Preview production build locally
npm run preview
```

---

## 8. Completed Work

- **Phase 0 Documentation**:
  - Created `CLAUDE.md` and `DEVELOPMENT_PLAN.md`.
  - Created `THREAT_MODEL.md` (Formal threat model, trust boundaries, server visibility matrix, 9 threat scenarios with mitigations, 12 mandatory architectural rules).
  - Created `KEY_LIFECYCLE_SPEC.md` (Formal cryptographic key hierarchy, DEK generation, beneficiary key wrapping, SHA-256 fingerprint verification, DEK rotation, failure modes, implementation boundaries).
  - Created `STATE_MACHINE_SPEC.md` (Formal lifecycle states, transition matrix, liveness hierarchy, Day 60/75/85/90+ warning schedule, cancellation mechanics, trusted contact role, 9-check Final Eligibility Safety Gate, `SAFE_HOLD` triggers, idempotency rules, Mermaid state diagram).
- **UI Prototype**: Vite + React application shell in `frontend/`.

---

## 9. Known Issues & Limitations Discovered

1. **Backend Directory Missing**: `backend/` directory, Express API, database schema, and server code documented in `README.md` do not exist in the filesystem yet.
2. **Simplified Crypto Prototype**: `frontend/src/utils/crypto.js` currently uses PBKDF2 passphrase derivation only; it does not implement DEK generation, beneficiary key wrapping, or Web Crypto RSA-OAEP / ECDH key management.
3. **Monolithic App Component**: `frontend/src/App.jsx` contains state handling, simulation steps, and view routing in a single 400+ line file without a structured router (e.g. React Router) or modular state store.
4. **Mock Database Reliance**: UI state relies entirely on local memory/mock data (`mockDb.js`) without persistent storage or API synchronization.
5. **No Automated Test Runner**: `package.json` lacks unit testing frameworks (e.g., Vitest, Jest) for testing crypto functions or state machine logic.
6. **Unresolved Architectural Decisions**:
    - Asymmetric Key Wrapping Standard: RSA-OAEP-4096 vs. ECDH-ES (P-384) + AES-KW (`DECISION REQUIRED`).
    - Secondary OAuth Delay Window: Up to 14 days extension of Warning Stage 1 (`DECISION REQUIRED`).

---

## 10. Current Phase & Status

- **Current Phase**: Phase 0 — Project Foundation, Threat Model & Architecture
- **Status**: **IN PROGRESS** (Threat model, security rules, key lifecycle specification, and state machine specification finalized; initial backend project structure and shared contracts setup remaining).

---

## 11. NEXT REQUIRED STEP

Set EXACTLY ONE small, actionable task for the next development session:

**Task**: Initialize the backend service directory structure (`backend/package.json`, `.env.example`, `server.js` entry point, and directory skeletons for `middleware/`, `services/`, `routes/`, `prisma/`, `jobs/`, `protocols/`) without adding application features or database connections.
