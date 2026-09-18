import React, { useState } from 'react'
import { Users, UserPlus, CheckCircle2, ShieldCheck, Mail } from 'lucide-react'

export default function TrustedContacts() {
  const [contacts, setContacts] = useState([
    { name: 'Sarah Ames (Trustee)', email: 's.ames@familyoffice-ames.com', status: 'Key Verified', quorum: true },
    { name: 'Marcus Vance (Executor)', email: 'm.vance@vancelegal.com', status: 'Key Verified', quorum: true },
    { name: 'Elena Rostova (Guardian)', email: 'e.rostova@vault-trustees.org', status: 'Key Verified', quorum: true }
  ])

  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddContact = (e) => {
    e.preventDefault()
    if (!newEmail || !newName) return

    setContacts([
      ...contacts,
      {
        name: newName,
        email: newEmail,
        status: 'Pending Signature',
        quorum: false
      }
    ])
    setNewName('')
    setNewEmail('')
    setShowAddForm(false)
  }

  return (
    <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
            <Users className="h-4 w-4 text-[#475569]" />
            CRYPTOGRAPHIC QUORUM
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] px-2.5 py-1 rounded text-xs font-bold text-[#475569] shadow-sm transition-all"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register Keyholder</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddContact} className="mb-4 bg-white border border-[#cbd5e1] rounded-lg p-3 space-y-2.5 shadow-inner">
            <input
              type="text"
              placeholder="Keyholder Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-[#cbd5e1] rounded outline-none focus:border-[#2563eb]"
            />
            <input
              type="email"
              placeholder="Keyholder Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-[#cbd5e1] rounded outline-none focus:border-[#2563eb]"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-[#2563eb] text-white hover:bg-blue-600 text-[11px] font-bold rounded"
              >
                Dispatch Invitation
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-[#cbd5e1]/60 rounded-lg">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f1f5f9] border border-[#cbd5e1]">
                  <Mail className="h-3.5 w-3.5 text-[#64748b]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">{contact.name}</h4>
                  <p className="text-[10px] font-mono text-[#64748b]">{contact.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {contact.quorum ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#10b981] bg-[#ebfdf5] border border-[#bbf7d0] px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#f97316] bg-[#fff7ed] border border-[#ffedd5] px-2 py-0.5 rounded-full">
                    Pending Key
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#cbd5e1]/60 pt-3 mt-4 text-[11px] font-semibold text-[#64748b] flex items-center gap-1">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
        <span>3-of-3 schema satisfied. No pending approvals.</span>
      </div>
    </div>
  )
}
