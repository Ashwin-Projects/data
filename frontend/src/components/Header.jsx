import React from 'react'
import { ChevronDown, Activity, Menu } from 'lucide-react'

export default function Header({ title, subtitle, activeTabLabel, daysRemaining, triggerManualHeartbeat, onToggleNavigation }) {
  return (
    <header className="border-b border-[#cbd5e1] bg-[#f8fafc] shrink-0">
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 lg:hidden">
            <button
              onClick={onToggleNavigation}
              className="inline-flex items-center justify-center rounded-lg border border-[#cbd5e1] bg-white p-2 text-[#475569] shadow-sm hover:bg-[#f1f5f9] transition-all"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="rounded-full border border-[#cbd5e1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#475569]">
              {activeTabLabel}
            </span>
          </div>
          <h2 className="truncate text-xl font-bold tracking-tight text-[#0f172a] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 hidden text-xs font-medium text-[#64748b] sm:block">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* System status pill */}
          <div className="hidden items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#ebfdf5] px-3.5 py-1 text-xs font-bold text-[#10b981] shadow-sm md:flex">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span>Active Monitor • {Math.max(0, Number(daysRemaining)).toFixed(1)}d</span>
          </div>

          {/* Quick heartbeat trigger */}
          <button
            onClick={() => triggerManualHeartbeat('Manual Pulse')}
            className="flex items-center gap-1.5 rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-2 text-xs font-bold text-[#475569] shadow-sm hover:bg-[#f1f5f9] transition-all sm:px-3"
            title="Reset the inactivity countdown"
          >
            <Activity className="h-3.5 w-3.5 text-[#0d9488]" />
            <span className="hidden sm:inline">Emit Heartbeat</span>
          </button>

          {/* Separation line */}
          <div className="hidden h-6 w-px bg-[#cbd5e1] sm:block" />

          {/* Profile Card */}
          <div className="flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-2 py-1.5 shadow-sm sm:gap-3 sm:px-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              alt="profile"
              className="h-8 w-8 rounded-full border border-[#cbd5e1] object-cover"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-[#0f172a]">Daniel Ames</p>
              <p className="text-[10px] font-bold text-[#94a3b8]">Account Principal</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-[#64748b] sm:block" />
          </div>
        </div>
      </div>
    </header>
  )
}
