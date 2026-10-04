# Unloop landing: ideas, research, storyboard

For the designer-builder. Opinionated and skimmable. Assets are named by path under `landing/assets/`. Brand rules come from `BRIEF.md` and do not change.

---

## 0. TL;DR (read this if nothing else)

- **The one feeling:** "Oh. That's my time. And it can come back." Relief, not guilt.
- **Build these four first (ranked):** (1) **The Hours Dial**: the real hours slider, dragged, turns into years of your life. (2) **The Quiet**: a hold-to-pause breath ring where the page itself goes still. (3) **The Ring Fills**: Home ring filling on scroll, minutes becoming Time Coins that drop and stack. (4) **Out of the Phone**: a line character draws itself, then steps out of the phone frame into open ivory space.
- **Cut:** full doomscroll simulator with a fake social feed (shame, and too close to imitating real apps), WebGL coin, confetti of any kind, scroll-jacking.
- **Tech:** plain CSS + vanilla JS + inline SVG. CSS scroll-driven animations where supported, with an IntersectionObserver fallback. GSAP + ScrollTrigger from cdnjs only if the pinned sections get hairy (GSAP is free, plugins included, since 2025). No WebGL.
- **Motion:** slow ease-out, nothing bounces, nothing flashes, everything respects `prefers-reduced-motion`.

---

## 1. Audience and the emotional job

**Who arrives:** people who already know they scroll too much. They have opened Screen Time, winced, and closed it. Many have tried blockers that felt like a parent or a punishment. They are tired, a little ashamed, and allergic to being lectured. They do not need persuading that phones are a problem; they need to believe change can feel *kind*.

**What Unloop uniquely offers:** time away becomes *visible* (the ring) and *worth something* (Time Coins you spend on real life: a quiet coffee, a mosaic workshop). That is the emotional pivot: from loss to accrual.

| Moment | They should feel | Not | How the page does it |
|---|---|---|---|
| **First 5 s** | Exhale. "This is soft. This is for me." | Alarm, stats, red numbers | Ivory, one line character sitting quietly, one short sentence, lots of space. Something moves slowly (a line drawing itself). No clutter above the fold. |
| **~30 s** | A small, private "oh." Their own hours, made physical, then made *recoverable*. | Shame, guilt-trip math | They drag the hours slider themselves. The years appear, then immediately the reframe: "and here's what an hour back looks like." The ring fills; a coin lands. |
| **At the CTA** | Quiet resolve. "I'd like to try this." Like closing a laptop on a Sunday. | Urgency, FOMO, discount timers | The page goes still. A breath. One pill button. One line: "Your time is worth something." |

Guiding rule: **every hard truth is followed within one scroll by a gentle way back.** The page never leaves the visitor sitting in a bad number.

---

## 2. Research: reference sites

Steal the *technique*, never the look. Unloop's look is ivory, orange hairlines, Comfortaa, one glossy coin.

| # | Site | What it does brilliantly | Exact technique | Steal | Avoid |
|---|---|---|---|---|---|
| 1 | **neal.fun/deep-sea** | Makes an abstract number (depth) physical by making you *scroll through it*. | One very tall page; a fixed depth counter updates on scroll; content positioned at absolute "meters". | A counter that is honest about scale; a long quiet stretch where almost nothing happens *is* the message. | The length. We want a 30-second version, not 10 minutes. |
| 2 | **neal.fun/life-stats** | Your birthday becomes heartbeats and breaths: time turned into countable, personal things. | One input, then live-ticking numbers via `requestAnimationFrame`. | Personal input → personal numbers. The age wheel in our app is exactly this input. | Raw big-number shock with no "what now". |
| 3 | **Wait But Why, "Your Life in Weeks"** (waitbutwhy.com/2014/05/life-weeks.html) | A grid of ~4,700 tiny boxes makes a life finite and visible in one glance. | Static grid of dots/boxes; the power is in the count. | A dot grid as a quiet visual unit for "hours of your year". | Mortality framing. We say "your time", never "before you die". |
| 4 | **Apple product pages (AirPods / iPhone)** | Scroll scrubs an object through a choreographed turn; feels like holding it. | Image-sequence on `<canvas>`: N frames preloaded, frame index = scroll progress; sticky container. | Our Coin page has a **75-variant turntable**. That is a ready-made image sequence. | 100+ MB of frames. Keep to ~24-36 WebP frames, small. |
| 5 | **The Pudding** (pudding.cool, e.g. data essays) | Scrollytelling where a sticky graphic changes state as text steps pass by. | Sticky figure + text "steps"; IntersectionObserver (Scrollama pattern) triggers states. | The pattern for the phone mockup: phone stays sticky, steps on the side change its screen. | Long paragraphs. Our steps are one line each. |
| 6 | **one sec** (one-sec.app) | Its product *is* a pause (a breath before the app opens). Copy is plain, second-person ("You just wanted to check that one message..."). | Annotated phone mockups of the intervention; stats with science backing. | Speaking to the exact micro-moment. Credible, specific stats. | Its static presentation. We should let people *do* the pause, not see a screenshot of it. Also its "hate scrolling" edge: too combative for us. |
| 7 | **Opal** (opalapp.com, by Our Life's Work) | Empathetic opener ("Focus is hard"), gems as visible reward, features named as rituals ("Bedtime Shield"). | Live UI previews in mockups, reward objects as recurring visual motif. | A single reward object as the throughline (our coin). Naming moments, not features. | Dark UI, glow, gradients: everything Unloop is not. |
| 8 | **Headspace / Calm** | Instantly lowers the heart rate: big soft shapes, slow motion, one breath animation. | Looping Lottie/CSS breath shapes; very slow eases (4-8 s cycles). | Breath timing: 4 s in, 6 s out. A single breathing shape as the CTA's companion. | Cartoon blobs, blue/purple night skies, stock nature-video heroes. |
| 9 | **Endel** (endel.io) | Ambient generative visuals that react subtly to context; the site feels like the product. | Canvas/WebGL generative shapes keyed to time of day. | Time-of-day greeting ("Good morning") and subtle variation by local hour. Our Home already says "Good Morning". | WebGL weight; abstract gradients. |
| 10 | **Brick** (getbrick.com) | Makes the abstract (blocking) physical: a thing you tap. | Product photography, short lifestyle copy, "Do more of what matters". | Ending on life, not on the phone: "what matters" photography (we have rewards photos). | Hardware-shop layout. |
| 11 | **Awwwards scroll-storytelling examples** (awwwards.com/awwwards/collections/storytelling) | Line illustrations that draw themselves as you scroll; scenes that transition by morphing. | SVG `stroke-dasharray`/`stroke-dashoffset` tied to scroll progress; sticky scenes. | Line drawing is the most on-brand technique available to us: our characters *are* single strokes. | Heavy parallax stacks, scroll hijacking, preloader screens. |
| 12 | **ustwo's PAUSE app** (mindfulness via touch) | Calm through a slow, continuous gesture: you hold and move slowly, and if you rush, it gently stops. | Touch-and-hold with slow feedback; rushing resets the state. | **Hold-to-confirm** that only works if you are slow. Matches the app's hold-to-confirm. | Nothing; it's a principle, not a look. |

**Platform note:** CSS scroll-driven animations (`animation-timeline: scroll()/view()`) ship in Chrome/Edge 115+ and Safari 26; Firefox stable support is still uneven. Use them behind `@supports (animation-timeline: view())` with an IntersectionObserver fallback that just plays the end state with a fade.

---

## 3. Concepts ("show, don't tell" moments)

Ranked. Score = emotional payoff × buildability. **Keep** the top 7, **maybe** 8-10, **cut** the rest unless there is time.

### 1. The Hours Dial (KEEP, hero-adjacent)
- **Sees/does:** The real hours screen, enlarged: "How much time do you spend on your phone?" A huge Comfortaa number (default 4). The sitting character with glasses sits *on* the slider track, exactly as in the app. Visitor drags. Under the number, a second line quietly recalculates: "4 hours a day is **61 days** a year." Keep dragging to 10 and the line becomes "...**152 days** a year. Five months." Then below, a soft reframe fades in: "Get one hour back, and that's **15 days** a year. Yours."
- **Why it works:** they enter their own number; the math is about *them*, so no claim has to be made. And the last line hands back time, not blame.
- **Build:** native `<input type="range">` styled to match (black thumb, orange fill, #DAC4B2 track), +/- pill buttons, `aria-live="polite"` on the result. Number tween with rAF (200 ms). Character is an absolutely positioned SVG whose `left` follows the thumb (or stays seated at track start as in the app; test both). Optional age wheel next to it turns days into "of your remaining years", but only if it stays gentle (see Copy).
- **Difficulty:** S. **Assets:** `screens/hours.png` as reference, `characters/character-reader-glasses.png` (re-export as SVG from Figma Illustrations > Characters).

### 2. The Quiet (KEEP, pre-CTA)
- **Sees/does:** The page dims nothing; it *empties*. Everything fades except a single ring (the Home ring's track color) and a line: "Hold here. Just for a breath." Visitor presses and holds the ring (mouse, touch, or Space). The ring stroke draws around over 4 s like an inhale; releasing early lets it gently unwind (no error). Completing it: the ring settles, a coin appears in its center, and the text changes to "That's what it feels like to choose."
- **Why:** it is the product in miniature: pausing, choosing, being rewarded. You *feel* the 4 seconds. Mirrors the app's hold-to-confirm.
- **Build:** SVG circle, `stroke-dashoffset` animated with a CSS transition while `:active`/pointerdown, reversed on pointerup (`transition-duration` longer on release, e.g. 1.2 s). Keyboard: Space/Enter hold. Scroll does not get blocked; the section is just tall (150vh) and sticky so it feels slower. Optional gentle haptic on Android via `navigator.vibrate(10)` at completion.
- **Difficulty:** S-M. **Assets:** coin PNG (re-export at 4x), ring colors from tokens.

### 3. The Ring Fills (KEEP, the "how it works" core)
- **Sees/does:** A large, sticky Home screen: "Good morning", the 2h/4h/6h ring, coin in the center, the walking character on the ring's top edge. As the visitor scrolls, the orange arc grows from 0 to ~270°. The three pills below count up (Screen Free 0 → 45 min). Every 15 minutes of arc, a coin pops off the ring's end (+1000 floats, the app's real label) and drops into a neat stack at the side or into the header balance pill (5000 → 6000 → 7000).
- **Why:** "Time away becomes visible progress" is shown literally. The scroll *is* time passing away from the phone.
- **Build:** sticky container (300vh tall). Arc = SVG circle with `pathLength="100"` and `stroke-dashoffset: calc(100 - var(--p))`; `--p` from `animation-timeline: view()` or from a JS scroll handler (rAF-throttled). Coin drop: a CSS keyframe (translateY + slight rotate, ease-out, no bounce; it *settles*). Counter text updated on threshold crossings only.
- **Difficulty:** M. **Assets:** `screens/home.png` (rebuild in HTML/SVG, not the PNG), coin, walking character (export from Figma).

### 4. Out of the Phone (KEEP, the emotional turn)
- **Sees/does:** Inside a phone outline, the sitting character on their phone (the meditating-white pose is exactly "person staring at phone"). Scroll: the phone outline itself undraws (dashoffset reverses), the character's phone stroke fades, and the character's line redraws in a new pose, reading a book or walking, now in open ivory space with a few nature doodles (a branch, a cup). On wider screens, the frame line literally continues into the horizon line of the scene.
- **Why:** the visitor watches the same person leave the loop. No sentence needed. The continuous line is the "unloop".
- **Build:** two SVG character exports from Figma; animate stroke-dashoffset out on A and in on B, scrubbed by scroll. Avoid path morphing (needs GSAP MorphSVG and matching paths); a cross-draw reads better anyway.
- **Difficulty:** M. **Assets:** characters from Figma Illustrations (sitting-with-phone, reader). White-on-photo versions (`character-reading-white.png`) can be used if the scene ends on a photo.

### 5. Unloop the loop (KEEP, logo moment / hero)
- **Sees/does:** The logo's "oo" is a loop (infinity in the nav icon too). Hero: a single orange line runs in a tight looping scribble (the doomscroll loop) and, as the page loads or the visitor scrolls first ~200px, it slowly *straightens* into a horizon line that a character sits on.
- **Why:** the brand name, demonstrated. Busy → calm in one stroke.
- **Build:** SVG path interpolation between two paths with the same number of points (author both in Figma with matching anchor counts, or generate in JS: a sine-loop path whose amplitude goes to 0, which is trivial: `y = A(t)*sin(...)`, recomputed per frame). JS-generated is easier and smaller.
- **Difficulty:** S (JS-generated) / M (hand-authored). **Assets:** none; plus sitting character.

### 6. The Coin, turning (KEEP, small and precious)
- **Sees/does:** Near the rewards section, the gold hourglass coin turns slowly as you scroll past, catching light. Its one moment of shine on an otherwise flat page.
- **Why:** it is the only glossy object in the brand; making it *physical* gives the coin value. "Your time is worth something" lands better next to an object that looks like money but contains an hourglass.
- **Build:** export ~24-36 of the 75 turntable frames from the Figma Coin page as WebP at 2x (~400 px), or a single sprite sheet. Draw to `<canvas>` or swap `background-position` on a sprite; frame = scroll progress (scrubbed) or a slow idle loop at 8 fps when stationary. Lazy-load when within one viewport.
- **Difficulty:** S-M (export is the work). **Assets:** Figma Coin page (75 variants). Total budget: under 400 KB.

### 7. Spend it on real life (KEEP, rewards)
- **Sees/does:** Horizontal row of reward cards from the app ("A quiet coffee · 1000", "Mosaic workshop · 10000"). The visitor's coins earned in concept 3 sit in a balance pill; hovering/tapping a card shows a thin progress bar "you're 1,000 away". Tap "A quiet coffee" and the coins slide from the pill into the card and the photo warms (desaturated → full color).
- **Why:** closes the loop from screen time to *life*. The photos do the emotional work; the interaction makes the coins feel spendable.
- **Build:** CSS scroll-snap row; `filter: saturate()` transition; coin flight via FLIP (getBoundingClientRect, transform). Use the app's real photography (ask for originals; screenshot crops are too small).
- **Difficulty:** M. **Assets:** `screens/rewards-store.png` for reference; source photos needed from Figma.

### 8. The phone you can actually use (MAYBE, as a sticky demo for onboarding)
- **Sees/does:** A sticky phone mockup with the four onboarding screens, fully operable: hours slider → age wheel → Select Apps cards (tap to toggle, hairline becomes solid fill, Continue enables) → set work time wheel pickers → "Start" lands on Home.
- **Why:** "this is how easy setup is" without saying it. Good for the skeptical visitor.
- **Risk:** it duplicates concept 1 and gets long. **Recommendation:** fold the slider into concept 1 and the Select Apps tap into a compact 3-step "Set it up in a minute" strip (concept 8b), no full phone emulation. Wheel pickers on web are fiddly; use CSS `scroll-snap-type: y mandatory` columns, which feel native on iOS.
- **Difficulty:** M-L. **Assets:** all `screens/*`, `cards/*`.

### 9. The gentle nudge (MAYBE)
- **Sees/does:** A dark, busy phone (blurred abstract colour blocks, *not* a fake Instagram) where the visitor's cursor/finger flicks endlessly. After a few seconds, the real Unloop toast slides down: coin icon, "You've been in the loop for a while.. Let's return to what matters." The dark phone fades to ivory.
- **Why:** shows the core intervention exactly as it feels: kind, not a wall.
- **Build:** auto-scrolling column of soft rectangles (CSS animation), toast slide-in with ease-out, after 3 s or after 5 wheel/touch events in the area.
- **Caution:** do not reproduce real app UIs or real people's handles (the toast screenshot sits over a real-looking Instagram clone with real usernames; do not use that image as-is). Abstract blocks only.
- **Difficulty:** S-M. **Assets:** `screens/notification-toast.png` (toast only, rebuilt in HTML).

### 10. Busy to calm background (MAYBE, as a subtle global layer)
- **Sees/does:** The very top of the page has a faint scatter of the doodle collage (phone, hand, scribbles) at low opacity, slightly drifting. As you scroll, it thins out and the ground becomes clean ivory.
- **Why:** visual quiet accumulates; you feel the page getting calmer.
- **Build:** single SVG layer, opacity tied to scroll via CSS `scroll()` timeline. Do *not* go dark → light: a dark section breaks "ivory ground" and reads as the generic tech look. Keep the shift to density, not colour.
- **Difficulty:** S. **Assets:** `characters/doodle-collage.png` (re-export SVG).

### 11. Your year in dots (MAYBE, companion to concept 1)
- **Sees/does:** 365 small dots (one per day) in the track colour. As the hours value from concept 1 changes, the dots that equal "days spent on the phone" turn orange-outline; then the "one hour back" days fill solid gold-ish orange.
- **Why:** the Wait But Why grid effect, but personal and reversible.
- **Build:** CSS grid of 365 spans or one SVG; class toggles; 5 ms stagger per dot.
- **Difficulty:** S. Risk: two visualizations of the same number. Pick dots *or* the days sentence on small screens.

### 12. Work time, protected (MAYBE)
- **Sees/does:** A 24-hour horizontal day strip. Visitor drags two handles (9 AM, 5 PM) like the app's wheels; the work block shades softly, and apps (abstract category icons from the cards: chat bubble, gamepad, popcorn, bag) slide out of that block to its edges.
- **Why:** blocking shown as *making space*, not locking.
- **Build:** two range thumbs on one track (or pointer events); icons from `cards/*` line icons.
- **Difficulty:** M. **Assets:** `cards/*` icons, `screens/set-work-time.png`.

### 13. Doomscroll simulator (CUT)
Fake infinite feed that gets heavier (scroll friction increases) until you stop. Clever, but it hijacks scroll (accessibility and annoyance), and it leans into shame. Concept 9 gets the same insight in five seconds without punishing the visitor.

### 14. WebGL coin / 3D scene (CUT)
The turntable frames already exist. WebGL adds 150+ KB and battery drain for no extra feeling.

### 15. Sound of the room (OPTIONAL, see §5)
A single soft ambient bed (room tone, birds) that starts only if the visitor taps a small "sound" pill; fades in during The Quiet.

**What to cut, summarised:** 13, 14; and do not build both 8 and 1 in full. If time is short, ship 1, 3, 2, 5 and the CTA; that is already a complete story.

---

## 4. Recommended page narrative (storyboard)

Nine beats, under ~7 screen heights on mobile plus two sticky sections. Order logic: **recognise → measure → relieve → show the mechanism → make it valuable → choose → act.** Every "hard" beat (2) is immediately followed by a "kind" one (3).

| # | Section | One feeling | One interaction | Headline (Unloop voice) | Transition to next |
|---|---|---|---|---|---|
| 1 | **Hero: the loop** | Exhale | First scroll straightens the looping line into a horizon; sitting character with phone rests on it (concept 5) | **"You've been in the loop for a while."** Sub: "Let's return to what matters." CTA pill: Get Unloop (App Store) | The horizon line runs down the page and becomes the slider track. |
| 2 | **How much time?** | A private "oh" | Drag the hours slider; days/year recalculates (concept 1, optional dot year 11) | **"How much time do you spend on your phone?"** (the app's own question) | Result line: "Get one hour back..." The number fades; the ring's track draws in. |
| 3 | **The nudge** | Recognised, not judged | Dark-ish abstract feed in a phone; Unloop toast slides in; screen turns ivory (concept 9) | **"A gentle nudge. Not a wall."** | Toast's coin icon slides down and becomes the coin at the center of the ring. |
| 4 | **The ring fills** (sticky) | Momentum, satisfaction | Scroll fills the Home ring; coins drop and stack, balance counts up (concept 3) | **"Time away becomes visible."** Steps: "Put the phone down." / "Watch the ring fill." / "Every quarter hour, a Time Coin." | Last coin rises out of the phone frame. |
| 5 | **Out of the phone** | Lightness | Phone outline undraws; character redraws reading, outside (concept 4) | **"Then go live it."** | Scene widens into the rewards row. |
| 6 | **The coin** | Value | Coin turns as you scroll (concept 6) | **"Your time is worth something."** (brand line, given its own screen) | Coin shrinks into the balance pill above the rewards. |
| 7 | **Spend it on real life** | Warmth | Tap a reward; coins move in; photo warms (concept 7) | **"Spend it on things that don't scroll."** | Row ends; page empties. |
| 8 | **The Quiet** | Stillness, choice | Hold the ring for one breath (concept 2) | **"Hold here. Just for a breath."** → after: "That's what choosing feels like." | Ring stays; the CTA appears inside its calm. |
| 9 | **CTA + footer** | Quiet resolve | One pill button. Small 3-step setup strip (8b) below for the skeptical | **"Start with one hour."** Button: Get Unloop. Under: "Free to start. No streaks to break." *(confirm with product)* | End. Footer in brown #3A2E27 text, ivory ground. |

Why this order: section 2 must come early because it is *personal*; everything after it reads as "this is what happens to your number". Rewards (7) come after the mechanism (4) so coins have meaning before they are spent. The Quiet sits right before the CTA so the visitor arrives at the button in the calmest state of the whole visit. Setup detail (8b) lives below the CTA, for those who need it, not as a hurdle before it.

On desktop: sections 3-5 use a sticky phone in the left column with step text on the right (Pudding pattern). On mobile: the phone is centered and sticky, text overlays below it in a short card.

---

## 5. Motion principles

**Character:** like the line characters: unhurried, continuous, never jumpy. Things *settle*, they don't land.

| Token | Value | Use |
|---|---|---|
| `--ease-calm` | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint-ish) | Default for entrances, coin settles, text fades |
| `--ease-breath` | `cubic-bezier(0.45, 0, 0.55, 1)` (ease-in-out-sine) | Breath ring, idle loops, the loop-to-line |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Rare exits only |
| Durations | 200 ms (UI feedback: slider number, button press), 600 ms (fades, card reveals), 1200 ms (line draws, coin drop), 4000 ms in / 6000 ms out (breath) | |
| Stagger | 60-90 ms between siblings; never more than 5 staggered items | |
| Travel | Reveals move 12-24 px max. Opacity 0 → 1 plus small translate. No scale-up from 0. | |

**Rules**
- Scroll-*scrubbed* (tied to position) for things that represent time passing: ring fill, line drawing, coin turn. Scroll-*triggered* (play once) for text.
- Never: bounce/elastic easing, confetti, particle bursts, shake, flashing counters, parallax over ~10%, scroll hijacking or snap-jacking the whole page, autoplay video with sound, cursor trails, preloaders, number tickers that race.
- One moving thing per viewport. If the ring is filling, text is still.
- Idle loops max 1 per screen and paused when off-screen (IntersectionObserver) and when the tab is hidden.
- Counters tick in steps that read (e.g. +1000 every coin), not a blur of digits.

**Reduced motion** (`@media (prefers-reduced-motion: reduce)`)
- Line drawings: show complete. Ring: shown at final fill with a static "+3000" label. Coin turntable: single hero frame. Loop-to-line: show the line.
- Keep *interactions* (slider, hold ring, reward tap) since they are user-initiated; make their transitions instant or a 150 ms crossfade. Breath ring still fills while held (that's the content), but no idle pulse.
- No sticky scrubbing; sections become normal flow with the end state.

**Performance budget (mid-range Android, 4G)**
- LCP < 2.0 s; total JS < 60 KB gz without GSAP (< 110 KB with GSAP + ScrollTrigger); fonts: Comfortaa variable woff2 subset (~30 KB), `font-display: swap`.
- Images: hero assets SVG; coin frames WebP, lazy, total < 400 KB; reward photos AVIF/WebP at 2x of displayed size, lazy.
- Animate only `transform`, `opacity`, `stroke-dashoffset`. No animated `filter: blur()` on large areas (except the reward photo saturate, which is a small element).
- Scroll handlers: one passive listener, rAF-throttled, or CSS timelines. No layout reads inside the loop.
- CLS 0: reserve sizes for phone mockups and coin canvas.

**Sound (optional, OFF by default)**
- A small pill top-right: "Sound off" / "Sound on". Never autoplay.
- If on: low room tone with distant birds (loopable 20-30 s, < 200 KB Opus), a soft wooden "tok" when a coin settles (very quiet, pitch varies ±2 semitones so it doesn't nag), and during The Quiet the room tone gently swells on inhale and settles on exhale. Web Audio `GainNode` fades, 800 ms.
- Respect mute state in `localStorage` (try/catch).

---

## 6. Risks and cheap fixes

| Risk | Why it matters | Cheap fix |
|---|---|---|
| **Small PNG assets** (characters 106-240 px, coin 109 px) | Blurry at hero size; looks cheap | Re-export characters as SVG from Figma (Illustrations > Characters) via `exportAsync({format:"SVG_STRING"})`; coin as PNG at 4x. Do not use `get_screenshot` (grey #666 background). |
| **Phone screens are PNG screenshots** | Text not crisp, not interactive, not accessible | Rebuild the screens used interactively (hours, home, select apps) in HTML/SVG; use PNGs only as small static thumbnails. |
| **Notification screenshot shows a cloned Instagram feed with real-looking handles** | Trademark/impersonation and privacy concerns | Rebuild only the toast; put it over abstract colour blocks. |
| **Heavy scroll effects on phones** | Jank, battery, iOS Safari address bar resize jumps | Use `svh`/`dvh` carefully: sticky sections sized in `svh`. Max two sticky sections. One rAF loop. Test on a real mid-range Android. |
| **CSS scroll-timeline support gaps** (Firefox) | Animations missing | `@supports` gate; fallback = IntersectionObserver adds a class that plays a 1 s time-based version. |
| **Scrubbed animations confuse screen-reader / keyboard users** | Content only "exists" mid-animation | All text is real DOM text, present at load, in reading order. Animations are decoration on top. |
| **Hold-to-confirm accessibility** | Motor impairments, no touch | Keyboard hold (Space), and a visible "Skip" text button. Not required to reach the CTA. |
| **Custom slider/wheel pickers** | Keyboard and SR users stuck | Native `<input type="range">` with labels; wheel = native `<select>` styled, or scroll-snap list with `role="listbox"` and arrow-key support. |
| **Contrast** | Soft orange #DF9F6C on ivory fails AA for text | Soft orange for lines only. Body text #2C2018; orange text only at ≥ 24 px or use #D87639 (check: still borderline, so prefer ink for anything important). White button text on #D87639 is ~3:1, so make the CTA label Comfortaa Bold at 18 px+ (large text) or darken the CTA fill slightly on hover only. Flag to design. |
| **Guilt math lands badly** | "152 days" can feel like an accusation | Always pair with the reclaim line; default the slider at 4 h (relatable), not 10. Avoid lifespan/mortality phrasing. |
| **Load time** | Coin frames + photos + font | Lazy-load everything below section 2; preload only Comfortaa + hero SVG; coin frames load when section 5 is near. |
| **Comfortaa at small sizes** | Rounded geometric gets mushy under 14 px | Minimum 15 px body on mobile; increase letter-spacing slightly (0.01em) for small labels. |
| **Unverified claims** | Stats like "people save X hours" | Don't use numbers that aren't backed; the visitor's own slider number is the only stat needed. |

---

## 7. Copy (calm voice, sentence case, no hype)

**Headlines**
1. You've been in the loop for a while.
2. Let's return to what matters.
3. Your time is worth something.
4. How much time do you spend on your phone?
5. Put it down. Watch it add up.
6. Time away, made visible.
7. Every quiet hour counts. Literally.
8. A gentle nudge. Not a wall.
9. Then go live it.
10. Spend it on things that don't scroll.
11. Hold here. Just for a breath.
12. Start with one hour.
13. Less phone. More afternoon.
14. The loop is optional.

**Microcopy**
15. Slider result: "That's 61 days a year. One hour back is 15 of them, yours again."
16. After the breath: "That's what choosing feels like."
17. Coin drop label: "+1000. Fifteen minutes, well spent."
18. Reward card hint: "1,000 coins away from a quiet coffee."
19. CTA button: "Get Unloop" · secondary: "See how it works"
20. Under CTA: "No streaks to break. No one keeping score but you." *(confirm the app has no streak mechanic)*
21. Sound toggle: "Sound off" / "Sound on: a quiet room"
22. Reduced-motion/skip link on the breath: "Skip the breath"
23. Footer sign-off: "Go on. We'll be here."

Avoid: "addiction", "toxic", "detox", "hack", "crush your goals", "take control!", exclamation marks, red, countdowns, "before it's too late".

---

### Sources
- [neal.fun: The Deep Sea](https://neal.fun/deep-sea/) · [Life Stats overview](https://www.anygen.io/showcase/neal-fun/index.html)
- [Wait But Why: Your Life in Weeks](https://waitbutwhy.com/2014/05/life-weeks.html)
- [one sec](https://one-sec.app/) · [one sec research (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974409/)
- [Opal site design by Our Life's Work](https://www.ourlifeswork.com/projects/opal) · [Opal on Lapa Ninja](https://www.lapa.ninja/post/withopal/)
- [Endel](https://endel.io/) · [Brick](https://getbrick.com/pages/brick-take-back-your-time)
- [Awwwards storytelling collection](https://www.awwwards.com/awwwards/collections/storytelling/) · [Scroll-driven storytelling inspiration](https://www.awwwards.com/inspiration/scroll-driven-storytelling-synapser-studio)
- [Scroll-driven animations intro (Smashing)](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/) · [view() timelines (Codrops)](https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view/)
- [Scrollytelling examples](https://reallygooddesigns.com/scrollytelling-website-examples/)
