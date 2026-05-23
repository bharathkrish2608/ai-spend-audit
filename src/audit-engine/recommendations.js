import { PRICING } from './pricing.js';
import { checkPlanOverkill, checkCheaperSameVendor, checkRedundantOverlap } from './rules.js';
import { calculateAnnualSavings } from './calculators.js';

export function runAudit(tools, teamSize, useCase) {
  if (!tools || !Array.isArray(tools)) {
    return {
      recommendations: [],
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
      hasSignificantSavings: false
    };
  }

  const recommendations = [];

  // 1. Process individual tools
  for (const t of tools) {
    const toolConfig = PRICING[t.toolId];
    const toolName = toolConfig?.name || t.toolId;

    // Calculate current spend for the tool
    let currentSpend = 0;
    if (t.monthlySpend !== undefined && t.monthlySpend !== null && t.monthlySpend !== '') {
      currentSpend = Number(t.monthlySpend) || 0;
    } else {
      const plan = toolConfig?.plans[t.planId];
      currentSpend = (plan?.pricePerSeat || 0) * (Number(t.seats) || 0);
    }

    const overkill = checkPlanOverkill(t.toolId, t.planId, t.seats, teamSize);
    const cheaperSame = checkCheaperSameVendor(t.toolId, t.planId, t.seats);

    let bestRecommendation = null;
    if (overkill && cheaperSame) {
      bestRecommendation = overkill.savings >= cheaperSame.savings ? overkill : cheaperSame;
    } else if (overkill) {
      bestRecommendation = overkill;
    } else if (cheaperSame) {
      bestRecommendation = cheaperSame;
    }

    if (bestRecommendation) {
      recommendations.push({
        toolId: t.toolId,
        toolName,
        currentSpend,
        recommendedAction: bestRecommendation.recommendedAction,
        savings: bestRecommendation.savings,
        reason: bestRecommendation.reason,
        isOptimal: false
      });
    } else {
      recommendations.push({
        toolId: t.toolId,
        toolName,
        currentSpend,
        recommendedAction: 'No changes needed',
        savings: 0,
        reason: 'You are on the right plan for your team size.',
        isOptimal: true
      });
    }
  }

  // 2. Process multi-tool redundancy overlap
  const redundancy = checkRedundantOverlap(tools, useCase);
  if (redundancy) {
    recommendations.push({
      toolId: 'redundancy',
      toolName: 'Tool Redundancy',
      currentSpend: 0,
      recommendedAction: redundancy.recommendedAction,
      savings: redundancy.savings,
      reason: redundancy.reason,
      isOptimal: false
    });
  }

  // 3. Calculate totals
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.savings, 0);
  const totalAnnualSavings = calculateAnnualSavings(totalMonthlySavings);
  const hasSignificantSavings = totalMonthlySavings > 500;

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    hasSignificantSavings
  };
}
