---
name: ui-design
description: Refactors React components and improves UX/UI using v0/Linear interaction patterns and the Saphire rose-gold design system. Use when refactoring UI, polishing components, improving layouts, adding skeletons/empty states, fixing accessibility, or when the user mentions UX, UI design, design system, or visual polish.
---

# Saphire UI/UX Refactor Skill

Expert UI refactor workflow for `SaphireSouvernis-Front`. Design tokens live in [.cursor/rules/ui-design.mdc](../../rules/ui-design.mdc) — read it before changing styles.

## When to Apply

- User asks to improve, polish, or refactor a component or page
- Layout feels cramped, inconsistent, or off-brand
- Missing hover/focus/loading/empty states
- Accessibility gaps (icon buttons without labels, poor contrast)

## Refactor Workflow

### 1. Audit (read-only first)

- Read the target component and its parent layout
- List issues: spacing, hierarchy, states, a11y, responsiveness, brand drift
- Check if data fetching belongs in the component (move to service/context if leaked)

### 2. Plan minimal diff

- Prefer editing existing components over new abstractions unless markup is duplicated 3+ times
- Match surrounding conventions: `src/views/` for pages, domain folders under `src/components/`
- Consumer pages → glassmorphism + rose; admin → clean stone chrome

### 3. Apply design rules

Follow [ui-design.mdc](../../rules/ui-design.mdc). Non-negotiables:

| Area | Rule |
|------|------|
| Headings | `font-display` |
| Page bg | `bg-stone-50` |
| Cards | `rounded-2xl`, subtle border or glass |
| Interactions | hover + focus-visible + active + `transition-all duration-200` |
| Loading | skeletons matching final layout |
| Icons | `react-icons`, rose accent |

### 4. States checklist

Every data-driven view needs:

```
- [ ] Loading  → skeleton (animate-pulse), same dimensions as content
- [ ] Empty    → message + optional CTA
- [ ] Error    → friendly message, retry if applicable
- [ ] Success  → final UI with micro-interactions
```

### 5. Validate

- Remove unused imports and dead Tailwind classes
- Run `npm run lint` on touched files
- Visually verify mobile (`sm`) and desktop breakpoints
- Confirm no new `import.meta.env` or direct `fetch` usage

## Micro-interaction Templates

**Primary button (brand CTA)**

```jsx
className="rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-3 text-white font-medium shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]"
```

**Ghost / secondary button**

```jsx
className="rounded-xl border border-stone-200 bg-white/60 px-4 py-2 text-stone-600 transition-all duration-200 ease-in-out hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]"
```

**Glass card (consumer)**

```jsx
className="rounded-2xl border border-white/60 bg-white/60 p-6 backdrop-blur-md shadow-sm ring-1 ring-black/5"
```

**Skeleton block**

```jsx
className="h-4 w-3/4 animate-pulse rounded-lg bg-stone-200/60"
```

**Icon button**

```jsx
className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-stone-400 transition-all duration-200 ease-in-out hover:bg-rose-50 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-95"
// aria-label="Descriptive action"
```

## UX Principles (v0 / Linear)

1. **Hierarchy first** — one primary action per section; secondary actions visually quieter
2. **Whitespace is premium** — increase padding before adding borders or shadows
3. **Predictable feedback** — every click/tap gets an immediate visual response
4. **Stability over flash** — skeletons and fixed aspect ratios beat spinners for perceived quality
5. **Progressive disclosure** — show essentials; hide complexity behind clear affordances
6. **Consistency** — same spacing, radius, and interaction pattern across similar components

## Component Decomposition

Split when a file exceeds ~150 lines of JSX or mixes concerns:

```
ComponentName/
├── ComponentName.jsx      # composition + layout
├── ComponentNameHeader.jsx
└── ComponentNameSkeleton.jsx
```

Keep skeletons co-located with the component they serve.

## Accessibility Minimums

- Icon-only controls → `aria-label`
- Decorative icons → `aria-hidden="true"`
- Form inputs → associated `<label>` or `aria-labelledby`
- Focus order follows visual order; never remove focus outlines without a replacement ring
- Color contrast: body text on light bg uses `text-stone-500` minimum; headings `text-stone-800`

## Anti-patterns

- Heavy `shadow-2xl` on every card
- Missing `focus-visible` (keyboard users blocked)
- Full-page spinner while a skeleton layout would work
- Hardcoded colors outside Tailwind tokens
- Replacing Saphire rose brand with generic SaaS blue
- Adding animation libraries for simple hover transitions

## Output Expectations

When reporting refactor work to the user:

1. What changed (component names)
2. Which UX gaps were fixed (states, a11y, spacing)
3. Any follow-up the user should verify visually in the browser
