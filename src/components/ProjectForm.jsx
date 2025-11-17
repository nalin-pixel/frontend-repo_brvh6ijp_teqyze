import { useState } from 'react'

function ProjectForm({ onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          token_symbol: tokenSymbol,
          logo_url: logoUrl || null,
        })
      })
      if (!res.ok) throw new Error('Failed to create project')
      const data = await res.json()
      onCreated && onCreated({ id: data.id, name, token_symbol: tokenSymbol, logo_url: logoUrl })
      setName(''); setDescription(''); setTokenSymbol(''); setLogoUrl('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-xl shadow space-y-3">
      <h3 className="font-semibold text-gray-800">List a Crypto Project</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Project name" className="w-full border rounded-lg px-3 py-2" required />
      <input value={tokenSymbol} onChange={(e)=>setTokenSymbol(e.target.value)} placeholder="Token symbol (e.g., SOL)" className="w-full border rounded-lg px-3 py-2" required />
      <input value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="Logo URL (optional)" className="w-full border rounded-lg px-3 py-2" />
      <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short description" className="w-full border rounded-lg px-3 py-2" />
      <button disabled={loading} className="w-full bg-black text-white rounded-lg py-2 font-semibold hover:opacity-90 disabled:opacity-50">{loading? 'Creating...' : 'Create Project'}</button>
    </form>
  )
}

export default ProjectForm
