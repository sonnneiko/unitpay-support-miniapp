import { FC } from 'react';

type Result = 'correct' | 'wrong';

interface Props {
  results: Result[];
  total: number;
  size?: number;
}

export const QuizRing: FC<Props> = ({ results, total, size = 46 }) => {
  const strokeWidth = 5;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const correct = results.filter(r => r === 'correct').length;
  const wrong = results.filter(r => r === 'wrong').length;
  const empty = total - correct - wrong;

  const correctLen = (correct / total) * circumference;
  const wrongLen = (wrong / total) * circumference;
  const emptyLen = (empty / total) * circumference;

  const arcs = [
    { len: correctLen, color: '#34C759', opacity: 1,    offset: 0 },
    { len: wrongLen,   color: '#FF3B30', opacity: 1,    offset: correctLen },
    { len: emptyLen,   color: 'var(--tg-theme-hint-color, #999)', opacity: 0.2, offset: correctLen + wrongLen },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
    >
      {/* track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--tg-theme-hint-color, #999)"
        strokeWidth={strokeWidth}
        strokeOpacity={0.12}
      />
      {arcs.map((arc, i) => arc.len > 0 && (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeOpacity={arc.opacity}
          strokeDasharray={`${arc.len} ${circumference - arc.len}`}
          strokeDashoffset={circumference - arc.offset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
};
