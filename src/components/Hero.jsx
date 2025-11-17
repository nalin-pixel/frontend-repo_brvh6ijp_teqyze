import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live crypto vibes
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Create memes for crypto projects and earn tokens
            </h1>
            <p className="mt-4 text-white/80 md:text-lg">
              Design viral memes, tag the project, and get rewarded every time the community upvotes your creation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#create" className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold shadow hover:shadow-lg transition">Start Creating</a>
              <a href="#market" className="bg-white/10 text-white px-5 py-2.5 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition">Explore Memes</a>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
    </section>
  )
}

export default Hero
