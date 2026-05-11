'use strict';

// ── Letter values (Scrabble-based) ────────────────────────────────────────────
const VAL = {
  A:1,B:3,C:3,D:2,E:1,F:4,G:2,H:4,I:1,J:8,
  K:5,L:1,M:3,N:1,O:1,P:3,Q:10,R:1,S:1,T:1,
  U:1,V:4,W:4,X:8,Y:4,Z:10
};

// Weighted pool — high-frequency letters appear more often
const POOL = 'AAAAAAAAABBBCCCDDDDEEEEEEEEEEEEFFFGGGHHHIIIIIIIIIJKLLLLMMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYYYZ'.split('');

// Build ring map for an N×N grid: 0=outer, increasing toward center
function buildRing(n) {
  const r = [];
  for (let row = 0; row < n; row++)
    for (let col = 0; col < n; col++)
      r.push(Math.min(row, col, n - 1 - row, n - 1 - col));
  return r;
}

// ── Level config ──────────────────────────────────────────────────────────────
const LEVELS = [
  { target: 100,  min: 3, label: 'Beginner' },
  { target: 300,  min: 3, label: 'Easy'     },
  { target: 650,  min: 4, label: 'Medium'   },
  { target: 1100, min: 4, label: 'Hard'     },
  { target: 1800, min: 5, label: 'Expert'   },
  { target: 2800, min: 5, label: 'Master'   },
  { target: 4200, min: 5, label: 'Champion' },
];

// ── Word list ─────────────────────────────────────────────────────────────────
let WORDS = null;

const FALLBACK = `ACE ACT ADD AGE AGO AID AIM AIR ALL AND ANT ANY APE APT ARC ARE ARK ARM
ART ASH ASK ATE AWE AXE AYE BAD BAG BAN BAR BAT BAY BED BET BID BIG BIT
BOG BOW BOX BOY BUD BUG BUN BUS BUT BUY CAB CAN CAP CAR CAT COB COD COG
COP COT COW CUB CUP CUR CUT DAB DAD DAM DEW DID DIG DIM DIP DOG DOT DUB
DUG DUN DUO EAR EAT EEL EGG EGO ELF ELK ELM END ERA EVE EYE FAD FAN FAR
FAT FED FEW FIG FIN FIT FLY FOE FOG FOR FOX FRY FUN FUR GAG GAL GAP GAS
GEL GEM GET GIG GIN GNU GOD GOT GUM GUN GUT GYM HAD HAM HAS HAT HAW HAY
HEM HER HEW HID HIM HIP HIS HIT HOE HOG HOP HOT HOW HUB HUE HUG HUM HUT
ICE ICY ILL IMP INK INN ION IRE IRK ITS IVY JAB JAG JAM JAR JAW JAY JET
JIG JOB JOT JOY JUG JUT KEG KIN KIT LAB LAP LAW LAY LEA LEG LET LID LIP
LIT LOG LOT LOW LUG MAD MAN MAP MAT MAW MIX MOB MOD MOM MOP MUD MUG MUM
NAG NAP NET NEW NIL NIP NIT NOD NOR NOT NUB NUN OAK OAR ODD ODE OIL OLD
ORB ORE OUR OUT OWE OWL OWN PAD PAL PAN PAP PAR PAT PAW PEA PEG PEN PEP
PER PET PIE PIG PIN PIT POD POP POT POW PRO PUB PUN PUP PUS PUT RAG RAM
RAN RAP RAT RAW RAY RED RIB RID RIG RIM RIP ROB ROD ROT ROW RUB RUG RUM
RUN RUT SAD SAG SAP SAT SAW SAY SEA SET SEW SIN SIP SIR SIT SKI SKY SOB
SOD SON SOP SOW SOY SPA SPY SUB SUE SUM TAB TAG TAN TAP TAR TEA TIN TIP
TOE TON TOO TOP TOY TUB TUG TUN TWO URN USE VAN VAT VIA VIE VIM WAR WAS
WAY WEB WED WIG WIN WIT WOE WON WOO YAM YAP YAW YEA YES YET YEW YIP YOU
ZAP ZED ZEN ZIP ZOO ABLE ACID AGED ALSO ARCH AREA ARMY ATOM AUNT AVID AWAY
BABY BACK BALD BAND BARE BARK BARN BASE BATH BEAK BEAN BEAR BEAT BEEN BELL
BENT BEST BITE BLOW BLUE BOLD BOLT BONE BOOK BORN BOTH BREW BROW BUFF BULB
BULK BULL BUMP BURN BUSY BYTE CALM CAME CANE CAPE CARD CARE CART CASE CAST
CAVE CELL CENT CHAP CHAT CHEF CHIP CITY CLAM CLAP CLAY CLOD CLOP CLOT CLUB
CLUE COAL COAT CODE COIL COIN COLD COME CONE COOK COOL COPY CORD CORE CORK
CORN COST COVE COWL CRAB CRAM CREW CROP CROW CUBE CURL CURB CUTE DALE DAMP
DARE DARK DATA DATE DAWN DEAD DEAL DEAN DEAR DEBT DECK DEED DEEP DEFT DENY
DESK DIAL DICE DIET DILL DIME DISC DISH DISK DIVE DOCK DOLE DOME DONE DOOR
DOSE DOTE DOVE DOWN DRAW DROP DRUG DRUM DUAL DUDE DULL DUMB DUMP DUNE DUSK
DUST DUTY EACH EARN EASE EAST EASY EDGE ELSE ENVY EPIC EVEN EVER EVIL EXAM
EXIT FACE FACT FAIL FAIR FALL FAME FARE FARM FAST FATE FEEL FEET FELL FEND
FERN FEST FILL FILM FIND FINE FIRE FIRM FIST FLAG FLAT FLEW FLIT FLOW FLUE
FOAM FOLD FOLK FOND FONT FOOL FOOT FORD FORE FORK FORM FORT FOUL FOWL FREE
FROG FROM FUEL FULL FUND FURY FUSE GALE GAME GANG GAPE GATE GEAR GERM GIFT
GILL GIVE GLAD GLEE GLUE GOAL GOLD GOLF GONE GOWN GRAB GRAY GREW GREY GRIN
GRIP GRIT GROW GULF GULL GUSH GUST HACK HAIL HALF HALL HALO HALT HAND HANG
HARD HARE HARM HARP HASH HAUL HAVE HAZE HEAD HEAL HEAP HEAR HEAT HEEL HELD
HELM HELP HERD HERE HERO HIKE HILL HILT HINT HIRE HOLD HOLE HOOD HOOP HOPE
HORN HOSE HOST HOUR HUGE HULL HUNT IDLE INCH INTO IRIS IRON ISLE ITEM JACK
JADE JAIL JEST JOIN JOLT JUNK JURY JUST KEEN KEEP KITE KNEE KNIT KNOB KNOW
LACK LADY LAID LAKE LAME LAMP LAND LANE LARK LASH LAST LATE LAUD LAWN LAZY
LEAD LEAF LEAN LEFT LEND LENS LENT LEVY LICK LIFE LIKE LIME LINK LION LIST
LIVE LOAD LOBE LOCK LOFT LONE LONG LOOK LORE LOST LOVE LUCK LUMP LURE LUST
MADE MAIL MAIN MAKE MALE MALL MALT MANE MANY MARE MARK MAST MATE MATH MAZE
MEAD MEAN MEAT MELT MEMO MERE MESH MILD MILE MILK MILL MIME MIND MINE MINT
MISS MIST MODE MOLE MOON MOOR MORE MOSS MOST MOTH MOVE MUCH MULE MUSE MUSK
MUST NAME NAVY NEED NEST NEXT NICE NORM NOSE NOTE NOUN NUDE NULL NUMB OBEY
OMEN ONCE ONLY ONTO OPEN ORAL OVEN OVER OWED PACK PAGE PAIN PAIR PALE PALM
PANG PARK PART PASS PAST PATH PAVE PEAK PEEL PEER PERK PEST PICK PINE PINK
PIPE PLAN PLAY PLOT PLOW PLUS POEM POET POLL POLO POND POOL PORE PORT POSE
POST POUR PRAY PREY PROD PROP PULL PUMP PURE PUSH RACE RACK RAID RAIL RAIN
RAKE RANG RANK RANT RARE RASH RATE RAVE READ REAL REAP REEL REIN RELY RENT
REST RICE RICH RIDE RING RIOT RISE RISK ROAD ROAM ROAR ROBE ROCK ROLL ROOF
ROOM ROOT ROPE ROSE ROTE ROUT RULE RUSE RUSH RUST SAFE SAGE SAIL SAKE SALE
SALT SAME SAND SANE SANG SANK SASH SAVE SCAN SEAL SEAM SEAR SEAT SEED SEEK
SEEM SEEN SELF SELL SEND SENT SHED SHIN SHIP SHOP SHOT SHOW SHUN SHUT SICK
SIDE SIFT SIGH SILK SINK SITE SIZE SKEW SKIN SKIP SLAB SLAM SLAP SLID SLIM
SLIP SLOT SLOW SLUG SLUM SLUR SMUG SNAP SNIP SNOW SOAK SOAR SOCK SOFT SOIL
SOLE SOLO SOME SONG SOOT SORT SOUL SOUP SOUR SPAN SPED SPIN SPIT SPOT SPUR
STAB STAR STAY STEM STEP STIR STOP STOW STUB STUD STUN SUCH SUIT SULK SUNG
SUNK SURE SURF SWAM SWAN SWAP SWAT SWIM SWUM SYNC TAKE TALE TALK TALL TAME
TANG TASK TEAM TEAR TEEM TELL TEND TENT TERM THEN THIN THOU THUS TICK TIDE
TIDY TILE TIME TINT TIRE TOLD TOLL TOMB TOME TONE TORE TORN TOSS TOUR TOWN
TRAP TREE TRIP TRUE TUBE TUCK TUNE TURF TURN TUSK TYPE UGLY UNDO UNIT UPON
URGE USED VAIN VALE VANE VEIL VEIN VEST VIEW VILE VINE VOID VOLT VOTE WAIL
WAKE WANE WARD WARE WARN WART WASH WATT WAVE WEAK WEAL WEAR WEED WEEK WELL
WEND WEST WIDE WIFE WILD WILL WILT WIND WINE WINK WISE WISH WISP WORE WORK
WORM WORN WRAP WREN WRIT YARD YARN ZONE ZOOM ABOUT ABOVE ABUSE ACHES ACRES
ADMIT ADOPT ADULT AFTER AGAIN AGENT AGREE AHEAD ALARM ALBUM ALLEY ALLOW ALONG
ANGEL ANGER ANGLE ANGRY ANTIC ANVIL APPLY APRON APART ARENA ARGUE ARISE ARMOR
AROMA AROSE ARRAY ARSON ASIDE ASKED ATTIC AUDIT AVOID AWAKE AWASH AWFUL AWOKE
AZURE BADGE BADLY BAGEL BAGGY BASIC BASIN BASIS BATCH BATTY BEARD BEAST BEGAN
BEGIN BEING BELLY BENCH BERRY BINGO BIRCH BISON BLESS BLIND BLISS BLOCK BLOND
BLOOD BLOOM BLOWN BLUNT BOARD BONUS BOOTH BOSSY BOTCH BOUGH BRAID BRAIN BRAKE
BRAND BRAVE BRAWL BREAD BREAK BREED BRICK BRIDE BRIEF BRINE BRINK BRISK BROAD
BROKE BROOK BROTH BROWN BRUSH BRUTE BUDDY BUDGE BUGLE BUILD BUILT BULGE BULLY
BUMPY BUNCH BURLY BURST CANDY CARGO CAROL CASTE CEDAR CHAOS CHASE CHEAP CHEAT
CHECK CHEEK CHEER CHESS CHEST CHICK CHIEF CHILD CHINA CHOIR CHORD CHORE CHOSE
CHUCK CHURN CIVIC CIVIL CLAIM CLANK CLASH CLASP CLASS CLEAN CLEAR CLERK CLICK
CLIFF CLIMB CLING CLOSE CLOTH CLOUD CLOWN COACH COLON COMET COMIC COMMA CORAL
COUCH COULD COURT COVER COVET CRAMP CRANE CREAK CREAM CREST CRIME CRISP CROSS
CROWD CRUEL CRUMB CRUST CYCLE DAILY DAISY DANCE DANDY DECAY DECOY DECRY DELAY
DELTA DENSE DEPOT DERBY DETER DIGIT DITTY DIZZY DODGE DOGMA DOING DOLLY DOUBT
DOUGH DOUSE DOWDY DOZEN DRAFT DRAIN DRAPE DRIVE DRONE DROVE DRUNK DRYER DWARF
DWELL EAGER EAGLE EARLY EARTH EASEL EATEN EIGHT EJECT ELITE ELBOW EMPTY ENDOW
ENJOY ENTER ENTRY ENVOY EQUAL ERODE ESSAY EVADE EVICT EXACT EXERT EXILE EXIST
EXPEL EXTRA FABLE FACET FAINT FAIRY FALSE FANCY FANGS FARCE FATAL FEAST FEIGN
FELON FEMUR FENCE FERRY FETCH FEVER FIEND FIFTH FIFTY FIGHT FINAL FINCH FIRST
FIXED FIZZY FLAKE FLAME FLANK FLARE FLASH FLASK FLEET FLESH FLINT FLOOD FLOOR
FLORA FLOSS FLOUR FLUSH FOCUS FOGGY FORAY FORCE FORGE FORGO FORUM FOYER FRAIL
FRAME FRANK FRAUD FREAK FRESH FRIAR FRIED FROTH FROZE FRUIT FUGUE FULLY FUNGI
FUNKY FUNNY FUTON FUZZY GAUZE GAVEL GAWKY GIDDY GIVEN GLAND GLARE GLASS GLEAM
GLEAN GLOOM GLORY GLOSS GLOVE GODLY GOOSE GOUGE GOURD GRACE GRADE GRANT GRASP
GRATE GRAVE GRAZE GREED GREET GRIEF GRIME GRIPE GROAN GROIN GROOM GROPE GROSS
GROUT GROVE GRUFF GUARD GUIDE GUILD GUISE GUSTO GYPSY HABIT HASTY HAUNT HAVEN
HEDGE HENCE HERBS HITCH HOARD HOBBY HOLLY HONEY HONOR HORDE HOTEL HOUND HOVER
HUMAN HUMID HURRY IGLOO IMAGE INFER INNER INPUT INTER INTRO IVORY JAZZY JELLY
JEWEL JUICY JUMBO JUMPY KITTY KNAVE KNEEL KNIFE KNOCK KUDOS LABEL LANCE LAYER
LEACH LEAFY LEAPT LEASE LEASH LEAST LEAVE LEDGE LEGAL LEMON LEVEL LIGHT LIMIT
LINER LIVER LOBBY LOOSE LOVER LOWER LOYAL LUCID LUCKY LUNAR LUSTY LYING MAGIC
MAPLE MARCH MARRY MATCH MANOR MAYOR MEDAL MEDIA MERCY METAL MIGHT MINCE MISER
MOODY MOOSE MORPH MOSSY MOUND MOURN MOUTH MUDDY MUGGY MUMMY NASAL NAVAL NERVE
NEVER NIGHT NIFTY NOBLE NOTED NOVEL NURSE NYMPH OFFER OFTEN OLIVE ONION ONSET
OPERA ORBIT ORDER ORGAN OTTER OUGHT OUNCE OUTER OUTDO OWING OZONE PANDA PANIC
PATIO PATSY PEACH PECAN PETAL PETTY PHASE PHONE PHOTO PIANO PILOT PINCH PIOUS
PIXIE PIZZA PLACE PLAID PLAIN PLAIT PLANE PLANK PLANT PLATE PLAZA PLEAT PLUCK
PLUMP PLUSH POACH POLAR POLKA POPPY POTTY POUCH POUND POWER PRICE PRIDE PRIME
PRISM PRIZE PROBE PRONG PROOF PROSE PROUD PROVE PROWL PRUDE PRUNE PSALM PUFFY
PUPPY PURGE PUSHY QUALM QUART QUEEN QUEST QUEUE QUILL QUIRK QUOTA QUOTE RABBI
RADAR RADIO RAINY RALLY RANCH RAVEN RAZOR REACH REALM REBEL REFER REIGN RELAX
REMIT REPAY REPEL RERUN REUSE RIDGE RIFLE RIPEN RISKY RIVET ROBIN ROCKY RODEO
ROGUE ROOMY ROUGH ROUND ROWDY ROYAL RUGBY RULER RUNNY RUSTY SADLY SANDY SAUCE
SCALD SCALE SCALP SCAMP SCANT SCARE SCARF SCARY SCENE SCONE SCOOP SCORE SCORN
SCOUR SCOUT SCREW SEIZE SERUM SHACK SHADE SHAFT SHAKY SHAME SHAPE SHARE SHARK
SHARP SHAVE SHAWL SHEEN SHELF SHOWY SHRUB SIDED SIEGE SILLY SINCE SIXTH SIXTY
SIZED SKATE SKULK SLAIN SLANT SLATE SLEET SLICK SLIME SLIMY SLOPE SLOTH SLUMP
SMALL SMART SMASH SMEAR SMILE SMITE SMOKE SNACK SNAIL SNAKE SNARE SNEAK SNEER
SNIFF SNORT SOGGY SOLID SOLVE SONIC SOUTH SPACE SPADE SPARK SPARE SPASM SPEAR
SPECK SPEED SPELL SPEND SPILL SPINE SPITE SPLAT SPOIL SPOKE SPOON SPORT SPOUT
SPREE SQUAT SQUID SQUAD STALE STALL STAMP STAND STANK STARK START STASH STEAK
STEAL STEEL STEEP STEER STERN STICK STIFF STILL STOMP STONE STOOL STORE STORK
STORM STORY STOVE STRAP STRAW STRAY STRIP STUCK STUNG STUNK STUNT STYLE SUGAR
SUITE SULKY SUPER SURGE SWEAR SWEAT SWEET SWEPT SWIRL SWOOP SWORD SYRUP TABOO
TALON TANGO TAPIR TAUNT TAWNY TEMPT TENSE TERSE THEFT THORN THREW THROW THRUM
THUMP TIDAL TIGER TIMER TIPSY TITLE TOAST TOKEN TONGS TOPIC TORCH TOTAL TOTEM
TOUCH TOXIC TRACE TRACK TRAIL TRAIN TRAIT TRAMP TRASH TREAD TREAT TREND TRIAL
TRIBE TRICK TRIED TROUT TROVE TRUCE TRULY TRUNK TRYST TULIP TUMOR TUNER TUNIC
TWANG TWEED TWIRL TWIST ULTRA UNCUT UNDER UNFIT UNIFY UNION UNITE UNTIE UNZIP
UPPER USHER USUAL UTTER VAGUE VALID VALOR VALVE VAULT VAUNT VIGOR VIRUS VISIT
VISTA VITAL VIVID VIXEN VOCAL VOGUE VOTER VOUCH VOWEL WAFER WALTZ WAVER WEARY
WEAVE WEDGE WEIRD WHALE WHEAT WHICH WHILE WHISK WHOOP WHOSE WIDEN WIDOW WITCH
WOKEN WOMAN WOMEN WORLD WORRY WORSE WORST WORTH WOULD WOUND WRATH WRING WROTE
XYLEM YACHT YEARN YIELD YOUNG YOUTH ZESTY ZINGY`.trim().split(/\s+/).filter(w => w.length >= 3);

// Short list used to pick a bonus word (common 3–5 letter words)
// ── Bonus word pool — 5–7 letter adjectives and animals ──────────────────────
const BONUS_POOL = [
  // 5-letter animals
  'TIGER','EAGLE','KOALA','PANDA','BISON','OTTER','RAVEN','COBRA','CRANE',
  'HERON','SHREW','TAPIR','FINCH','VIPER','QUAIL','GECKO','TROUT',
  // 6-letter animals
  'FALCON','JAGUAR','WALRUS','MARMOT','BABOON','TOUCAN','PARROT','SALMON',
  'IMPALA','RABBIT','TURTLE','WEASEL','BADGER','FERRET','PUFFIN','OSPREY',
  'CONDOR','MAGPIE','GIBBON','IGUANA','LIZARD','GOPHER',
  // 7-letter animals
  'PENGUIN','DOLPHIN','SPARROW','PANTHER','CHEETAH','GIRAFFE','LOBSTER',
  'HAMSTER','PEACOCK','VULTURE','BUFFALO','GORILLA','PELICAN','CARIBOU',
  // 5-letter adjectives
  'BRAVE','SWIFT','LUCKY','FUZZY','WITTY','JOLLY','PROUD','FANCY','VIVID',
  'SUNNY','NOBLE','ZESTY','CRISP','SHARP','SLEEK','PLUMP',
  // 6-letter adjectives
  'GOLDEN','SILVER','BRIGHT','CLEVER','FROZEN','HUMBLE','GENTLE','MIGHTY',
  'STORMY','BREEZY','NIMBLE','GLOSSY','FLUFFY','GRUMPY','FEISTY','BUBBLY',
  'CHUNKY','LIVELY','DREAMY','CRAFTY','SERENE','FRISKY',
  // 7-letter adjectives
  'VIBRANT','RADIANT','PLAYFUL','CRIMSON','VERDANT','BASHFUL','ELEGANT',
  'ANCIENT','FERTILE','FURIOUS',
];

async function loadWords() {
  try {
    const raw = localStorage.getItem('qwc_words_v3');
    if (raw) { WORDS = new Set(raw.split('\n')); return; }
  } catch (_) {}

  setLoadPct(12);
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res  = await fetch(
      'https://cdn.jsdelivr.net/gh/dwyl/english-words@master/words_alpha.txt',
      { signal: ctrl.signal }
    );
    clearTimeout(tid);
    setLoadPct(65);
    const text = await res.text();
    const arr  = text.split('\n')
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length >= 3 && w.length <= 8 && /^[A-Z]+$/.test(w));
    WORDS = new Set(arr);
    setLoadPct(92);
    try { localStorage.setItem('qwc_words_v3', arr.join('\n')); } catch (_) {}
  } catch (_) {
    clearTimeout(tid);
    WORDS = new Set(FALLBACK);
  }
  setLoadPct(100);
}

const isWord = w => WORDS && WORDS.has(w.toUpperCase());

// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  phase:     'loading',
  level:     1,
  score:     0,
  tiles:     [],
  sel:       [],
  history:   [],
  bonusWord: '',
  gridSize:  5,
};

// ── Grid helpers ──────────────────────────────────────────────────────────────
function randLetter() { return POOL[Math.floor(Math.random() * POOL.length)]; }
function newGrid()    { return buildRing(S.gridSize).map(ring => ({ letter: randLetter(), ring })); }
function levelCfg()   { return LEVELS[Math.min(S.level - 1, LEVELS.length - 1)]; }

function pickBonus() {
  // Only pick words confirmed to be in the loaded dictionary
  const pool = WORDS ? BONUS_POOL.filter(w => WORDS.has(w)) : BONUS_POOL;
  const candidates = pool.length > 0 ? pool : BONUS_POOL;
  let word;
  do { word = candidates[Math.floor(Math.random() * candidates.length)]; }
  while (candidates.length > 1 && word === S.bonusWord);
  S.bonusWord = word;
  const el = $('bonus-word');
  if (el) el.textContent = word;
}

// ── Selection rules ───────────────────────────────────────────────────────────
function canSelect(idx) {
  if (S.sel.includes(idx)) return false;
  if (!S.sel.length) return true;
  return S.tiles[idx].ring >= S.tiles[S.sel[S.sel.length - 1]].ring;
}

// ── Scoring ───────────────────────────────────────────────────────────────────
function lm(len) {
  return len <= 2 ? 0.5 : len === 3 ? 1 : len === 4 ? 1.5 : len === 5 ? 2 : len === 6 ? 2.5 : 3;
}

function wordScore(sel) {
  if (!sel.length) return 0;
  const maxRing   = Math.floor(S.gridSize / 2);
  const letterSum = sel.reduce((s, i) => s + (VAL[S.tiles[i].letter] || 1), 0);
  const cb        = S.tiles[sel[sel.length - 1]].ring === maxRing ? 3 : 1;
  return Math.floor(letterSum * lm(sel.length) * cb);
}

// Live display value per tile — increases with word length and ring depth
function tileDisplayValue(idx) {
  const tile     = S.tiles[idx];
  const base     = VAL[tile.letter] || 1;
  const maxRing  = Math.floor(S.gridSize / 2);
  // Linear scale: outer ring = 1×, center = 3×
  const ringMult = maxRing === 0 ? 1 : 1 + (tile.ring / maxRing) * 2;
  // Length multiplier for what the word would be if this tile is added next
  return Math.max(1, Math.round(base * ringMult * lm(S.sel.length + 1)));
}

// ── Grid style ────────────────────────────────────────────────────────────────
function applyGridStyles() {
  const n    = S.gridSize;
  const root = document.documentElement;
  root.style.setProperty('--grid-cols', n);
  if (n === 3) {
    root.style.setProperty('--tile-sz', 'clamp(60px, 20vw, 120px)');
  } else if (n === 7) {
    root.style.setProperty('--tile-sz', 'clamp(26px, 9vw, 64px)');
  } else {
    root.style.removeProperty('--tile-sz'); // let CSS media queries handle 5×5
  }
}

// ── Rendering ─────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function setLoadPct(pct) {
  const el = $('load-fill');
  if (el) el.style.width = pct + '%';
}

function showScreen(name) {
  S.phase = name;
  document.querySelectorAll('.screen').forEach(s =>
    s.classList.toggle('active', s.id === 'sc-' + name)
  );
}

function renderHeader() {
  const cfg = levelCfg();
  $('hdr-score').textContent  = S.score;
  $('hdr-target').textContent = cfg.target;
  $('hdr-lvl').textContent    = S.level;
  $('hdr-words').textContent  = S.history.length;
}

function renderWordBar() {
  const bar = $('word-display-bar');
  const sub = $('btn-submit');
  if (!bar) return;

  if (!S.sel.length) {
    bar.innerHTML = '<span class="bar-placeholder">Tap letters to form a word</span>';
    if (sub) sub.disabled = true;
    return;
  }

  const pts     = wordScore(S.sel);
  const maxRing = Math.floor(S.gridSize / 2);
  const last    = S.tiles[S.sel[S.sel.length - 1]];
  const bonus   = last.ring === maxRing ? ' ⭐×3' : '';
  const chips = S.sel
    .map(i => `<span class="bar-chip r${S.tiles[i].ring}">${S.tiles[i].letter}</span>`)
    .join('');
  bar.innerHTML = chips + `<span class="bar-pts">${pts}pts${bonus}</span>`;

  if (sub) sub.disabled = S.sel.length < levelCfg().min;
}

function renderGrid() {
  const grid = $('grid');
  if (!grid) return;

  const n       = S.gridSize;
  const total   = n * n;
  const maxRing = Math.floor(n / 2);

  if (grid.children.length !== total) {
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${n}, var(--tile-sz))`;
    grid.style.gridTemplateRows    = `repeat(${n}, var(--tile-sz))`;
    S.tiles.forEach((_, idx) => {
      const el = document.createElement('div');
      el.id = 'tile-' + idx;
      el.className = 'tile';
      el.innerHTML = '<span class="tile-letter"></span><span class="tile-value"></span>';
      el.addEventListener('click', () => onTileClick(idx));
      el.addEventListener('touchstart', e => { e.preventDefault(); onTileClick(idx); }, { passive: false });
      grid.appendChild(el);
    });
  }

  S.tiles.forEach((t, idx) => {
    const el  = $('tile-' + idx);
    const lEl = el.querySelector('.tile-letter');
    const vEl = el.querySelector('.tile-value');

    if (lEl.textContent !== t.letter) {
      lEl.textContent = t.letter;
      el.classList.add('flash-in');
      setTimeout(() => el.classList.remove('flash-in'), 380);
    }
    vEl.textContent = tileDisplayValue(idx);

    const isSel  = S.sel.includes(idx);
    const isBlk  = !isSel && S.sel.length > 0 && !canSelect(idx);
    const isCtr  = t.ring === maxRing;
    el.className = `tile r${t.ring}${isCtr ? ' center' : ''}${isSel ? ' sel' : ''}${isBlk ? ' blocked' : ''}`;
  });
}

function renderBook() {
  const left  = $('book-left');
  const right = $('book-right');
  if (!left || !right) return;

  const words = [...S.history];
  const half  = Math.ceil(words.length / 2);
  left.innerHTML  = words.slice(0, half).map(h => `<div class="book-word">${h.word}</div>`).join('');
  right.innerHTML = words.slice(half).map(h  => `<div class="book-word">${h.word}</div>`).join('');
}

function render() {
  renderHeader();
  renderWordBar();
  renderGrid();
  renderBook();
}

// ── Messages ──────────────────────────────────────────────────────────────────
let msgTimer = null;
function msg(text, type = 'info') {
  clearTimeout(msgTimer);
  const el = $('msg');
  el.innerHTML = `<span class="msg ${type}">${text}</span>`;
  msgTimer = setTimeout(() => { el.innerHTML = ''; }, 2600);
}

// ── Game actions ──────────────────────────────────────────────────────────────
function onTileClick(idx) {
  if (S.phase !== 'game') return;

  // Tap last selected tile to undo it
  if (S.sel.length && S.sel[S.sel.length - 1] === idx) {
    S.sel.pop();
    render();
    return;
  }
  if (!canSelect(idx)) return;
  S.sel.push(idx);
  render();
  if (navigator.vibrate) navigator.vibrate(8);
}

function clearSel() {
  S.sel = [];
  render();
}

function shuffleLetters() {
  S.tiles.forEach(t => { t.letter = randLetter(); });
  S.sel = [];
  render();
  msg('Letters shuffled!', 'info');
}

function submitWord() {
  const cfg  = levelCfg();
  const word = S.sel.map(i => S.tiles[i].letter).join('');

  if (word.length < cfg.min) {
    msg(`Need ${cfg.min}+ letters this level!`, 'bad'); return;
  }
  if (!isWord(word)) {
    msg(`"${word}" is not a valid word!`, 'bad'); return;
  }
  if (S.history.some(h => h.word === word)) {
    msg(`"${word}" already used!`, 'bad'); return;
  }

  const isBonus = word === S.bonusWord;
  const pts = wordScore(S.sel) * (isBonus ? 2 : 1);
  S.score  += pts;
  S.history.push({ word, pts });

  const used = [...S.sel];
  S.sel = [];
  used.forEach(i => { S.tiles[i].letter = randLetter(); });

  if (isBonus) {
    msg(`🎉 BONUS WORD! +${pts} pts!`, 'ok');
    pickBonus();
  } else {
    msg(`+${pts} pts!`, 'ok');
  }
  render();

  if (S.score >= cfg.target) setTimeout(showLevelComplete, 550);
}

// ── Options menu ──────────────────────────────────────────────────────────────
let pendingGridSize = null;

function openOptions() {
  document.querySelectorAll('.opt-grid-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.size) === S.gridSize);
  });
  $('options-overlay').classList.remove('hidden');
}
function closeOptions() {
  $('options-overlay').classList.add('hidden');
}
function openGridConfirm(size) {
  pendingGridSize = size;
  $('gridsize-overlay').classList.remove('hidden');
}
function closeGridConfirm() {
  pendingGridSize = null;
  $('gridsize-overlay').classList.add('hidden');
}
function applyGridSize(size) {
  S.gridSize = size;
  closeGridConfirm();
  closeOptions();
  startGame();
}

// ── Screen transitions ────────────────────────────────────────────────────────
function startGame() {
  S.level   = 1;
  S.score   = 0;
  S.history = [];
  S.sel     = [];
  S.tiles   = newGrid();
  if ($('grid')) $('grid').innerHTML = '';
  applyGridStyles();
  pickBonus();
  showScreen('game');
  render();
  msg(`Level 1 · ${levelCfg().label} · ${levelCfg().min}+ letter words!`, 'info');
}

function showLevelComplete() {
  $('lc-pts').textContent   = `You scored ${S.score} points!`;
  $('lc-words').textContent = `${S.history.length} word${S.history.length === 1 ? '' : 's'} found`;
  const best = parseInt(localStorage.getItem('qwc_best_lvl') || '0', 10);
  if (S.level > best) localStorage.setItem('qwc_best_lvl', S.level);
  showScreen('levelComplete');
}

function nextLevel() {
  S.level  += 1;
  S.score   = 0;
  S.history = [];
  S.sel     = [];
  S.tiles   = newGrid();
  if ($('grid')) $('grid').innerHTML = '';
  applyGridStyles();
  pickBonus();
  showScreen('game');
  render();
  msg(`Level ${S.level} · ${levelCfg().label} · ${levelCfg().min}+ letter words!`, 'info');
}

function updateBestScore() {
  const best = parseInt(localStorage.getItem('qwc_best_lvl') || '0', 10);
  const el   = $('best-score');
  if (el) el.textContent = best > 0 ? `Best: reached Level ${best}` : '';
}

// ── Hint ──────────────────────────────────────────────────────────────────────
function giveHint() {
  if (S.phase !== 'game') return;
  msg(`Bonus word: ${S.bonusWord}`, 'info');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function init() {
  showScreen('loading');

  $('btn-play').addEventListener('click', startGame);
  $('btn-howto').addEventListener('click', () => showScreen('howto'));
  $('btn-howto-back').addEventListener('click', () => showScreen('menu'));
  $('btn-submit').addEventListener('click', submitWord);
  $('btn-clear').addEventListener('click', clearSel);
  $('btn-shuffle').addEventListener('click', shuffleLetters);
  $('btn-next-level').addEventListener('click', nextLevel);
  $('btn-play-again').addEventListener('click', startGame);
  $('btn-go-menu').addEventListener('click', () => { showScreen('menu'); updateBestScore(); });
  $('btn-hint').addEventListener('click', giveHint);
  $('btn-hdr-menu').addEventListener('click', openOptions);
  $('opt-resume').addEventListener('click', closeOptions);
  $('opt-quit').addEventListener('click', () => { window.location.href = 'https://wagonwednesday.app'; });
  document.querySelectorAll('.opt-grid-btn').forEach(btn => {
    btn.addEventListener('click', () => openGridConfirm(parseInt(btn.dataset.size)));
  });
  $('opt-gridsize-ok').addEventListener('click', () => pendingGridSize && applyGridSize(pendingGridSize));
  $('opt-gridsize-cancel').addEventListener('click', closeGridConfirm);

  document.addEventListener('keydown', e => {
    if (S.phase !== 'game') return;
    if (e.key === 'Enter')     submitWord();
    if (e.key === 'Escape')    clearSel();
    if (e.key === 'Backspace') { S.sel.pop(); render(); }
  });

  await loadWords();
  updateBestScore();
  showScreen('menu');
}

document.addEventListener('DOMContentLoaded', init);
