# DataDignity — Threat Model & Security Architecture

This document establishes the formal threat model, trust boundaries, zero-knowledge constraints, threat scenarios, and security rules for the DataDignity digital estate planning platform.

---

## 1. Assets Being Protected

| Asset | Sensitivity | Protection Requirements |
|---|---|---|
| **Encrypted Vault Contents** | Critical | Client-side AES-GCM-256 encryption. Plaintext must never reach backend servers or database. |
| **Data Encryption Keys (DEKs)** | Critical | Encrypted with beneficiary public keys while user is active. Never stored unwrapped on server. |
| **Beneficiary Key Material** | High | Asymmetric public keys registered with out-of-band fingerprint verification. Private keys stay client-side. |
| **Beneficiary Metadata** | Medium | Fingerprints, delivery addresses, and trustee authorization statuses stored with tenant isolation. |
| **User Identity Information** | High | User credentials, emails, and profile data stored in isolated identity schemas. |
| **Identity-to-Vault Mappings** | High | Pseudonymous mapping layer protected by separate access controls to prevent correlation. |
| **Liveness & Check-In Signals** | High | Timestamp assertions, check-in history, and activity signals protected against replay or forge attacks. |
| **OAuth Credentials & Tokens** | High | Encrypted at rest, minimally scoped, used solely for secondary liveness corroboration. |
| **Trusted Contact Metadata** | Medium | Contact details used exclusively for human escalation during warning windows. |
| **Protocol Execution State** | Critical | State machine transitions (`ACTIVE`, `WARNING`, `TRIGGER_ELIGIBLE`, `EXECUTED`) guarded by atomic locks and safety gates. |
| **Audit & Security Metadata** | High | Immutable event logs tracking heartbeat assertions, key changes, and warning dispatches. |

---

## 2. Security Goals

1. **Confidentiality**: Zero-knowledge trust model. Plaintext vault contents and unwrapped DEKs are accessible only to the authenticated user or verified beneficiaries.
2. **Integrity**: Authenticated encryption via AES-GCM-256 prevents ciphertext tampering. Audit logs and public key fingerprints are cryptographically validated.
3. **Passphrase-Independent Recovery**: Beneficiaries must be able to recover DEKs using their own pre-registered private keys without relying on the original user's passphrase.
4. **Beneficiary Authenticity & Authorization**: Only beneficiaries whose public keys have passed out-of-band fingerprint verification can be assigned wrapped DEKs.
5. **Identity & Vault Unlinkability**: Database compromise must not allow trivial correlation between user identity records and pseudonymous vault payloads.
6. **Resilient Liveness & False-Trigger Prevention**: Multi-stage warning windows, active user cancellation, and human escalation prevent accidental protocol execution.
7. **Safe Policy Execution**: Deterministic policy engine (`LEGACY`, `SCRUB`, `UNCLASSIFIED`, `SAFE HOLD`) ensures no asset undergoes unverified or conflicting actions.
8. **Truthful Scrub Reporting**: Third-party erasure attempts explicitly report execution status without false claims of deletion.

---

## 3. Trust Boundaries

```
+-----------------------------------------------------------------------------------+
| CLIENT TRUST BOUNDARY (User Browser / Beneficiary Client)                          |
|  - Plaintext Vault Assets                                                         |
|  - User Master Passphrase & Derived PBKDF2 Keys                                    |
|  - Raw Unwrapped Data Encryption Keys (DEKs)                                      |
|  - Beneficiary Asymmetric Private Keys                                            |
|  - Out-of-Band Fingerprint Verification UI                                        |
+-----------------------------------------+-----------------------------------------+
                                          | Ciphertext, Wrapped DEKs, Fingerprints,
                                          | Auth Tokens, Heartbeat Signals
                                          v
+-----------------------------------------------------------------------------------+
| BACKEND API TRUST BOUNDARY (Node.js / Express Server)                             |
|  - JWT Authentication & Authorization Middleware                                  |
|  - Ciphertext Vault CRUD Operations & Routing                                     |
|  - Inactivity State Machine Engine & Safety Gates                                 |
|  - Warning Dispatch & Notification Services                                       |
+--------------------+--------------------+--------------------+--------------------+
                     |                    |                    |
        Ciphertext & |       OAuth API    |   Escalation       | Erasure Payloads
        Pseudonyms   |       Queries      |   Notifications    | & Status Checks
                     v                    v                    v
+--------------------+----+ +-------------+------+ +-------------+------+ +-------------+------+
| DATABASE BOUNDARY       | | OAUTH PROVIDERS    | | TRUSTED CONTACTS   | | EXTERNAL APIS        |
|  - Identity Tables      | | (GitHub, Google,   | | - Email/SMS      | | (GitHub, Google,   | |
|  - Mapping Layer        | |  LinkedIn)         | |   Escalation     | |  Workspace Purge)  |
|  - Ciphertext Vaults    | | - Secondary      | |   Notifications  | | - Scrub Protocol   |
|  - Audit Logs           | |   Corroboration    | | - No DEK/Cipher  | |   Connector        |
+-------------------------+ +--------------------+ +--------------------+ +--------------------+
```

### Boundary Descriptions

- **Boundary A (Client Browser vs. Backend API)**: Plaintext assets, master passphrases, raw DEKs, and beneficiary private keys MUST NEVER cross this boundary. Only ciphertext, wrapped DEKs, public keys, fingerprints, and authentication tokens may be transmitted.
- **Boundary B (Backend API vs. Database Layer)**: Database queries deal with pseudonymous vault IDs, ciphertext payloads, wrapped DEKs, hashed credentials, and audit logs. Identity tables and vault tables are separated by access controls.
- **Boundary C (System vs. Beneficiary Client)**: Beneficiaries receive wrapped DEKs and ciphertext packages only after trigger eligibility. Beneficiary private keys remain exclusively on beneficiary devices.
- **Boundary D (Backend API vs. OAuth Providers)**: OAuth integrations query activity timestamps to corroborate liveness. Provider token revocation or API outages MUST NEVER be interpreted as proof of user inactivity or death.
- **Boundary E (Backend API vs. Trusted Contacts)**: Trusted contacts receive escalation notifications during warning windows. They NEVER receive raw ciphertext, DEKs, or legal executor authority.
- **Boundary F (Backend API vs. External Erasure Targets)**: Scrub Protocol dispatches deletion payloads to third-party APIs and tracks response states explicitly.
- **Boundary G (State Machine & Cron Engine)**: Scheduled background evaluation runs under strict distributed locks and pre-execution safety gates to prevent race conditions.

---

## 4. Zero-Knowledge Boundary & Server Visibility Matrix

| Data Item | Client Visibility | Server Visibility | Database Visibility |
|---|---|---|---|
| **Plaintext Vault Assets** | Plaintext | **None (Zero-Knowledge)** | **None** |
| **User Master Passphrase** | Plaintext | **None** | **None** |
| **Unwrapped DEK** | Plaintext | **None (Zero-Knowledge)** | **None** |
| **Beneficiary Private Key** | Plaintext (Beneficiary device) | **None** | **None** |
| **Ciphertext Payload** | Ciphertext | Ciphertext | Ciphertext |
| **Wrapped DEK** | Wrapped | Wrapped | Wrapped |
| **IV / Salt Metadata** | Visible | Visible | Stored |
| **Beneficiary Public Key & Fingerprint** | Visible | Visible | Stored |
| **User Identity & Credentials** | Visible | Auth Context | Hashed / Encrypted |
| **Check-In Timestamps** | Visible | Visible | Stored |
| **Asset Policy (`LEGACY`/`SCRUB`/`UNCLASSIFIED`)** | Visible | Visible | Stored |

---

## 5. Threat Actors

1. **Malicious Authenticated User**: Attempts tenant isolation bypass, access to another user's pseudonymous vault, or fraudulent check-in manipulation.
2. **Unauthorized External Attacker**: Attempts credential theft, API endpoint injection, brute-force auth attacks, or replay attacks.
3. **Compromised Beneficiary / Rogue Trustee**: Attempts premature access to vault payloads before inactivity threshold breach, or attempts public-key substitution during onboarding.
4. **Malicious Insider / Database Reader**: Possesses direct read/dump access to the database or storage layer and attempts identity-to-vault correlation or ciphertext decryption.
5. **Man-in-the-Middle (MITM) Interceptor**: Attempts network request interception, key tampering, or heartbeat modification.
6. **Compromised OAuth Integration / Flaky Provider**: External OAuth provider emitting revoked tokens, corrupted API responses, or experiencing extended downtime.
7. **Premature Trigger / Inactivity Attacker**: Attempts clock manipulation or notification suppression to force premature `LEGACY` or `SCRUB` execution.

---

## 6. Threat Scenarios & Intended Mitigations

### Scenario 1: Database Compromise / Complete DB Dump
- **Threat**: An attacker gains full read access to backend PostgreSQL database dumps.
- **Mitigation**: All vault contents are encrypted client-side using AES-GCM-256 with unique DEKs. DEKs are wrapped with beneficiary public keys. The database contains no plaintext assets or unwrapped DEKs. Identity records and pseudonymous vault IDs are stored in separate decoupled schemas.

### Scenario 2: MITM Beneficiary Public Key Substitution
- **Threat**: An attacker intercepts beneficiary onboarding and substitutes their own public key to receive wrapped DEKs upon trigger.
- **Mitigation**: Mandatory out-of-band fingerprint verification. The user must manually confirm the beneficiary's cryptographic public key fingerprint before the key is trusted for DEK wrapping.

### Scenario 3: Beneficiary Private Key Loss
- **Threat**: A verified beneficiary loses their private key, rendering them unable to unwrap the DEK upon trigger.
- **Mitigation**: System provides beneficiary key health reminders, secondary trustee assignment, and key replacement workflows while the user is active.

### Scenario 4: Beneficiary Revocation Bypass
- **Threat**: A user revokes a beneficiary, but the revoked beneficiary attempts to use a previously wrapped DEK copy.
- **Mitigation**: Mandatory DEK Rotation. When a beneficiary is revoked, the system generates a new DEK client-side, re-encrypts the asset, discards the old DEK, and re-wraps the new DEK strictly for remaining verified beneficiaries.

### Scenario 5: False Inactivity Trigger via OAuth Provider Outage
- **Threat**: A linked OAuth provider (e.g. GitHub) experiences downtime or revokes tokens, causing missing activity signals that wrongfully trigger inactivity protocols.
- **Mitigation**: Dedicated user check-in is the primary liveness signal. OAuth activity is secondary corroboration only. Provider failure, token expiry, or network downtime MUST NEVER be treated as proof of user inactivity or death.

### Scenario 6: Premature Protocol Execution / False Alarm
- **Threat**: Inactivity threshold is reached due to user illness, travel, or forgotten check-ins.
- **Mitigation**: Staged warning windows (e.g., Day 60, Day 75, Day 85, Day 90+). Multi-channel notifications are dispatched. Trusted contacts are notified for human escalation. Active user check-in instantly cancels warning states and resets timers. Pre-execution safety gates verify all conditions before execution.

### Scenario 7: Conflicting Asset Policies (`LEGACY` vs. `SCRUB`)
- **Threat**: An asset is assigned conflicting policy metadata or ambiguous instructions, risking unwanted data exposure or premature destruction.
- **Mitigation**: Deterministic asset policy engine. `LEGACY` and `SCRUB` are strictly mutually exclusive. Conflicting or ambiguous configurations automatically enter `SAFE HOLD` and halt all automated execution until resolved by the user.

### Scenario 8: Fraudulent Third-Party Deletion Claim
- **Threat**: Scrub Protocol reports data as deleted on external platforms when third-party APIs actually failed or rejected requests.
- **Mitigation**: Explicit status tracking: `DELETION_REQUESTED`, `DELETION_CONFIRMED`, `DELETION_FAILED`, and `DELETION_UNAVAILABLE`. Third-party deletion is never claimed as complete without cryptographic/API response confirmation.

### Scenario 9: Legal Entitlement & Executor Misrepresentation
- **Threat**: Beneficiaries or third parties claim DataDignity inactivity triggers grant legal probate or executor authority over real-world assets.
- **Mitigation**: Explicit legal boundary documentation. Automated inactivity detection is a technical signal only and does not establish legal proof of death, executor authority, probate entitlement, or legal right of destruction.

---

## 7. Architectural Rules for Future Implementation

All future development phases MUST adhere to the following mandatory security rules:

1. **Client-Side Zero-Knowledge Encryption**: All vault payloads must be encrypted client-side before transmission. Backend endpoints must reject unencrypted payload submissions.
2. **Separate Data Encryption Keys (DEKs)**: Every asset payload must use a unique DEK encrypted with beneficiary public keys.
3. **Passphrase-Independent Beneficiary Recovery**: Beneficiaries must recover assets using their pre-registered asymmetric key pairs without relying on the user's passphrase.
4. **Mandatory Fingerprint Verification**: Beneficiary public keys must be verified via out-of-band fingerprints before being trusted for DEK wrapping.
5. **DEK Rotation on Revocation**: Revoking a beneficiary requires generating a new DEK, re-encrypting the payload, and re-wrapping for remaining active beneficiaries.
6. **Liveness Signal Hierarchy**: Primary liveness signal is explicit user check-in. OAuth activity is secondary corroboration. Provider outage must never trigger inactivity state transitions.
7. **Trusted Contact Human Escalation**: Trusted contacts participate strictly as human escalation alerts during warning windows. They receive no keys, ciphertext, or legal executor rights.
8. **Explicit Policy States**: Every asset must be categorized as `LEGACY`, `SCRUB`, or `UNCLASSIFIED`.
9. **SAFE HOLD Resolution**: Any policy conflict or unverified trustee configuration must force the asset into `SAFE HOLD`, blocking automated execution.
10. **Unclassified Protection**: `UNCLASSIFIED` assets must never undergo automated recovery or deletion.
11. **Truthful Scrub Reporting**: Third-party erasure responses must be accurately categorized as `DELETION_REQUESTED`, `DELETION_CONFIRMED`, `DELETION_FAILED`, or `DELETION_UNAVAILABLE`.
12. **Legal Limitation Safeguard**: System disclaimers and UI interfaces must explicitly communicate that automated inactivity detection is not legal proof of death.
