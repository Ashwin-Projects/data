import React from 'react'
import { CheckCircle2, Shield, Lock, Cpu } from 'lucide-react'

export default function ServiceStatus() {
  const metrics = [
    {
      title: 'Systems Integrity',
      value: 'Online',
      detail: 'Passive integration daemons polling',
      icon: Cpu,
      iconColor: 'text-[#0ea5e9]',
      borderColor: 'border-[#cbd5e1]'
    },
    {
      title: 'Zero-Knowledge Layer',
      value: 'AES-GCM-256',
      detail: 'PBKDF2 key derivation active',
      icon: Lock,
      iconColor: 'text-[#10b981]',
      borderColor: 'border-[#cbd5e1]'
    },
    {
      title: 'Post-Mortem Protocols',
      value: 'Armed',
      detail: 'Vault isolated database routing',
      icon: Shield,
      iconColor: 'text-[#8b5cf6]',
      borderColor: 'border-[#cbd5e1]'
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m, idx) => {
        const Icon = m.icon
        return (
          <div key={idx} className={`rounded-xl border ${m.borderColor} bg-[#f8fafc] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">{m.title}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#0f172a]">{m.value}</h3>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf2f7] border border-[#cbd5e1]/40">
                <Icon className={`h-4.5 w-4.5 ${m.iconColor}`} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 border-t border-[#cbd5e1]/50 pt-2 text-[11px] font-semibold text-[#64748b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              {m.detail}
            </div>
          </div>
        )
      })}
    </div>
  )
}
