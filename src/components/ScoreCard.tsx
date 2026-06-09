'use client';

import type { WalletScore } from '@/types';
import { SCORE_WEIGHTS } from '@/config';

interface Props {
  score: WalletScore;
}

function gradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-400';
    case 'B': return 'text-blue-400';
    case 'C': return 'text-yellow-400';
    case 'D': return 'text-orange-400';
    default: return 'text-red-400';
  }
}

function gradeBg(grade: string): string {
  switch (grade) {
    case 'A': return 'bg-green-500/10 border-green-500/30';
    case 'B': return 'bg-blue-500/10 border-blue-500/30';
    case 'C': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'D': return 'bg-orange-500/10 border-orange-500/30';
    default: return 'bg-red-500/10 border-red-500/30';
  }
}

export default function ScoreCard({ score }: Props) {
  const { breakdown } = score;
  const maxWeight = SCORE_WEIGHTS.longevity + SCORE_WEIGHTS.activity + SCORE_WEIGHTS.diversity + SCORE_WEIGHTS.consistency;

  const bars = [
    { label: 'Longevity', value: breakdown.longevity, max: SCORE_WEIGHTS.longevity, color: 'bg-green-500' },
    { label: 'Activity', value: breakdown.activity, max: SCORE_WEIGHTS.activity, color: 'bg-blue-500' },
    { label: 'Diversity', value: breakdown.diversity, max: SCORE_WEIGHTS.diversity, color: 'bg-purple-500' },
    { label: 'Consistency', value: breakdown.consistency, max: SCORE_WEIGHTS.consistency, color: 'bg-teal-500' },
  ];

  return (
    <div className="w-full max-w-2xl">
      <div className={`rounded-xl border p-6 ${gradeBg(score.grade)}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className={`text-5xl font-bold ${gradeColor(score.grade)}`}>{score.grade}</div>
            <div className="text-sm text-gray-400 mt-1">Grade</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{score.score}</div>
            <div className="text-sm text-gray-400 mt-1">/ 100</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{bar.label}</span>
                <span>{bar.value}/{bar.max}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${bar.color}`}
                  style={{ width: `${(bar.value / bar.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {breakdown.riskDeduction > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="text-red-400">Risk Deduction</span>
                <span className="text-red-400">-{breakdown.riskDeduction}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${(breakdown.riskDeduction / SCORE_WEIGHTS.riskDeduction) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
