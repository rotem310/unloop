# Unloop

Unloop is a calm screen-time app. Time away from the phone turns into visible progress and Time Coins. The line: **"Your time is worth something."**

Source: Figma file "Unloop app", page *sign-up flow*, sections AppFlow (screens), Comp (components) and Charecters (illustrations). Nothing else.

## Content fundamentals
- Quiet, human, second person. Short statements: "Good Morning", "Work time start in 5min", "Choose what distracts you most".
- Questions are plain: "How much time do you spend on your phone?", "How old are you?"
- Buttons: "Continue", "START". Sentence case titles, no exclamation marks.
- Nudge voice: "You've been in the loop for a while.. Let's return to what matters."
- Logo is lowercase: **unloop**.

## Visual foundations
- **Ground**: warm ivory `bg` (#FDF9F5). Lots of empty space. Rewards Store uses `store-bg` (#F5ECDF) with white cards.
- **Orange is the voice**: solid `orange` (#D87639) for the one primary action; `orange-soft` (#DF9F6C) for outlines, subtitles and line art.
- **Type**: Comfortaa only, mostly Regular; Medium for titles, SemiBold for questions, Bold for card titles. Pure black `ink-black` for titles and numerals.
- **Shape**: pill buttons (`radius-pill`), 15px outlined cards, a rounded floating tab bar. Hairline orange outlines instead of shadows; shadows only on reward cards.
- **Illustration**: thin continuous-outline human characters in orange, sitting on UI edges (slider thumb, pills, ring). Two main characters: reading and meditating. Never filled.
- **Time Coin**: a photographic gold hourglass coin, the one realistic object. See `assets/Brand/time-coin-hourglass.png`.
- **Photography/video** of nature appears behind system moments such as permissions; it is context, not a component.
- **Third-party backdrops** (Instagram feed, iOS home screen) show where Unloop nudges appear; they are not part of the system.

## Components
AppButton, Button, ChoiceCard, CategoryCard, QuestionOption, HoursSlider, WheelPicker, StepProgress, TimerPill, InsightStat, IntroStep, StatPill, TabBar, RewardCard, Toast, TimeCoin.

## Open issues
- White text on `orange` is about 3.4:1: acceptable only for 17px+ button labels.
- Exports of the logo, coin and characters are small (106-240px); re-export at 2-4x from Figma for hero use.

## For the landing page
The same system is meant to drive the app's landing page. Use: `bg` ground, Comfortaa, `orange` and `orange-soft` for emphasis, the logo and Time Coin from `assets/Brand`, the two main characters from `assets/Illustration`, and the screens from `assets/Screens` inside a phone frame. Scale the type up from the `app-*` styles; the numeral and statement styles are the natural hero sizes.

## Figma file structure
File "Unloop app" is organized as follows.
- **Pages:** `Foundations` (color variable swatches), `Components` (the UI library), `App flow (prototype)`, `Illustrations`, `Coin`.
- **Sections on `App flow (prototype)`:** `App flow (prototype)` (the screens), `Screen states (components)` (the screen state machines: Home, Intro Step, Insight, Good News, News, Question, Select Apps, Break, Intro animation), `Videos (backgrounds)`, `Unsorted screens`.
- **Why screen states live with the flow:** each screen variant carries its own NAVIGATE links. Figma prototypes cannot navigate across pages, so those sets stay beside the screens they lead to. The `Components` page holds only true UI components, whose links are variant swaps (CHANGE_TO).
- **Variables:** collections `Color` (18: `bg/*`, `surface/*`, `ink/*`, `orange/*`, `ring/track`, `tabbar/border`, `text/on-orange`), `Spacing` (7) and `Radius` (6), the last two with `Base` and `Web` modes. `orange/ui` is an alias of `orange/primary`.
- **Text styles:** `Unloop/Title/*`, `Unloop/Body/*`, `Unloop/Caption/*`, `Unloop/Statement/*`, `Unloop/Intro/*`, and `Unloop/Type/{Weight} {size}` for the combinations found in the file.
- **Component naming:** `Group / Name`, for example `Card / Category`, `Wheel / Age`, `Timer Pill`, `Home / Progress Ring`, `Control / Hold Slider`, `Brand / Logo`; screens as `Screen / Home`.
