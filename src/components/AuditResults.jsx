import React from 'react';

export default function AuditResults({ auditResult, onBack }) {
  const {
    recommendations = [],
    totalMonthlySavings = 0,
    totalAnnualSavings = 0,
    hasSignificantSavings = false,
  } = auditResult || {};

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 text-zinc-100 font-sans">
      {/* Back button */}
      <div className="mb-12">
        <button
          onClick={onBack}
          className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
        >
          ← Back to input
        </button>
      </div>

      {/* Top section: Numbers as Hero */}
      <div className="mb-16">
        {totalMonthlySavings > 0 ? (
          <div className="flex flex-col md:flex-row md:items-baseline gap-x-20 gap-y-8">
            <div>
              <div className="text-6xl md:text-7xl font-bold text-white tracking-tight leading-none">
                ${totalMonthlySavings}
              </div>
              <div className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">
                saved per month
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-zinc-300 tracking-tight leading-none">
                ${totalAnnualSavings}
              </div>
              <div className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">
                saved per year
              </div>
            </div>
          </div>
        ) : (
          <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Your stack looks optimized.
          </div>
        )}
      </div>

      {/* Horizontal divider */}
      <hr className="border-t border-zinc-800 my-12" />

      {/* Recommendations List */}
      <div className="mb-16">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8">
          Recommendations
        </h3>
        <div className="space-y-8">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="pb-8 border-b border-zinc-900 last:border-none last:pb-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                {/* Recommendation Detail Row */}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-semibold text-white text-base">
                    {rec.toolName}
                  </span>
                  <span className="text-sm text-zinc-500 font-mono">
                    (${rec.currentSpend}/mo)
                  </span>
                  <span className="text-zinc-700 text-sm px-1 font-mono">→</span>
                  <span className="text-zinc-200 text-sm">
                    {rec.recommendedAction}
                  </span>
                </div>

                {/* Savings / Status */}
                <div className="shrink-0 text-left sm:text-right">
                  {rec.isOptimal ? (
                    <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                      Optimal ✓
                    </span>
                  ) : (
                    <span className="text-sm text-emerald-400 font-semibold">
                      Save ${rec.savings}/mo
                    </span>
                  )}
                </div>
              </div>

              {/* Explanatory/Reason Text */}
              {rec.reason && (
                <div className="text-xs text-zinc-500 italic mt-2 max-w-3xl leading-relaxed">
                  {rec.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal divider before bottom section if there are actions */}
      <hr className="border-t border-zinc-800 my-12" />

      {/* Bottom section */}
      <div className="mt-12">
        {hasSignificantSavings ? (
          <div className="border border-zinc-800 p-6 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="text-sm text-zinc-300 max-w-xl leading-relaxed">
              Credex offers discounted AI credits for teams spending over $500/month. Book a free 20-minute call.
            </div>
            <button
              onClick={() => window.open('https://credex.io', '_blank')}
              className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2.5 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              Book Call
            </button>
          </div>
        ) : totalMonthlySavings < 100 ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              We'll notify you when new optimizations apply to your stack.
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Subscription successful.');
              }}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="bg-zinc-950 border border-zinc-850 text-zinc-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-zinc-700 w-48 transition-colors"
              />
              <button
                type="submit"
                className="bg-zinc-905 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded transition-colors cursor-pointer"
              >
                Notify Me
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
