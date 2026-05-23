import './App.css'

function App() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400 mb-4">
            AI Spend Optimization
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Stop overpaying for AI tools.
          </h1>

          <p className="text-zinc-400 text-lg mt-6 max-w-2xl leading-relaxed">
            Audit your AI stack instantly. Discover unnecessary spend,
            downgrade opportunities, and lower-cost alternatives for your team.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition">
              Start Free Audit
            </button>

            <button className="border border-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-900 transition">
              View Example Report
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App