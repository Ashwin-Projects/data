# DataDignity
Zero-Knowledge Digital Estate Plan & Post-Mortem Privacy Infrastructure

A privacy-first digital estate platform that lets users predefine how their encrypted digital assets should be transferred to beneficiaries or permanently destroyed if they become inactive for an extended period — with recovery, verification, and revocation designed in from the start, not bolted on afterward.

**Protect what matters, on your own terms — even when you're not there to manage it.**

## Current Status

This repository is currently in the architecture and design phase, with the security-critical model (key recovery, beneficiary authenticity, revocation, liveness verification, asset classification) finalized before any implementation begins.

- **Phase 0 (Foundation, Threat Model & Architecture): COMPLETED.**
- Handoff & Project Context: See `PROJECT_PLAN.md` for the full phase-by-phase execution plan, subagent structure, and critical design decisions.
- Product Specification: See `DataDignity_Architecture_Spec.pdf` for the zero-knowledge trust model, key lifecycle, and threat model.

## Tech Stack

### Currently Implemented
| Layer | Technology |
|---|---|
| Architecture | Zero-knowledge trust model, threat model, key lifecycle — finalized |
| Cryptography Design | AES-GCM-256 via Web Crypto API, DEK/beneficiary key-wrapping model |
| Data Model Design | Pseudonymous identity/vault unlinkability schema |

### Planned / Future Roadmap
| Layer | Technology / Feature |
|---|---|
| Frontend | Vault dashboard, beneficiary onboarding, check-in & warning UI, trusted-contact UI |
| Backend | REST API for ciphertext-only vault operations, authorization & tenant isolation |
| Database | PostgreSQL + Prisma — `users`, `identity_vault_mapping`, `encrypted_vaults` |
| Cryptography | Client-side DEK generation, beneficiary key wrapping, fingerprint verification, DEK rotation on revocation |
| Liveness | User check-in (primary), OAuth corroboration (GitHub, Google Workspace, LinkedIn), trusted-contact escalation |
| Automation | Cron-based state machine — staged warnings, inactivity evaluation, idempotent triggers |
| Policy Engine | `LEGACY` / `SCRUB` / `UNCLASSIFIED` asset classification with conflict safe-hold |
| Protocols | Legacy Protocol (beneficiary recovery), Scrub Protocol (provider deletion with confirmed/unavailable states) |

## Quick Start & Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database (local installation, Neon, or Docker)
- OAuth app credentials for supported providers (GitHub, Google Workspace, LinkedIn) — optional, used only for corroborating liveness signals

### 1. Backend Setup
```
cd backend
cp .env.example .env
npm install
```

Configure `backend/.env`:
```
PORT=5000
CORS_ORIGIN="http://localhost:3000"
DB_URL="postgresql://username:password@localhost:5432/datadignity?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/datadignity?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
OAUTH_GITHUB_CLIENT_ID=""
OAUTH_GITHUB_CLIENT_SECRET=""
OAUTH_GOOGLE_CLIENT_ID=""
OAUTH_GOOGLE_CLIENT_SECRET=""
```

Initialize database & seed synthetic test data:
```
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

Start the backend server:
```
npm run dev
# or: npm start
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Setup
In a new terminal:
```
cd frontend
npm install
npm run dev
```
Frontend dev server runs on `http://localhost:3000`.

## Project Structure
```
datadignity/
├── PROJECT_PLAN.md                  # Phase-by-phase execution plan & subagent structure
├── README.md                        # Project quick start & state
├── DataDignity_Architecture_Spec.pdf # Threat model, key lifecycle, data flow spec
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js                    # Express entry point
│   ├── middleware/
│   │   ├── auth.js                  # Authentication middleware
│   │   └── ownership.js             # Vault ownership & tenant isolation checks
│   ├── services/
│   │   ├── vault.service.js         # Ciphertext-only vault operations
│   │   ├── beneficiary.service.js   # Beneficiary onboarding, key wrapping, revocation
│   │   ├── liveness.service.js      # Check-in & OAuth corroboration handling
│   │   └── policy.service.js        # Asset classification & conflict resolution
│   ├── prisma/
│   │   ├── schema.prisma            # users, identity_vault_mapping, encrypted_vaults
│   │   └── seed.js                  # Synthetic test data seed script
│   ├── jobs/
│   │   └── inactivity-cron.js       # Staged warning & inactivity state machine
│   ├── protocols/
│   │   ├── legacy.js                # Legacy Protocol delivery workflow
│   │   └── scrub.js                 # Scrub Protocol deletion workflow
│   └── routes/
│       ├── auth.js
│       ├── vault.js
│       ├── beneficiary.js
│       ├── liveness.js
│       └── admin.js
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── App.tsx                  # Router & protected route wrappers
        ├── main.tsx
        ├── store/
        │   └── useStore.ts          # Global state & lifecycle status handling
        ├── components/
        │   ├── Layout.tsx
        │   └── ui/                  # Vault entries, status indicators, warning dialogs
        └── pages/
            ├── Landing.tsx
            ├── Login.tsx
            ├── Signup.tsx
            ├── Dashboard.tsx        # Vault overview & protocol status
            ├── Beneficiaries.tsx    # Onboarding, fingerprint verification, key health
            ├── CheckIn.tsx          # Liveness check-in & warning states
            ├── TrustedContact.tsx
            └── Settings.tsx
```

## Development & Testing Commands

### Backend Commands
```
npm run dev              # Start backend with nodemon
npm start                # Start backend with node
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run seed             # Seed synthetic beneficiaries & vault entries
npm run test:crypto      # Run client-crypto & key-wrapping test suite
npm run test:security    # Run incremental security test suite
```

### Frontend Commands
```
npm run dev       # Start Vite development server
npm run build     # Typecheck & build production bundle
npm run lint      # Run ESLint analysis
npm run preview   # Preview production build locally
```

## Security Notice

Automated inactivity detection is a technical signal, not legal proof of death, and does not establish executor or probate authority. DataDignity is a technical privacy and digital-estate infrastructure layer, not a substitute for applicable estate-planning or legal processes.

## License
MIT — see `LICENSE` for details.