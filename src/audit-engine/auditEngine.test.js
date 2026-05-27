import { runAudit } from './recommendations';
import { describe, it, expect } from 'vitest';

describe('Audit Engine tests', () => {
  it('flags Business plan overkill for 2 users on Cursor', () => {
    const result = runAudit(
      [{ toolId: 'cursor', planId: 'business', seats: 2, monthlySpend: 80 }],
      2,
      'coding'
    );
    expect(result.recommendations[0].isOptimal).toBe(false);
    expect(result.recommendations[0].savings).toBe(40);
  });

  it('flags Enterprise overkill for 5 users on Claude', () => {
    const result = runAudit(
      [{ toolId: 'claude', planId: 'enterprise', seats: 5, monthlySpend: 300 }],
      5,
      'coding'
    );
    expect(result.recommendations[0].isOptimal).toBe(false);
    expect(result.recommendations[0].savings).toBeGreaterThan(0);
  });

  it('returns optimal for Cursor Pro 1 user', () => {
    const result = runAudit(
      [{ toolId: 'cursor', planId: 'pro', seats: 1, monthlySpend: 20 }],
      1,
      'coding'
    );
    expect(result.recommendations[0].isOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBe(0);
  });

  it('flags redundant overlap for ChatGPT and Claude same use case', () => {
    const result = runAudit(
      [
        { toolId: 'chatgpt', planId: 'plus', seats: 1, monthlySpend: 20 },
        { toolId: 'claude', planId: 'pro', seats: 1, monthlySpend: 20 }
      ],
      1,
      'mixed'
    );
    const redundancyRec = result.recommendations.find(r => r.toolId === 'redundancy');
    expect(redundancyRec).toBeDefined();
  });

  it('calculates correct total monthly and annual savings', () => {
    const result = runAudit(
      [{ toolId: 'cursor', planId: 'business', seats: 2, monthlySpend: 80 }],
      2,
      'coding'
    );
    expect(result.totalMonthlySavings).toBe(40);
    expect(result.totalAnnualSavings).toBe(480);
  });
});
