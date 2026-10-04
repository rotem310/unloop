# Unloop landing page: shared brief

Unloop: a calm screen-time app. Time away from the phone becomes visible progress and Time Coins. Line: "Your time is worth something."

## Sources of truth (use nothing else for brand)
- Design system (published, private): https://claude.ai/artifact/GMJhzdZE3aujWYAgGRcWZ1 ; local copy: ./design-system/README.md and tokens.json
- Figma file "Unloop app", fileKey 6oSKOWbZRth3iT2ftMies2 (use the Figma MCP tools, READ-ONLY: get_screenshot, get_design_context, use_figma only for read/export, never write or rename anything in this file)
  Pages: Foundations, Components, App flow (prototype), Illustrations (section "Characters": all line characters, SVG-exportable), Coin (75-variant turntable of the gold coin).
- Local assets (transparent PNG, ready to use): ./assets/brand (logo orange/gradient, icon, hourglass Time Coin 109px), ./assets/characters (orange sitting + glasses reader, doodle collage, two white versions for photo overlays), ./assets/cards (real Select Apps cards), ./assets/screens (real app screens 390x844: hours slider, age wheel, set work time, select apps, home, rewards store, notification toast)

## Brand rules
- Ground ivory #FDF9F5. Primary orange #D87639 (solid CTAs, strokes). Soft orange #DF9F6C (outlines, line art). Ring track #DAC4B2. Ink #000 for titles, #3A2E27 brown, #2C2018 body. White on photos.
- Type: Comfortaa only (Google Fonts). Regular for most; Medium titles; Bold sparingly.
- Shapes: pills for buttons, 15px outlined cards, hairline orange outlines instead of shadows. No gradients, glassmorphism, stock icons, blue-purple tech look, emoji.
- Illustration: thin continuous-outline human characters, orange on ivory, white over nature photography. The Time Coin is the one realistic glossy object.
- Voice: calm, human, second person, short sentences, sentence case. "Good Morning", "Let's return to what matters." No hype, no urgency.

## Known asset gotchas (learned the hard way)
- Figma get_screenshot returns images with an opaque grey (#666) background. Do NOT use those raw. Transparent exports: use_figma with node.exportAsync({format:"SVG_STRING"}) for line art (vector, scalable, animatable with stroke-dashoffset) and exportAsync PNG at scale 2-4 via figma.base64Encode (tool output truncates near 20,000 characters, so return it in slices). Hourglass coin is an image fill, so export it as PNG.
- The ./assets PNGs are small (characters 106-240px, coin 109px). For hero use, re-export larger from Figma.

## Goal
A landing page for the app that SHOWS rather than tells: the visitor should feel the product (calm, reclaiming time) through interaction, motion and visuals, not through feature lists and paragraphs.
