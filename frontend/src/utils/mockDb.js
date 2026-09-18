// Mock database simulation for DataDignity dual-tier isolated schema.
// Separates identity index (users) from encrypted vaults.

const DEFAULT_USERS = [
  {
    id: 1,
    identity_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // sha256 of "daniel.ames@example.com"
    last_active_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    inactivity_threshold_days: 90,
  }
];

// Pre-encrypted payloads encrypted with a mock passphrase 'safehouse'
// We store stringified envelopes containing ciphertext, salt, iv.
const DEFAULT_VAULTS = [
  {
    id: 1,
    user_id: 1,
    name: 'Financial_Access_Key.enc',
    payload_type: 'LEGACY',
    // Mock encrypted string envelope of 'SECRET_FINANCIAL_KEY_992182'
    cipher_text: JSON.stringify({
      ciphertext: "c87a55ecb5cc454d6ea6120ee135e69e71ec26a42a6c8e3100ba02bb",
      iv: "2d8f99e3a1f8bbcc00dd2211",
      salt: "11aa22bb33cc44dd55ee66ff77889900"
    }),
    description: 'AES-256 key envelope — repo access tier',
    beneficiary_routing_metadata: 's.ames@familyoffice-ames.com',
    last_synchronized: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    user_id: 1,
    name: 'Estate_Documents.enc',
    payload_type: 'LEGACY',
    // Mock encrypted string envelope of 'ESTATE_TRUST_DECREE_SIGNED_2026'
    cipher_text: JSON.stringify({
      ciphertext: "a98a44ecb5cc454d6ea6120ee135e69e71ec26a42a6c8e3100ba11cc",
      iv: "1d8f99e3a1f8bbcc00dd3322",
      salt: "22aa33bb44cc55dd66ee77ff88990011"
    }),
    description: 'Notarized legal corpus — probate routing',
    beneficiary_routing_metadata: 'm.vance@vancelegal.com',
    last_synchronized: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    user_id: 1,
    name: 'Family_Photos_Archive.enc',
    payload_type: 'LEGACY',
    // Mock encrypted string envelope of 'FAMILY_ARCHIVE_URL_AND_PASSPHRASE'
    cipher_text: JSON.stringify({
      ciphertext: "f76a33ecb5cc454d6ea6120ee135e69e71ec26a42a6c8e3100ba22dd",
      iv: "3d8f99e3a1f8bbcc00dd4433",
      salt: "33aa44bb55cc66dd77ee88ff99001122"
    }),
    description: 'AES-256 media container — archive partition',
    beneficiary_routing_metadata: 'e.rostova@vault-trustees.org',
    last_synchronized: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_AUDIT_LOGS = [
  { id: 1, action: 'Identity Created', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), detail: 'Core schema initialized. Operator: Account Principal' },
  { id: 2, action: 'Vault Entry Created', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), detail: 'Family_Photos_Archive.enc added' },
  { id: 3, action: 'Vault Entry Created', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), detail: 'Estate_Documents.enc added' },
  { id: 4, action: 'Passive Heartbeat Ingested', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), detail: 'GitHub OAuth: repo push verified' },
  { id: 5, action: 'Vault Entry Created', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), detail: 'Financial_Access_Key.enc added' },
];

export function getDb() {
  const users = localStorage.getItem('dd_users');
  const vaults = localStorage.getItem('dd_vaults');
  const logs = localStorage.getItem('dd_logs');

  if (!users || !vaults || !logs) {
    saveDb(DEFAULT_USERS, DEFAULT_VAULTS, DEFAULT_AUDIT_LOGS);
    return { users: DEFAULT_USERS, vaults: DEFAULT_VAULTS, logs: DEFAULT_AUDIT_LOGS };
  }

  return {
    users: JSON.parse(users),
    vaults: JSON.parse(vaults),
    logs: JSON.parse(logs)
  };
}

export function saveDb(users, vaults, logs) {
  localStorage.setItem('dd_users', JSON.stringify(users));
  localStorage.setItem('dd_vaults', JSON.stringify(vaults));
  localStorage.setItem('dd_logs', JSON.stringify(logs));
}

// Reset Database to Seed Data
export function resetDb() {
  saveDb(DEFAULT_USERS, DEFAULT_VAULTS, DEFAULT_AUDIT_LOGS);
  return { users: DEFAULT_USERS, vaults: DEFAULT_VAULTS, logs: DEFAULT_AUDIT_LOGS };
}

// Register a heartbeat (reset inactivity timer)
export function triggerHeartbeat(source) {
  const db = getDb();
  db.users[0].last_active_at = new Date().toISOString();
  db.logs.unshift({
    id: Date.now(),
    action: 'Passive Heartbeat Ingested',
    timestamp: new Date().toISOString(),
    detail: `${source} OAuth session handshake detected`
  });
  saveDb(db.users, db.vaults, db.logs);
  return db;
}

// Add a new vault entry
export function addVaultEntry(entry) {
  const db = getDb();
  const newEntry = {
    id: Date.now(),
    user_id: 1,
    name: entry.name,
    payload_type: entry.payload_type || 'LEGACY',
    cipher_text: entry.cipher_text,
    description: entry.description,
    beneficiary_routing_metadata: entry.beneficiary_routing_metadata || '',
    last_synchronized: new Date().toISOString()
  };
  db.vaults.unshift(newEntry);
  db.logs.unshift({
    id: Date.now() + 1,
    action: 'Vault Entry Created',
    timestamp: new Date().toISOString(),
    detail: `Client-side encrypted payload: ${entry.name}`
  });
  saveDb(db.users, db.vaults, db.logs);
  return db;
}

// Delete a vault entry
export function deleteVaultEntry(id) {
  const db = getDb();
  const entry = db.vaults.find(v => v.id === id);
  db.vaults = db.vaults.filter(v => v.id !== id);
  db.logs.unshift({
    id: Date.now(),
    action: 'Vault Entry Purged',
    timestamp: new Date().toISOString(),
    detail: entry ? `Purged archive: ${entry.name}` : `Purged vault ID ${id}`
  });
  saveDb(db.users, db.vaults, db.logs);
  return db;
}

// Update inactivity threshold
export function updateInactivityThreshold(days) {
  const db = getDb();
  db.users[0].inactivity_threshold_days = days;
  db.logs.unshift({
    id: Date.now(),
    action: 'Threshold Updated',
    timestamp: new Date().toISOString(),
    detail: `Threshold updated to ${days} days`
  });
  saveDb(db.users, db.vaults, db.logs);
  return db;
}

// Perform Cron check and trigger protocols if expired
export function checkInactivityExpiry(simulatedTimeMs = null) {
  const db = getDb();
  const user = db.users[0];
  const lastActive = new Date(user.last_active_at).getTime();
  const thresholdMs = user.inactivity_threshold_days * 24 * 60 * 60 * 1000;
  const currentTime = simulatedTimeMs || Date.now();

  const isTriggered = (currentTime - lastActive) > thresholdMs;

  return {
    isTriggered,
    timeElapsedDays: ((currentTime - lastActive) / (24 * 60 * 60 * 1000)).toFixed(1),
    daysRemaining: Math.max(0, ((lastActive + thresholdMs - currentTime) / (24 * 60 * 60 * 1000)).toFixed(1))
  };
}

// Execute Post-Mortem Orchestration Protocols
export function executeOrchestration(protocolType) {
  const db = getDb();
  
  if (protocolType === 'SCRUB') {
    // Scrub Protocol: Purge everything immediately!
    db.vaults = [];
    db.users[0].last_active_at = new Date(0).toISOString(); // Reset activity
    db.logs.unshift({
      id: Date.now(),
      action: 'SCRUB PROTOCOL ACTIVATED',
      timestamp: new Date().toISOString(),
      detail: 'Fired media erasure webhooks. Purged database vaults. Erased identity metadata.'
    });
    saveDb(db.users, db.vaults, db.logs);
    return { ...db, outcome: 'SCRUB_SUCCESS' };
  } else {
    // Legacy Protocol: Dispatch to beneficiaries
    db.logs.unshift({
      id: Date.now(),
      action: 'LEGACY PROTOCOL ACTIVATED',
      timestamp: new Date().toISOString(),
      detail: 'Packaged browser-encrypted files. Dispatched files and decryption tools to beneficiary routing addresses.'
    });
    saveDb(db.users, db.vaults, db.logs);
    return { ...db, outcome: 'LEGACY_SUCCESS' };
  }
}
