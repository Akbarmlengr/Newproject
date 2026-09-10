const WIDTH = 120;
const HEIGHT = 32;
const PADDING = 4;

export default function Sparkline({ values = [] }) {
  const points = values.filter((v) => v != null);

  if (points.length < 2) {
    return <span className="sparkline-empty">Not enough data yet</span>;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((price, i) => {
    const x = PADDING + (i / (points.length - 1)) * (WIDTH - PADDING * 2);
    const y = HEIGHT - PADDING - ((price - min) / range) * (HEIGHT - PADDING * 2);
    return [x, y, price];
  });

  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const [lastX, lastY, lastPrice] = coords[coords.length - 1];

  return (
    <svg className="sparkline" width={WIDTH} height={HEIGHT} role="img" aria-label="Price trend">
      <path d={path} className="sparkline-line" fill="none" />
      {coords.map(([x, y, price], i) => (
        <circle key={i} cx={x} cy={y} r={8} className="sparkline-hit">
          <title>{price}</title>
        </circle>
      ))}
      <circle cx={lastX} cy={lastY} r={6} className="sparkline-ring" />
      <circle cx={lastX} cy={lastY} r={4} className="sparkline-dot">
        <title>Latest: {lastPrice}</title>
      </circle>
    </svg>
  );
}
