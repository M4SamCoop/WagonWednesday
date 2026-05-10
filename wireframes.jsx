/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, DCPostIt */
const { useState, useEffect } = React;

/* ─────────────────────────────────────────────────────────── shared bits */

const Ph = ({ label, style, className = '', stripe = 'stripes' }) => (
  <div
    className={`${stripe} placeholder ${className}`}
    data-ph={label}
    style={{ border: '1.25px solid var(--ink)', ...style }}
  />
);

const Hatch = ({ style, label, className = '' }) => (
  <div
    className={`crosshatch placeholder ${className}`}
    data-ph={label}
    style={{ border: '1.25px solid var(--ink)', ...style }}
  />
);

const Rule = ({ style }) => (
  <div style={{ height: 1.5, background: 'var(--ink)', ...style }} />
);

const Margin = ({ children, style }) => (
  <div
    className="hand"
    style={{
      position: 'absolute',
      color: 'var(--accent)',
      fontSize: 18,
      lineHeight: 1.15,
      maxWidth: 180,
      ...style,
    }}
  >
    {children}
  </div>
);

// Curved annotation arrow (svg overlay)
const Arrow = ({ from, to, curve = 30, style }) => {
  const w = Math.abs(to.x - from.x) + Math.abs(curve) + 40;
  const h = Math.abs(to.y - from.y) + Math.abs(curve) + 40;
  const x0 = Math.min(from.x, to.x) - 20;
  const y0 = Math.min(from.y, to.y) - 20;
  const ax = from.x - x0;
  const ay = from.y - y0;
  const bx = to.x - x0;
  const by = to.y - y0;
  const cx = (ax + bx) / 2 + curve;
  const cy = (ay + by) / 2 - curve;
  return (
    <svg
      style={{
        position: 'absolute',
        left: x0,
        top: y0,
        width: w,
        height: h,
        pointerEvents: 'none',
        overflow: 'visible',
        ...style,
      }}
    >
      <defs>
        <marker
          id="arr"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
        </marker>
      </defs>
      <path
        d={`M${ax},${ay} Q${cx},${cy} ${bx},${by}`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        markerEnd="url(#arr)"
      />
    </svg>
  );
};

const Header = ({ variant = 'plain' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 40px 18px',
      borderBottom: '1.25px solid var(--ink)',
      background: 'var(--paper)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span
        className="mono"
        style={{ fontSize: 14, letterSpacing: '.04em', fontWeight: 700 }}
      >
        {variant === 'terminal' ? '~/jane.dev $' : 'JANE ALDER'}
      </span>
      <span
        className="mono"
        style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em' }}
      >
        {variant === 'terminal' ? 'v3.1.0' : 'design · code · vibes'}
      </span>
    </div>
    <nav
      className="mono"
      style={{ display: 'flex', gap: 22, fontSize: 12, letterSpacing: '.06em' }}
    >
      <span>WORK</span>
      <span>NOTES</span>
      <span>ABOUT</span>
      <span className="arrow-r">EMAIL</span>
    </nav>
  </div>
);

const Footer = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: 32,
      padding: '32px 40px 28px',
      borderTop: '1.25px solid var(--ink)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 12,
      color: 'var(--ink-2)',
    }}
  >
    <div>
      <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
        JANE ALDER
      </div>
      <div style={{ lineHeight: 1.6 }}>
        Lorem ipsum portfolio blurb — two lines max, voicey, ends on a joke or a
        link.
      </div>
    </div>
    <div>
      <div style={{ marginBottom: 4 }}>ELSEWHERE</div>
      <div>github ↗</div>
      <div>are.na ↗</div>
      <div>read.cv ↗</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div>© 2026</div>
      <div>built in a weekend</div>
    </div>
  </div>
);

const ProjectCard = ({ idx, title, tag, hatched }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {hatched ? (
      <Hatch label={`thumb · 16:10`} style={{ height: 180 }} />
    ) : (
      <Ph label={`thumb · 16:10`} style={{ height: 180 }} />
    )}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 17 }}>{title}</div>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
        {String(idx).padStart(2, '0')}
      </span>
    </div>
    <div
      style={{
        fontSize: 13,
        color: 'var(--ink-2)',
        lineHeight: 1.45,
      }}
    >
      One-line description of the thing — what it does, why it&rsquo;s weird.
    </div>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
      {tag.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────── 01 · Classic Hero  */

const ClassicHero = () => (
  <div className="wf">
    <Header />

    {/* Hero band */}
    <div style={{ padding: '28px 40px 0', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 12,
        }}
      >
        <span className="mono" style={{ fontSize: 12 }}>
          FEATURED · 01 / 05
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          auto-advance 6s · ↔ to scrub
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <Ph
          label="hero project shot · full bleed 16:7"
          style={{ height: 440 }}
          stripe="stripes-thin"
        />
        {/* overlay text inside hero */}
        <div
          style={{
            position: 'absolute',
            left: 28,
            bottom: 24,
            color: 'var(--ink)',
            background: 'rgba(245,242,234,0.72)',
            padding: '14px 18px',
            border: '1.25px solid var(--ink)',
            maxWidth: 480,
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 4 }}
          >
            PROJECT · TOOL · 2026
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>
            Wagon Wednesday
          </div>
          <div style={{ fontSize: 13, marginTop: 8, color: 'var(--ink-2)' }}>
            two-sentence pitch sits here, max, kept punchy.
          </div>
          <div style={{ marginTop: 12 }}>
            <span className="pill arrow-r">OPEN PROJECT</span>
          </div>
        </div>

        {/* prev/next chevrons */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: -18,
            transform: 'translateY(-50%)',
            width: 36,
            height: 36,
            border: '1.25px solid var(--ink)',
            background: 'var(--paper)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: -18,
            transform: 'translateY(-50%)',
            width: 36,
            height: 36,
            border: '1.25px solid var(--ink)',
            background: 'var(--paper)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          →
        </div>
      </div>

      {/* dots */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 14,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? 26 : 8,
              height: 8,
              borderRadius: 999,
              background: i === 0 ? 'var(--ink)' : 'transparent',
              border: '1.25px solid var(--ink)',
            }}
          />
        ))}
      </div>

      <Margin style={{ right: 12, top: 96 }}>
        slideshow: auto-cycle, pause on hover, swipe on touch
      </Margin>
    </div>

    {/* All work grid */}
    <div style={{ padding: '60px 40px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 22,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>
            Selected Work
          </h2>
          <span
            className="mono"
            style={{ fontSize: 13, color: 'var(--ink-3)' }}
          >
            (24)
          </span>
        </div>
        <div className="mono" style={{ fontSize: 12, display: 'flex', gap: 14 }}>
          <span style={{ borderBottom: '1.5px solid var(--ink)' }}>ALL</span>
          <span style={{ color: 'var(--ink-3)' }}>TOOLS</span>
          <span style={{ color: 'var(--ink-3)' }}>TOYS</span>
          <span style={{ color: 'var(--ink-3)' }}>EXPERIMENTS</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
        }}
      >
        {[
          { t: 'Lap Counter', g: ['react', 'pwa'] },
          { t: 'Tone Picker', g: ['canvas', 'audio'] },
          { t: 'Pomodoro RPG', g: ['game', 'svelte'] },
          { t: 'Recipe Roulette', g: ['llm'] },
          { t: 'Subway Status', g: ['scraper'] },
          { t: 'Word Garden', g: ['three.js'] },
        ].map((p, i) => (
          <ProjectCard key={p.t} idx={i + 2} title={p.t} tag={p.g} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <span className="pill">SEE ALL 24 →</span>
      </div>
    </div>

    <Footer />
  </div>
);

/* ────────────────────────────────── 02 · Editorial / Numbered List */

const EditorialNumbered = () => (
  <div className="wf">
    <Header />

    {/* Hero: huge type left, stacked frame right */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        gap: 40,
        padding: '40px 40px 24px',
        position: 'relative',
      }}
    >
      <div>
        <div className="mono" style={{ fontSize: 12, marginBottom: 14 }}>
          NOW SHOWING — 01 / 05
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 92,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: '-0.03em',
          }}
        >
          Wagon
          <br />
          <span className="squiggle">Wednesday</span>
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <div
          style={{
            marginTop: 22,
            fontSize: 16,
            lineHeight: 1.5,
            maxWidth: 380,
            color: 'var(--ink-2)',
          }}
        >
          A tiny weekly ritual app. Built in an evening. Took itself entirely
          too seriously by Friday.
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <span className="pill arrow-r">OPEN</span>
          <span className="pill">SOURCE ↗</span>
        </div>

        {/* meta strip */}
        <div
          style={{
            display: 'flex',
            gap: 22,
            marginTop: 32,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: 'var(--ink-2)',
          }}
        >
          <div>
            <div style={{ color: 'var(--ink-3)' }}>YEAR</div>
            <div>2026</div>
          </div>
          <div>
            <div style={{ color: 'var(--ink-3)' }}>STACK</div>
            <div>react · idb</div>
          </div>
          <div>
            <div style={{ color: 'var(--ink-3)' }}>STATUS</div>
            <div>live</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* back stacked frames */}
        <Ph
          label=""
          stripe="stripes-thin"
          style={{
            position: 'absolute',
            top: 18,
            right: -8,
            width: '94%',
            height: 320,
            opacity: 0.45,
          }}
        />
        <Ph
          label=""
          stripe="stripes-thin"
          style={{
            position: 'absolute',
            top: 9,
            right: -4,
            width: '97%',
            height: 320,
            opacity: 0.7,
          }}
        />
        <Ph
          label="featured shot · 4:3"
          stripe="stripes"
          style={{ position: 'relative', width: '100%', height: 320 }}
        />

        {/* nav row */}
        <div
          className="mono"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 26,
            fontSize: 12,
          }}
        >
          <span>← PREV</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {['01', '02', '03', '04', '05'].map((n, i) => (
              <span
                key={n}
                style={{
                  fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? 'var(--ink)' : 'var(--ink-3)',
                  borderBottom:
                    i === 0 ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                  paddingBottom: 2,
                }}
              >
                {n}
              </span>
            ))}
          </div>
          <span>NEXT →</span>
        </div>

        <Margin style={{ right: -10, top: 200 }}>
          arrows + numbers, no dots — feels editorial
        </Margin>
      </div>
    </div>

    <Rule style={{ marginTop: 24 }} />

    {/* All projects as numbered list */}
    <div style={{ padding: '32px 40px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
          The Index
        </h2>
        <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          hover for preview · click to open
        </span>
      </div>

      {[
        ['Lap Counter', 2026, 'TOOL', 'react'],
        ['Tone Picker', 2025, 'TOY', 'canvas'],
        ['Pomodoro RPG', 2025, 'GAME', 'svelte'],
        ['Recipe Roulette', 2025, 'TOOL', 'llm'],
        ['Subway Status', 2024, 'UTIL', 'cron'],
        ['Word Garden', 2024, 'EXPERIMENT', 'three'],
        ['Daily Doodle', 2024, 'RITUAL', 'p5'],
        ['Yarn Log', 2023, 'TOOL', 'pwa'],
      ].map(([name, year, cat, stack], i) => (
        <div
          key={name}
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 110px 130px 90px',
            alignItems: 'center',
            gap: 20,
            padding: '16px 0',
            borderBottom: '1px solid var(--ink)',
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 12, color: 'var(--ink-3)' }}
          >
            {String(i + 2).padStart(2, '0')}
          </span>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.015em',
            }}
          >
            {name}
          </div>
          <span className="mono" style={{ fontSize: 12 }}>
            {cat}
          </span>
          <span className="chip">{stack}</span>
          <span
            className="mono"
            style={{ fontSize: 12, textAlign: 'right', color: 'var(--ink-3)' }}
          >
            {year} →
          </span>
        </div>
      ))}
    </div>

    <Footer />
  </div>
);

/* ───────────────────────────────────────── 03 · Terminal / Now Playing */

const TerminalIndex = () => (
  <div className="wf">
    <Header variant="terminal" />

    {/* "Now playing" card */}
    <div style={{ padding: '32px 40px 0', position: 'relative' }}>
      <div
        className="mono"
        style={{
          fontSize: 12,
          marginBottom: 10,
          color: 'var(--ink-2)',
          display: 'flex',
          gap: 14,
        }}
      >
        <span>▶ NOW PLAYING</span>
        <span style={{ color: 'var(--ink-3)' }}>
          # cycles every 6s · ←/→ to step
        </span>
      </div>

      <div
        style={{
          border: '1.5px solid var(--ink)',
          background: 'var(--paper)',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
        }}
      >
        <Ph
          label="project thumb · 4:3"
          stripe="stripes"
          style={{ borderTop: 0, borderLeft: 0, borderBottom: 0, height: 360 }}
        />
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <div
            className="mono"
            style={{ fontSize: 11, color: 'var(--ink-3)' }}
          >
            01 / 05 · featured
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.02, marginTop: 6 }}>
            wagon-
            <br />
            wednesday
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              color: 'var(--ink-2)',
              lineHeight: 1.45,
            }}
          >
            A tiny weekly ritual app. Built in an evening. Refuses to delete
            itself.
          </div>

          {/* spec rows */}
          <div
            style={{
              marginTop: 18,
              borderTop: '1px solid var(--ink)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
            }}
          >
            {[
              ['stack', 'react · idb · vibes'],
              ['shipped', '2026-04-21'],
              ['status', 'live · v1.2'],
              ['repo', 'github.com/ja/ww ↗'],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr',
                  padding: '8px 0',
                  borderBottom: '1px dashed var(--ink-2)',
                }}
              >
                <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 18 }}>
            {/* playback bar */}
            <div
              style={{
                height: 6,
                border: '1px solid var(--ink)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '0 65% 0 0',
                  background: 'var(--accent)',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: 'var(--ink-3)',
              }}
            >
              <span>◼ pause · ▶ play</span>
              <span>02.1s / 06.0s</span>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <span className="pill arrow-r">OPEN</span>
              <span className="pill">SOURCE ↗</span>
            </div>
          </div>
        </div>
      </div>

      <Margin style={{ right: -12, top: 60 }}>
        feels like a media player — every project is a "track"
      </Margin>
    </div>

    {/* filter pills */}
    <div
      style={{
        padding: '36px 40px 12px',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <span
        className="mono"
        style={{ fontSize: 12, color: 'var(--ink-3)', marginRight: 8 }}
      >
        filter ::
      </span>
      {['all (24)', 'tools', 'toys', 'games', 'experiments', 'one-day'].map(
        (t, i) => (
          <span
            key={t}
            className="pill"
            style={{
              background: i === 0 ? 'var(--ink)' : 'transparent',
              color: i === 0 ? 'var(--paper)' : 'var(--ink)',
              borderColor: 'var(--ink)',
            }}
          >
            {t}
          </span>
        )
      )}
    </div>

    {/* bento mixed grid */}
    <div
      style={{
        padding: '8px 40px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridAutoRows: '120px',
        gap: 14,
      }}
    >
      {/* row 1 */}
      <BentoTile span="span 3 / span 2" title="Lap Counter" sub="tool · 2026" tone="img" />
      <BentoTile span="span 3 / span 2" title="Pomodoro RPG" sub="game · 2025" tone="hatch" />
      {/* row 2 */}
      <BentoTile span="span 2 / span 1" title="Tone Picker" sub="toy" tone="img" />
      <BentoTile span="span 2 / span 1" title="Recipe Roulette" sub="tool · llm" tone="text" />
      <BentoTile span="span 2 / span 1" title="Word Garden" sub="experiment" tone="img" />
      {/* row 3 */}
      <BentoTile span="span 2 / span 2" title="Subway Status" sub="util" tone="img" />
      <BentoTile span="span 2 / span 1" title="Yarn Log" sub="tool · 2023" tone="text" />
      <BentoTile span="span 2 / span 1" title="Daily Doodle" sub="ritual" tone="hatch" />
      <BentoTile span="span 4 / span 1" title="Tide Clock" sub="experiment · 2024" tone="text" />
    </div>

    <Footer />
  </div>
);

const BentoTile = ({ span, title, sub, tone }) => {
  const body =
    tone === 'img' ? (
      <Ph label="thumb" style={{ position: 'absolute', inset: 0 }} />
    ) : tone === 'hatch' ? (
      <Hatch label="thumb" style={{ position: 'absolute', inset: 0 }} />
    ) : null;
  return (
    <div
      style={{
        gridColumn: span.split(' / ')[0],
        gridRow: span.split(' / ')[1],
        position: 'relative',
        border: '1.25px solid var(--ink)',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: tone === 'text' ? 'var(--paper)' : 'transparent',
      }}
    >
      {body}
      <div
        style={{
          position: 'relative',
          background: tone === 'text' ? 'transparent' : 'rgba(245,242,234,.85)',
          padding: tone === 'text' ? 0 : '6px 8px',
          border: tone === 'text' ? 0 : '1px solid var(--ink)',
          alignSelf: 'flex-start',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div
          className="mono"
          style={{ fontSize: 10, color: 'var(--ink-3)' }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────── 04 · Marquee Hero + Masonry */

const MarqueeMasonry = () => (
  <div className="wf">
    <Header />

    {/* Marquee hero */}
    <div style={{ padding: '36px 0 0', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 40px 14px',
          alignItems: 'baseline',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 900,
            letterSpacing: '-0.025em',
            lineHeight: 1,
          }}
        >
          Things I made,
          <br />
          mostly on Wednesdays.
        </h1>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          ↓ scroll for the full index
        </span>
      </div>

      {/* the marquee */}
      <div style={{ position: 'relative', marginTop: 16 }}>
        <div
          className="mono"
          style={{
            position: 'absolute',
            top: -6,
            left: 40,
            fontSize: 11,
            color: 'var(--ink-3)',
            background: 'var(--paper)',
            padding: '0 6px',
          }}
        >
          FEATURED · AUTO-SCROLL · HOVER TO PAUSE
        </div>
        <div
          style={{
            display: 'flex',
            gap: 22,
            padding: '22px 40px',
            borderTop: '1.25px solid var(--ink)',
            borderBottom: '1.25px solid var(--ink)',
            alignItems: 'flex-end',
          }}
        >
          {[
            { t: 'Lap Counter', big: false, opacity: 0.4 },
            { t: 'Tone Picker', big: false, opacity: 0.6 },
            { t: 'Wagon Wednesday', big: true, opacity: 1 },
            { t: 'Pomodoro RPG', big: false, opacity: 0.6 },
            { t: 'Word Garden', big: false, opacity: 0.4 },
          ].map((p, i) => (
            <div
              key={p.t}
              style={{
                flex: p.big ? '0 0 360px' : '0 0 220px',
                opacity: p.opacity,
              }}
            >
              <Ph
                label={p.big ? 'featured frame' : 'frame'}
                style={{ height: p.big ? 240 : 150 }}
                stripe={p.big ? 'stripes' : 'stripes-thin'}
              />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, fontSize: p.big ? 18 : 14 }}>
                  {p.t}
                </div>
                {p.big && <span className="mono" style={{ fontSize: 11 }}>OPEN →</span>}
              </div>
            </div>
          ))}
        </div>

        {/* dots */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            marginTop: 14,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: i === 2 ? 26 : 8,
                height: 8,
                borderRadius: 999,
                background: i === 2 ? 'var(--accent)' : 'transparent',
                border: '1.25px solid var(--ink)',
              }}
            />
          ))}
        </div>

        <Margin style={{ right: 14, top: 60 }}>
          edge frames dim — focus on the centered one. Click any frame to lock.
        </Margin>
      </div>
    </div>

    {/* masonry */}
    <div style={{ padding: '50px 40px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
          The whole pile <span className="mono" style={{ fontSize: 13, color: 'var(--ink-3)' }}>(24)</span>
        </h2>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          newest first
        </span>
      </div>

      <div style={{ columnCount: 3, columnGap: 22 }}>
        {[
          { h: 180, type: 'img', t: 'Lap Counter', tag: 'react · pwa' },
          { h: 110, type: 'text', t: 'Tide Clock', tag: 'a clock you smell' },
          { h: 240, type: 'img', t: 'Tone Picker', tag: 'canvas · audio' },
          { h: 140, type: 'hatch', t: 'Pomodoro RPG', tag: 'game · 2025' },
          { h: 90, type: 'note', t: '↳ on hiatus', tag: 'rewriting in zig' },
          { h: 200, type: 'img', t: 'Word Garden', tag: 'three.js' },
          { h: 130, type: 'text', t: 'Recipe Roulette', tag: 'llm · cli' },
          { h: 170, type: 'hatch', t: 'Subway Status', tag: 'scraper' },
          { h: 110, type: 'img', t: 'Yarn Log', tag: 'pwa · 2023' },
          { h: 140, type: 'text', t: 'Daily Doodle', tag: 'p5 · ritual' },
        ].map((p) => (
          <div
            key={p.t}
            style={{
              breakInside: 'avoid',
              marginBottom: 22,
              border: '1.25px solid var(--ink)',
              padding: p.type === 'note' ? 14 : 0,
              background: p.type === 'note' ? '#fef4a8' : 'transparent',
            }}
          >
            {p.type === 'img' && <Ph label="thumb" style={{ height: p.h, border: 0 }} />}
            {p.type === 'hatch' && <Hatch label="thumb" style={{ height: p.h, border: 0 }} />}
            {p.type === 'text' && (
              <div
                style={{
                  height: p.h,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.05 }}>
                  {p.t}
                </div>
              </div>
            )}
            {p.type !== 'note' && p.type !== 'text' && (
              <div style={{ padding: '10px 14px', borderTop: '1.25px solid var(--ink)' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.t}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  {p.tag}
                </div>
              </div>
            )}
            {p.type === 'text' && (
              <div style={{ padding: '8px 16px 14px' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  {p.tag}
                </div>
              </div>
            )}
            {p.type === 'note' && (
              <div className="hand" style={{ fontSize: 18, color: '#5a4a2a' }}>
                {p.t}
                <div className="mono" style={{ fontSize: 11, marginTop: 4 }}>
                  {p.tag}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);

/* ─────────────────────────────────────── 05 · Stacked Cards Hero */

const StackedCards = () => (
  <div className="wf">
    <Header />

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.9fr 1.1fr',
        gap: 40,
        padding: '48px 40px 24px',
        position: 'relative',
      }}
    >
      {/* left intro */}
      <div>
        <div className="mono" style={{ fontSize: 12, marginBottom: 14 }}>
          ◉ FEATURED · 5 PROJECTS
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.025em',
          }}
        >
          Click through
          <br />
          the stack
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <div
          style={{
            marginTop: 22,
            fontSize: 15,
            color: 'var(--ink-2)',
            lineHeight: 1.55,
            maxWidth: 360,
          }}
        >
          Each card is a project. Swipe, drag, or tap to deal the next one.
          Auto-deals every 8 seconds.
        </div>

        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <button
            style={{
              border: '1.25px solid var(--ink)',
              background: 'transparent',
              width: 36,
              height: 36,
              fontSize: 16,
            }}
          >
            ←
          </button>
          <span className="mono" style={{ fontSize: 12 }}>
            01 / 05
          </span>
          <button
            style={{
              border: '1.25px solid var(--ink)',
              background: 'var(--ink)',
              color: 'var(--paper)',
              width: 36,
              height: 36,
              fontSize: 16,
            }}
          >
            →
          </button>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 6 }}>
            or just drag the top card
          </span>
        </div>

        <Margin style={{ left: 0, top: 360 }}>
          peek at 2-3 cards behind — slight rotation, opacity step
        </Margin>
      </div>

      {/* right card stack */}
      <div style={{ position: 'relative', height: 440 }}>
        {[
          { i: 3, rot: 6, top: 30, left: 60, op: 0.35 },
          { i: 2, rot: -3, top: 18, left: 32, op: 0.55 },
          { i: 1, rot: 2, top: 8, left: 14, op: 0.8 },
          { i: 0, rot: 0, top: 0, left: 0, op: 1 },
        ].map(({ i, rot, top, left, op }) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top,
              left,
              right: i === 0 ? 0 : 60 - left,
              transform: `rotate(${rot}deg)`,
              opacity: op,
              background: 'var(--paper)',
              border: '1.5px solid var(--ink)',
              padding: 14,
              boxShadow: i === 0 ? '6px 6px 0 var(--ink)' : 'none',
              zIndex: 10 - i,
            }}
          >
            <Ph
              label={i === 0 ? 'project shot · 16:10' : ''}
              stripe={i === 0 ? 'stripes' : 'stripes-thin'}
              style={{ height: 260, border: '1px solid var(--ink)' }}
            />
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  {['Wagon Wednesday', 'Lap Counter', 'Tone Picker', 'Pomodoro RPG'][i]}
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  {['tool · ritual', 'tool · pwa', 'toy · audio', 'game'][i]}
                </div>
              </div>
              {i === 0 && <span className="pill arrow-r">OPEN</span>}
            </div>
          </div>
        ))}

        {/* deck indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: -28,
            left: 0,
            display: 'flex',
            gap: 6,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 3,
                background: i === 0 ? 'var(--ink)' : 'rgba(0,0,0,.15)',
              }}
            />
          ))}
        </div>
      </div>
    </div>

    <Rule style={{ marginTop: 28 }} />

    {/* compact horizontal list */}
    <div style={{ padding: '32px 40px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
          The deck (all 24)
        </h2>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          sort: recent · stack · scratched
        </span>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {[
          ['Recipe Roulette', 'llm tool · throws a recipe at you', '2025'],
          ['Subway Status', 'scraper · waves when the L is out', '2024'],
          ['Word Garden', 'a 3D garden you grow w/ words', '2024'],
          ['Daily Doodle', 'one drawing a day, append-only', '2024'],
          ['Yarn Log', 'pwa for knitters w/ counter', '2023'],
          ['Tide Clock', 'clock face = your local tide', '2023'],
        ].map(([t, d, y]) => (
          <div
            key={t}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 80px 40px',
              alignItems: 'center',
              gap: 18,
              padding: '10px 12px',
              border: '1.25px solid var(--ink)',
            }}
          >
            <Ph label="" style={{ height: 56 }} stripe="stripes-thin" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{t}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{d}</div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              {y}
            </span>
            <span style={{ textAlign: 'right' }}>→</span>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);

/* ─────────────────────────────────────────────── canvas mount */

const App = () => (
  <DesignCanvas
    title="Wagon Wednesday — Portfolio Wireframes"
    subtitle="Five low-fi directions · hero slideshow + project grid · clean dev-tool energy"
  >
    <DCSection
      id="hero-shapes"
      title="01 · Hero shapes"
      subtitle="Different ways the featured-project slideshow could read at the top of the page."
    >
      <DCArtboard id="classic" label="A · Classic carousel" width={1000} height={1600}>
        <ClassicHero />
      </DCArtboard>
      <DCArtboard id="editorial" label="B · Editorial / numbered" width={1000} height={1600}>
        <EditorialNumbered />
      </DCArtboard>
      <DCArtboard id="terminal" label="C · Now Playing" width={1000} height={1600}>
        <TerminalIndex />
      </DCArtboard>
      <DCArtboard id="marquee" label="D · Marquee + masonry" width={1000} height={1600}>
        <MarqueeMasonry />
      </DCArtboard>
      <DCArtboard id="stack" label="E · Deal-a-card stack" width={1000} height={1600}>
        <StackedCards />
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
