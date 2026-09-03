'use client';
import React from 'react';

interface RadarData {
  axis: string;
  A: number;
  B: number;
}

interface RadarChartProps {
  data: RadarData[];
  playerAName: string;
  playerBName: string;
  colorA?: string;
  colorB?: string;
}

export default function RadarChart({
  data,
  playerAName,
  playerBName,
  colorA = '#3b82f6',
  colorB = '#ec4899',
}: RadarChartProps) {
  const size = 320;
  const center = size / 2;
  const radius = center - 40;

  const getCoordinates = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle - Math.PI / 2);
    const y = center + r * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const ticks = [20, 40, 60, 80, 100];
  const angleStep = (Math.PI * 2) / data.length;
  
  const pointsA = data.map((d, i) => getCoordinates(d.A, i * angleStep));
  const pointsB = data.map((d, i) => getCoordinates(d.B, i * angleStep));

  const pathA = pointsA.map((p) => `${p.x},${p.y}`).join(' ');
  const pathB = pointsB.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-6 mb-4 text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" style={{ backgroundColor: colorA }} />
          <span className="text-slate-200">{playerAName || 'Jogador A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.6)]" style={{ backgroundColor: colorB }} />
          <span className="text-slate-200">{playerBName || 'Jogador B'}</span>
        </div>
      </div>

      <svg width={size} height={size} className="overflow-visible">
        {ticks.map((t, i) => (
          <polygon
            key={i}
            points={data
              .map((_, idx) => {
                const { x, y } = getCoordinates(t, idx * angleStep);
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray={t === 100 ? '0' : '4 4'}
          />
        ))}

        {data.map((_, i) => {
          const { x, y } = getCoordinates(100, i * angleStep);
          return (
            <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#334155" strokeWidth="1" />
          );
        })}

        {data.map((d, i) => {
          const { x, y } = getCoordinates(115, i * angleStep);
          let textAnchor = 'middle';
          if (x < center - 10) textAnchor = 'end';
          if (x > center + 10) textAnchor = 'start';
          
          return (
            <text
              key={i}
              x={x}
              y={y + 4}
              textAnchor={textAnchor}
              fill="#94a3b8"
              fontSize="10"
              fontWeight="bold"
              className="uppercase tracking-wider"
            >
              {d.axis}
            </text>
          );
        })}

        <polygon
          points={pathB}
          fill={colorB}
          fillOpacity="0.3"
          stroke={colorB}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        {pointsB.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={colorB} />
        ))}

        <polygon
          points={pathA}
          fill={colorA}
          fillOpacity="0.4"
          stroke={colorA}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        {pointsA.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={colorA} />
        ))}
      </svg>
    </div>
  );
}