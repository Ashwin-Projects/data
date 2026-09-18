import React, { useState, useEffect } from 'react'
import { Calendar, ChevronDown, Clock, ShieldAlert, FastForward, RotateCcw } from 'lucide-react'
import { updateInactivityThreshold } from '../../utils/mockDb'

export default function InactivityThreshold({ user, onThresholdChange, simulatedDays, setSimulatedDays, onTriggerProtocol }) {
  const [isOpen, setIsOpen] = useState(false)
  const threshold = user.inactivity_threshold_days

  // Calculate remaining time
  const lastActiveTime = new Date(user.last_active_at).getTime()
  const simulatedTimeMs = lastActiveTime + (simulatedDays * 24 * 60 * 60 * 1000)
  const expiryTimeMs = lastActiveTime + (threshold * 24 * 60 * 60 * 1000)
  
  const msRemaining = expiryTimeMs - simulatedTimeMs
  const daysRemaining = (msRemaining / (24 * 60 * 60 * 1000)).toFixed(1)
  const isTriggered = msRemaining <= 0

  useEffect(() => {
    if (isTriggered) {
      onTriggerProtocol()
    }
  }, [isTriggered])

  const thresholds = [30, 60, 90, 180, 365]

  const handleSelectThreshold = (val) => {
    updateInactivityThreshold(val)
    onThresholdChange(val)
    setIsOpen(false)
  }

  return (
    <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#475569]" />
          INACTIVITY RUNTIME MONITOR
        </h3>
        
        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-white border border-[#cbd5e1] px-3 py-1 rounded text-xs font-bold text-[#475569] shadow-sm hover:bg-[#f1f5f9] transition-all"
          >
            t-{threshold} Days <ChevronDown className="h-3 w-3" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-32 rounded-md bg-white border border-[#cbd5e1] shadow-lg z-10">
              <div className="py-1">
                {thresholds.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleSelectThreshold(t)}
                    className={`block w-full text-left px-4 py-1.5 text-xs font-semibold ${
                      t === threshold
                        ? 'bg-[#f1f5f9] text-[#2563eb]'
                        : 'text-[#475569] hover:bg-[#edf2f7]'
                    }`}
                  >
                    {t} Days
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-baseline md:justify-between gap-2">
        <div>
          <span className={`text-4xl font-black tracking-tight ${isTriggered ? 'text-[#ef4444]' : 'text-[#0f172a]'}`}>
            {isTriggered ? 'TRIGGERED' : `${daysRemaining} Days`}
          </span>
          <span className="text-xs font-bold text-[#94a3b8] ml-2 uppercase">REMAINING</span>
        </div>
        <div className="text-xs font-semibold text-[#64748b]">
          {simulatedDays === 0 ? 'Last pulse 3h 14m ago' : `Last pulse ${simulatedDays * 24 + 3}h ago`}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#e2e8f0] h-2 rounded-full mt-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isTriggered ? 'bg-[#ef4444]' : daysRemaining < 15 ? 'bg-[#f97316]' : 'bg-[#10b981]'
          }`}
          style={{ width: `${isTriggered ? 100 : Math.min(100, Math.max(0, (daysRemaining / threshold) * 100))}%` }}
        />
      </div>

      {/* Simulator Interface */}
      <div className="mt-5 pt-4 border-t border-[#cbd5e1]/60 bg-[#edf2f7]/50 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl">
        <p className="text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-2">
          TRIGGER SIMULATION
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSimulatedDays(prev => prev + 10)}
            disabled={isTriggered}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] rounded text-[11px] font-bold text-[#475569] shadow-sm disabled:opacity-50 transition-all"
          >
            <FastForward className="h-3 w-3 text-[#f97316]" />
            <span>Advance 10 Days</span>
          </button>
          
          <button
            onClick={() => setSimulatedDays(prev => prev + 30)}
            disabled={isTriggered}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] rounded text-[11px] font-bold text-[#475569] shadow-sm disabled:opacity-50 transition-all"
          >
            <FastForward className="h-3 w-3 text-[#f97316]" />
            <span>Advance 30 Days</span>
          </button>

          <button
            onClick={() => setSimulatedDays(0)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] rounded text-[11px] font-bold text-[#475569] shadow-sm transition-all"
          >
            <RotateCcw className="h-3 w-3 text-[#64748b]" />
            <span>Reset Timeline</span>
          </button>
        </div>
        
        {simulatedDays > 0 && (
          <p className="text-[10px] text-[#b45309] font-bold mt-2">
            ⚠️ Simulated Time: {simulatedDays} days of silence active.
          </p>
        )}
      </div>
    </div>
  )
}
