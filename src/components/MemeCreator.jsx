import { useEffect, useMemo, useRef, useState } from 'react'

function MemeCreator({ projects, onCreated }) {
  const [selected, setSelected] = useState('')
  const [top, setTop] = useState('')
  const [bottom, setBottom] = useState('')
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [creator, setCreator] = useState('')
  const [wallet, setWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canvasRef = useRef(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  // Draw preview when inputs change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const src = imageUrl || 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop'
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      canvas.width = 800
      canvas.height = 800
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.font = 'bold 48px Impact, Arial Black, sans-serif'
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 6
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      // Top text
      const topText = top.toUpperCase()
      ctx.strokeText(topText, canvas.width / 2, 20)
      ctx.fillText(topText, canvas.width / 2, 20)
      // Bottom text
      ctx.textBaseline = 'bottom'
      const bottomText = bottom.toUpperCase()
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20)
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20)
    }
  }, [top, bottom, imageUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected) { setError('Select a project'); return }
    setLoading(true)
    setError('')
    try {
      // Export canvas to data URL and upload to a free image host alternative could be complex.
      // For simplicity we will send the preview data URL directly; backend expects an image_url (HttpUrl)
      // so we instead store the provided imageUrl for now.
      const res = await fetch(`${baseUrl}/api/memes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: selected,
          title,
          image_url: imageUrl || 'https://picsum.photos/800',
          top_text: top || null,
          bottom_text: bottom || null,
          creator_name: creator || null,
          creator_wallet: wallet || null,
        })
      })
      if (!res.ok) throw new Error('Failed to create meme')
      const data = await res.json()
      onCreated && onCreated(data.id)
      setTitle(''); setTop(''); setBottom(''); setImageUrl(''); setCreator(''); setWallet('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="create" className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-3">
        <h3 className="font-semibold text-gray-800">Create a Meme</h3>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <select value={selected} onChange={(e)=>setSelected(e.target.value)} className="w-full border rounded-lg px-3 py-2" required>
          <option value="">Select project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.token_symbol})</option>
          ))}
        </select>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Meme title" className="w-full border rounded-lg px-3 py-2" required />
        <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="Background image URL" className="w-full border rounded-lg px-3 py-2" />
        <div className="grid grid-cols-2 gap-3">
          <input value={top} onChange={(e)=>setTop(e.target.value)} placeholder="Top text" className="w-full border rounded-lg px-3 py-2" />
          <input value={bottom} onChange={(e)=>setBottom(e.target.value)} placeholder="Bottom text" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <input value={creator} onChange={(e)=>setCreator(e.target.value)} placeholder="Your name (optional)" className="w-full border rounded-lg px-3 py-2" />
        <input value={wallet} onChange={(e)=>setWallet(e.target.value)} placeholder="Wallet address (optional)" className="w-full border rounded-lg px-3 py-2" />
        <button disabled={loading} className="w-full bg-black text-white rounded-lg py-2 font-semibold hover:opacity-90 disabled:opacity-50">{loading? 'Publishing...' : 'Publish Meme'}</button>
      </form>

      <div className="bg-white p-4 rounded-xl shadow flex flex-col">
        <h3 className="font-semibold text-gray-800 mb-3">Live Preview</h3>
        <canvas ref={canvasRef} className="w-full aspect-square rounded-lg border" />
        <p className="text-xs text-gray-500 mt-2">Note: For demo, we store the background URL and captions server-side.</p>
      </div>
    </div>
  )
}

export default MemeCreator
