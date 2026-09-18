import React from 'react'
import LegacyVault from '../components/Dashboard/LegacyVault'

export default function VaultManager({ vaults, onVaultUpdated }) {
  return (
    <div className="space-y-6">
      <LegacyVault vaults={vaults} onVaultUpdated={onVaultUpdated} />
    </div>
  )
}
