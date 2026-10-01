# Papercraft UI

Tactile, stationery-inspired components for **React 19 + Tailwind CSS v4**. They use hard-offset stamp shadows, grain and ruled textures, washi tape, dog-ears and perforated rules.

Like shadcn/ui, the source is yours. Copy the components into your project with the CLI, or import the compiled modules. Either way, every component takes a `className`, and `cn()` (clsx + tailwind-merge) makes sure your classes replace the defaults.

## Option A: copy the source (recommended)

```bash
npx papercraft-ui init          # tokens stylesheet, cn() helper, papercraft.json
npx papercraft-ui add button card tabs
npx papercraft-ui add --all
npx papercraft-ui list
```

`init` does the following:

- writes `papercraft.css` (tokens, themes, texture utilities) next to your main stylesheet
- adds `@import "./papercraft.css";` after `@import "tailwindcss";`
- writes `lib/utils.ts` with a `cn()` that knows Papercraft's shadow and radius names
- installs `clsx`, `tailwind-merge` and `class-variance-authority`

Components are copied to `components/ui`. Their `@/lib/utils` imports are rewritten to the aliases in `papercraft.json`. Flags: `-y` accepts the defaults, `-o` overwrites existing files, `--no-install` skips installing packages, and `--cwd <dir>` runs against another directory.

## Option B: import the package

```bash
npm i papercraft-ui
```

```css
/* app.css */
@import "tailwindcss";
@import "papercraft-ui/styles.css"; /* tokens + @source for the compiled components */
```

```tsx
import { Button, Card, CardContent } from "papercraft-ui";
```

## Overriding styles

```tsx
<Button className="bg-amber-100 border-red-700 shadow-[4px_4px_0px_0px_#b91c1c] text-red-950 font-serif">
  Stamped Draft
</Button>
```

`bg-amber-100` replaces `bg-paper`, `border-red-700` replaces `border-pencil`, and the arbitrary shadow replaces `shadow-paper-sm`. The hover and active press states stay in place. Every component also exports its `cva` recipe (`buttonVariants`, `cardVariants`, …) so you can style other elements the same way:

```tsx
<a href="/drafts" className={buttonVariants({ variant: "perforated" })}>Drafts</a>
```

> If you already had a `cn()`, extend its tailwind-merge config with Papercraft's names. Otherwise `shadow-paper-md` is treated as a shadow *color* and won't be overridden. See [src/lib/utils.ts](src/lib/utils.ts).

## Tokens

| Utility | Variable | Role |
| --- | --- | --- |
| `bg-desk` | `--paper-desk` | Surface the sheets rest on |
| `bg-paper` / `-muted` / `-accent` / `-sheet` | `--paper-bg*` | Parchment, cardstock, manila, writing area |
| `border-pencil` / `border-carbon` | `--paper-border*` | Structural / secondary lines |
| `text-ink` / `text-ink-muted` | `--paper-ink-*` | Printer ink / sepia |
| `text-danger` / `text-info` | `--paper-ink-danger/info` | Crimson / indigo stamps |
| `bg-highlight` | `--paper-highlight` | Highlighter wax, `::selection` |
| `shadow-paper-{flat,xs,sm,md,lg,inset}` | | 0 / 1 / 2 / 3 / 5px hard offsets, debossed inset |
| `rounded-paper` / `rounded-paper-md` | | 2px / 4px |
| `font-typewriter` / `font-editorial` | | Mono labels / serif prose |

**Themes:** parchment is the default. Add `.paper-copy` for white copy paper, or `.paper-blueprint` (or `.dark`) for drafting blueprint, on any ancestor. You can also use `data-paper-theme="copy|blueprint"`. Change any `--paper-*` variable to make your own theme.

**Utilities:** `paper-dots`, `paper-ruled`, `paper-grid`, `paper-grain`, `washi-tape`, `dog-ear`, `torn-edge`, `ink-bleed`.

## Components

alert · badge · button · card · checkbox · input · label · separator · sticky-note · tabs · textarea

## Development

```bash
npm install
npm run dev        # playground at playground/ (append ?theme=paper-blueprint)
npm run typecheck
npm run build      # dist/ via tsup
```

To add a component, put it in `src/components/ui/`, import `cn` from `@/lib/utils`, register it in `registry.json` and export it from `src/index.ts`.
