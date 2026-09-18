import React from 'react'
import { Bell, ChevronDown, Activity } from 'lucide-react'

export default function Header({ title, subtitle, daysRemaining, triggerManualHeartbeat }) {
  return (
    <header className="border-b border-[#cbd5e1] bg-[#f8fafc] shrink-0">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">
            {title}
          </h2>
          <p className="mt-1 text-xs font-medium text-[#64748b]">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* System status pill */}
          <div className="flex items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#ebfdf5] px-3.5 py-1 text-xs font-bold text-[#10b981] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span>Active Monitor</span>
          </div>

          {/* Quick heartbeat trigger */}
          <button
            onClick={() => triggerManualHeartbeat('Manual Pulse')}
            className="flex items-center gap-1.5 rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-bold text-[#475569] shadow-sm hover:bg-[#f1f5f9] transition-all"
            title="Reset the inactivity countdown"
          >
            <Activity className="h-3.5 w-3.5 text-[#0d9488]" />
            <span>Emit Heartbeat</span>
          </button>

          {/* Separation line */}
          <div className="h-6 w-px bg-[#cbd5e1]" />

          {/* Profile Card */}
          <div className="flex items-center gap-3 rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              alt="profile"
              className="h-8 w-8 rounded-full border border-[#cbd5e1] object-cover"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-[#0f172a]">Daniel Ames</p>
              <p className="text-[10px] font-bold text-[#94a3b8]">Account Principal</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#64748b]" />
          </div>
        </div>
      </div>
    </header>
  )
}
