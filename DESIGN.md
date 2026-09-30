# Design

## Theme

Light first (graphite on cool off-white), dark as an equal option. Six accent themes plus a user-defined one; each theme only changes the accent hue. Neutrals are tinted toward blue (hue 255, chroma under 0.02).

## Color

OKLCH tokens in `src/css/base.css`. Roles: `--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-ink`, `--danger`, `--success`. Strategy: restrained, the accent is for the primary action, selection and the answer.

## Typography

System sans for everything, system monospace with tabular figures for numbers and equations. Fixed rem scale: 0.8125, 0.875, 1, 1.125, 1.25, 1.5.

## Layout

Max width 1080px, 4px spacing base. Tools are a plain bordered tile grid; the workspace is a single bordered surface with a horizontally scrolling tab row.

## Components

Primary button (filled accent), secondary (outlined surface), keys (neutral, operator keys tinted, equals filled), inputs (1px border, accent focus ring), solution block (rule above, mono figures, accent only on the answer).

## Motion

160 ms ease-out-quart on color and border changes. Steps fade in over 200 ms. Reduced motion disables both.
