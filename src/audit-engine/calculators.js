import { PRICING } from './pricing.js';

export function calculateCurrentSpend(toolId, planId, seats) {
  const tool = PRICING[toolId];
  const plan = tool?.plans[planId];
  if (!plan) return 0;

  const price = plan.pricePerSeat;
  if (price === undefined || price === null) return 0;

  const numSeats = Number(seats) || 0;
  return numSeats * price;
}

export function calculateTotalSpend(toolsArray) {
  if (!toolsArray || !Array.isArray(toolsArray)) return 0;
  return toolsArray.reduce((sum, tool) => {
    const spend = Number(tool?.monthlySpend) || 0;
    return sum + spend;
  }, 0);
}

export function calculateAnnualSavings(monthlySavings) {
  const savings = Number(monthlySavings) || 0;
  return savings * 12;
}
