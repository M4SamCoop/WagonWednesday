/* global React, ReactDOM, Wagon, Road, Ground, TopRoadLoader, ExhaustPuff,
   TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakToggle, TweakColor, TweakSelect */
const { useState, useEffect, useRef, useCallback } = React;

/* ───────────────────────── data ───────────────────────── */

const QUIZZY = { t: "Quizzy's Word Challenge", s: 'build words from a letter grid', k: 'vanilla js · pwa', yr: '2026', thumb: 'quizzy-thumb.png', url: 'quizzy/' };

const FEATURED = [
  { id: 'qwc-1', ...QUIZZY },
  { id: 'qwc-2', ...QUIZZY },
  { id: 'qwc-3', ...QUIZZY },
];

const ALL = [
  { h: 220, t: "Quizzy's Word Challenge", tag: 'word game · js · 2026', url: 'quizzy/', thumb: 'quizzy-thumb.png' },
];

/* ───────────────────────── header ───────────────────────── */

const Header = ({ wagonColor }) => {
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      lastY.current = y;
      setAtTop(y < 10);
      setHidden(goingDown && y > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: atTop ? '12px 44px' : '7px 44px',
        borderBottom: '1.25px solid var(--ink)',
        background: 'var(--paper)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease, padding 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Wagon width={56} color={wagonColor} />
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.03em' }}>
          Wagon Wednesday.
        </span>
      </div>
    </header>
  );
};

/* ───────────────────────── hero ───────────────────────── */

const SpinningWheel = ({ color, size = 110 }) => (
  <svg
    width={size}
    height={size}
    viewBox="268 501 204 204"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <circle cx="370" cy="603" r="92" fill={color} />
    <circle cx="370" cy="603" r="44" fill="var(--paper)" stroke={color} strokeWidth={10} />
    <g
      className="wheel-slow"
      style={{ transformOrigin: '370px 603px' }}
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
    >
      <line x1="330" y1="603" x2="410" y2="603" />
      <line x1="370" y1="563" x2="370" y2="643" />
      <line x1="341" y1="574" x2="399" y2="632" />
      <line x1="341" y1="632" x2="399" y2="574" />
    </g>
    <circle cx="370" cy="603" r="11" fill={color} />
  </svg>
);

const HeroFrame = ({ p, big, dim }) => (
  <div style={{ opacity: dim ? 0.42 : 1, width: '100%', maxWidth: big ? 420 : 220, justifySelf: big ? 'stretch' : undefined }}>
    {p.thumb ? (
      <img
        src={p.thumb}
        alt={p.t}
        style={{
          display: 'block',
          border: '1.25px solid var(--ink)',
          height: big ? 240 : 154,
          width: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
        }}
      />
    ) : (
      <div
        className="crosshatch ph"
        data-ph={big ? 'featured shot · 16:10' : 'shot'}
        style={{ border: '1.25px solid var(--ink)', height: big ? 240 : 154 }}
      />
    )}
    {!big && (
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{p.t}</div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{p.yr}</span>
      </div>
    )}
  </div>
);

const Hero = ({ tweaks, onOpenProject }) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [driving, setDriving] = useState(false);
  const [puffKey, setPuffKey] = useState(0);
  const [wagonLeft, setWagonLeft] = useState('15%');
  const [wagonHasTransition, setWagonHasTransition] = useState(true);
  const [slideDir, setSlideDir] = useState(0);   // -1 = going next (grid shifts left), +1 = going prev
  const [slideTx, setSlideTx] = useState(true);  // enables CSS transition on the grid
  const containerRef = useRef(null);

  useEffect(() => {
    if (paused || driving || !tweaks.autoAdvance) return;
    const t = setTimeout(() => { go(1); }, tweaks.cycleSeconds * 1000);
    return () => clearTimeout(t);
  }, [idx, paused, driving, tweaks.autoAdvance, tweaks.cycleSeconds]);

  const go = useCallback((dir) => {
    if (driving) return;
    setPuffKey(k => k + 1);
    setDriving(true);

    // Slide grid left/right and exit wagon right
    setSlideDir(dir);
    setSlideTx(true);
    setWagonHasTransition(true);
    setWagonLeft('110%');

    // At 450ms: snap grid back, update slide, snap wagon to off-screen left
    setTimeout(() => {
      setSlideTx(false);
      setSlideDir(0);
      setIdx(i => (i + dir + FEATURED.length) % FEATURED.length);
      setWagonHasTransition(false);
      setWagonLeft('-20%');
    }, 450);

    // At 490ms: re-enable transitions, wagon drives in from left edge
    setTimeout(() => {
      setSlideTx(true);
      setWagonHasTransition(true);
      setWagonLeft('15%');
    }, 490);

    setTimeout(() => {
      setDriving(false);
    }, 1000);
  }, [driving]);

  const current = FEATURED[idx];
  const window3 = [-1, 0, 1].map(
    (d) => FEATURED[(idx + d + FEATURED.length) % FEATURED.length]
  );

  return (
    <section style={{ padding: '40px 44px 0', position: 'relative' }}>
      {/* Heading + spinning wheel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, marginBottom: 24 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            maxWidth: 760,
          }}
        >
          Things I made,<br />
          mostly on <span className="squiggle">Wednesdays</span>
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <SpinningWheel color={tweaks.wagonColor} size={120} />
      </div>

      {/* The carousel */}
      <div style={{ position: 'relative' }}>
        <div
          className="mono"
          style={{
            position: 'absolute',
            top: -8,
            left: 14,
            fontSize: 11,
            color: 'var(--ink-3)',
            background: 'var(--paper)',
            padding: '0 6px',
            zIndex: 2,
          }}
        >
          ▸ FEATURED · {String(idx + 1).padStart(2, '0')} / {String(FEATURED.length).padStart(2, '0')} · {paused ? 'PAUSED' : 'AUTO'}
        </div>

        <div
          ref={containerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            border: '1.25px solid var(--ink)',
            borderLeft: 0,
            borderRight: 0,
            padding: '28px 0 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* frames row — slides left/right on transition */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr minmax(280px, 420px) 1fr',
              gap: 24,
              padding: '0 44px',
              alignItems: 'flex-end',
              transform: slideDir !== 0 ? `translateX(${-slideDir * 38}%)` : 'translateX(0)',
              transition: slideTx ? 'transform 0.45s cubic-bezier(.4,0,.2,1)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
              <HeroFrame p={window3[0]} dim />
            </div>
            <div style={{ position: 'relative', minWidth: 0 }}>
              <HeroFrame p={window3[1]} big />
              {/* wagon + ground overlay */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -10,
                  pointerEvents: 'none',
                }}
              >
                <Ground flowing={driving} />
                <button
                  onClick={() => { onOpenProject(current); }}
                  aria-label={`Open ${current.t}`}
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: wagonLeft,
                    transform: 'translateX(-50%)',
                    transition: wagonHasTransition ? 'left .43s cubic-bezier(.5,.2,.4,1)' : 'none',
                    background: 'transparent',
                    border: 0,
                    padding: 0,
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                  }}
                  onMouseDown={(e) => { e.preventDefault(); }}
                >
                  <div style={{ position: 'relative' }}>
                    <ExhaustPuff trigger={puffKey} />
                    <Wagon width={120} spinning={driving} color={tweaks.wagonColor} windowColor="transparent" showShadow />
                  </div>
                </button>
                <div
                  className="mono"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -22,
                    transform: 'translateX(-50%)',
                    fontSize: 10.5,
                    color: 'var(--ink-3)',
                    whiteSpace: 'nowrap',
                    opacity: driving ? 0 : 1,
                    transition: 'opacity .2s',
                  }}
                >
                  click the wagon to open ↑ · or → to drive to the next one
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
              <HeroFrame p={window3[2]} dim />
            </div>
          </div>

          {/* bottom nav row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '60px 24px 14px',
              gap: 14,
              borderTop: '1.25px dashed var(--ink-2)',
              marginTop: 8,
            }}
          >
            <button onClick={() => go(-1)} className="pill" style={{ border: 0, background: 'transparent' }} aria-label="previous">
              ← prev
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {FEATURED.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { if (!driving) setIdx(i); }}
                  aria-label={`go to ${p.t}`}
                  style={{
                    width: i === idx ? 30 : 9,
                    height: 9,
                    borderRadius: 999,
                    background: i === idx ? 'var(--accent)' : 'transparent',
                    border: '1.25px solid var(--ink)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'width .25s',
                  }}
                />
              ))}
            </div>
            <button onClick={() => go(1)} className="pill" style={{ border: 0, background: 'transparent' }} aria-label="next">
              next →
            </button>
          </div>
        </div>
      </div>

      {/* current spec line */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          alignItems: 'baseline',
          gap: 22,
          padding: '20px 4px 0',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          color: 'var(--ink-2)',
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
          ↳ &nbsp;{current.t}
          <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}> — {current.s}</span>
        </div>
        <span className="chip">{current.k}</span>
        <span>{current.yr}</span>
        <button
          className="pill pill-dark"
          onClick={() => onOpenProject(current)}
          style={{ border: '1.25px solid var(--ink)' }}
        >
          OPEN →
        </button>
      </div>
    </section>
  );
};

/* ───────────────────────── masonry grid ───────────────────────── */

const Tile = ({ p, onClick }) => {
  const body = p.thumb ? (
    <img
      src={p.thumb}
      alt={p.t}
      style={{ display: 'block', height: p.h, width: '100%', objectFit: 'cover' }}
    />
  ) : (
    <div className="crosshatch ph" data-ph="thumb" style={{ height: p.h }} />
  );

  return (
    <button
      onClick={onClick}
      className="lift"
      style={{
        breakInside: 'avoid',
        marginBottom: 22,
        border: '1.25px solid var(--ink)',
        padding: 0,
        background: 'var(--paper)',
        display: 'block',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
      }}
    >
      {body}
      <div
        style={{
          padding: '10px 14px 12px',
          borderTop: '1.25px solid var(--ink)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{p.t}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{p.tag}</div>
        </div>
        <span style={{ fontSize: 14 }}>→</span>
      </div>
    </button>
  );
};

const Pile = ({ onOpenProject }) => (
  <section id="work" style={{ padding: '64px 44px 28px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 22,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.015em' }}>
        The whole pie{' '}
        <span className="mono" style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 400 }}>
          ({ALL.length})
        </span>
      </h2>
      <div className="mono" style={{ fontSize: 12 }}>
        <span style={{ borderBottom: '1.5px solid var(--ink)' }}>ALL</span>
      </div>
    </div>

    <div style={{ columnCount: 3, columnGap: 22 }}>
      {ALL.map((p, i) => (
        <Tile key={i} p={p} onClick={() => onOpenProject(p)} />
      ))}
    </div>
  </section>
);

/* ───────────────────────── footer ───────────────────────── */

const Footer = ({ wagonColor }) => (
  <footer
    style={{
      marginTop: 40,
      borderTop: '1.25px solid var(--ink)',
      padding: '36px 44px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <Wagon width={66} color={wagonColor} />
    <span className="mono" style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
      Wagon Wednesday.
    </span>
  </footer>
);

/* ───────────────────────── loading overlay ───────────────────────── */

const useLoader = () => {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [project, setProject] = useState(null);

  const run = useCallback((p) => {
    setProject(p);
    setActive(true);
    setProgress(0);
    let v = 0;
    const tick = () => {
      v += 0.04 + Math.random() * 0.06;
      if (v >= 1) {
        setProgress(1);
        setTimeout(() => {
          if (p.url) {
            window.location.href = p.url;
          } else {
            setActive(false);
            setProgress(0);
          }
        }, 480);
        return;
      }
      setProgress(v);
      setTimeout(tick, 90);
    };
    setTimeout(tick, 120);
  }, []);

  return { active, progress, project, run };
};

const LoadingOverlay = ({ active, progress, project, wagonColor }) => {
  if (!active) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(245,242,234,.94)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
        OPENING {project ? project.t.toUpperCase() : '...'}
      </div>
      <div style={{ width: 'min(560px, 80vw)', position: 'relative' }}>
        <Road height={48} flowing />
        <div
          style={{
            position: 'absolute',
            left: `calc(${progress * 100}% - 50px)`,
            bottom: 2,
            transition: 'left .15s linear',
          }}
        >
          <Wagon width={96} spinning color={wagonColor} />
        </div>
      </div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
        {Math.round(progress * 100)}% · {progress < .5 ? 'merging onto highway' : progress < .85 ? 'two more exits' : 'almost there'}
      </div>
    </div>
  );
};

/* ───────────────────────── app ───────────────────────── */

const App = () => {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "wagonColor": "#1a1a1a",
    "autoAdvance": true,
    "cycleSeconds": 6,
    "demoTopLoader": false
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const loader = useLoader();

  const [topActive, setTopActive] = useState(false);
  const [topProgress, setTopProgress] = useState(0);
  useEffect(() => {
    if (!tweaks.demoTopLoader) {
      setTopActive(false);
      return;
    }
    setTopActive(true);
    let v = 0;
    let timer;
    const tick = () => {
      v += 0.018;
      if (v >= 1) { v = 0; }
      setTopProgress(v);
      timer = setTimeout(tick, 80);
    };
    tick();
    return () => clearTimeout(timer);
  }, [tweaks.demoTopLoader]);

  return (
    <div style={{ paddingTop: tweaks.demoTopLoader ? 18 : 0, transition: 'padding-top .25s' }}>
      <TopRoadLoader active={topActive} progress={topProgress} wagonColor={tweaks.wagonColor} />

      <Header wagonColor={tweaks.wagonColor} />
      <div style={{ height: 68 }} />

      <Hero tweaks={tweaks} onOpenProject={loader.run} />
      <Pile onOpenProject={loader.run} />
      <Footer wagonColor={tweaks.wagonColor} />

      <LoadingOverlay {...loader} wagonColor={tweaks.wagonColor} />

      <TweaksPanel>
        <TweakSection title="The Wagon">
          <TweakColor
            label="Paint job"
            value={tweaks.wagonColor}
            onChange={(v) => setTweak('wagonColor', v)}
            options={['#1a1a1a', '#5b8a72', '#b8512c', '#3a5a8a', '#d4b656']}
          />
        </TweakSection>
        <TweakSection title="Marquee">
          <TweakToggle
            label="Auto-advance"
            value={tweaks.autoAdvance}
            onChange={(v) => setTweak('autoAdvance', v)}
          />
          <TweakSlider
            label="Seconds between"
            min={3}
            max={14}
            step={1}
            value={tweaks.cycleSeconds}
            onChange={(v) => setTweak('cycleSeconds', v)}
            suffix="s"
          />
        </TweakSection>
        <TweakSection title="Top-road loader">
          <TweakToggle
            label="Show demo"
            value={tweaks.demoTopLoader}
            onChange={(v) => setTweak('demoTopLoader', v)}
          />
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.4 }}>
            the wagon drives across the very top of the page whenever something&rsquo;s loading.
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
