import { PRICING } from './pricing.js';

export function checkPlanOverkill(toolId, planId, seats, teamSize) {
  const tool = PRICING[toolId];
  if (!tool) return null;

  const numSeats = Number(seats) || 0;

  // 1. Business/Team plan overkill for 1-2 users
  const isBusinessTeam = ['business', 'team', 'teams'].includes(planId);
  if (isBusinessTeam && numSeats <= 2) {
    let targetPlanId = null;
    if (toolId === 'cursor') targetPlanId = 'pro';
    else if (toolId === 'githubCopilot') targetPlanId = 'individual';
    else if (toolId === 'claude') targetPlanId = 'pro';
    else if (toolId === 'chatgpt') targetPlanId = 'plus';
    else if (toolId === 'windsurf') targetPlanId = 'pro';

    if (targetPlanId) {
      const currentPlan = tool.plans[planId];
      const targetPlan = tool.plans[targetPlanId];
      if (currentPlan && targetPlan) {
        const priceDiff = currentPlan.pricePerSeat - targetPlan.pricePerSeat;
        const savings = priceDiff * numSeats;
        if (savings > 0) {
          return {
            recommendedAction: `Downgrade to ${targetPlan.name}`,
            savings,
            reason: `Paying for ${currentPlan.name} is overkill for only ${numSeats} seat${numSeats > 1 ? 's' : ''}. Downgrade to ${targetPlan.name}.`
          };
        }
      }
    }
  }

  // 2. Enterprise overkill for fewer than 10 users
  if (planId === 'enterprise' && numSeats < 10) {
    let targetPlanId = null;
    if (toolId === 'cursor') targetPlanId = 'business';
    else if (toolId === 'githubCopilot') targetPlanId = 'business';
    else if (toolId === 'claude') targetPlanId = 'team';
    else if (toolId === 'chatgpt') targetPlanId = 'team';

    if (targetPlanId) {
      const currentPlan = tool.plans[planId];
      const targetPlan = tool.plans[targetPlanId];
      if (currentPlan && targetPlan) {
        const priceDiff = currentPlan.pricePerSeat - targetPlan.pricePerSeat;
        const savings = priceDiff * numSeats;
        if (savings > 0) {
          return {
            recommendedAction: `Downgrade to ${targetPlan.name}`,
            savings,
            reason: `Enterprise plan is unnecessary for teams under 10. Downgrade to ${targetPlan.name}.`
          };
        }
      }
    }
  }

  return null;
}

export function checkCheaperSameVendor(toolId, planId, seats) {
  const tool = PRICING[toolId];
  if (!tool) return null;

  const currentPlan = tool.plans[planId];
  if (!currentPlan) return null;

  const currentPrice = currentPlan.pricePerSeat;
  const numSeats = Number(seats) || 0;
  const isTeamSize = numSeats > 2;

  let bestTargetPlanId = null;
  let lowestPrice = currentPrice;

  for (const [id, plan] of Object.entries(tool.plans)) {
    if (id === planId) continue;

    // Filter out individual plans for larger teams
    if (isTeamSize) {
      const isIndividualOnly =
        plan.pricePerSeat === 0 ||
        (toolId === 'cursor' && id === 'pro') ||
        (toolId === 'githubCopilot' && id === 'individual') ||
        (toolId === 'claude' && id === 'pro') ||
        (toolId === 'claude' && id === 'max') ||
        (toolId === 'chatgpt' && id === 'plus') ||
        (toolId === 'windsurf' && id === 'pro');

      if (isIndividualOnly) continue;
    } else {
      // For exactly 2 seats, avoid free single-user tiers
      if (numSeats === 2 && plan.pricePerSeat === 0) continue;
    }

    if (plan.pricePerSeat < lowestPrice) {
      lowestPrice = plan.pricePerSeat;
      bestTargetPlanId = id;
    }
  }

  if (bestTargetPlanId) {
    const targetPlan = tool.plans[bestTargetPlanId];
    const savings = (currentPrice - targetPlan.pricePerSeat) * numSeats;
    if (savings > 0) {
      return {
        recommendedAction: `Switch to ${targetPlan.name}`,
        savings,
        reason: `Switching to ${targetPlan.name} from ${currentPlan.name} saves $${currentPrice - targetPlan.pricePerSeat}/seat per month.`
      };
    }
  }

  return null;
}

export function checkRedundantOverlap(allTools, useCase) {
  if (!allTools || !Array.isArray(allTools)) return null;

  const chatgptEntry = allTools.find(t => t.toolId === 'chatgpt');
  const claudeEntry = allTools.find(t => t.toolId === 'claude');

  if (chatgptEntry && claudeEntry) {
    const getMonthlySpend = (entry) => {
      if (entry.monthlySpend !== undefined && entry.monthlySpend !== null && entry.monthlySpend !== '') {
        return Number(entry.monthlySpend) || 0;
      }
      const tool = PRICING[entry.toolId];
      const plan = tool?.plans[entry.planId];
      return (plan?.pricePerSeat || 0) * (Number(entry.seats) || 0);
    };

    const chatgptSpend = getMonthlySpend(chatgptEntry);
    const claudeSpend = getMonthlySpend(claudeEntry);
    const savings = Math.min(chatgptSpend, claudeSpend);

    if (savings > 0) {
      const displayUseCase = useCase ? `for ${useCase}` : 'for the same use case';
      return {
        recommendedAction: 'Consolidate ChatGPT & Claude',
        savings,
        reason: `Paying for both ChatGPT and Claude ${displayUseCase} is redundant. Consolidating onto one tool saves $${savings}/month.`
      };
    }
  }

  return null;
}
