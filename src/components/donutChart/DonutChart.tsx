import { useState } from 'react';
import type { AllocationSlice, AssetType } from '../../types/assets';
import { formatKES } from '../../utils/formatters';
import './DonutChart.css';

interface DonutChartProps {
  slices: AllocationSlice[];
  total: number;
}

const GAP = 0.8;

export default function DonutChart({ slices, total }: DonutChartProps) {
  const [activeType, setActiveType] = useState<AssetType | null>(null);
  const active = slices.find((s) => s.type === activeType) ?? null;

  const segments: Array<AllocationSlice & { dash: number; start: number }> = [];
  let cursor = 0;
  for (const s of slices) {
    segments.push({ ...s, dash: Math.max(s.pct - GAP, 0.2), start: cursor });
    cursor += s.pct;
  }

  return (
    <div className="donut-wrap">
      <div className="donut">
        <svg viewBox="0 0 42 42" role="img" aria-label="Asset allocation">
          <circle className="donut-track" cx="21" cy="21" r="15.9155" />
          {segments.map((seg) => (
            <circle
              key={seg.type}
              className="donut-seg"
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              pathLength={100}
              stroke={seg.color}
              strokeWidth={activeType === seg.type ? 6 : 4.6}
              strokeDasharray={`${seg.dash} ${100 - seg.dash}`}
              strokeDashoffset={-seg.start}
              transform="rotate(-90 21 21)"
              opacity={activeType && activeType !== seg.type ? 0.35 : 1}
              onClick={() => setActiveType(seg.type)}
              onMouseEnter={() => setActiveType(seg.type)}
              onMouseLeave={() => setActiveType(null)}
            />
          ))}
        </svg>

        <div className="donut-center">
          <span className="donut-label">{active ? active.label : 'Total assets'}</span>
          <strong className="donut-value sensitive">{formatKES(active ? active.value : total)}</strong>
          <span className="donut-sub">
            {active ? `${active.pct.toFixed(1)}% of portfolio` : `${slices.length} asset classes`}
          </span>
        </div>
      </div>

      <div className="legend">
        {slices.map((s) => (
          <button
            key={s.type}
            className={`legend-item ${activeType === s.type ? 'active' : ''}`}
            onClick={() => setActiveType(activeType === s.type ? null : s.type)}
          >
            <span className="legend-dot" style={{ background: s.color }} />
            <span className="legend-label">{s.label}</span>
            <span className="legend-pct">{s.pct.toFixed(1)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}