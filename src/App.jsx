import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import SpendForm from './components/SpendForm';
import AuditResults from './components/AuditResults'; // still imported for potential internal use
import { runAudit } from './audit-engine/recommendations';
import { saveAudit } from './services/supabase';

function Home() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400 mb-4">AI Spend Optimization</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">Stop overpaying for AI tools.</h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl leading-relaxed">
            Audit your AI stack instantly. Discover unnecessary spend,
            downgrade opportunities, and lower-cost alternatives for your team.
          </p>
          <div className="mt-10 flex gap-4">
            <button
              onClick={() => navigate('/audit')}
              className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Start Free Audit
            </button>
            <button className="border border-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-900 transition">
              View Example Report
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Audit() {
  const navigate = useNavigate();
  const [auditResult, setAuditResult] = useState(null);

  async function handleAuditSubmit({ tools, teamSize, useCase }) {
    const result = runAudit(tools, teamSize, useCase);
    setAuditResult(result);
    try {
      const id = await saveAudit({
        tools_data: tools,
        team_size: teamSize,
        use_case: useCase,
        recommendations: result.recommendations,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
      });
      // Navigate to public result page with the saved audit id
      navigate(`/audit/${id}`);
    } catch (e) {
      console.error('Failed to save audit', e);
      // Still navigate to a result page (could be internal) using a fallback id
      navigate('/audit/result');
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('..')}
          className="text-zinc-400 hover:text-white text-sm mb-8 block cursor-pointer"
        >
          ← Back
        </button>
        <SpendForm onSubmit={handleAuditSubmit} />
      </div>
    </main>
  );
}

function PublicResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-zinc-400 hover:text-white text-sm mb-8 block cursor-pointer"
        >
          ← Back
        </button>
        <div className="text-center text-2xl">Public Result – Audit ID: {id}</div>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/audit/:id" element={<PublicResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;