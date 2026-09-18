import React, { useState } from 'react'
import { Lock, Unlock, Eye, Trash2, Shield, Plus, X, EyeOff, AlertTriangle } from 'lucide-react'
import { encryptPayload, decryptPayload } from '../../utils/crypto'
import { addVaultEntry, deleteVaultEntry } from '../../utils/mockDb'

export default function LegacyVault({ vaults, onVaultUpdated }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDecryptModal, setShowDecryptModal] = useState(false)
  const [selectedVault, setSelectedVault] = useState(null)
  const [passphrase, setPassphrase] = useState('')
  const [decryptionError, setDecryptionError] = useState('')
  const [decryptedText, setDecryptedText] = useState('')

  // Form State
  const [assetName, setAssetName] = useState('')
  const [assetDesc, setAssetDesc] = useState('')
  const [plainTextPayload, setPlainTextPayload] = useState('')
  const [newAssetPassphrase, setNewAssetPassphrase] = useState('')
  const [beneficiaryEmail, setBeneficiaryEmail] = useState('')
  const [payloadType, setPayloadType] = useState('LEGACY')
  const [encrypting, setEncrypting] = useState(false)

  const handleOpenDecrypt = (vault) => {
    setSelectedVault(vault)
    setPassphrase('')
    setDecryptedText('')
    setDecryptionError('')
    setShowDecryptModal(true)
  }

  const handleDecrypt = async (e) => {
    e.preventDefault()
    setDecryptionError('')
    setDecryptedText('')

    try {
      // Seed data is encrypted with passphrase "safehouse"
      const result = await decryptPayload(selectedVault.cipher_text, passphrase)
      setDecryptedText(result)
    } catch (err) {
      setDecryptionError('Invalid decryption passphrase. Keys do not match.')
    }
  }

  const handleCreateAsset = async (e) => {
    e.preventDefault()
    if (!assetName || !plainTextPayload || !newAssetPassphrase) return
    
    setEncrypting(true)
    try {
      const encrypted = await encryptPayload(plainTextPayload, newAssetPassphrase)
      
      const newDb = addVaultEntry({
        name: assetName.endsWith('.enc') ? assetName : `${assetName}.enc`,
        cipher_text: encrypted,
        description: assetDesc || 'AES-256 key envelope',
        payload_type: payloadType,
        beneficiary_routing_metadata: payloadType === 'LEGACY' ? beneficiaryEmail : 'Self-Destruct Triggered'
      })

      onVaultUpdated(newDb.vaults)
      
      // Reset Form
      setAssetName('')
      setAssetDesc('')
      setPlainTextPayload('')
      setNewAssetPassphrase('')
      setBeneficiaryEmail('')
      setPayloadType('LEGACY')
      setShowAddModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setEncrypting(false)
    }
  }

  const handleDelete = (id) => {
    const newDb = deleteVaultEntry(id)
    onVaultUpdated(newDb.vaults)
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#cbd5e1] bg-white shadow-sm">
      
      {/* Table Title and Actions */}
      <div className="flex items-center justify-between border-b border-[#cbd5e1] bg-[#f8fafc] px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-[#0f172a]">Legacy Vault</h3>
          <p className="text-xs font-medium text-[#64748b]">
            Zero-knowledge payload matrix. Encrypted archives secured client-side.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[#0d9488] bg-[#0d9488] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0f766e] transition-colors"
        >
          <Plus className="h-4 w-full md:w-3.5" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Headings */}
      <div className="grid grid-cols-12 bg-[#cbd5e1]/40 border-b border-[#cbd5e1] px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#475569]">
        <div className="col-span-5">Vault Entry</div>
        <div className="col-span-3">Beneficiary Link</div>
        <div className="col-span-2">Last Synchronized</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Grid List */}
      {vaults.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border-b border-slate-100">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#0f172a]">Vault Empty</p>
          <p className="text-xs text-slate-500">Add an asset to secure it client-side.</p>
        </div>
      ) : (
        vaults.map((entry, index) => {
          const isEven = true
          return (
            <div
              key={entry.id}
              className={`grid grid-cols-12 items-center px-6 py-3.5 transition-colors duration-150 bg-[#1e293b] text-white ${
                index !== vaults.length - 1 ? 'border-b border-slate-800' : ''
              }`}
            >
              {/* Name & Desc */}
              <div className="col-span-5 flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  isEven ? 'border-slate-700 bg-slate-800' : 'border-teal-200 bg-teal-50'
                }`}>
                  {entry.payload_type === 'SCRUB' ? (
                    <Trash2 className={`h-3.5 w-3.5 ${isEven ? 'text-[#f43f5e]' : 'text-rose-500'}`} />
                  ) : (
                    <Lock className={`h-3.5 w-3.5 ${isEven ? 'text-[#38bdf8]' : 'text-[#0d9488]'}`} />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isEven ? 'text-white' : 'text-[#0f172a]'} flex items-center gap-1.5`}>
                    {entry.name}
                    {!isEven && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0d9488]" title="Teal Indicator" />
                    )}
                  </p>
                  <p className={`text-xs ${isEven ? 'text-slate-400' : 'text-slate-500'}`}>
                    {entry.description}
                  </p>
                </div>
              </div>

              {/* Beneficiary */}
              <div className={`col-span-3 text-xs font-mono font-medium ${isEven ? 'text-slate-300' : 'text-slate-600'}`}>
                {entry.payload_type === 'SCRUB' ? (
                  <span className="text-rose-500 font-bold uppercase tracking-wider text-[10px]">Cryptographic Destruction</span>
                ) : (
                  entry.beneficiary_routing_metadata
                )}
              </div>

              {/* Last Sync */}
              <div className={`col-span-2 text-xs ${isEven ? 'text-slate-400' : 'text-slate-500'}`}>
                {entry.last_synchronized ? new Date(entry.last_synchronized).toLocaleDateString() : 'N/A'}
              </div>

              {/* Action buttons */}
              <div className="col-span-2 flex justify-end gap-1.5">
                {/* View/Decrypt - Cool Blue Accent */}
                <button
                  onClick={() => handleOpenDecrypt(entry)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold transition hover:opacity-80 shadow-sm ${
                    isEven 
                      ? 'bg-[#075985] text-[#38bdf8] border-[#0c4a6e]' 
                      : 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]'
                  }`}
                  title="Decrypt Payload Client-Side"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold transition hover:opacity-80 shadow-sm ${
                    isEven 
                      ? 'bg-red-950 text-red-400 border-red-900' 
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}
                  title="Purge Entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })
      )}

      {/* Decrypt Passphrase Modal */}
      {showDecryptModal && selectedVault && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#cbd5e1] rounded-xl max-w-md w-full shadow-2xl p-6 relative">
            <button
              onClick={() => setShowDecryptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 border border-blue-200">
                <Unlock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0f172a]">Decrypt Legacy Payload</h4>
                <p className="text-xs text-slate-500">Local decryption execution via AES-GCM-256.</p>
              </div>
            </div>

            <form onSubmit={handleDecrypt} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                  Passphrase Key
                </label>
                <input
                  type="password"
                  placeholder="Enter key to derive AES-GCM matrix"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#2563eb] font-mono"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  * Try the default secret passphrase: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-bold">safehouse</code>
                </p>
              </div>

              {decryptionError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
                  {decryptionError}
                </div>
              )}

              {decryptedText && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="block text-[9px] font-bold text-[#38bdf8] uppercase tracking-wider mb-1">
                    Plaintext Decrypted Payload
                  </span>
                  <pre className="text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                    {decryptedText}
                  </pre>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDecryptModal(false)}
                  className="px-4 py-2 border border-[#cbd5e1] hover:bg-slate-50 text-xs font-bold rounded-lg text-slate-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563eb] text-white hover:bg-blue-600 text-xs font-bold rounded-lg"
                >
                  Decrypt Payload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#cbd5e1] rounded-xl max-w-lg w-full shadow-2xl p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 border border-teal-200">
                <Shield className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0f172a]">Create Zero-Knowledge Asset</h4>
                <p className="text-xs text-slate-500">Client-side payload packaging and key synthesis.</p>
              </div>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                    Asset Name (e.g. key.enc)
                  </label>
                  <input
                    type="text"
                    placeholder="Financial_Access.enc"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                    Protocol Routing
                  </label>
                  <select
                    value={payloadType}
                    onChange={(e) => setPayloadType(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#2563eb] font-bold"
                  >
                    <option value="LEGACY">Legacy Transfer (Release on Inactivity)</option>
                    <option value="SCRUB">Scrub Protocol (Wipe on Inactivity)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Master credentials or ledger archives"
                  value={assetDesc}
                  onChange={(e) => setAssetDesc(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#2563eb]"
                />
              </div>

              {payloadType === 'LEGACY' && (
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                    Beneficiary Email Address (Routing Link)
                  </label>
                  <input
                    type="email"
                    placeholder="s.ames@familyoffice-ames.com"
                    value={beneficiaryEmail}
                    onChange={(e) => setBeneficiaryEmail(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#2563eb]"
                    required={payloadType === 'LEGACY'}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                  Plaintext Secure Payload (Private details)
                </label>
                <textarea
                  placeholder="Enter private passwords, keys, or decrees. Encrypted locally."
                  value={plainTextPayload}
                  onChange={(e) => setPlainTextPayload(e.target.value)}
                  rows={3}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#2563eb] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                  Passphrase Key (Synthesized client-side)
                </label>
                <input
                  type="password"
                  placeholder="Passphrase used to encrypt payload"
                  value={newAssetPassphrase}
                  onChange={(e) => setNewAssetPassphrase(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#2563eb] font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#cbd5e1] hover:bg-slate-50 text-xs font-bold rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={encrypting}
                  className="px-4 py-2 bg-[#0d9488] text-white hover:bg-[#0f766e] text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  {encrypting ? 'Encrypting...' : 'Encrypt Payload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
