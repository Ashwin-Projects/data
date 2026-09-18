import React from 'react'
import ServiceStatus from '../components/ServiceStatus'
import InactivityThreshold from '../components/Dashboard/InactivityThreshold'
import TrustedContacts from '../components/Dashboard/TrustedContacts'
import LegacyVault from '../components/Dashboard/LegacyVault'
import ActivityMonitoring from '../components/Dashboard/ActivityMonitoring'

export default function Dashboard({
  user,
  vaults,
  simulatedDays,
  setSimulatedDays,
  onThresholdChange,
  onTriggerProtocol,
  onVaultUpdated,
  onHeartbeat
}) {
  return (
    <div className="space-y-6">
      <ServiceStatus />

      <div className="grid gap-6 lg:grid-cols-2">
        <InactivityThreshold
          user={user}
          onThresholdChange={onThresholdChange}
          simulatedDays={simulatedDays}
          setSimulatedDays={setSimulatedDays}
          onTriggerProtocol={onTriggerProtocol}
        />
        <TrustedContacts />
      </div>

      <LegacyVault
        vaults={vaults.slice(0, 3)}
        onVaultUpdated={onVaultUpdated}
      />

      <ActivityMonitoring onHeartbeat={onHeartbeat} />
    </div>
  )
}
