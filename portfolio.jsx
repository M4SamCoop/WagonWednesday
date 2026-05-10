/* global React, ReactDOM, Wagon, Road, Ground, TopRoadLoader, ExhaustPuff,
   TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakToggle, TweakColor, TweakSelect */
const { useState, useEffect, useRef, useCallback } = React;

/* ───────────────────────── data ───────────────────────── */

const FEATURED = [
  { id: 'ww',  t: 'Wagon Wednesday',  s: 'a tiny weekly ritual app',         k: 'react · idb',   yr: '2026', tone: 'img' },
  { id: 'qwc', t: "Quizzy's Word Challenge", s: 'build words from a letter grid', k: 'vanilla js · pwa', yr: '2026', tone: 'hatch', url: 'quizzy/' },
  { id: 'lap', t: 'Lap Counter',      s: 'pwa for swim sets, no signup',     k: 'svelte · pwa',  yr: '2026', tone: 'hatch' },
  { id: 'tp',  t: 'Tone Picker',      s: 'pick a chord, paint with it',      k: 'canvas · audio',yr: '2025', tone: 'img' },
  { id: 'prpg',t: 'Pomodoro RPG',     s: 'level up by focusing',             k: 'svelte',        yr: '2025', tone: 'img' },
  { id: 'wg',  t: 'Word Garden',      s: 'a 3D garden you grow with words',  k: 'three.js',      yr: '2024', tone: 'hatch' },
];

const ALL = [
  { h: 180, type: 'hatch', t: "Quizzy's Word Challenge", tag: 'word game · js · 2026', url: 'quizzy/' },
  { h: 220, type: 'img',   t: 'Lap Counter',      tag: 'react · pwa · 2026' },
  { h: 130, type: 'text',  t: 'Tide Clock',       tag: 'a clock face = your local tide' },
  { h: 260, type: 'img',   t: 'Tone Picker',      tag: 'canvas · audio · 2025' },
  { h: 160, type: 'hatch', t: 'Pomodoro RPG',     tag: 'game · 2025' },
  { h: 110, type: 'note',  t: '↳ on hiatus',      tag: 'rewriting in zig (lol)' },
  { h: 220, type: 'img',   t: 'Word Garden',      tag: 'three.js · 2024' },
  { h: 150, type: 'text',  t: 'Recipe Roulette',  tag: 'llm · spits a recipe at you' },
  { h: 200, type: 'hatch', t: 'Subway Status',    tag: 'scraper · 2024' },
  { h: 130, type: 'img',   t: 'Yarn Log',         tag: 'pwa · 2023' },
  { h: 160, type: 'text',  t: 'Daily Doodle',     tag: 'p5 · append-only' },
  { h: 180, type: 'img',   t: "Driver's Mood",    tag: 'webcam · color · 2023' },
  { h: 110, type: 'note',  t: '✦ new!',           tag: 'shipped last weds' },
  { h: 200, type: 'hatch', t: 'Salt Calendar',    tag: 'utility · 2022' },
  { h: 140, type: 'text',  t: 'Knot Encyclopedia', tag: 'static · 2022' },
];

/* ───────────────────────── header ───────────────────────── */

const Header = ({ wagonColor }) => (
  <header
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 44px 18px',
      borderBottom: '1.25px solid var(--ink)',
      background: 'var(--paper)',
      position: 'sticky',
      top: 18,
      zIndex: 40,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Wagon width={88} color={wagonColor} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span className="mono" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.03em' }}>
          WAGON&nbsp;WEDNESDAY
        </span>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '.08em' }}>
          things jane made, mostly on weds.
        </span>
      </div>
    </div>
    <nav
      className="mono"
      style={{ display: 'flex', gap: 24, fontSize: 12, letterSpacing: '.06em' }}
    >
      <a href="#work" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1.5px solid var(--ink)' }}>WORK</a>
      <a href="#notes" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>NOTES</a>
      <a href="#about" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>ABOUT</a>
      <a href="#email" style={{ color: 'var(--ink)', textDecoration: 'none' }}>EMAIL&nbsp;→</a>
    </nav>
  </header>
);

/* ───────────────────────── hero ───────────────────────── */

const HeroFrame = ({ p, big, dim }) => (
  <div style={{ opacity: dim ? 0.42 : 1, width: '100%', maxWidth: big ? 420 : 220, justifySelf: big ? 'stretch' : undefined }}>
    <div
      className={p.tone === 'hatch' ? 'crosshatch ph' : 'stripes ph'}
      data-ph={big ? 'featured shot · 16:10' : 'shot'}
      style={{
        border: '1.25px solid var(--ink)',
        height: big ? 240 : 154,
      }}
    />
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
  const containerRef = useRef(null);

  // Auto-advance
  useEffect(() => {
    if (paused || driving || !tweaks.autoAdvance) return;
    const t = setTimeout(() => {
      go(1);
    }, tweaks.cycleSeconds * 1000);
    return () => clearTimeout(t);
  }, [idx, paused, driving, tweaks.autoAdvance, tweaks.cycleSeconds]);

  const go = useCallback((dir) => {
    if (driving) return;
    setPuffKey((k) => k + 1);
    setDriving(true);
    setTimeout(() => {
      setIdx((i) => (i + dir + FEATURED.length) % FEATURED.length);
    }, 520);
    setTimeout(() => {
      setDriving(false);
    }, 950);
  }, [driving]);

  const current = FEATURED[idx];
  // 3 visible frames: left dim, center featured, right dim
  const window3 = [-1, 0, 1].map(
    (d) => FEATURED[(idx + d + FEATURED.length) % FEATURED.length]
  );

  return (
    <section style={{ padding: '40px 44px 0', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 30,
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.025em',
            maxWidth: 760,
          }}
        >
          Things I made,<br />
          mostly on <span className="squiggle">Wednesdays</span>
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: 'var(--ink-3)',
            textAlign: 'right',
            lineHeight: 1.5,
            paddingBottom: 10,
          }}
        >
          24 small things, mostly working.<br />
          ↓ scroll for the full pile.
        </div>
      </div>

      {/* The marquee row */}
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
          {/* frames row — centered on the big middle frame */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr minmax(280px, 420px) 1fr',
              gap: 24,
              padding: '0 44px',
              alignItems: 'flex-end',
              transition: 'transform .5s cubic-bezier(.4,.7,.3,1)',
              transform: driving ? 'translateX(-40px)' : 'translateX(0)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
              <HeroFrame p={window3[0]} dim />
            </div>
            <div style={{ position: 'relative', minWidth: 0 }}>
              <HeroFrame p={window3[1]} big />
              {/* centered wagon on ground inside the featured slot */}
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
                {/* wagon button */}
                <button
                  onClick={() => { onOpenProject(current); }}
                  aria-label={`Open ${current.t}`}
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: driving ? '110%' : '50%',
                    transform: 'translateX(-50%)',
                    transition: 'left .6s cubic-bezier(.5,.2,.4,1)',
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
                    <Wagon width={120} spinning={driving} color={tweaks.wagonColor} showShadow />
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

          {/* bottom hover-pause row */}
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

        <Margin style={{ right: 8, top: -32, textAlign: 'right' }}>
          edge frames dim — focus the center. Hover pauses.
        </Margin>
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

const Margin = ({ children, style }) => (
  <div
    className="hand"
    style={{
      position: 'absolute',
      color: 'var(--accent)',
      fontSize: 18,
      lineHeight: 1.18,
      maxWidth: 200,
      pointerEvents: 'none',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ───────────────────────── masonry grid ───────────────────────── */

const Tile = ({ p, onClick }) => {
  if (p.type === 'note') {
    return (
      <div
        style={{
          breakInside: 'avoid',
          marginBottom: 22,
          border: '1.25px solid var(--ink)',
          padding: 14,
          background: '#fef4a8',
          transform: 'rotate(-1.2deg)',
        }}
        className="lift"
      >
        <div className="hand" style={{ fontSize: 22, color: '#5a4a2a', lineHeight: 1.1 }}>
          {p.t}
        </div>
        <div className="mono" style={{ fontSize: 11, marginTop: 4, color: '#5a4a2a' }}>
          {p.tag}
        </div>
      </div>
    );
  }
  const body =
    p.type === 'img' ? (
      <div className="stripes ph" data-ph="thumb" style={{ height: p.h }} />
    ) : p.type === 'hatch' ? (
      <div className="crosshatch ph" data-ph="thumb" style={{ height: p.h }} />
    ) : (
      <div
        style={{
          height: p.h,
          padding: '18px 16px 6px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.05 }}>{p.t}</div>
      </div>
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
          {p.type !== 'text' && (
            <div style={{ fontWeight: 700, fontSize: 15 }}>{p.t}</div>
          )}
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            {p.tag}
          </div>
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
        The whole pile{' '}
        <span className="mono" style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 400 }}>
          ({ALL.length})
        </span>
      </h2>
      <div className="mono" style={{ fontSize: 12, display: 'flex', gap: 14 }}>
        <span style={{ borderBottom: '1.5px solid var(--ink)' }}>NEWEST</span>
        <span style={{ color: 'var(--ink-3)' }}>OLDEST</span>
        <span style={{ color: 'var(--ink-3)' }}>TOOLS</span>
        <span style={{ color: 'var(--ink-3)' }}>TOYS</span>
        <span style={{ color: 'var(--ink-3)' }}>SCRATCHED ↗</span>
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
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 12,
      color: 'var(--ink-2)',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 28,
      alignItems: 'start',
    }}
  >
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Wagon width={66} color={wagonColor} />
        <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 13 }}>
          PARKED FOR THE NIGHT.
        </div>
      </div>
      <div style={{ lineHeight: 1.6, maxWidth: 360 }}>
        most weeks one new little thing. ~half work, ~half don&rsquo;t. all
        kept on purpose. say hi if anything sticks.
      </div>
    </div>
    <div>
      <div style={{ color: 'var(--ink-3)', marginBottom: 6 }}>ELSEWHERE</div>
      <div>github ↗</div>
      <div>are.na ↗</div>
      <div>read.cv ↗</div>
    </div>
    <div>
      <div style={{ color: 'var(--ink-3)', marginBottom: 6 }}>RSS / EMAIL</div>
      <div>feed.xml</div>
      <div>weekly digest ↗</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div>© 2026 jane alder</div>
      <div>built in a weekend</div>
      <div style={{ marginTop: 14, color: 'var(--ink-3)' }}>v3.1.0 — “low ride”</div>
    </div>
  </footer>
);

/* ───────────────────────── loading state ───────────────────────── */

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

  // Demo top-road loader on tweak toggle
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
