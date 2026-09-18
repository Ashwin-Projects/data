import React, { useId, useState } from 'react'
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
  const [formError, setFormError] = useState('')
  const formId = useId()
  const nameInputId = `${formId}-name`
  const emailInputId = `${formId}-email`
  const instructionsId = `${formId}-instructions`
  const errorId = `${formId}-error`
  const hasRequiredFields = newName.trim() !== '' && newEmail.trim() !== ''
  const verifiedCount = contacts.filter((contact) => contact.quorum).length

  const handleAddContact = (e) => {
    e.preventDefault()
    if (!hasRequiredFields) {
      setFormError('Enter both a keyholder name and keyholder email before dispatching an invitation.')
      return
    }

    setFormError('')

    setContacts([
      ...contacts,
      {
        name: newName.trim(),
        email: newEmail.trim(),
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
            type="button"
            onClick={() => {
              setShowAddForm(!showAddForm)
              setFormError('')
            }}
            aria-expanded={showAddForm}
            aria-controls={`${formId}-add-form`}
            className="flex items-center gap-1 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] px-2.5 py-1 rounded text-xs font-bold text-[#475569] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register Keyholder</span>
          </button>
        </div>

        {showAddForm && (
          <form id={`${formId}-add-form`} onSubmit={handleAddContact} className="mb-4 bg-white border border-[#cbd5e1] rounded-lg p-3 space-y-2.5 shadow-inner">
            <p id={instructionsId} className="text-[11px] text-[#64748b]">
              Add a trusted keyholder for warning-stage escalation metadata.
            </p>
            <div>
              <label htmlFor={nameInputId} className="block text-[11px] font-semibold text-[#334155] mb-1">
                Keyholder Name <span aria-hidden="true">*</span>
              </label>
              <input
                id={nameInputId}
                type="text"
                required
                aria-required="true"
                aria-invalid={formError !== '' && newName.trim() === ''}
                aria-describedby={formError !== '' && newName.trim() === '' ? `${instructionsId} ${errorId}` : instructionsId}
                autoComplete="name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value)
                  if (formError) setFormError('')
                }}
                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-[#cbd5e1] rounded outline-none focus:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-1"
              />
            </div>
            <div>
              <label htmlFor={emailInputId} className="block text-[11px] font-semibold text-[#334155] mb-1">
                Keyholder Email <span aria-hidden="true">*</span>
              </label>
              <input
                id={emailInputId}
                type="email"
                required
                aria-required="true"
                aria-invalid={formError !== '' && newEmail.trim() === ''}
                aria-describedby={formError !== '' && newEmail.trim() === '' ? `${instructionsId} ${errorId}` : instructionsId}
                autoComplete="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value)
                  if (formError) setFormError('')
                }}
                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-[#cbd5e1] rounded outline-none focus:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-1"
              />
            </div>
            {formError && (
              <p id={errorId} className="text-[11px] font-semibold text-rose-700" role="alert" aria-live="assertive">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setFormError('')
                }}
                className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasRequiredFields}
                className="px-3 py-1 bg-[#2563eb] text-white hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed text-[11px] font-bold rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Dispatch Invitation
              </button>
            </div>
          </form>
        )}

        {contacts.length === 0 ? (
          <p className="text-xs text-[#64748b] bg-white border border-dashed border-[#cbd5e1] rounded-lg p-3">
            No trusted contacts registered yet.
          </p>
        ) : (
          <ul className="space-y-3" aria-label="Trusted keyholders">
            {contacts.map((contact, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-white border border-[#cbd5e1]/60 rounded-lg">
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
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#10b981] bg-[#ebfdf5] border border-[#bbf7d0] px-2 py-0.5 rounded-full" aria-label={`${contact.name} verified`}>
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#f97316] bg-[#fff7ed] border border-[#ffedd5] px-2 py-0.5 rounded-full" aria-label={`${contact.name} pending key verification`}>
                      Pending Key
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-[#cbd5e1]/60 pt-3 mt-4 text-[11px] font-semibold text-[#64748b] flex items-center gap-1">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
        <span>{verifiedCount}-of-{contacts.length} schema satisfied.</span>
      </div>
    </div>
  )
}
