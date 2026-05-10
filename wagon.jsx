/* global React */
// Volvo-ish wagon side view, facing right.
// Body silhouette + window panes + light clusters come straight from the
// uploaded WagonSideview.svg (viewBox 1600x900). Wheel spokes drawn on top
// so they can spin independently when the wagon is "driving".

const Wagon = ({
  width = 200,
  color = 'var(--wagon)',
  paper = 'var(--paper)',
  stroke = 10,
  spinning = false,
  showShadow = false,
  style,
  className = '',
}) => {
  const VB_W = 1600, VB_H = 900;
  const h = (width * VB_H) / VB_W;
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ display: 'block', overflow: 'visible', ...style }}
      className={className}
    >
      {showShadow && (
        <ellipse cx="800" cy="715" rx="680" ry="16" fill="rgba(0,0,0,.18)" />
      )}

      {/* Body silhouette */}
      <path
        d="m109.5 233.85l795 12 130.5 130.5 501 24 1.5 94.5 21 27-4.5 88.5-147 13.5-43.5-133.5-162-1.5-46.5 127.5h-474l-183-10.5-34.5-117-175.5-9-46.5 126-184.5-31.5-16-84.35 33-1 65.5-196.65z"
        fill={color}
        stroke={color}
        strokeWidth={stroke / 2}
        strokeLinejoin="round"
      />

      {/* Window panes — cut through with paper color */}
      <g stroke={color} strokeWidth={stroke} strokeLinejoin="round">
        <path d="m753 376.35l253.5 15-112.5-109.5-163.5-4.5z" fill={paper} />
        <path d="m468 370l239 8-21.5-100.65-193.5-3z" fill={paper} />
        <path d="m423 364.35l28.5-90-259.5-6-30 93z" fill={paper} />
      </g>

      {/* Side / belt lines + light clusters */}
      <g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="m747 417l65 3" />
        <path d="m452 406l67 3.35" />
        <path d="m105 494.85l172.5 6" />
        <path d="m507 500.85l675 21" />
        <path d="m1405.5 527.85l153.5 0.15" />
        <path d="m1482 411l8 70 45 2" />
        <path d="m99 450h36l24-63h-40" />
      </g>

      {/* Wheel tires (full discs) */}
      <circle cx="370" cy="603" r="92" fill={color} />
      <circle cx="1282" cy="607" r="91" fill={color} />

      {/* Hub plates so spokes read on top */}
      <circle cx="370" cy="603" r="44" fill={paper} stroke={color} strokeWidth={stroke} />
      <circle cx="1282" cy="607" r="44" fill={paper} stroke={color} strokeWidth={stroke} />

      {/* Spinning spokes */}
      <g
        className={`wheel-spokes ${spinning ? 'spinning' : ''}`}
        style={{ transformOrigin: '370px 603px' }}
        stroke={color}
        strokeWidth={stroke * 0.9}
        strokeLinecap="round"
      >
        <line x1="330" y1="603" x2="410" y2="603" />
        <line x1="370" y1="563" x2="370" y2="643" />
        <line x1="341" y1="574" x2="399" y2="632" />
        <line x1="341" y1="632" x2="399" y2="574" />
      </g>
      <g
        className={`wheel-spokes ${spinning ? 'spinning' : ''}`}
        style={{ transformOrigin: '1282px 607px' }}
        stroke={color}
        strokeWidth={stroke * 0.9}
        strokeLinecap="round"
      >
        <line x1="1242" y1="607" x2="1322" y2="607" />
        <line x1="1282" y1="567" x2="1282" y2="647" />
        <line x1="1253" y1="578" x2="1311" y2="636" />
        <line x1="1253" y1="636" x2="1311" y2="578" />
      </g>

      {/* Hub center caps */}
      <circle cx="370" cy="603" r="11" fill={color} />
      <circle cx="1282" cy="607" r="11" fill={color} />
    </svg>
  );
};

/* ── road components ───────────────────────────────────────── */

const Road = ({ height = 36, flowing = false, style }) => (
  <div style={{ position: 'relative', height, ...style }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1.5, background: 'var(--ink)' }} />
    <div className={`lane ${flowing ? 'flowing' : ''}`} style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.5, background: 'var(--ink)' }} />
  </div>
);

const Ground = ({ flowing = false, style }) => (
  <div style={{ position: 'relative', height: 22, ...style }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1.5, background: 'var(--ink)' }} />
    <div
      className={`lane ${flowing ? 'flowing' : ''}`}
      style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)' }}
    />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.5, background: 'var(--ink)' }} />
  </div>
);

const TopRoadLoader = ({ active, progress, wagonColor }) => (
  <div className={`top-road ${active ? 'on' : ''}`}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      <div className="lane flowing" style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', left: `calc(${progress * 100}% - 40px)`, bottom: -4, transition: 'left .25s linear' }}>
        <Wagon width={64} spinning={active} color={wagonColor} />
      </div>
    </div>
  </div>
);

const ExhaustPuff = ({ trigger, color = 'rgba(60,55,50,.55)' }) => (
  <div style={{ position: 'absolute', left: -4, bottom: 10, pointerEvents: 'none', width: 0, height: 0 }}>
    {[0, 1, 2].map((i) => (
      <div
        key={`${trigger}-${i}`}
        className="puff"
        style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          animationDelay: `${i * 0.12}s`,
        }}
      />
    ))}
  </div>
);

Object.assign(window, { Wagon, Road, Ground, TopRoadLoader, ExhaustPuff });
