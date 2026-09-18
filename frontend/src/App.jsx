import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import VaultManager from './pages/VaultManager'
import ScrubManager from './pages/ScrubManager'
import TrustedContactsView from './pages/TrustedContactsView'
import AuditLogsView from './pages/AuditLogsView'

import {
  getDb,
  triggerHeartbeat,
  checkInactivityExpiry,
  executeOrchestration,
  resetDb
} from './utils/mockDb'

import { ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'vault', label: 'Legacy Vault' },
  { id: 'scrub', label: 'Scrub Protocol' },
  { id: 'contacts', label: 'Trusted Contacts' },
  { id: 'logs', label: 'Audit Logs' }
]

const tabMetadata = {
  overview: {
    title: 'Security Overview',
    subtitle: 'End-to-end encrypted estate relay. Activity-gated payload delivery.'
  },
  vault: {
    title: 'Vault Payload Manager',
    subtitle: 'Client-side encryption interface. Payload deployment and envelope configuration.'
  },
  scrub: {
    title: 'Localized Cryptographic Scrub',
    subtitle: 'Hardware-isolated erasure vectors. Localized payload sanitization.'
  },
  contacts: {
    title: 'Quorum Signatures',
    subtitle: 'Multisig escrow routing. Cryptographic trustee assignment.'
  },
  logs: {
    title: 'Ledger Audit Trails',
    subtitle: 'Chronological execution ledger. Read-only event logging.'
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [dbState, setDbState] = useState(getDb())
  const [simulatedDays, setSimulatedDays] = useState(0)
  
  // Post-mortem trigger visual simulation state
  const [triggeredProtocol, setTriggeredProtocol] = useState(null) // 'LEGACY' or 'SCRUB' or null
  const [simulationStep, setSimulationStep] = useState(0) // 0 to 4 steps of visual sequence
  const [simulationLogs, setSimulationLogs] = useState([])

  const user = dbState.users[0]
  const vaults = dbState.vaults

  // Monitor inactivity trigger
  const { isTriggered, daysRemaining } = checkInactivityExpiry(
    new Date(user.last_active_at).getTime() + (simulatedDays * 24 * 60 * 60 * 1000)
  )

  const handleHeartbeat = (source = 'Google Ingestion') => {
    // Reset simulation days to 0 when heartbeat is sent
    setSimulatedDays(0)
    const updatedDb = triggerHeartbeat(source)
    setDbState(updatedDb)
    
    // Add visual toast or notification
    showNotification(`Heartbeat ingested: ${source}. Countdown refreshed.`)
  }

  const [notification, setNotification] = useState('')
  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification('')
    }, 4000)
  }

  // Trigger post-mortem protocol simulation sequence
  const handleTriggerProtocol = () => {
    // Check if we have SCRUB payloads, default is LEGACY
    const hasScrub = vaults.some(v => v.payload_type === 'SCRUB')
    const type = hasScrub ? 'SCRUB' : 'LEGACY'
    
    if (triggeredProtocol) return // Already running
    setTriggeredProtocol(type)
    setSimulationStep(1)
    
    if (type === 'SCRUB') {
      setSimulationLogs([
        '⏰ [00:00 UTC] Daemon: Inactivity threshold breached.',
        '⚠️ Elevating system state to TRIGGERED.',
        '🛑 Executing zero-fill write sequence: Scrub Protocol...'
      ])
    } else {
      setSimulationLogs([
        '⏰ [00:00 UTC] Daemon: Inactivity threshold breached.',
        '⚠️ Elevating system state to TRIGGERED.',
        '📦 Compiling client-side AES-GCM-256 encrypted envelopes...',
        '📧 Establishing outbound routing pathways to trustees...'
      ])
    }
  }

  // Step through simulation animations
  useEffect(() => {
    if (!triggeredProtocol) return
    
    const interval = setInterval(() => {
      setSimulationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval)
          // Actually execute in db
          const updatedDb = executeOrchestration(triggeredProtocol)
          setDbState(updatedDb)
          return 4
        }
        
        // Add log depending on step
        if (triggeredProtocol === 'SCRUB') {
          if (prev === 1) {
            setSimulationLogs(l => [...l, '🔗 Dispatching profile erasure webhook payloads to external providers.'])
          } else if (prev === 2) {
            setSimulationLogs(l => [...l, '🧬 Spawning backend database sanitization process.'])
          } else if (prev === 3) {
            setSimulationLogs(l => [...l, '🧹 Wiped database tables "encrypted_vaults". Anonymized "users" table. Status: SUCCESS.'])
          }
        } else {
          if (prev === 1) {
            setSimulationLogs(l => [...l, '🔑 Appending client-side decryption utility to payload packages.'])
          } else if (prev === 2) {
            setSimulationLogs(l => [...l, '📬 Dispatching encrypted envelopes to: s.ames@familyoffice-ames.com, m.vance@vancelegal.com'])
          } else if (prev === 3) {
            setSimulationLogs(l => [...l, '✅ Delivery handshakes confirmed. Recipient escrow initialized.'])
          }
        }
        
        return prev + 1
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [triggeredProtocol])

  const handleResetSimulation = () => {
    const updatedDb = resetDb()
    setDbState(updatedDb)
    setSimulatedDays(0)
    setTriggeredProtocol(null)
    setSimulationStep(0)
    setSimulationLogs([])
    showNotification('System database state reset to base seed configuration.')
  }

  const handleThresholdChange = () => {
    setDbState(getDb())
  }

  const handleVaultUpdated = (newVaults) => {
    setDbState((prev) => ({ ...prev, vaults: newVaults }))
  }

  const handleRegisterScrubPayload = () => {
    const db = getDb()
    db.vaults.unshift({
      id: Date.now(),
      user_id: 1,
      name: 'Confidential_Journal.enc',
      payload_type: 'SCRUB',
      cipher_text: '{}',
      description: 'Hardware-isolated scrub target — zero-fill erasure routing',
      beneficiary_routing_metadata: 'Self-Destruct Triggered',
      last_synchronized: new Date().toISOString()
    })
    setDbState(db)
    showNotification('Asset registered under SCRUB policy.')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Dashboard
            user={user}
            vaults={vaults}
            simulatedDays={simulatedDays}
            setSimulatedDays={setSimulatedDays}
            onThresholdChange={handleThresholdChange}
            onTriggerProtocol={handleTriggerProtocol}
            onVaultUpdated={handleVaultUpdated}
            onHeartbeat={handleHeartbeat}
          />
        )
      case 'vault':
        return (
          <VaultManager
            vaults={vaults}
            onVaultUpdated={handleVaultUpdated}
          />
        )
      case 'scrub':
        return <ScrubManager onRegisterScrubPayload={handleRegisterScrubPayload} />
      case 'contacts':
        return <TrustedContactsView />
      case 'logs':
        return (
          <AuditLogsView
            logs={dbState.logs}
            onResetSimulation={handleResetSimulation}
          />
        )
      default:
        return null
    }
  }

  const { title, subtitle } = tabMetadata[activeTab] ?? { title: 'Dashboard', subtitle: 'System Control' }
  const activeTabLabel = navItems.find((item) => item.id === activeTab)?.label ?? 'Overview'
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setMobileNavOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#334155] antialiased font-sans flex relative">
      
      {/* Toast Alert Banner */}
      {notification && (
        <div className="fixed top-5 right-5 bg-slate-900 border border-slate-800 text-white rounded-lg shadow-2xl p-4 z-50 flex items-center gap-3 animate-fade-in-down max-w-sm">
          <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
          <p className="text-xs font-semibold leading-normal">{notification}</p>
        </div>
      )}

      {/* Sidebar navigation */}
      <Sidebar
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Main dashboard viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <Header
          title={title}
          subtitle={subtitle}
          activeTabLabel={activeTabLabel}
          daysRemaining={daysRemaining}
          triggerManualHeartbeat={handleHeartbeat}
          onToggleNavigation={() => setMobileNavOpen(true)}
        />

        <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 max-w-[1600px] w-full mx-auto space-y-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Post-Mortem Protocol Trigger Simulation Overlay Screen */}
      {triggeredProtocol && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative text-left">
            <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                triggeredProtocol === 'SCRUB' ? 'bg-rose-950 border border-rose-900 text-rose-500 animate-pulse' : 'bg-blue-950 border border-blue-900 text-blue-400 animate-pulse'
              }`}>
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white uppercase">
                  {triggeredProtocol} PROTOCOL TRIGGERED
                </h2>
                <p className="text-xs font-medium text-slate-400">
                  DataDignity automated background orchestrator running active protocols
                </p>
              </div>
            </div>

            {/* Animation Console */}
            <div className="bg-black/80 rounded-xl p-5 border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 h-64 overflow-y-auto space-y-2">
              {simulationLogs.map((log, idx) => (
                <div key={idx} className={log.includes('SUCCESS') || log.includes('✅') ? 'text-teal-400 font-bold' : log.includes('⚠️') || log.includes('🛑') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {log}
                </div>
              ))}
              
              {simulationStep < 4 && (
                <div className="flex items-center gap-1.5 text-slate-500 font-bold mt-2 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-slate-500 animate-ping" />
                  <span>Processing operational instruction packet...</span>
                </div>
              )}
            </div>

            {/* Step Counter Indicator */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Execution Status</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <div
                      key={stepNum}
                      className={`h-2 w-8 rounded ${
                        simulationStep >= stepNum
                          ? triggeredProtocol === 'SCRUB' ? 'bg-rose-500' : 'bg-blue-500'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {simulationStep >= 4 ? (
                <button
                  onClick={handleResetSimulation}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Unlock System</span>
                </button>
              ) : (
                <span className="text-[10px] font-bold text-amber-500 animate-pulse uppercase tracking-wider">
                  ⚠️ Protocol Active - Do Not Interrupt
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
