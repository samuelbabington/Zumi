# Zumi — web

Zumi is a social learning and gaming platform for curious minds. Zumi the pangolin is the mascot.

This repo is **phase 1: the UI only**. The pages are static. Sign-up, quizzes and the rest of the features come in later branches.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- Plain CSS (`src/app/globals.css`, with the design tokens at the top)
- `next/font` (Plus Jakarta Sans for headings, Inter for body text)
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Pages

| Route          | What it is                                       |
| -------------- | ------------------------------------------------ |
| `/`            | Home hero                                        |
| `/features`    | "Everything you need to level up." hero          |
| `/about`       | "Learn. Compete. Grow Together." hero            |
| `/faq`         | FAQ accordion                                    |
| `/get-started` | Placeholder for sign-up (functional phase)       |

## Structure

```
src/
  app/                 routes + globals.css
  components/
    Navbar.tsx         top nav with active-link underline
    Backdrop.tsx       purple blobs, arc line, bottom wave
    BlinkingZumi.tsx   mascot that blinks
    FeatureStrip.tsx   icon row (plain or card style)
    Decor.tsx          sparks + light-bulb accents
public/zumi/           mascot art (made with Higgsfield)
```

## How Zumi blinks

Each mascot image has a matching **eyes-closed** frame (`*-closed.png`). Both frames were made with Higgsfield. `BlinkingZumi` stacks the closed frame on top of the open one and shows it for a moment with a CSS keyframe. A soft mask limits the closed frame to the eye area, so nothing else in the picture changes. To use a new pose, add an open/closed pair and set the `eyes` ellipse (`[centerX, centerY, radiusX, radiusY]` in %).

## Branching

`main` stays deployable. Do new work on feature branches such as `feat/auth`, `feat/quiz-engine` or `feat/dashboard`, then open a PR into `main`.
