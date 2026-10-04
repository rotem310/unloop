# Unloop landing: creative direction

**Idea: one line, unlooped.** The whole page hangs on one thin orange line. It starts tangled (the loop you're in), straightens into a horizon, becomes the slider track, wraps into the Home ring, runs out of the phone into the hills, and closes as a breath ring. The atmosphere goes from busy to calm as you scroll: dense, fast and noisy at the top; empty, slow and warm at the end.

## The feeling
- **5 s:** an exhale. Ivory, a lot of space, one person on their phone sitting on a line that slowly coils. One sentence. Nothing shouts.
- **30 s:** a private "oh". You've dragged your own hours and watched them become days of your year, then seen a few of those days handed back. Relief, not guilt.
- **CTA:** quiet resolve. You've just held still for one breath. The button is the only thing on the screen.

## Storyboard (9 sections, one feeling, one interaction each)
| # | Section | Feeling | Interaction |
|---|---|---|---|
| 1 | **The loop** (hero) | Exhale | Scrolling unties a looping, drifting line into a still horizon; the character rests on it. |
| 2 | **Your hours** | A private "oh" | Drag the real hours slider (character sits on the thumb). The numeral, the days and a 365-dot year react; the one hour you get back shows as solid days. |
| 3 | **The nudge** | Recognised, not judged | A busy abstract feed scrolls in a phone; the real Unloop toast slides in. Tap it and the feed slows to a stop and goes calm. |
| 4 | **Set it up** | Ease | A phone you can actually use: tap the Select Apps cards, spin the work-time wheels, press START, land on Home. |
| 5 | **The ring fills** | Momentum | Sticky Home ring fills as you scroll (0 to 8h); each hour sends a Time Coin to the balance. |
| 6 | **Out of the phone** | Lightness | The phone-to-nature line drawing is revealed by scroll; the page warms into a sand field where a person on a hill draws themselves in white. |
| 7 | **Worth something** | Value | The gold coin turns under your scroll and settles face-forward when you stop. Spend coins on real-life rewards; the coffee photo warms. |
| 8 | **The quiet** | Stillness | Press and hold the ring for one breath (4 s). Release early and it gently unwinds. |
| 9 | **Start** | Resolve | One pill. The day-loop line draws itself across the footer. |

## Motion principles
- Slow and continuous, like the line characters. Things settle; nothing bounces, flashes or races.
- Easing: `--ease-calm: cubic-bezier(.22,1,.36,1)` for entrances and settles; `--ease-breath: cubic-bezier(.45,0,.55,1)` for idle loops and breath.
- Durations: 200 ms feedback, 600 ms fades, 1200 ms draws and coin flights, 4 s inhale and 1.2 s release.
- Things that stand for time passing are scrubbed by scroll (loop, ring, line reveals, coin turn), smoothed with a lerp so they glide. Text is triggered once.
- One moving thing per viewport. Idle loops pause off-screen.
- No scroll hijacking. "Slow" moments come from tall sticky sections, not from fighting the wheel.
- `prefers-reduced-motion`: end states shown (straight line, full ring, complete drawings, front-facing coin). User-started interactions still work, with instant transitions.

## Web type scale (Comfortaa, scaled up from the app styles)
| Token | Size | Weight | From app |
|---|---|---|---|
| `--t-numeral` | clamp(120px, 17vw, 232px) / 0.9 | 400 | app-numeral 64 |
| `--t-statement` | clamp(56px, 7.5vw, 112px) / 1 | 700, orange-deep | statement-number 76 |
| `--t-h1` | clamp(40px, 5.4vw, 76px) / 1.1, -0.02em | 500 | app-title 32 |
| `--t-h2` | clamp(32px, 3.9vw, 56px) / 1.15, -0.015em | 500 | app-title 32 |
| `--t-question` | clamp(24px, 2.4vw, 34px) / 1.3 | 600 | app-question 28 |
| `--t-lead` | clamp(19px, 1.6vw, 24px) / 1.5 | 400 | statement-body 24 |
| `--t-body` | 17px / 1.6 | 400 | app-body 17 |
| `--t-label` | 15px / 1.4 | 500 | app-label 16 |
| `--t-micro` | 13px / 1.4 | 400 | app-micro 11 (raised for web legibility) |

## Rules kept from the brand
Ivory ground, orange as the voice, Comfortaa only, pills and 15px hairline cards, no gradients as decoration, no shadows except reward cards, line art in soft orange (white on the warm field), the coin as the one glossy object.
