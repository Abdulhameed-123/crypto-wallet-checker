import type { WalletMetrics, RiskFlag, ScoreBreakdown, WalletScore } from '@/types';
import { SCORE_WEIGHTS } from '@/config';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function computeScore(metrics: WalletMetrics, riskFlags: RiskFlag[]): WalletScore {
  const { longevity: wL, activity: wA, diversity: wD, consistency: wC, riskDeduction: wR } = SCORE_WEIGHTS;

  let longevity = 0;
  if (metrics.age.days >= 365) longevity = wL;
  else if (metrics.age.days >= 180) longevity = wL * 0.8;
  else if (metrics.age.days >= 90) longevity = wL * 0.6;
  else if (metrics.age.days >= 30) longevity = wL * 0.4;
  else if (metrics.age.days >= 7) longevity = wL * 0.2;
  else longevity = metrics.age.days > 0 ? wL * 0.1 : 0;

  let activity = 0;
  if (metrics.activity.totalTxs >= 500) activity = wA;
  else if (metrics.activity.totalTxs >= 100) activity = wA * 0.8;
  else if (metrics.activity.totalTxs >= 50) activity = wA * 0.6;
  else if (metrics.activity.totalTxs >= 10) activity = wA * 0.4;
  else if (metrics.activity.totalTxs > 0) activity = wA * 0.15;

  if (metrics.activity.avgTxsPerMonth >= 10) activity = Math.min(activity + 3, wA);

  let diversity = 0;
  const tokenScore = Math.min(metrics.tokens.count * 2, 10);
  const contractScore = Math.min(metrics.contracts.uniqueInteracted * 1.5, 10);
  diversity = Math.min(tokenScore + contractScore, wD);

  let consistency = 0;
  if (metrics.activity.totalMonths > 0) {
    const ratio = metrics.activity.activeMonths / metrics.activity.totalMonths;
    if (ratio >= 0.8) consistency = wC;
    else if (ratio >= 0.5) consistency = wC * 0.7;
    else if (ratio >= 0.2) consistency = wC * 0.4;
    else consistency = wC * 0.15;
  }

  let riskDeduction = 0;
  for (const flag of riskFlags) {
    if (flag.severity === 'high') riskDeduction += 6;
    else if (flag.severity === 'medium') riskDeduction += 4;
    else riskDeduction += 2;
  }
  riskDeduction = Math.min(riskDeduction, wR);

  const rawScore = longevity + activity + diversity + consistency;
  const score = clamp(Math.round(rawScore - riskDeduction), 0, 100);

  let grade: string;
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';
  else if (score >= 20) grade = 'D';
  else grade = 'F';

  return {
    score,
    grade,
    breakdown: {
      longevity: Math.round(longevity),
      activity: Math.round(activity),
      diversity: Math.round(diversity),
      consistency: Math.round(consistency),
      riskDeduction: Math.round(riskDeduction),
    },
  };
}
