import React from 'react'
import {
  Shield,
  Activity,
  Lock,
  Trash2,
  Users,
  FileText
} from 'lucide-react'

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'vault', label: 'Legacy Vault', icon: Lock },
    { id: 'scrub', label: 'Scrub Protocol', icon: Trash2 },
    { id: 'contacts', label: 'Trusted Contacts', icon: Users },
    { id: 'logs', label: 'Audit Logs', icon: FileText },
  ]

  return (
    <aside className="w-[260px] border-r border-[#cbd5e1] bg-[#e2e8f0] flex flex-col shadow-sm shrink-0">
      {/* Brand Header */}
      <div className="border-b border-[#cbd5e1] px-6 py-6 bg-[#dee4ec]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#cbd5e1] bg-[#f8fafc] shadow-sm">
            <Shield className="h-5 w-5 text-[#2563eb]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#0f172a]">
              DataDignity
            </h1>
            <p className="text-[11px] font-bold leading-tight text-[#64748b]">
              Estate Relay Node
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#f8fafc] text-[#2563eb] shadow-sm border border-[#cbd5e1]'
                  : 'text-[#475569] hover:bg-[#dee4ec] hover:text-[#0f172a]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#2563eb]' : 'text-[#64748b]'}`} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom Info Banner */}
      <div className="p-4 border-t border-[#cbd5e1] bg-[#dee4ec]/40 text-center">
        <p className="text-[10px] font-bold text-[#64748b] tracking-wide uppercase">
          Zero-Knowledge Architecture
        </p>
        <p className="text-[9px] text-[#94a3b8] mt-0.5">
          Local AES-GCM-256 Cryptography
        </p>
      </div>
    </aside>
  )
}
