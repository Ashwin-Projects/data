import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ServiceStatus from './components/ServiceStatus'
import InactivityThreshold from './components/Dashboard/InactivityThreshold'
import TrustedContacts from './components/Dashboard/TrustedContacts'
import LegacyVault from './components/Dashboard/LegacyVault'
import ActivityMonitoring from './components/Dashboard/ActivityMonitoring'

import {
  getDb,
  triggerHeartbeat,
  checkInactivityExpiry,
  executeOrchestration,
  resetDb
} from './utils/mockDb'

import { Shield, ShieldAlert, CheckCircle2, AlertOctagon, RotateCcw, Send, Mail, Trash2, Database, Key } from 'lucide-react'

export default function App() {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'vault', label: 'Legacy Vault' },
    { id: 'scrub', label: 'Scrub Protocol' },
    { id: 'contacts', label: 'Trusted Contacts' },
    { id: 'logs', label: 'Audit Logs' }
  ]

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

  // Define contents based on tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ServiceStatus />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <InactivityThreshold
                user={user}
                onThresholdChange={(days) => setDbState(getDb())}
                simulatedDays={simulatedDays}
                setSimulatedDays={setSimulatedDays}
                onTriggerProtocol={handleTriggerProtocol}
              />
              <TrustedContacts />
            </div>

            <LegacyVault
              vaults={vaults.slice(0, 3)}
              onVaultUpdated={(newVaults) => setDbState(prev => ({ ...prev, vaults: newVaults }))}
            />

            <ActivityMonitoring onHeartbeat={handleHeartbeat} />
          </div>
        )
      case 'vault':
        return (
          <div className="space-y-6">
            <LegacyVault
              vaults={vaults}
              onVaultUpdated={(newVaults) => setDbState(prev => ({ ...prev, vaults: newVaults }))}
            />
          </div>
        )
      case 'scrub':
        return (
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-6 shadow-sm space-y-6">
            <div className="border-b border-[#cbd5e1] pb-4">
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-rose-500" />
                <h3 className="text-base font-bold text-[#0f172a]">Cryptographic Scrub Protocol</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure localized zero-fill procedures on inactivity threshold breach.
              </p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
              <AlertOctagon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Zero-Fill Erasure Policy Alert</h4>
                <p className="text-xs text-rose-700 mt-1">
                  Breaching the inactivity threshold triggers the Scrub Protocol. This executes an unrecoverable zero-fill database overwrite and dispatches API erasure payloads to external linked targets.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Configured Erasure Endpoints</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-800">GitHub API Erasure Target</p>
                    <p className="text-[10px] text-slate-500 font-mono">POST https://api.github.com/user/erasure</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#10b981] bg-[#ebfdf5] px-2 py-0.5 rounded border border-[#bbf7d0]">Linked</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Google Workspace Erasure Target</p>
                    <p className="text-[10px] text-slate-500 font-mono">POST https://googleapis.com/drive/purge</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#10b981] bg-[#ebfdf5] px-2 py-0.5 rounded border border-[#bbf7d0]">Linked</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  Simulate self-destruct by adding a SCRUB asset and advancing the inactivity timeline.
                </p>
                <button
                  onClick={() => {
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
                  }}
                  className="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold rounded shadow-sm transition-all"
                >
                  Register Scrub Payload
                </button>
              </div>
            </div>
          </div>
        )
      case 'contacts':
        return (
          <div className="space-y-6">
            <TrustedContacts />
          </div>
        )
      case 'logs':
        return (
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Secure Audit Ledger</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cryptographically signed audit logs of heartbeat assertions and credential alterations.
                </p>
              </div>
              <button
                onClick={handleResetSimulation}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#cbd5e1] hover:bg-[#f1f5f9] rounded text-xs font-bold text-[#475569] shadow-sm transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Audit Database</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {dbState.logs.map((log) => (
                <div key={log.id} className="py-3 flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{log.action}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{log.detail}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Get dynamic titles for tab
  const getTabMetadata = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'Security Overview', subtitle: 'End-to-end encrypted estate relay. Activity-gated payload delivery.' }
      case 'vault':
        return { title: 'Vault Payload Manager', subtitle: 'Client-side encryption interface. Payload deployment and envelope configuration.' }
      case 'scrub':
        return { title: 'Localized Cryptographic Scrub', subtitle: 'Hardware-isolated erasure vectors. Localized payload sanitization.' }
      case 'contacts':
        return { title: 'Quorum Signatures', subtitle: 'Multisig escrow routing. Cryptographic trustee assignment.' }
      case 'logs':
        return { title: 'Ledger Audit Trails', subtitle: 'Chronological execution ledger. Read-only event logging.' }
      default:
        return { title: 'Dashboard', subtitle: 'System Control' }
    }
  }

  const { title, subtitle } = getTabMetadata()
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
