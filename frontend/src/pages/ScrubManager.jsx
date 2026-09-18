import React from 'react'
import { AlertOctagon, Trash2 } from 'lucide-react'

export default function ScrubManager({ onRegisterScrubPayload }) {
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
            onClick={onRegisterScrubPayload}
            className="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold rounded shadow-sm transition-all"
          >
            Register Scrub Payload
          </button>
        </div>
      </div>
    </div>
  )
}
