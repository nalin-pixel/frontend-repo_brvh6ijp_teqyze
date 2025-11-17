import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import ProjectForm from './components/ProjectForm'
import MemeCreator from './components/MemeCreator'
import Marketplace from './components/Marketplace'

function App() {
  const [projects, setProjects] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadProjects = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/projects`)
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { loadProjects() }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Hero />

      <section className="-mt-12 relative z-20">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-6">
            <ProjectForm onCreated={loadProjects} />
            <MemeCreator projects={projects} onCreated={() => {}} />
          </div>
        </div>
      </section>

      <Marketplace />

      <footer className="py-10 text-center text-sm text-gray-500">
        Built for creators. Tip: set VITE_BACKEND_URL to connect your API.
      </footer>
    </div>
  )
}

export default App
