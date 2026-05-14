function categoryColors(category: string): [string, string] {
  const c = category.toLowerCase();
  if (c.includes('stout') || c.includes('porter') || c.includes('trappist')) return ['#3d1f0d', '#1e0e06'];
  if (c.includes('weiss') || c.includes('wheat') || c.includes('wit')) return ['#e8d48b', '#c4ae60'];
  if (c.includes('pilsner') || c.includes('pale ale')) return ['#e2c868', '#bfa038'];
  if (c.includes('ipa') || c.includes('india')) return ['#d4a020', '#a87010'];
  if (c.includes('amber') || c.includes('bock')) return ['#b85a14', '#8c3e08'];
  if (c.includes('belgisk') || c.includes('tripel') || c.includes('dubbel')) return ['#d4920c', '#a87008'];
  return ['#d09010', '#a07008'];
}

export default function BottleSvg({
  category,
  volume,
  abv,
  w = 26,
  h = 80,
}: {
  category: string;
  volume: number;
  abv: number;
  w?: number;
  h?: number;
}) {
  const [liquid, liquidDark] = categoryColors(category);
  const label = category.split(',')[0].slice(0, 8).toUpperCase();

  return (
    <svg viewBox="0 0 56 180" width={w} height={h} style={{ display: 'block' }}>
      <rect x="22" y="6" width="12" height="28" fill={liquidDark} />
      <path
        d="M22 30 Q 22 40 14 50 L 14 168 Q 14 174 20 174 L 36 174 Q 42 174 42 168 L 42 50 Q 34 40 34 30 Z"
        fill={liquid}
      />
      <rect x="20" y="0" width="16" height="8" fill="#1a1a1a" />
      <rect x="14" y="80" width="28" height="56" fill="#1a1a1a" />
      <text x="28" y="100" fontSize="6" fontFamily="ui-monospace,monospace" fill="#f5f3ee" textAnchor="middle" letterSpacing="0.5">
        {label}
      </text>
      <line x1="18" y1="106" x2="38" y2="106" stroke="#f5f3ee" strokeOpacity={0.4} strokeWidth={0.5} />
      <text x="28" y="118" fontSize="5" fontFamily="ui-monospace,monospace" fill="#f5f3ee" fillOpacity={0.7} textAnchor="middle">
        {abv.toFixed(1)}%
      </text>
      <text x="28" y="128" fontSize="5" fontFamily="ui-monospace,monospace" fill="#f5f3ee" fillOpacity={0.7} textAnchor="middle">
        {volume}ML
      </text>
      <rect x="18" y="50" width="3" height="120" fill="#fff" fillOpacity={0.18} rx="1.5" />
    </svg>
  );
}
