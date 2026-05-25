import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import SpendForm from './components/SpendForm';
import AuditResults from './components/AuditResults'; // still imported for potential internal use
import LeadCapture from './components/LeadCapture';
import { runAudit } from './audit-engine/recommendations';
import { saveAudit, getAudit } from './services/supabase';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { generateSummary } from './services/anthropic';

function Home() {
  const navigate = useNavigate();
  return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <section className="max-w-6xl mx-auto px-6 py-24">
    <div className="max-w-2xl mx-auto flex flex-col gap-6 text-center">
    <p className="text-3xl uppercase tracking-[0.2em] text-zinc-300 mb-2 font-bold hover-mid-underline">AI Spend Optimization</p>
    <h1 className="text-5xl md:text-7xl font-bold leading-tight hover-mid-underline">Stop overpaying for AI tools.</h1>
    <p className="text-zinc-400 text-lg mt-6 leading-relaxed hover-mid-underline">
      Audit your AI stack instantly. Discover unnecessary spend,
      downgrade opportunities, and lower-cost alternatives for your team.
    </p>
            <div className="mt-10">
              <button
                onClick={() => navigate('/audit')}
                className="bg-[var(--brand-green)] text-white px-6 py-3 rounded-xl font-medium hover:bg-[var(--brand-green-hover)] transition"
              >
                Start Free Audit
              </button>
            </div>
            <div className="mt-12 text-sm text-zinc-500 space-y-2">
              <p className="text-zinc-400 font-medium">How it works</p>
              <p>1. Enter your AI tools and current plans</p>
              <p>2. Get an instant audit of your spend</p>
              <p>3. See exactly where you can save</p>
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
      const summary = await generateSummary(result.recommendations, result.totalMonthlySavings, useCase, teamSize);
      const id = await saveAudit({
        tools_data: tools,
        team_size: teamSize,
        use_case: useCase,
        recommendations: result.recommendations,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        ai_summary: summary,
      });
      navigate(`/audit/${id}`, { state: { summary } });
    } catch (e) {
      console.error('Failed to save audit', e);
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
  const location = useLocation();
  const summary = location.state?.summary;
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchAudit() {
      try {
        const data = await getAudit(id);
        if (data) {
          const result = {
            recommendations: data.recommendations,
            totalMonthlySavings: data.total_monthly_savings,
            totalAnnualSavings: data.total_annual_savings,
            hasSignificantSavings: data.total_monthly_savings > 500,
          };
          setAuditResult(result);
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading...</div>
    );
  }

  if (notFound || !auditResult) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-white text-sm mb-8 block cursor-pointer"
          >
            ← Back
          </button>
          <div className="text-center text-2xl">Audit not found.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-zinc-400 hover:text-white text-sm mb-8 block cursor-pointer"
        >
          ← Back
        </button>
        {auditResult && (
          <Helmet>
            <meta property="og:title" content={`I could save $${auditResult.totalMonthlySavings}/month on AI tools`} />
            <meta property="og:description" content={`${auditResult.recommendations[0]?.recommendedAction || ''} ${auditResult.recommendations[0]?.reason || ''}`} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={`I could save $${auditResult.totalMonthlySavings}/month on AI tools`} />
            <meta name="twitter:description" content={`${auditResult.recommendations[0]?.recommendedAction || ''} ${auditResult.recommendations[0]?.reason || ''}`} />
          </Helmet>
        )}
        <AuditResults auditResult={auditResult} summary={summary} onBack={() => navigate(-1)} />
        <LeadCapture auditId={id} totalMonthlySavings={auditResult.totalMonthlySavings} />
      </div>
    </main>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/audit/:id" element={<PublicResult />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;