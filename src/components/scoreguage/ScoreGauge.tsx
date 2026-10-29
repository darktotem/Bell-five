import { useEffect, useState } from 'react';
import { MAX_SCORE, MIN_SCORE, getTier } from '../../utils/scoreCalculator';
import './ScoreGuage.css';

interface ScoreGaugeProps {
  score: number;
}

const ARC = 'M 10 100 A 90 90 0 0 1 190 100';

const TONES = {
  1: { pill: 'green', color: '#10b981' },
  2: { pill: 'blue', color: '#3b82f6' },
  3: { pill: 'amber', color: '#f59e0b' },
  4: { pill: 'red', color: '#ef4444' },
} as const;

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const target = Math.max(0, Math.min(100, ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100));
  const [pct, setPct] = useState(0);
  const tier = getTier(score);
  const tone = TONES[tier.level];

  useEffect(() => {
    const id = requestAnimationFrame(() => setPct(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  return (
    <div className="gauge">
      <div className="gauge-body">
        <svg viewBox="0 0 200 110" role="img" aria-label={`Credit score ${score} out of ${MAX_SCORE}`}>
          <path className="gauge-track" d={ARC} pathLength={100} />
          <path
            className="gauge-fill"
            d={ARC}
            pathLength={100}
            stroke={tone.color}
            strokeDasharray={`${pct} 100`}
          />
        </svg>

        <div className="gauge-center">
          <div className="gauge-score">
            {score}
            <span className="gauge-max"> / {MAX_SCORE}</span>
          </div>
          <span className={`pill pill-${tone.pill}`}>
            <span className="dot" />
            {tier.label}
          </span>
        </div>
      </div>

      <div className="gauge-scale">
        <span>{MIN_SCORE}</span>
        <span>{MAX_SCORE}</span>
      </div>
    </div>
  );
}