import { useEffect, useState } from 'react'
import { ThumbsUp } from 'lucide-react'

function Marketplace() {
  const [projects, setProjects] = useState([])
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    try {
      const [pRes, mRes] = await Promise.all([
        fetch(`${baseUrl}/api/projects`),
        fetch(`${baseUrl}/api/memes`),
      ])
      const [pData, mData] = await Promise.all([pRes.json(), mRes.json()])
      setProjects(pData)
      setMemes(mData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const upvote = async (id) => {
    try {
      await fetch(`${baseUrl}/api/memes/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meme_id: id }),
      })
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p]))

  return (
    <section id="market" className="py-14">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending Memes</h2>
            <p className="text-gray-500">Upvote and reward creators with tokens.</p>
          </div>
          <button onClick={load} className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white">Refresh</button>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map(m => {
              const proj = projectMap[m.project_id] || {}
              return (
                <div key={m.id} className="bg-white rounded-xl shadow overflow-hidden">
                  <img src={m.image_url} alt={m.title} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {proj.logo_url && <img src={proj.logo_url} alt={proj.name} className="h-6 w-6 rounded" />}
                      <span className="text-xs px-2 py-1 rounded bg-gray-100">{proj.name || 'Unknown'} {proj.token_symbol ? `(${proj.token_symbol})` : ''}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{m.title}</h3>
                    <p className="text-gray-500 text-sm">By {m.creator_name || 'anon'}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <button onClick={() => upvote(m.id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white">
                        <ThumbsUp size={16} /> Upvote
                      </button>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{m.upvotes || 0}</span> upvotes · <span className="font-semibold">{m.tokens_earned || 0}</span> tokens
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Marketplace
