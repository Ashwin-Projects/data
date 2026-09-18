import React from 'react'
import { RotateCcw } from 'lucide-react'

export default function AuditLogsView({ logs, onResetSimulation }) {
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
          onClick={onResetSimulation}
          className="flex items-center gap-1 px-3 py-1.5 border border-[#cbd5e1] hover:bg-[#f1f5f9] rounded text-xs font-bold text-[#475569] shadow-sm transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Audit Database</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {logs.map((log) => (
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
}
