# DataDignity
Zero-Knowledge Digital Estate Plan & Post-Mortem Privacy Infrastructure

## 1. Executive Project Summary
DataDignity is a decentralized, privacy-first web ecosystem addressing a profound structural problem of the digital era: the handling of sensitive digital legacies. Traditional online accounts, asset repositories, and personal chronicles are vulnerable to institutional gridlock, post-mortem platform locking, or unintended visibility when an individual passes away unexpectedly.

Operating entirely under a Zero-Knowledge architectural model, DataDignity encrypts private payloads (passwords, encryption keys, legal decrees, and memory archives) entirely within the user's client browser using the native Web Crypto API. The central server never processes unencrypted text, rendering the cloud database computationally useless to malicious actors. Triggered via a distributed, multi-factor passive heartbeat matrix, the system distinguishes cleanly between inheritance transfers (Legacy Protocol) and localized cryptographic destruction procedures (Scrub Protocol).

### Security Model
- **Zero-Knowledge Architecture**: Client-Side Web Crypto API.
- **Default Active Window**: 90 Days Passive Heartbeat Monitor.
- **Verification Protocol**: 3-member Multi-Sig Quorum.

## 2. Key Visual Architecture Pillars
To cultivate absolute consumer confidence, DataDignity departs from standard, chaotic web-app frameworks. The production interface implements a highly refined, professional corporate light-and-slate-gray crossover layout strategy:
- **Structural Hierarchy**: Built with solid slate sidebars and crisp dividers to completely eliminate generic AI-generated drop-shadow visual artifacts.
- **Alternating Content Contrast Matrix**: Important data lists alternate rows strictly between Deep Charcoal Slate profiles (high contrast) and pure white cards with soft teal indicators. This design structure guarantees instant scannability and extreme textual accessibility.
- **Semantic Interface Cues**: Avoids primary or neon hues. Employs mathematically balanced accents—Muted Emerald for active monitoring status, Cool Blue for viewing operations, and Soft Lavender for routing configurations.

## 3. Production-Ready UI Layout Sample Data
The table below reflects the architectural layout of the core workspace dashboard, showcasing the contrasting row structure implemented in the application layer:

| Vault Entry | Asset | Beneficiary Link | Last Synchronized |
| :--- | :--- | :--- | :--- |
| `Financial_Access_Key.enc` | Encrypted archive token | `family.trust@example.com` | 2 days ago |
| `Estate_Documents.enc` | Sensitive legal document bundle | `legal.executor@example.com` | 5 days ago |
| `Family_Photos_Archive.enc` | Encrypted master media vault | `family.archive@example.com` | 1 week ago |

## 4. Core Technical Infrastructure Blueprint
Building DataDignity requires a linear, security-first implementation process across five clear foundational milestones:

### Step 1: Client-Side Browser Cryptography
Implement client-side envelope encryption directly via the Web Crypto API using AES-GCM-256. Master keys are synthesized inside browser runtime memory using user passphrase salts. Plaintext documents are compressed and encrypted locally; only the randomly initialized vectors (IVs) and stringified cipher-texts are dispatched down to the transport network.

### Step 2: Dual-Tier Isolated Database Schema
Design backend operational databases (e.g., PostgreSQL) to rigidly separate identity indices from encrypted payload storage blocks. The structure prevents correlation mapping:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    identity_hash VARCHAR(64) UNIQUE NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    inactivity_threshold_days INT DEFAULT 90
);

CREATE TABLE encrypted_vaults (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    payload_type VARCHAR(16) CHECK (payload_type IN ('LEGACY', 'SCRUB')),
    cipher_text TEXT NOT NULL,
    beneficiary_routing_metadata TEXT
);
```

### Step 3: Passive Heartbeat Detection Framework
To bypass manual tracking spam, the system interfaces directly with third-party web metadata layers using OAuth 2.0. By watching passive endpoints (such as GitHub code commits, Google Workspace authorization signals, or LinkedIn logins), the user's active timestamp updates organically behind the scenes during everyday usage without requiring direct dashboard interactions.

### Step 4: Automated Background Cron-Engine
A background process executing exactly at 00:00 UTC queries the identity matrix to evaluate expiration parameters:
`Account_Status = IF (Current_Date - Last_Active_At > Inactivity_Threshold) -> TRIGGERED`

### Step 5: Post-Mortem Orchestration Protocols
Upon entering a TRIGGERED status, the core processor initiates parallel final instructions:
- **The Legacy Protocol**: Automatically routes the browser-encrypted files alongside localized client-side unwrapping tools to the designated beneficiary email lines.
- **The Scrub Protocol**: Fires cryptographic webhooks to linked platform APIs initiating immediate cloud media erasure, followed by an immediate, low-level server script that purges the user's database records permanently from local environments.
