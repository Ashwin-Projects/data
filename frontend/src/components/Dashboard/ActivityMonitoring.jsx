import React from 'react'
import { Activity, CheckCircle2, Github, Globe, Linkedin, ShieldAlert } from 'lucide-react'

export default function ActivityMonitoring({ onHeartbeat }) {
  const monitoringServices = [
    {
      id: 'github',
      name: 'GitHub Commit Monitor',
      status: 'Active: Repo pushes & PR reviews',
      desc: 'Validates commit signing key metadata.',
      icon: Github,
      color: 'text-slate-800 bg-slate-100 border-slate-200'
    },
    {
      id: 'google',
      name: 'Google Workspace',
      status: 'Active: Workspace logins & edits',
      desc: 'Validates OAuth session handshake telemetry.',
      icon: Globe,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn OAuth Daemon',
      status: 'Active: OAuth handshake verified',
      desc: 'Validates active session state handshake.',
      icon: Linkedin,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100'
    }
  ]

  const handleSimulate = (serviceName) => {
    onHeartbeat(serviceName)
  }

  return (
    <section className="rounded-xl border border-[#cbd5e1] bg-white shadow-sm p-6">
      <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#0f172a]">PASSIVE INTEGRATIONS</h3>
          <p className="text-xs font-medium text-[#64748b]">
            Multi-factor passive heartbeat ingest matrix.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-[#bbf7d0] bg-[#ebfdf5] px-2.5 py-1 text-[11px] font-bold text-[#10b981]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75 animate-duration-1000"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10b981]"></span>
          </span>
          INGESTION ACTIVE
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {monitoringServices.map((service) => {
          const Icon = service.icon
          return (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-4 shadow-sm hover:border-[#94a3b8] transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${service.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#10b981]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Online
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-[#0f172a]">{service.name}</h4>
                <p className="text-[11px] font-semibold text-[#0d9488] mt-0.5">{service.status}</p>
                <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#cbd5e1]/40 flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-400">Ingest Channel: OAuth 2.0</span>
                <button
                  onClick={() => handleSimulate(service.name)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#cbd5e1] hover:bg-[#edf2f7] rounded text-[10px] font-bold text-[#475569] shadow-sm transition-all"
                >
                  <Activity className="h-3 w-3 text-[#10b981]" />
                  <span>Emit Heartbeat</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
