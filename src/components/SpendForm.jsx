import { useState, useEffect } from 'react';
import { PRICING } from '../audit-engine/pricing';

export default function SpendForm({ onSubmit }) {
  // Helper to generate a default tool entry based on pricing config
  const getDefaultToolEntry = (toolId) => {
    const plans = PRICING[toolId].plans;
    const planKeys = Object.keys(plans);
    // Default to 'pro' or 'plus' if they exist, otherwise the first option
    let planId = planKeys[0];
    if (planKeys.includes('pro')) {
      planId = 'pro';
    } else if (planKeys.includes('plus')) {
      planId = 'plus';
    }
    
    const seats = 1;
    const pricePerSeat = plans[planId].pricePerSeat;
    
    return {
      toolId,
      planId,
      seats,
      monthlySpend: seats * pricePerSeat,
    };
  };

  // State initialization with localStorage fallback
  const [teamSize, setTeamSize] = useState(() => {
    const saved = localStorage.getItem('ai_audit_form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize && parsed.teamSize >= 1) return parsed.teamSize;
      } catch (e) {
        console.error('Failed to parse saved teamSize', e);
      }
    }
    return 1;
  });

  const [useCase, setUseCase] = useState(() => {
    const saved = localStorage.getItem('ai_audit_form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.useCase) return parsed.useCase;
      } catch (e) {
        console.error('Failed to parse saved useCase', e);
      }
    }
    return 'coding';
  });

  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('ai_audit_form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tools && Array.isArray(parsed.tools) && parsed.tools.length > 0) {
          return parsed.tools;
        }
      } catch (e) {
        console.error('Failed to parse saved tools list', e);
      }
    }
    // Default to having Cursor preselected
    return [getDefaultToolEntry('cursor')];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(
      'ai_audit_form',
      JSON.stringify({ tools, teamSize, useCase })
    );
  }, [tools, teamSize, useCase]);

  // Handler for tool selection change
  const handleToolIdChange = (index, newToolId) => {
    const plans = PRICING[newToolId].plans;
    const planKeys = Object.keys(plans);
    // Select default plan key
    let newPlanId = planKeys[0];
    if (planKeys.includes('pro')) {
      newPlanId = 'pro';
    } else if (planKeys.includes('plus')) {
      newPlanId = 'plus';
    }

    const pricePerSeat = plans[newPlanId].pricePerSeat;

    setTools((prev) =>
      prev.map((tool, idx) => {
        if (idx === index) {
          const seats = parseInt(tool.seats, 10) || 1;
          return {
            ...tool,
            toolId: newToolId,
            planId: newPlanId,
            seats: seats,
            monthlySpend: seats * pricePerSeat,
          };
        }
        return tool;
      })
    );
  };

  // Handler for plan change
  const handlePlanIdChange = (index, newPlanId) => {
    setTools((prev) =>
      prev.map((tool, idx) => {
        if (idx === index) {
          const pricePerSeat = PRICING[tool.toolId].plans[newPlanId].pricePerSeat;
          const seats = parseInt(tool.seats, 10) || 1;
          return {
            ...tool,
            planId: newPlanId,
            seats: seats,
            monthlySpend: seats * pricePerSeat,
          };
        }
        return tool;
      })
    );
  };

  // Handler for seats change
  const handleSeatsChange = (index, newSeats) => {
    setTools((prev) =>
      prev.map((tool, idx) => {
        if (idx === index) {
          const pricePerSeat = PRICING[tool.toolId].plans[tool.planId].pricePerSeat;
          if (newSeats === '') {
            return {
              ...tool,
              seats: '',
              monthlySpend: '',
            };
          }
          const parsed = parseInt(newSeats, 10);
          const seatsVal = isNaN(parsed) ? '' : parsed;
          return {
            ...tool,
            seats: seatsVal,
            monthlySpend: seatsVal !== '' ? seatsVal * pricePerSeat : '',
          };
        }
        return tool;
      })
    );
  };

  const handleSeatsBlur = (index) => {
    setTools((prev) =>
      prev.map((tool, idx) => {
        if (idx === index) {
          const parsed = parseInt(tool.seats, 10);
          const seatsVal = isNaN(parsed) || parsed < 1 ? 1 : parsed;
          const pricePerSeat = PRICING[tool.toolId].plans[tool.planId].pricePerSeat;
          return {
            ...tool,
            seats: seatsVal,
            monthlySpend: seatsVal * pricePerSeat,
          };
        }
        return tool;
      })
    );
  };

  // Handler for monthly spend override
  const handleMonthlySpendChange = (index, newSpend) => {
    setTools((prev) =>
      prev.map((tool, idx) => {
        if (idx === index) {
          if (newSpend === '') {
            return {
              ...tool,
              monthlySpend: '',
            };
          }
          const parsed = parseFloat(newSpend);
          const spendVal = isNaN(parsed) ? '' : Math.max(0, parsed);
          return {
            ...tool,
            monthlySpend: spendVal,
          };
        }
        return tool;
      })
    );
  };

  const handleMonthlySpendBlur = (index) => {
    setTools((prev) =>
      prev.map((tool, idx) => {
        if (idx === index) {
          const parsed = parseFloat(tool.monthlySpend);
          const pricePerSeat = PRICING[tool.toolId].plans[tool.planId].pricePerSeat;
          const seats = parseInt(tool.seats, 10) || 1;
          const spendVal = isNaN(parsed) || parsed < 0 ? seats * pricePerSeat : parsed;
          return {
            ...tool,
            monthlySpend: spendVal,
          };
        }
        return tool;
      })
    );
  };

  // Add a new tool to the list
  const addTool = () => {
    // Find a tool not already added, or default to cursor
    const activeToolIds = tools.map((t) => t.toolId);
    const availableToolIds = Object.keys(PRICING);
    const nextToolId = availableToolIds.find((id) => !activeToolIds.includes(id)) || 'cursor';

    setTools((prev) => [...prev, getDefaultToolEntry(nextToolId)]);
  };

  // Remove a tool from the list
  const removeTool = (index) => {
    if (tools.length <= 1) return;
    setTools((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedTools = tools.map((tool) => {
      const seats = parseInt(tool.seats, 10) || 1;
      const pricePerSeat = PRICING[tool.toolId].plans[tool.planId].pricePerSeat;
      const monthlySpend = tool.monthlySpend === '' ? seats * pricePerSeat : (parseFloat(tool.monthlySpend) || 0);
      return {
        ...tool,
        seats,
        monthlySpend,
      };
    });

    onSubmit({
      tools: sanitizedTools,
      teamSize: parseInt(teamSize, 10) || 1,
      useCase,
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl max-w-4xl mx-auto shadow-xl">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Audit Your AI Spend</h2>
        <p className="text-zinc-400 text-sm">
          Enter your team configuration and deployed software licenses to find cost-saving recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Row 1: Team details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="teamSize" className="text-sm font-medium text-zinc-300">
              Team Size
            </label>
            <input
              type="number"
              id="teamSize"
              min="1"
              value={teamSize}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setTeamSize('');
                } else {
                  const parsed = parseInt(val, 10);
                  setTeamSize(isNaN(parsed) ? '' : parsed);
                }
              }}
              onBlur={() => {
                if (teamSize === '' || teamSize < 1) {
                  setTeamSize(1);
                }
              }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
              placeholder="e.g. 10"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="useCase" className="text-sm font-medium text-zinc-300">
              Primary Use Case
            </label>
            <select
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="coding" className="bg-zinc-900 text-zinc-100">Coding / Software Engineering</option>
              <option value="writing" className="bg-zinc-900 text-zinc-100">Writing / Content Creation</option>
              <option value="research" className="bg-zinc-900 text-zinc-100">Research & Analysis</option>
              <option value="data" className="bg-zinc-900 text-zinc-100">Data Science & Analytics</option>
              <option value="mixed" className="bg-zinc-900 text-zinc-100">Mixed / General Use</option>
            </select>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-200">Deployed AI Tools</h3>
            <span className="text-xs text-zinc-500 font-mono">{tools.length} tool(s) registered</span>
          </div>

          {/* List of tool rows */}
          <div className="space-y-4">
            {tools.map((tool, index) => {
              const currentPricing = PRICING[tool.toolId];
              const planOptions = Object.entries(currentPricing.plans);

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl transition-all duration-200 hover:border-zinc-800"
                >
                  {/* Tool selection */}
                  <div className="flex flex-col gap-2 md:col-span-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Tool
                    </label>
                    <select
                      value={tool.toolId}
                      onChange={(e) => handleToolIdChange(index, e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer w-full"
                    >
                      {Object.entries(PRICING).map(([id, details]) => (
                        <option key={id} value={id} className="bg-zinc-900 text-zinc-100">
                          {details.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plan selection */}
                  <div className="flex flex-col gap-2 md:col-span-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Plan
                    </label>
                    <select
                      value={tool.planId}
                      onChange={(e) => handlePlanIdChange(index, e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer w-full"
                    >
                      {planOptions.map(([planKey, planVal]) => (
                        <option key={planKey} value={planKey} className="bg-zinc-900 text-zinc-100">
                          {planVal.name} (${planVal.pricePerSeat}/seat)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Seats input */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Seats
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) => handleSeatsChange(index, e.target.value)}
                      onBlur={() => handleSeatsBlur(index)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full"
                      required
                    />
                  </div>

                  {/* Monthly Spend override */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Monthly Spend ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={tool.monthlySpend}
                      onChange={(e) => handleMonthlySpendChange(index, e.target.value)}
                      onBlur={() => handleMonthlySpendBlur(index)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full font-mono text-emerald-400"
                      required
                    />
                  </div>

                  {/* Remove action */}
                  {tools.length > 1 && (
                    <div className="flex justify-end md:justify-center md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeTool(index)}
                        className="text-zinc-500 hover:text-red-400 hover:bg-zinc-900 p-2 rounded-lg transition-all duration-200"
                        title="Remove tool"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.24 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add tool button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={addTool}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 py-3 rounded-xl transition-all duration-200 font-medium cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add another tool
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button

            type="submit"
            className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-zinc-950 font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Analyze Spend & Find Savings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
